#!/bin/bash

# 检查 DropShare 项目结构和配置
echo "🔍 检查 DropShare 项目..."
echo "========================="

# 检查项目目录结构
echo "📁 1. 检查项目目录结构："
if [ -d "/var/www/dropshare" ]; then
    echo "✅ DropShare 目录存在"
    echo ""
    echo "目录内容："
    ls -la /var/www/dropshare/
    echo ""
    
    # 检查是否有前端构建文件
    echo "🔍 2. 检查前端文件："
    if [ -d "/var/www/dropshare/dist" ]; then
        echo "✅ 找到 dist 目录"
        echo "dist 目录内容："
        ls -la /var/www/dropshare/dist/
    elif [ -d "/var/www/dropshare/build" ]; then
        echo "✅ 找到 build 目录"
        echo "build 目录内容："
        ls -la /var/www/dropshare/build/
    elif [ -d "/var/www/dropshare/public" ]; then
        echo "✅ 找到 public 目录"
        echo "public 目录内容："
        ls -la /var/www/dropshare/public/
    else
        echo "❌ 未找到前端构建文件目录 (dist/build/public)"
    fi
    
    echo ""
    
    # 检查是否有 index.html
    echo "🔍 3. 检查入口文件："
    if [ -f "/var/www/dropshare/index.html" ]; then
        echo "✅ 根目录有 index.html"
        echo "文件内容预览："
        head -20 /var/www/dropshare/index.html
    elif [ -f "/var/www/dropshare/dist/index.html" ]; then
        echo "✅ dist 目录有 index.html"
    elif [ -f "/var/www/dropshare/build/index.html" ]; then
        echo "✅ build 目录有 index.html"
    elif [ -f "/var/www/dropshare/public/index.html" ]; then
        echo "✅ public 目录有 index.html"
    else
        echo "❌ 未找到 index.html 文件"
    fi
    
    echo ""
    
    # 检查是否有 package.json
    echo "🔍 4. 检查项目配置："
    if [ -f "/var/www/dropshare/package.json" ]; then
        echo "✅ 找到 package.json"
        echo "项目信息："
        grep -E '"name"|"version"|"scripts"' /var/www/dropshare/package.json || true
    else
        echo "❌ 未找到 package.json"
    fi
    
    echo ""
    
    # 检查当前 nginx 配置指向哪里
    echo "🔍 5. 检查当前 nginx 配置："
    if [ -f "/etc/nginx/sites-enabled/domains-simple" ]; then
        echo "当前 nginx 配置指向："
        grep -A 3 -B 1 "dropshare.tech" /etc/nginx/sites-enabled/domains-simple || true
    fi
    
else
    echo "❌ DropShare 目录不存在: /var/www/dropshare"
fi

echo ""
echo "🎯 建议："
echo "1. 如果这是测试页面，需要构建实际的前端应用"
echo "2. 检查项目是否需要运行 npm run build"
echo "3. 确认正确的静态文件目录路径"