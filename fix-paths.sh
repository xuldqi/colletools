#!/bin/bash

echo "🔧 修复页面路径访问问题"
echo "========================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./fix-paths.sh"
    exit 1
fi

echo "📝 1. 创建正确的nginx配置..."
cat > nginx.fixed.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    upstream colletools_backend {
        server colletools-test:80;
    }
    
    upstream dropshare_backend {
        server dropshare-test:80;
    }
    
    # 默认服务器 - 显示站点列表
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 200 "Available sites:\n- http://$host/colletools\n- http://$host/dropshare\n";
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
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /colletools/ {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
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
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /dropshare/ {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

echo "📝 2. 创建测试页面..."
cat > colletools-test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Colletools - 测试页面</title>
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
            <p>✅ 测试页面运行正常</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署测试成功！</p>
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

cat > dropshare-test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DropShare - 测试页面</title>
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
            <p>✅ 测试页面运行正常</p>
            <p>服务器时间: <span id="time"></span></p>
        </div>
        <p>多站点部署测试成功！</p>
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

echo "🛑 3. 停止现有服务..."
docker-compose down 2>/dev/null || true

echo "📝 4. 创建docker-compose配置..."
cat > docker-compose.fixed.yml << 'EOF'
version: '3.8'

services:
  nginx-test:
    image: nginx:alpine
    container_name: nginx-test
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.fixed.conf:/etc/nginx/nginx.conf:ro
    networks:
      - test-network

  colletools-test:
    image: nginx:alpine
    container_name: colletools-test
    restart: unless-stopped
    volumes:
      - ./colletools-test.html:/usr/share/nginx/html/index.html:ro
    networks:
      - test-network
    expose:
      - "80"

  dropshare-test:
    image: nginx:alpine
    container_name: dropshare-test
    restart: unless-stopped
    volumes:
      - ./dropshare-test.html:/usr/share/nginx/html/index.html:ro
    networks:
      - test-network
    expose:
      - "80"

networks:
  test-network:
    driver: bridge
EOF

echo "🚀 5. 启动修复后的服务..."
cp docker-compose.fixed.yml docker-compose.yml
cp nginx.fixed.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 10

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试首页:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "首页访问失败"

echo "测试 colletools 路径:"
curl -I http://$SERVER_IP:8080/colletools 2>/dev/null || echo "colletools路径访问失败"

echo "测试 dropshare 路径:"
curl -I http://$SERVER_IP:8080/dropshare 2>/dev/null || echo "dropshare路径访问失败"

echo "📝 9. 提供测试链接..."
echo -e "\n🎉 修复完成！请测试以下链接："
echo "=================================="
echo "首页: http://$SERVER_IP:8080"
echo "Colletools: http://$SERVER_IP:8080/colletools"
echo "DropShare: http://$SERVER_IP:8080/dropshare"
echo ""
echo "域名访问:"
echo "Colletools: http://colletools.com:8080/colletools"
echo "DropShare: http://dropshare.tech:8080/dropshare"
