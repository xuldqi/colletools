#!/bin/bash

# 简化版多域名修复（如果SSL证书有问题使用这个）
echo "🔧 简化版域名路由修复..."
echo "=========================="

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

# 备份配置
echo "💾 备份当前配置..."
cp /etc/nginx/sites-available/colletools /etc/nginx/sites-available/colletools.backup.$(date +%Y%m%d_%H%M%S)

# 创建简化的多域名配置（先只配置有SSL证书的域名）
echo "📝 创建简化配置..."
cat > /etc/nginx/sites-available/domains-simple << 'EOF'
# ColleTools 项目 (有SSL证书的域名)
server {
    listen 443 ssl http2;
    server_name colletools.com www.colletools.com;
    
    ssl_certificate /etc/letsencrypt/live/colletools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colletools.com/privkey.pem;
    
    root /var/www/colletools/dist;
    index index.html;
    
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        proxy_pass http://localhost:3002/health;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Dropshare 项目 (HTTP版本，避免SSL证书问题)
server {
    listen 80;
    server_name dropshare.tech www.dropshare.tech;
    
    root /var/www/dropshare;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 其他域名的HTTP重定向
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    return 301 https://$host$request_uri;
}
EOF

# 应用配置
echo "🔄 应用新配置..."
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/domains-simple /etc/nginx/sites-enabled/domains-simple

# 测试配置
echo "🧪 测试配置..."
if nginx -t; then
    echo "✅ 配置测试通过"
    systemctl reload nginx
    echo "✅ nginx重启成功"
else
    echo "❌ 配置测试失败"
    exit 1
fi

sleep 2

echo ""
echo "🎉 简化版修复完成！"
echo "===================="
echo "🌐 现在的配置："
echo "- ColleTools: https://colletools.com (HTTPS)"
echo "- Dropshare: http://dropshare.tech (HTTP)"
echo ""
echo "💡 如果要给 dropshare.tech 添加HTTPS："
echo "sudo certbot --nginx -d dropshare.tech -d www.dropshare.tech"