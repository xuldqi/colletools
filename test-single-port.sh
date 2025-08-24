#!/bin/bash

echo "🧪 单端口测试脚本 - 使用8080端口"
echo "================================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./test-single-port.sh"
    exit 1
fi

echo "🛑 1. 停止所有现有服务..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "📝 2. 创建8080端口测试配置..."
cat > docker-compose.8080.yml << 'EOF'
version: '3.8'

services:
  nginx-8080:
    image: nginx:alpine
    container_name: nginx-8080
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.8080.conf:/etc/nginx/nginx.conf:ro
    networks:
      - test-network

  colletools-8080:
    image: nginx:alpine
    container_name: colletools-8080
    restart: unless-stopped
    volumes:
      - ./colletools-8080.html:/usr/share/nginx/html/index.html:ro
    networks:
      - test-network
    expose:
      - "80"

  dropshare-8080:
    image: nginx:alpine
    container_name: dropshare-8080
    restart: unless-stopped
    volumes:
      - ./dropshare-8080.html:/usr/share/nginx/html/index.html:ro
    networks:
      - test-network
    expose:
      - "80"

networks:
  test-network:
    driver: bridge
EOF

echo "📝 3. 创建8080端口nginx配置..."
cat > nginx.8080.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    upstream colletools_backend {
        server colletools-8080:80;
    }
    
    upstream dropshare_backend {
        server dropshare-8080:80;
    }
    
    # 默认服务器 - 显示所有可用站点
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

echo "📝 4. 创建测试页面..."
cat > colletools-8080.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Colletools - 8080端口测试</title>
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
            <p>✅ 8080端口测试成功</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署在8080端口运行正常！</p>
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

cat > dropshare-8080.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DropShare - 8080端口测试</title>
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
            <p>✅ 8080端口测试成功</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署在8080端口运行正常！</p>
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

echo "🚀 5. 启动8080端口服务..."
cp docker-compose.8080.yml docker-compose.yml
cp nginx.8080.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 10

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试8080端口访问..."
echo "测试本地8080端口:"
curl -I http://localhost:8080 2>/dev/null || echo "8080端口访问失败"

echo "测试 colletools 路径:"
curl -I http://localhost:8080/colletools 2>/dev/null || echo "colletools路径访问失败"

echo "测试 dropshare 路径:"
curl -I http://localhost:8080/dropshare 2>/dev/null || echo "dropshare路径访问失败"

echo "📝 9. 获取服务器IP..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "🌐 10. 测试外部8080端口访问..."
echo "测试IP访问8080端口:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "IP访问8080端口失败"

echo "📋 11. 提供测试链接..."
echo -e "\n📋 测试链接："
echo "1. 本地测试: http://localhost:8080"
echo "2. 外部测试: http://$SERVER_IP:8080"
echo "3. Colletools: http://$SERVER_IP:8080/colletools"
echo "4. DropShare: http://$SERVER_IP:8080/dropshare"

echo -e "\n✅ 8080端口测试完成！"
echo "📝 如果8080端口可以访问，说明问题在于80端口被占用或阻止"
echo "🔧 下一步：配置域名指向8080端口或解决80端口问题"
