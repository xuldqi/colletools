#!/bin/bash
# ColleTools 快速修复脚本 - 简化版
# 使用方法: chmod +x quick_fix.sh && ./quick_fix.sh

echo "⚡ ColleTools 快速修复脚本"
echo "========================="

PROJECT_DIR="/var/www/colletools"
PORT=3003

# 进入项目目录
cd $PROJECT_DIR

# 1. 修复Git仓库并拉取最新代码
echo "🔄 更新代码..."
git remote set-url origin https://github.com/xuldqi/colletools.git
git fetch origin
git reset --hard origin/main
git clean -fd

# 2. 安装依赖和构建
echo "📦 安装依赖并构建..."
npm install
npm run build

# 3. 停止现有进程
echo "🛑 停止现有进程..."
sudo lsof -ti:$PORT | xargs sudo kill -9 2>/dev/null || true
pm2 stop colletools 2>/dev/null || true
pm2 delete colletools 2>/dev/null || true

# 4. 启动服务
echo "🚀 启动服务..."
if command -v pm2 &> /dev/null; then
    pm2 start npm --name "colletools" -- run preview -- --port $PORT --host 0.0.0.0
    pm2 save
else
    nohup npm run preview -- --port $PORT --host 0.0.0.0 > colletools.log 2>&1 &
fi

# 5. 等待启动并检查
sleep 5
if curl -s "http://127.0.0.1:$PORT" > /dev/null; then
    SERVER_IP=$(curl -s ifconfig.me)
    echo "✅ 启动成功！"
    echo "🌐 访问地址: http://$SERVER_IP:$PORT"
    echo "🔧 管理命令: pm2 status (如果安装了PM2)"
else
    echo "❌ 启动失败，请检查日志"
fi