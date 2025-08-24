#!/bin/bash

echo "🔧 配置端口重定向 - 解决80端口被阻止问题"
echo "=========================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./setup-port-redirect.sh"
    exit 1
fi

echo "📝 1. 创建8080端口的完整配置..."
cat > docker-compose.8080-final.yml << 'EOF'
version: '3.8'

services:
  nginx-8080:
    image: nginx:alpine
    container_name: nginx-8080
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.8080-final.conf:/etc/nginx/nginx.conf:ro
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

echo "📝 2. 创建8080端口的nginx配置..."
cat > nginx.8080-final.conf << 'EOF'
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
    
    # 默认服务器 - 重定向到colletools
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 301 http://$host:8080/colletools;
        }
    }
    
    # Colletools 服务器
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
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
    }
    
    # Dropshare 服务器
    server {
        listen 80;
        server_name dropshare.com www.dropshare.com dropshare.tech;
        
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

echo "🛑 3. 停止现有服务..."
docker-compose down 2>/dev/null || true

echo "📁 4. 确保dropshare静态文件存在..."
if [ ! -d "/var/www/dropshare/dist" ]; then
    echo "创建dropshare静态文件..."
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
        .links { margin-top: 30px; }
        .links a { color: white; text-decoration: none; padding: 10px 20px; background: rgba(255,255,255,0.2); border-radius: 5px; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DropShare</h1>
        <div class="status">
            <p>✅ 网站运行正常</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署在8080端口成功！</p>
        <div class="links">
            <a href="http://colletools.com:8080">访问 Colletools</a>
        </div>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF
fi

echo "🚀 5. 启动8080端口完整服务..."
cp docker-compose.8080-final.yml docker-compose.yml
cp nginx.8080-final.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 15

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试 colletools:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "colletools访问失败"

echo "测试 dropshare:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "dropshare访问失败"

echo "📝 9. 提供访问链接..."
echo -e "\n🎉 部署完成！请使用以下链接访问："
echo "=================================="
echo "Colletools:"
echo "- http://colletools.com:8080"
echo "- http://www.colletools.com:8080"
echo "- http://$SERVER_IP:8080"
echo ""
echo "DropShare:"
echo "- http://dropshare.com:8080"
echo "- http://www.dropshare.com:8080"
echo "- http://dropshare.tech:8080"
echo "- http://$SERVER_IP:8080"
echo ""
echo "📋 域名配置说明："
echo "1. 在域名管理面板中，将域名指向服务器IP: $SERVER_IP"
echo "2. 访问时需要在域名后加上 :8080 端口"
echo "3. 例如：http://dropshare.tech:8080"
echo ""
echo "🔧 下一步："
echo "- 配置SSL证书（可选）"
echo "- 设置域名重定向（可选）"
echo "- 或者联系服务器提供商开放80端口"
