#!/bin/bash

# 修复多域名路由配置
echo "🔧 修复域名路由配置..."
echo "========================="

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

# 1. 备份当前配置
echo "💾 1. 备份nginx配置..."
cp /etc/nginx/sites-available/colletools /etc/nginx/sites-available/colletools.backup.$(date +%Y%m%d_%H%M%S)

# 2. 检查项目目录
echo "📁 2. 检查项目目录..."
if [ -d "/var/www/colletools" ]; then
    echo "✅ ColleTools 项目存在: /var/www/colletools"
else
    echo "❌ ColleTools 项目不存在"
    exit 1
fi

if [ -d "/var/www/dropshare" ]; then
    echo "✅ Dropshare 项目存在: /var/www/dropshare"
else
    echo "❌ Dropshare 项目不存在"
    exit 1
fi

# 3. 创建正确的多域名nginx配置
echo "📝 3. 创建多域名nginx配置..."
cat > /etc/nginx/sites-available/multi-domains << 'EOF'
# ColleTools 项目配置 (colletools.com, dropshare.com)
server {
    listen 443 ssl http2;
    server_name colletools.com www.colletools.com dropshare.com www.dropshare.com;
    
    ssl_certificate /etc/letsencrypt/live/colletools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colletools.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # ColleTools 前端文件
    root /var/www/colletools/dist;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # ColleTools API
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
    
    # ColleTools 健康检查
    location /health {
        proxy_pass http://localhost:3002/health;
        proxy_set_header Host $host;
    }
    
    # ColleTools SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Dropshare 项目配置 (dropshare.tech)
server {
    listen 443 ssl http2;
    server_name dropshare.tech www.dropshare.tech;
    
    ssl_certificate /etc/letsencrypt/live/dropshare.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dropshare.tech/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Dropshare 前端文件
    root /var/www/dropshare/dist;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 如果 Dropshare 有API服务，取消下面的注释并修改端口
    # location /api/ {
    #     proxy_pass http://localhost:3003;
    #     proxy_http_version 1.1;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     client_max_body_size 100M;
    # }
    
    # Dropshare SPA路由或静态文件服务
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name colletools.com www.colletools.com dropshare.com www.dropshare.com dropshare.tech www.dropshare.tech;
    return 301 https://$host$request_uri;
}
EOF

echo "✅ 多域名配置已创建"

# 4. 禁用旧配置，启用新配置
echo "🔄 4. 更新nginx站点配置..."
rm -f /etc/nginx/sites-enabled/colletools
ln -sf /etc/nginx/sites-available/multi-domains /etc/nginx/sites-enabled/multi-domains

# 5. 测试nginx配置
echo "🧪 5. 测试nginx配置..."
if nginx -t; then
    echo "✅ nginx配置测试通过"
else
    echo "❌ nginx配置有错误"
    # 恢复原配置
    rm -f /etc/nginx/sites-enabled/multi-domains
    ln -sf /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/colletools
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

# 8. 测试域名访问
echo "🌐 8. 测试域名访问..."

echo "测试 ColleTools (colletools.com):"
if curl -I https://colletools.com 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ colletools.com 访问正常"
else
    echo "❌ colletools.com 访问异常"
fi

echo ""
echo "测试 Dropshare (dropshare.tech):"
if curl -I https://dropshare.tech 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ dropshare.tech 访问正常"
else
    echo "❌ dropshare.tech 访问异常（可能需要SSL证书）"
fi

echo ""
echo "🎉 多域名路由修复完成！"
echo "=========================="
echo "🌐 域名分配："
echo "- ColleTools: https://colletools.com, https://dropshare.com"
echo "- Dropshare: https://dropshare.tech"
echo ""
echo "📝 注意："
echo "- 如果 dropshare.tech 无法访问，可能需要申请SSL证书"
echo "- 如果 Dropshare 项目有API服务，需要取消配置中的注释并修改端口"
echo ""
echo "🔧 如果有问题："
echo "- 查看日志: sudo tail -f /var/log/nginx/error.log"
echo "- 恢复备份: 运行 restore-backup.sh"