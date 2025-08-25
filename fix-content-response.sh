#!/bin/bash

# 修复网站内容响应问题
echo "🔧 修复网站内容响应问题..."
echo "==========================="

echo "1. 检查实际返回内容:"
echo "==================="

echo "dropshare.tech 返回内容:"
echo "------------------------"
curl -s http://dropshare.tech | head -10
echo ""

echo "colletools.com 返回内容:"
echo "-----------------------"
curl -s http://colletools.com | head -10
echo ""

echo "2. 检查本地服务内容:"
echo "==================="

echo "localhost:8080 (DropShare) 内容:"
echo "-------------------------------"
DROPSHARE_CONTENT=$(curl -s http://localhost:8080 | head -5)
echo "$DROPSHARE_CONTENT"

if echo "$DROPSHARE_CONTENT" | grep -q "<!DOCTYPE\|<html"; then
    echo "✅ DropShare 返回HTML页面"
else
    echo "❌ DropShare 只返回文本，不是HTML"
fi

echo ""
echo "localhost:3002 (ColleTools) 内容:"
echo "--------------------------------"
COLLETOOLS_CONTENT=$(curl -s http://localhost:3002 | head -5)
echo "$COLLETOOLS_CONTENT"

if echo "$COLLETOOLS_CONTENT" | grep -q "<!DOCTYPE\|<html"; then
    echo "✅ ColleTools 返回HTML页面"
else
    echo "❌ ColleTools 只返回文本: '$COLLETOOLS_CONTENT'"
fi

echo ""
echo "3. 问题诊断:"
echo "==========="

# 检查是否是Express直接响应而不是静态文件
if echo "$COLLETOOLS_CONTENT" | grep -q "ColleTools is running"; then
    echo "🔍 发现问题: ColleTools 返回简单文本而不是HTML页面"
    echo "这意味着 Express 应用没有正确服务静态文件"
    
    echo ""
    echo "检查 ColleTools 项目结构:"
    cd /var/www/colletools
    
    if [ -d "dist" ]; then
        echo "✅ 找到 dist 目录"
        echo "dist 目录内容:"
        ls -la dist/ | head -10
        
        if [ -f "dist/index.html" ]; then
            echo "✅ 找到 dist/index.html"
            echo "index.html 内容预览:"
            head -5 dist/index.html
        else
            echo "❌ dist/index.html 不存在"
        fi
    else
        echo "❌ dist 目录不存在，需要构建前端"
    fi
fi

echo ""
echo "4. 修复方案:"
echo "==========="

# 修复 ColleTools 静态文件服务
if ! echo "$COLLETOOLS_CONTENT" | grep -q "<!DOCTYPE\|<html"; then
    echo "🔧 修复 ColleTools 静态文件服务..."
    
    cd /var/www/colletools
    
    # 检查是否需要构建
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        echo "📦 构建 ColleTools 前端..."
        if [ -f "package.json" ]; then
            npm run build 2>/dev/null || echo "构建失败，可能需要先运行 npm install"
        fi
    fi
    
    # 更新 nginx 配置，直接服务静态文件
    echo "🔄 更新 nginx 配置为静态文件服务..."
    
    cat > /etc/nginx/sites-available/fixed-static << 'EOF'
# ColleTools 配置 - 直接服务静态文件
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    
    root /var/www/colletools/dist;
    index index.html;
    
    # 静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理到 Express
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# DropShare 配置
server {
    listen 80;
    server_name dropshare.tech www.dropshare.tech;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

    # 应用新配置
    rm -f /etc/nginx/sites-enabled/*
    ln -sf /etc/nginx/sites-available/fixed-static /etc/nginx/sites-enabled/
    
    if nginx -t; then
        systemctl reload nginx
        echo "✅ nginx 配置已更新"
    else
        echo "❌ nginx 配置错误"
        nginx -t
    fi
fi

echo ""
echo "5. 验证修复结果:"
echo "==============="

sleep 3

echo "重新测试网站内容:"
echo "colletools.com:"
NEW_CONTENT=$(curl -s http://colletools.com | head -3)
echo "$NEW_CONTENT"

if echo "$NEW_CONTENT" | grep -q "<!DOCTYPE\|<html"; then
    echo "🎉 ColleTools 现在返回完整 HTML 页面！"
else
    echo "❌ ColleTools 仍返回: $NEW_CONTENT"
fi

echo ""
echo "dropshare.tech:"
curl -s http://dropshare.tech | head -3

echo ""
echo "📋 总结:"
echo "========"
echo "如果修复成功，现在应该能看到:"
echo "- http://colletools.com → 完整的 ColleTools 界面"
echo "- http://dropshare.tech → 完整的 DropShare 应用"
echo ""
echo "而不是简单的 'ColleTools is running!' 文本"