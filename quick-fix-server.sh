#!/bin/bash

echo "🚀 快速修复脚本"
echo "================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./quick-fix-server.sh"
    exit 1
fi

echo "🛑 1. 停止所有Docker服务..."
docker-compose down 2>/dev/null || true
cd /var/www/dropshare && docker-compose down 2>/dev/null || true
cd /var/www/colletools

echo "🛑 2. 停止系统服务..."
systemctl stop nginx apache2 2>/dev/null || true

echo "🧹 3. 清理Docker资源..."
docker system prune -f
docker volume prune -f

echo "📋 4. 检查端口占用..."
echo "当前占用80端口的进程："
lsof -i :80 2>/dev/null || echo "80端口未被占用"
echo "当前占用443端口的进程："
lsof -i :443 2>/dev/null || echo "443端口未被占用"

echo "🔧 5. 使用简化的多站点配置..."
if [ -f "docker-compose.multi-site.yml" ]; then
    cp docker-compose.multi-site.yml docker-compose.yml
    echo "✅ 使用多站点配置"
else
    echo "❌ 多站点配置文件不存在，创建基础配置..."
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.multi-site.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
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
fi

echo "📝 6. 创建必要的配置文件..."
mkdir -p uploads logs ssl

# 创建简化的nginx配置
cat > nginx.multi-site.conf << 'EOF'
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
    
    # HTTP重定向到HTTPS
    server {
        listen 80;
        server_name colletools.com www.colletools.com dropshare.com www.dropshare.com;
        return 301 https://$server_name$request_uri;
    }
    
    # Colletools HTTPS服务器
    server {
        listen 443 ssl http2;
        server_name colletools.com www.colletools.com;
        
        # SSL配置（临时，稍后配置证书）
        ssl_certificate /etc/nginx/ssl/colletools.com.crt;
        ssl_certificate_key /etc/nginx/ssl/colletools.com.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
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
    
    # Dropshare HTTPS服务器
    server {
        listen 443 ssl http2;
        server_name dropshare.com www.dropshare.com;
        
        # SSL配置（临时，稍后配置证书）
        ssl_certificate /etc/nginx/ssl/dropshare.com.crt;
        ssl_certificate_key /etc/nginx/ssl/dropshare.com.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
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

echo "🔑 7. 创建临时SSL证书..."
# 创建自签名证书用于测试
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/colletools.com.key -out ssl/colletools.com.crt \
    -subj "/C=CN/ST=State/L=City/O=Organization/CN=colletools.com" 2>/dev/null || echo "SSL证书创建失败"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/dropshare.com.key -out ssl/dropshare.com.crt \
    -subj "/C=CN/ST=State/L=City/O=Organization/CN=dropshare.com" 2>/dev/null || echo "SSL证书创建失败"

echo "🚀 8. 启动服务..."
docker-compose up -d

echo "⏳ 9. 等待服务启动..."
sleep 10

echo "📋 10. 检查服务状态..."
docker ps

echo "🌐 11. 测试连接..."
echo "测试 colletools.com:"
curl -k -I https://localhost 2>/dev/null || echo "连接失败"

echo "测试 dropshare.com:"
curl -k -I https://localhost 2>/dev/null || echo "连接失败"

echo "✅ 快速修复完成！"
echo "📝 下一步：配置真实的SSL证书"
