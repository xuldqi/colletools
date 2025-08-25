#!/bin/bash

# 修复 DropShare 项目 - 从测试文件切换到正式文件
echo "🔧 修复 DropShare 项目文件..."
echo "============================="

# 检查权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || { echo "❌ 无法进入项目目录"; exit 1; }

echo "📁 当前项目文件："
ls -la *.js 2>/dev/null || echo "未找到 JS 文件"

echo ""
echo "🔍 检查文件状态..."

# 检查是否有正式的应用文件
if [ -f "index.js.bak" ]; then
    echo "✅ 找到备份的正式文件：index.js.bak"
    echo "🔄 恢复正式文件..."
    cp index.js.bak index.js
    echo "✅ 已恢复 index.js"
elif [ -f "app.js" ]; then
    echo "✅ 找到正式应用文件：app.js"
elif [ -f "server.js" ]; then
    echo "✅ 找到服务器文件：server.js"
else
    echo "❌ 未找到正式应用文件"
    echo ""
    echo "🔍 当前所有文件："
    ls -la
    
    # 检查 index-simple.js 内容
    echo ""
    echo "📄 当前 index-simple.js 内容："
    if [ -f "index-simple.js" ]; then
        head -20 index-simple.js
        echo ""
        echo "💡 这可能是测试文件，需要切换到正式应用"
    fi
    
    exit 1
fi

# 检查是否有 PM2 进程在运行
echo ""
echo "🔍 检查 PM2 进程..."
if pm2 list | grep -q dropshare; then
    echo "✅ 找到 DropShare PM2 进程"
    echo "🔄 重启 PM2 进程..."
    pm2 restart dropshare
    sleep 3
    
    # 检查进程状态
    if pm2 list | grep dropshare | grep -q online; then
        echo "✅ DropShare 进程运行正常"
    else
        echo "❌ DropShare 进程启动失败"
        pm2 logs dropshare --lines 10
    fi
else
    echo "⚠️ 未找到 DropShare PM2 进程"
    echo "💡 可能需要手动启动或使用 nginx 静态服务"
    
    # 检查是否有前端构建文件
    if [ -d "dist" ] || [ -d "build" ] || [ -d "public" ]; then
        echo "✅ 找到前端文件，将使用 nginx 静态服务"
    else
        echo "❌ 未找到前端构建文件"
    fi
fi

echo ""
echo "🧪 测试访问..."
if curl -I http://localhost:3003 2>/dev/null | grep -q "200\|302"; then
    echo "✅ DropShare 本地服务正常"
elif curl -s http://localhost:3003 2>/dev/null | grep -q "DropShare\|dropshare"; then
    echo "✅ DropShare 服务响应正常"
else
    echo "⚠️ DropShare 本地服务可能未运行"
    echo "🔍 检查端口占用："
    netstat -tlnp | grep :3003 || echo "端口 3003 未被占用"
fi

echo ""
echo "🎉 DropShare 文件修复完成！"
echo "=========================="
echo ""
echo "📋 下一步："
echo "1. 如果有 PM2 进程，应该已自动重启"
echo "2. 如果是静态文件，需要更新 nginx 配置"
echo "3. 访问 http://dropshare.tech 测试"
echo ""
echo "🔧 如果仍显示测试页面："
echo "- 检查是否需要构建前端：npm run build"
echo "- 检查 nginx 配置是否指向正确目录"