#!/bin/bash

echo "🚀 简单稳定部署 - 确保8080端口工作"
echo "=================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./simple-stable-deploy.sh"
    exit 1
fi

echo "🛑 1. 完全停止所有服务..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "🧹 2. 清理Docker资源..."
docker system prune -af

echo "📝 3. 创建最简单的8080端口配置..."
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

  colletools-simple:
    image: nginx:alpine
    container_name: colletools-simple
    restart: unless-stopped
    volumes:
      - ./colletools-simple.html:/usr/share/nginx/html/index.html:ro
    networks:
      - simple-network
    expose:
      - "80"

  dropshare-simple:
    image: nginx:alpine
    container_name: dropshare-simple
    restart: unless-stopped
    volumes:
      - ./dropshare-simple.html:/usr/share/nginx/html/index.html:ro
    networks:
      - simple-network
    expose:
      - "80"

networks:
  simple-network:
    driver: bridge
EOF

echo "📝 4. 创建简单的nginx配置..."
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
        server colletools-simple:80;
    }
    
    upstream dropshare_backend {
        server dropshare-simple:80;
    }
    
    # 默认服务器 - 显示站点列表
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 200 "Available sites:\n- http://localhost:8080/colletools\n- http://localhost:8080/dropshare\n";
            add_header Content-Type text/plain;
        }
    }
    
    # Colletools 路径
    server {
        listen 80;
        server_name _;
        
        location /colletools {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    
    # Dropshare 路径
    server {
        listen 80;
        server_name _;
        
        location /dropshare {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
EOF

echo "📝 5. 创建简单的测试页面..."
cat > colletools-simple.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Colletools - 简单测试</title>
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
        <h1>🛠️ Colletools</h1>
        <div class="status">
            <p>✅ 简单部署成功</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>8080端口部署正常！</p>
        <div class="links">
            <a href="/dropshare">查看 DropShare</a>
            <a href="/">返回首页</a>
        </div>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF

cat > dropshare-simple.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DropShare - 简单测试</title>
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
            <p>✅ 简单部署成功</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>8080端口部署正常！</p>
        <div class="links">
            <a href="/colletools">查看 Colletools</a>
            <a href="/">返回首页</a>
        </div>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF

echo "🚀 6. 启动简单服务..."
cp docker-compose.simple.yml docker-compose.yml
cp nginx.simple.conf nginx.conf
docker-compose up -d

echo "⏳ 7. 等待服务启动..."
sleep 10

echo "📋 8. 检查服务状态..."
docker ps

echo "🌐 9. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试默认页面:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "默认页面访问失败"

echo "测试 colletools 路径:"
curl -I http://$SERVER_IP:8080/colletools 2>/dev/null || echo "colletools路径访问失败"

echo "测试 dropshare 路径:"
curl -I http://$SERVER_IP:8080/dropshare 2>/dev/null || echo "dropshare路径访问失败"

echo "📝 10. 提供访问链接..."
echo -e "\n🎉 简单部署完成！请测试以下链接："
echo "=================================="
echo "默认页面: http://$SERVER_IP:8080"
echo "Colletools: http://$SERVER_IP:8080/colletools"
echo "DropShare: http://$SERVER_IP:8080/dropshare"
echo ""
echo "📋 域名访问（需要配置DNS）:"
echo "Colletools: http://colletools.com:8080/colletools"
echo "DropShare: http://dropshare.tech:8080/dropshare"
echo ""
echo "✅ 这个配置是最简单的，应该能稳定工作"
echo "📝 如果这个可以访问，我们再逐步添加复杂功能"
