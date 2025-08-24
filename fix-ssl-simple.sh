#!/bin/bash

echo "🔒 简化SSL配置修复"
echo "=================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./fix-ssl-simple.sh"
    exit 1
fi

echo "📝 1. 创建简化的nginx配置（仅HTTP）..."
cat > nginx.simple.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
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
    
    # 上游服务器
    upstream colletools_backend {
        server colletools-app:3000;
    }
    
    upstream dropshare_backend {
        server dropshare-app:80;
    }
    
    # Colletools HTTP服务器
    server {
        listen 80;
        server_name colletools.com www.colletools.com;
        
        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        
        location / {
            proxy_pass http://colletools_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
    }
    
    # Dropshare HTTP服务器
    server {
        listen 80;
        server_name dropshare.com www.dropshare.com dropshare.tech;
        
        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        
        location / {
            proxy_pass http://dropshare_backend;
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

echo "📝 3. 更新docker-compose配置..."
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'

services:
  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.simple.conf:/etc/nginx/nginx.conf:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - colletools-network

  colletools-app:
    build:
      context: .
      dockerfile: Dockerfile.upgraded
    container_name: colletools-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - colletools-network
    expose:
      - "3000"

  dropshare-app:
    image: nginx:alpine
    container_name: dropshare-app
    restart: unless-stopped
    volumes:
      - /var/www/dropshare/dist:/usr/share/nginx/html:ro
    networks:
      - colletools-network
    expose:
      - "80"

networks:
  colletools-network:
    driver: bridge
EOF

echo "📁 4. 确保dropshare静态文件存在..."
if [ ! -d "/var/www/dropshare/dist" ]; then
    echo "创建dropshare测试文件..."
    mkdir -p /var/www/dropshare/dist
    cat > /var/www/dropshare/dist/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DropShare</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .status { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
        .time { font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DropShare</h1>
        <div class="status">
            <p>✅ 网站运行正常</p>
            <p class="time">服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署成功！</p>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF
fi

echo "🚀 5. 启动简化服务..."
cp docker-compose.simple.yml docker-compose.yml
cp nginx.simple.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 10

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试HTTP访问..."
echo "测试 dropshare.tech (HTTP):"
curl -I http://dropshare.tech 2>/dev/null || echo "HTTP访问失败"

echo "测试 colletools.com (HTTP):"
curl -I http://colletools.com 2>/dev/null || echo "HTTP访问失败"

echo -e "\n✅ 简化配置完成！"
echo "📝 现在两个网站都应该可以通过HTTP访问了"
echo "🔒 稍后我们可以配置SSL证书来启用HTTPS"
