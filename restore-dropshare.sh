#!/bin/bash

# 恢复 DropShare 正式文件
echo "🔄 恢复 DropShare 正式文件..."
echo "=========================="

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || exit 1

# 1. 恢复正式文件
if [ -f "index.js.bak" ]; then
    echo "✅ 找到备份文件，恢复中..."
    cp index.js.bak index.js
    echo "✅ index.js 已恢复"
else
    echo "❌ 未找到 index.js.bak"
    exit 1
fi

# 2. 重启 PM2 进程
echo ""
echo "🔄 重启服务..."
if pm2 list | grep -q dropshare; then
    pm2 restart dropshare
    sleep 3
    echo "✅ PM2 进程已重启"
else
    echo "⚠️  未找到 PM2 进程，可能需要手动启动"
fi

# 3. 检查服务状态
echo ""
echo "🧪 检查服务..."
if curl -s http://localhost:3003 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html"; then
    echo "✅ 服务返回 HTML 页面"
else
    echo "⚠️  服务可能需要重新配置"
fi

echo ""
echo "🎉 恢复完成！访问 http://dropshare.tech 查看结果"