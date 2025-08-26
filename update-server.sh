#!/bin/bash

echo "=== 更新 ColleTools 服务器代码 ==="

# 检查权限
if [[ $EUID -ne 0 ]]; then
    echo "❌ 需要root权限运行此脚本"
    echo "请使用: sudo $0"
    exit 1
fi

# 项目路径
PROJECT_PATH="/var/www/colletools"

echo "1. 进入项目目录..."
cd $PROJECT_PATH || {
    echo "❌ 项目目录不存在: $PROJECT_PATH"
    echo "请先部署项目或检查路径"
    exit 1
}

echo "2. 备份当前代码..."
BACKUP_DIR="${PROJECT_PATH}_backup_$(date +%Y%m%d_%H%M%S)"
cp -r "$PROJECT_PATH" "$BACKUP_DIR"
echo "✅ 代码已备份到: $BACKUP_DIR"

echo "3. 拉取最新代码..."
git pull origin main

echo "4. 安装/更新依赖..."
npm install

echo "5. 构建项目..."
npm run build

echo "6. 停止现有服务..."
pm2 stop colletools 2>/dev/null || echo "PM2服务未运行"
pkill -f "tsx.*server" || echo "没有运行的服务器进程"

echo "7. 重启服务..."
# 如果使用PM2
if command -v pm2 &> /dev/null; then
    pm2 start ecosystem.config.js
    pm2 save
    echo "✅ PM2服务已重启"
else
    # 直接启动
    nohup npm run server:dev > server.log 2>&1 &
    echo "✅ 服务已后台启动"
fi

sleep 3

echo "8. 检查服务状态..."
if pgrep -f "tsx.*server" >/dev/null; then
    echo "✅ 服务器进程运行中"
else
    echo "❌ 服务器进程未运行，检查日志:"
    tail -10 server.log 2>/dev/null || echo "无日志文件"
fi

# 测试服务
if curl -s --connect-timeout 5 http://localhost:3000 >/dev/null; then
    echo "✅ 服务响应正常"
else
    echo "❌ 服务无响应"
fi

echo ""
echo "=== 更新完成 ==="
echo ""
echo "🔍 验证 AdSense 文件:"
echo "- 访问: https://your-domain.com/ads.txt"
echo "- 查看网页源代码检查 AdSense 代码"
echo ""
echo "📋 如果有问题:"
echo "- 查看日志: tail -f server.log"
echo "- 恢复备份: rm -rf $PROJECT_PATH && mv $BACKUP_DIR $PROJECT_PATH"