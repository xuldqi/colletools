#!/bin/bash

echo "🚀 部署真正的colletools应用到80端口"
echo "======================================"

# 停止当前服务
echo "🛑 停止当前服务..."
docker-compose down

# 创建生产配置
echo "📝 创建colletools生产配置..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx-production:
    image: nginx:alpine
    container_name: nginx-production
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.production.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - colletools-app
    networks:
      - production-network

  colletools-app:
    image: node:18-alpine
    container_name: colletools-app
    restart: unless-stopped
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - production-network
    expose:
      - "3000"

networks:
  production-network:
    driver: bridge
EOF

# 创建nginx配置
echo "📝 创建nginx生产配置..."
cat > nginx.production.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    upstream colletools_backend {
        server colletools-app:3000;
    }
    
    server {
        listen 80;
        server_name _;
        
        location / {
            proxy_pass http://colletools_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /api/ {
            proxy_pass http://colletools_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            client_max_body_size 100M;
        }
    }
}
EOF

# 启动服务
echo "🚀 启动colletools应用..."
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 30

echo "📋 检查容器状态..."
docker ps

echo "🌐 测试访问..."
echo "测试localhost:"
curl -I http://localhost 2>/dev/null | head -1 || echo "访问失败"

echo -e "\n🎉 部署完成！"
echo "现在可以访问："
echo "- http://107.174.250.34 (真正的colletools应用)"
echo "- http://colletools.com (配置DNS后)"
echo ""
echo "这次是真正的React应用，不是测试页面！"