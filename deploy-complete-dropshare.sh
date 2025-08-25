#!/bin/bash

# 部署完整版 DropShare (3小时前的版本)
echo "🚀 部署完整版 DropShare..."
echo "=========================="

# 检查权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

DROPSHARE_DIR="/var/www/dropshare"
BACKUP_DIR="/var/www/dropshare_backup_$(date +%Y%m%d_%H%M%S)"

echo "📁 当前工作目录检查..."

# 1. 备份当前版本
echo ""
echo "💾 1. 备份当前版本..."
if [ -d "$DROPSHARE_DIR" ]; then
    echo "备份到: $BACKUP_DIR"
    cp -r "$DROPSHARE_DIR" "$BACKUP_DIR"
    echo "✅ 备份完成"
else
    echo "⚠️ 目标目录不存在，将创建新目录"
fi

# 2. 停止当前服务
echo ""
echo "🛑 2. 停止当前服务..."
pm2 delete dropshare 2>/dev/null || echo "未找到现有 PM2 进程"

# 3. 克隆完整版本
echo ""
echo "📥 3. 获取完整版本..."
if [ -d "/tmp/dropshare-complete" ]; then
    rm -rf /tmp/dropshare-complete
fi

cd /tmp
git clone https://github.com/xuldqi/dropshare.git dropshare-complete
cd dropshare-complete

# 确保在 main 分支的最新版本
git checkout main
git pull origin main

# 显示当前版本信息
echo ""
echo "📋 部署版本信息："
git log --oneline -1 --date=relative --pretty=format:"提交: %h | 时间: %ad | 信息: %s" --date=relative

echo ""
echo ""

# 4. 替换项目文件
echo "🔄 4. 替换项目文件..."
rm -rf "$DROPSHARE_DIR"
cp -r /tmp/dropshare-complete "$DROPSHARE_DIR"
chown -R www-data:www-data "$DROPSHARE_DIR" 2>/dev/null || true

# 清理临时文件
rm -rf /tmp/dropshare-complete

cd "$DROPSHARE_DIR"

# 5. 安装依赖
echo ""
echo "📦 5. 安装依赖..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "⚠️ 未找到 package.json"
fi

# 6. 启动服务
echo ""
echo "🚀 6. 启动服务..."
pm2 start index.js --name dropshare --max-memory-restart 1G
sleep 3

# 7. 检查服务状态
echo ""
echo "🧪 7. 检查服务..."
if pm2 list | grep dropshare | grep -q online; then
    echo "✅ PM2 进程启动成功"
    
    # 测试本地访问
    if curl -s http://localhost:3003 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html"; then
        echo "✅ 本地服务响应正常"
        
        # 测试外部访问
        if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
            echo "✅ dropshare.tech 访问正常"
        else
            echo "⚠️ 外部访问需要检查 nginx 配置"
        fi
    else
        echo "❌ 本地服务响应异常"
        echo "🔍 查看日志："
        pm2 logs dropshare --lines 5
    fi
else
    echo "❌ PM2 进程启动失败"
    pm2 logs dropshare --lines 10
fi

# 8. 显示功能特性
echo ""
echo "🎉 部署完成！"
echo "============="
echo "🌐 访问地址: http://dropshare.tech"
echo ""
echo "✅ 本次部署包含的完整功能："
echo "- 🏠 首页：完整的设备发现和连接界面"
echo "- 📤 传送：文件传输和分享功能"
echo "- 🏘️  房间：私人房间和群组功能"
echo "- 🌍 翻译：支持9种语言的完整国际化"
echo "  - 中文（简体/繁体）、英语、法语、德语"
echo "  - 西班牙语、葡萄牙语、日语、韩语"
echo ""
echo "📋 管理命令："
echo "- 查看状态: pm2 list"
echo "- 查看日志: pm2 logs dropshare"
echo "- 重启服务: pm2 restart dropshare"
echo ""
echo "💾 备份位置: $BACKUP_DIR"
echo "如果有问题可以恢复: cp -r $BACKUP_DIR/* $DROPSHARE_DIR/"