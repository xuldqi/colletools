#!/bin/bash

echo "🚀 部署正式网站到80端口"
echo "========================="

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

echo "🛑 1. 停止测试服务..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

echo "📝 2. 创建生产环境配置..."
cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  nginx-production:
    image: nginx:alpine
    container_name: nginx-production
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.production.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      - DOMAIN=colletools.com
    depends_on:
      - colletools-app
    networks:
      - production-network

  colletools-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: colletools-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DOMAIN=colletools.com
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - production-network
    expose:
      - "3000"

networks:
  production-network:
    driver: bridge
EOF

echo "📝 3. 创建生产nginx配置..."
cat > nginx.production.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 100M;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    upstream colletools_backend {
        server colletools-app:3000;
    }
    
    # HTTP 服务器 - colletools.com
    server {
        listen 80;
        server_name colletools.com www.colletools.com;
        
        location / {
            proxy_pass http://colletools_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        location /api/ {
            proxy_pass http://colletools_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
            client_max_body_size 100M;
        }
    }
    
    # 默认服务器 - 处理其他域名或IP直接访问
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 301 http://colletools.com$request_uri;
        }
    }
}
EOF

echo "🚀 4. 生成nginx配置..."
# 生成nginx配置文件
./generate-nginx-config.sh

echo "🚀 5. 构建并启动生产服务..."
# 使用独立的配置文件名，避免覆盖主配置
docker-compose -f docker-compose.production.yml up -d --build

echo "⏳ 6. 等待服务启动..."
sleep 20

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "107.174.250.34")
echo "服务器IP: $SERVER_IP"

echo "测试HTTP访问:"
curl -I http://localhost 2>/dev/null | head -1 || echo "本地访问失败"
curl -I http://$SERVER_IP 2>/dev/null | head -1 || echo "IP访问失败"

echo -e "\n🎉 生产环境部署完成！"
echo "================================"
echo "现在可以通过以下方式访问："
echo ""
echo "🌍 域名访问（需要DNS解析）："
echo "- http://colletools.com"
echo "- http://www.colletools.com"
echo ""
echo "🔧 IP访问："
echo "- http://$SERVER_IP"
echo ""
echo "📝 注意事项："
echo "1. 确保域名DNS已解析到 $SERVER_IP"
echo "2. 确保防火墙开放80端口"
echo "3. 如需HTTPS，请配置SSL证书"
echo ""
echo "✅ 这是真正的colletools应用，不是测试页面"
EOF

chmod +x deploy-production.sh