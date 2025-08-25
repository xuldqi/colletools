#!/bin/bash

# 恢复SSL证书配置
echo "🔒 恢复SSL证书配置..."
echo "===================="

echo "1. 检查现有SSL证书:"
echo "=================="

# 检查 Let's Encrypt 证书
echo "检查 Let's Encrypt 证书目录:"
if [ -d "/etc/letsencrypt/live" ]; then
    echo "✅ Let's Encrypt 目录存在"
    echo "现有证书:"
    ls -la /etc/letsencrypt/live/
    
    # 检查具体域名证书
    for domain in colletools.com dropshare.tech; do
        if [ -d "/etc/letsencrypt/live/$domain" ]; then
            echo "✅ $domain 证书存在"
            echo "证书文件:"
            ls -la /etc/letsencrypt/live/$domain/
            
            # 检查证书有效期
            echo "证书有效期:"
            openssl x509 -in /etc/letsencrypt/live/$domain/fullchain.pem -noout -dates 2>/dev/null || echo "无法读取证书信息"
        else
            echo "❌ $domain 证书不存在"
        fi
        echo ""
    done
else
    echo "❌ Let's Encrypt 证书目录不存在"
fi

echo ""
echo "2. 检查Certbot状态:"
echo "=================="
if command -v certbot >/dev/null; then
    echo "✅ Certbot 已安装"
    echo "Certbot 证书列表:"
    certbot certificates 2>/dev/null || echo "无法获取证书列表"
else
    echo "❌ Certbot 未安装"
    echo "安装 Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

echo ""
echo "3. 备份当前nginx配置:"
echo "===================="
mkdir -p /tmp/ssl-backup-$(date +%s)
cp -r /etc/nginx/sites-enabled/* /tmp/ssl-backup-$(date +%s)/ 2>/dev/null

echo ""
echo "4. 创建带SSL的nginx配置:"
echo "========================"

# 检查是否有有效的SSL证书
HAS_COLLETOOLS_SSL=false
HAS_DROPSHARE_SSL=false

if [ -f "/etc/letsencrypt/live/colletools.com/fullchain.pem" ]; then
    HAS_COLLETOOLS_SSL=true
fi

if [ -f "/etc/letsencrypt/live/dropshare.tech/fullchain.pem" ]; then
    HAS_DROPSHARE_SSL=true
fi

# 创建SSL配置
cat > /etc/nginx/sites-available/ssl-enabled << EOF
# ColleTools 配置
server {
    listen 80;
    server_name colletools.com www.colletools.com;
EOF

if [ "$HAS_COLLETOOLS_SSL" = true ]; then
    cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name colletools.com www.colletools.com;
    
    ssl_certificate /etc/letsencrypt/live/colletools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colletools.com/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    root /var/www/colletools/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
EOF
else
    cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
    root /var/www/colletools/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
EOF
fi

cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
}

# DropShare 配置
server {
    listen 80;
    server_name dropshare.tech www.dropshare.tech;
EOF

if [ "$HAS_DROPSHARE_SSL" = true ]; then
    cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dropshare.tech www.dropshare.tech;
    
    ssl_certificate /etc/letsencrypt/live/dropshare.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dropshare.tech/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
EOF
else
    cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
EOF
fi

cat >> /etc/nginx/sites-available/ssl-enabled << 'EOF'
}
EOF

echo ""
echo "5. 应用SSL配置:"
echo "=============="

rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/ssl-enabled /etc/nginx/sites-enabled/

if nginx -t; then
    echo "✅ SSL配置测试通过"
    systemctl reload nginx
    echo "✅ nginx已重启"
else
    echo "❌ SSL配置有错误"
    nginx -t
    exit 1
fi

echo ""
echo "6. 重新申请缺失的SSL证书:"
echo "======================="

# 如果没有证书，重新申请
if [ "$HAS_COLLETOOLS_SSL" = false ]; then
    echo "为 colletools.com 申请SSL证书..."
    certbot --nginx -d colletools.com -d www.colletools.com --non-interactive --agree-tos --email admin@colletools.com 2>/dev/null || echo "证书申请失败"
fi

if [ "$HAS_DROPSHARE_SSL" = false ]; then
    echo "为 dropshare.tech 申请SSL证书..."
    certbot --nginx -d dropshare.tech -d www.dropshare.tech --non-interactive --agree-tos --email admin@dropshare.tech 2>/dev/null || echo "证书申请失败"
fi

echo ""
echo "7. 测试HTTPS访问:"
echo "================"
sleep 3

echo "测试 HTTPS 访问:"
for domain in colletools.com dropshare.tech; do
    echo "https://$domain:"
    curl -s -I https://$domain | head -3 2>/dev/null || echo "HTTPS访问失败，使用HTTP"
    echo ""
done

echo ""
echo "🎉 SSL恢复完成!"
echo "==============="
echo "✅ 现在支持的访问方式:"

if [ "$HAS_COLLETOOLS_SSL" = true ]; then
    echo "- https://colletools.com (SSL)"
else
    echo "- http://colletools.com (无SSL)"
fi

if [ "$HAS_DROPSHARE_SSL" = true ]; then
    echo "- https://dropshare.tech (SSL)"
else
    echo "- http://dropshare.tech (无SSL)"
fi

echo ""
echo "💡 如果需要重新申请SSL证书:"
echo "certbot --nginx -d colletools.com -d www.colletools.com"
echo "certbot --nginx -d dropshare.tech -d www.dropshare.tech"