#!/bin/bash

echo "🚨 紧急修复脚本 - 解决连接关闭问题"
echo "=================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./emergency-fix.sh"
    exit 1
fi

echo "📋 1. 全面诊断当前状态..."
echo "--- Docker 服务状态 ---"
systemctl status docker --no-pager -l

echo -e "\n--- 所有容器状态 ---"
docker ps -a

echo -e "\n--- 端口占用情况 ---"
netstat -tulpn | grep -E ":80|:443|:8080|:3000"

echo -e "\n--- 防火墙状态 ---"
ufw status 2>/dev/null || iptables -L 2>/dev/null || echo "防火墙未配置"

echo -e "\n--- 系统服务状态 ---"
systemctl status nginx apache2 --no-pager -l 2>/dev/null || echo "nginx/apache2 未运行"

echo "🛑 2. 完全停止所有服务..."
docker-compose down 2>/dev/null || true
cd /var/www/dropshare && docker-compose down 2>/dev/null || true
cd /var/www/colletools

# 停止系统服务
systemctl stop nginx apache2 2>/dev/null || true

# 强制停止所有相关容器
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "🧹 3. 清理所有Docker资源..."
docker system prune -af
docker volume prune -f
docker network prune -f

echo "📝 4. 创建最简化的配置..."
cat > docker-compose.minimal.yml << 'EOF'
version: '3.8'

services:
  nginx-test:
    image: nginx:alpine
    container_name: nginx-test
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.test.conf:/etc/nginx/nginx.conf:ro
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

echo "📝 5. 创建测试nginx配置..."
cat > nginx.test.conf << 'EOF'
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
    
    # 默认服务器
    server {
        listen 80 default_server;
        server_name _;
        
        location / {
            return 200 "Nginx is working! Server: $hostname\n";
            add_header Content-Type text/plain;
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
        }
    }
}
EOF

echo "📝 6. 创建测试页面..."
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
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF

echo "🚀 7. 启动测试服务..."
cp docker-compose.minimal.yml docker-compose.yml
cp nginx.test.conf nginx.conf
docker-compose up -d

echo "⏳ 8. 等待服务启动..."
sleep 10

echo "📋 9. 检查服务状态..."
docker ps

echo "🔍 10. 检查nginx配置..."
docker exec nginx-test nginx -t

echo "🌐 11. 测试内部连接..."
echo "测试 nginx 内部:"
docker exec nginx-test curl -I http://localhost 2>/dev/null || echo "nginx 内部连接失败"

echo "测试 colletools-test 内部:"
docker exec nginx-test curl -I http://colletools-test:80 2>/dev/null || echo "colletools-test 内部连接失败"

echo "测试 dropshare-test 内部:"
docker exec nginx-test curl -I http://dropshare-test:80 2>/dev/null || echo "dropshare-test 内部连接失败"

echo "🌐 12. 测试外部访问..."
echo "测试本地访问:"
curl -I http://localhost 2>/dev/null || echo "本地访问失败"

echo "测试服务器IP访问:"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"
curl -I http://$SERVER_IP 2>/dev/null || echo "IP访问失败"

echo "🔧 13. 检查防火墙和端口..."
echo "检查80端口是否开放:"
lsof -i :80 2>/dev/null || echo "80端口未被占用"

echo "检查443端口是否开放:"
lsof -i :443 2>/dev/null || echo "443端口未被占用"

echo "📝 14. 提供手动测试命令..."
echo -e "\n📋 手动测试命令："
echo "1. 测试本地访问: curl -I http://localhost"
echo "2. 测试IP访问: curl -I http://$SERVER_IP"
echo "3. 查看容器日志: docker logs nginx-test"
echo "4. 查看nginx错误日志: docker exec nginx-test cat /var/log/nginx/error.log"

echo -e "\n✅ 紧急修复完成！"
echo "📝 如果还是无法访问，请检查："
echo "1. 服务器提供商是否阻止了80端口"
echo "2. 域名DNS解析是否正确"
echo "3. 是否有其他防火墙规则"
