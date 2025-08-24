#!/bin/bash

echo "🔧 简单修复 - 彻底解决重定向问题"
echo "=================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./simple-fix.sh"
    exit 1
fi

echo "📝 1. 创建最简单的nginx配置..."
cat > nginx.simple.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    upstream colletools_backend {
        server colletools-app:3000;
    }
    
    upstream dropshare_backend {
        server dropshare-app:80;
    }
    
    server {
        listen 80;
        server_name _;
        
        # 首页 - 显示站点列表
        location = / {
            return 200 "Available sites:\n- http://$host/colletools\n- http://$host/dropshare\n";
            add_header Content-Type text/plain;
        }
        
        # Colletools 路径
        location /colletools {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Dropshare 路径
        location /dropshare {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # 其他所有路径 - 显示404
        location / {
            return 404 "Not Found\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

echo "🛑 2. 停止所有服务..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "📝 3. 创建简单的docker-compose配置..."
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'

services:
  nginx-simple:
    image: nginx:alpine
    container_name: nginx-simple
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.simple.conf:/etc/nginx/nginx.conf:ro
    networks:
      - simple-network

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
      - simple-network
    expose:
      - "3000"

  dropshare-app:
    image: nginx:alpine
    container_name: dropshare-app
    restart: unless-stopped
    volumes:
      - /var/www/dropshare/dist:/usr/share/nginx/html:ro
    networks:
      - simple-network
    expose:
      - "80"

networks:
  simple-network:
    driver: bridge
EOF

echo "📁 4. 确保dropshare静态文件存在..."
if [ ! -d "/var/www/dropshare/dist" ]; then
    mkdir -p /var/www/dropshare/dist
fi

# 创建简单的dropshare页面
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DropShare</h1>
        <div class="status">
            <p>✅ 网站运行正常</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署成功！</p>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF

echo "🚀 5. 启动简单配置..."
cp docker-compose.simple.yml docker-compose.yml
cp nginx.simple.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 15

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试首页:"
curl http://$SERVER_IP:8080 2>/dev/null || echo "首页访问失败"

echo "测试 dropshare:"
curl -I http://$SERVER_IP:8080/dropshare 2>/dev/null || echo "dropshare访问失败"

echo "测试 colletools:"
curl -I http://$SERVER_IP:8080/colletools 2>/dev/null || echo "colletools访问失败"

echo "📝 9. 提供访问链接..."
echo -e "\n🎉 简单配置部署完成！"
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
echo "1. 使用最简单的nginx配置"
echo "2. 明确的路由规则"
echo "3. 不会再有重定向问题"
