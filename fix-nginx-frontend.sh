#!/bin/bash

# Nginx前端修复脚本 - 让nginx直接服务前端文件
echo "🔧 修复nginx前端配置..."
echo "========================"

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

# 1. 备份当前nginx配置
echo "💾 1. 备份nginx配置..."
cp /etc/nginx/sites-available/colletools /etc/nginx/sites-available/colletools.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ 配置已备份"

# 2. 确保Express使用简单稳定版本
echo "🔧 2. 设置Express为稳定版本..."
cp app.ts.simple api/app.ts
pm2 restart colletools
sleep 3

# 3. 检查Express服务状态
echo "🧪 3. 检查Express服务..."
if curl -s http://localhost:3002/health | grep -q "success"; then
    echo "✅ Express服务正常"
else
    echo "❌ Express服务异常，停止修复"
    exit 1
fi

# 4. 创建新的nginx配置
echo "📝 4. 创建新的nginx配置..."
cat > /etc/nginx/sites-available/colletools << 'EOF'
server {
    listen 443 ssl http2;
    server_name colletools.com www.colletools.com;
    
    ssl_certificate /etc/letsencrypt/live/colletools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colletools.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 直接服务前端文件
    root /var/www/colletools/dist;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API请求转发给Express
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
        client_max_body_size 100M;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:3002/health;
        proxy_set_header Host $host;
    }
    
    # 前端SPA路由 - 所有非API请求返回index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 第二个域名配置
server {
    listen 443 ssl http2;
    server_name dropshare.com www.dropshare.com;
    
    ssl_certificate /etc/letsencrypt/live/dropshare.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dropshare.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 重定向到主域名或者提供相同服务
    root /var/www/colletools/dist;
    index index.html;
    
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M;
    }
    
    location /health {
        proxy_pass http://localhost:3002/health;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name colletools.com www.colletools.com dropshare.com www.dropshare.com;
    return 301 https://$host$request_uri;
}
EOF

echo "✅ nginx配置已创建"

# 5. 测试nginx配置
echo "🧪 5. 测试nginx配置..."
if nginx -t; then
    echo "✅ nginx配置测试通过"
else
    echo "❌ nginx配置有错误，恢复备份..."
    cp /etc/nginx/sites-available/colletools.backup.* /etc/nginx/sites-available/colletools
    exit 1
fi

# 6. 重启nginx
echo "🔄 6. 重启nginx..."
systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "✅ nginx重启成功"
else
    echo "❌ nginx重启失败"
    exit 1
fi

# 7. 等待服务稳定
echo "⏳ 7. 等待服务稳定..."
sleep 3

# 8. 测试网站访问
echo "🌐 8. 测试网站访问..."

# 测试HTTPS
echo "测试HTTPS访问:"
if curl -I https://colletools.com 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ HTTPS访问正常"
else
    echo "❌ HTTPS访问异常"
fi

# 测试API
echo ""
echo "测试API访问:"
if curl -s https://colletools.com/health | grep -q "success"; then
    echo "✅ API代理正常"
else
    echo "❌ API代理异常"
fi

# 测试静态文件
echo ""
echo "测试静态文件:"
if curl -I https://colletools.com/ 2>/dev/null | grep -q "200"; then
    echo "✅ 静态文件服务正常"
else
    echo "❌ 静态文件服务异常"
fi

echo ""
echo "🎉 nginx前端修复完成！"
echo "========================="
echo "🌐 访问地址:"
echo "- https://colletools.com"
echo "- https://dropshare.com"
echo ""
echo "📋 配置说明:"
echo "- nginx直接服务前端文件(dist/)"
echo "- API请求转发给Express(localhost:3002)"
echo "- Express只处理API，不处理静态文件"
echo ""
echo "🔧 如果有问题:"
echo "- 查看nginx日志: sudo tail -f /var/log/nginx/error.log"
echo "- 查看Express日志: pm2 logs colletools"
echo "- 恢复备份: cp /etc/nginx/sites-available/colletools.backup.* /etc/nginx/sites-available/colletools"
echo ""
echo "✅ 现在应该能看到完整的ColleTools界面了！"