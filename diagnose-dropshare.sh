#!/bin/bash

# 全面诊断 DropShare 项目状态
echo "🔍 DropShare 项目全面诊断"
echo "=========================="

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || { echo "❌ 无法访问项目目录"; exit 1; }

echo "📁 1. 项目目录结构："
ls -la

echo ""
echo "📄 2. 检查各个 JS 文件内容："

if [ -f "index.js" ]; then
    echo ""
    echo "--- index.js 内容（前20行）---"
    head -20 index.js
fi

if [ -f "index.js.bak" ]; then
    echo ""
    echo "--- index.js.bak 内容（前20行）---"
    head -20 index.js.bak
fi

if [ -f "index-simple.js" ]; then
    echo ""
    echo "--- index-simple.js 内容（前20行）---"
    head -20 index-simple.js
fi

if [ -f "app.js" ]; then
    echo ""
    echo "--- app.js 内容（前20行）---"
    head -20 app.js
fi

if [ -f "server.js" ]; then
    echo ""
    echo "--- server.js 内容（前20行）---"
    head -20 server.js
fi

echo ""
echo "📦 3. 检查 package.json 配置："
if [ -f "package.json" ]; then
    echo "项目名称和脚本："
    grep -A 10 -B 2 '"name"\|"scripts"\|"main"' package.json 2>/dev/null || cat package.json
else
    echo "❌ 未找到 package.json"
fi

echo ""
echo "🔧 4. 检查 PM2 进程状态："
pm2 list | grep dropshare || echo "未找到 dropshare PM2 进程"

echo ""
echo "🌐 5. 检查当前服务响应："
echo "本地 3003 端口："
curl -s http://localhost:3003 2>/dev/null | head -5 || echo "无响应"

echo ""
echo "外部访问测试："
curl -I http://dropshare.tech 2>/dev/null | head -3 || echo "无响应"

echo ""
echo "🔍 6. 检查当前 nginx 配置："
if [ -f "/etc/nginx/sites-enabled/domains-simple" ]; then
    echo "当前 nginx 配置中的 dropshare.tech 部分："
    grep -A 10 -B 2 "dropshare.tech" /etc/nginx/sites-enabled/domains-simple
fi

echo ""
echo "📊 7. 端口占用情况："
netstat -tlnp | grep ":3003\|:80\|:443" | head -5

echo ""
echo "🎯 8. 分析结果："
echo "===================="
echo "基于以上信息，判断："
echo ""

# 判断哪个文件是测试文件
if [ -f "index.js" ] && [ -f "index-simple.js" ]; then
    if grep -q "测试\|test\|简单\|simple\|demo" index.js 2>/dev/null; then
        echo "❓ index.js 可能是测试文件"
    elif grep -q "测试\|test\|简单\|simple\|demo" index-simple.js 2>/dev/null; then
        echo "❓ index-simple.js 可能是测试文件"
    fi
fi

echo ""
echo "💡 建议下一步："
echo "1. 检查文件内容，确定哪个是正式应用"
echo "2. 检查前端构建文件是否存在"
echo "3. 确认正确的服务启动方式"