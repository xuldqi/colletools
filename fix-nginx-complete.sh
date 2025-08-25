#!/bin/bash

echo "🔧 彻底修复nginx配置"
echo "===================="

# 完全停止nginx
systemctl stop nginx

# 清理所有nginx配置
rm -f /etc/nginx/sites-enabled/*
rm -f /etc/nginx/conf.d/*

# 重新创建正确的配置
cat > /etc/nginx/sites-available/colletools << 'EOF'
server {
    listen 80 default_server;
    server_name _;
    client_max_body_size 100M;
    
    location / {
        root /var/www/colletools/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 启用新配置
ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/

# 测试并启动
nginx -t
systemctl start nginx

# 等待启动
sleep 5

# 测试访问
echo "测试结果:"
curl -I http://localhost

echo "✅ 完成"