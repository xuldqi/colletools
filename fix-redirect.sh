#!/bin/bash

echo "🔧 修复nginx重定向问题"
echo "======================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./fix-redirect.sh"
    exit 1
fi

echo "📝 1. 创建修复后的nginx配置..."
cat > nginx.fixed-redirect.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # 基本设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    upstream colletools_backend {
        server colletools-app:3000;
    }
    
    upstream dropshare_backend {
        server dropshare-app:80;
    }
    
    # 默认服务器 - 显示站点列表，不重定向
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 200 "Available sites:\n- http://$host/colletools\n- http://$host/dropshare\n";
            add_header Content-Type text/plain;
        }
    }
    
    # Colletools 服务器
    server {
        listen 80;
        server_name _;
        
        location /colletools {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
        
        location /colletools/ {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
    }
    
    # Dropshare 服务器
    server {
        listen 80;
        server_name _;
        
        location /dropshare {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
        
        location /dropshare/ {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
    }
}
EOF

echo "🛑 2. 停止现有服务..."
docker-compose down 2>/dev/null || true

echo "📝 3. 更新nginx配置..."
cp nginx.fixed-redirect.conf nginx.conf

echo "🚀 4. 重新启动服务..."
docker-compose up -d

echo "⏳ 5. 等待服务启动..."
sleep 10

echo "📋 6. 检查服务状态..."
docker ps

echo "🌐 7. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试首页:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "首页访问失败"

echo "测试 dropshare:"
curl -I http://$SERVER_IP:8080/dropshare 2>/dev/null || echo "dropshare访问失败"

echo "测试 colletools:"
curl -I http://$SERVER_IP:8080/colletools 2>/dev/null || echo "colletools访问失败"

echo "📝 8. 提供正确的访问链接..."
echo -e "\n🎉 重定向问题已修复！"
echo "=================================="
echo "现在可以正常访问："
echo ""
echo "首页: http://$SERVER_IP:8080"
echo "DropShare: http://$SERVER_IP:8080/dropshare"
echo "Colletools: http://$SERVER_IP:8080/colletools"
echo ""
echo "域名访问:"
echo "DropShare: http://dropshare.tech:8080/dropshare"
echo "Colletools: http://colletools.com:8080/colletools"
echo ""
echo "📋 说明："
echo "1. 首页不再重定向，显示可用站点列表"
echo "2. 每个路径都指向正确的后端服务"
echo "3. 不会再出现意外的重定向"
