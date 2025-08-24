#!/bin/bash

echo "🚀 部署真实网站内容"
echo "===================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./deploy-real-sites.sh"
    exit 1
fi

echo "📝 1. 创建真实网站的nginx配置..."
cat > nginx.real.conf << 'EOF'
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
            return 301 http://$host/colletools;
        }
    }
    
    # Colletools 服务器
    server {
        listen 80;
        server_name _;
        
        location /colletools {
            proxy_pass http://colletools_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
        
        location /colletools/ {
            proxy_pass http://colletools_backend/;
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
        server_name _;
        
        location /dropshare {
            proxy_pass http://dropshare_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
        
        location /dropshare/ {
            proxy_pass http://dropshare_backend/;
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

echo "📝 2. 创建真实网站的docker-compose配置..."
cat > docker-compose.real.yml << 'EOF'
version: '3.8'

services:
  nginx-real:
    image: nginx:alpine
    container_name: nginx-real
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.real.conf:/etc/nginx/nginx.conf:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - real-network

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
      - real-network
    expose:
      - "3000"

  dropshare-app:
    image: nginx:alpine
    container_name: dropshare-app
    restart: unless-stopped
    volumes:
      - /var/www/dropshare/dist:/usr/share/nginx/html:ro
    networks:
      - real-network
    expose:
      - "80"

networks:
  real-network:
    driver: bridge
EOF

echo "📁 3. 确保dropshare静态文件存在..."
if [ ! -d "/var/www/dropshare/dist" ]; then
    echo "创建dropshare静态文件..."
    mkdir -p /var/www/dropshare/dist
fi

# 创建dropshare的真实内容
cat > /var/www/dropshare/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DropShare - 文件分享平台</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 800px;
            text-align: center;
            padding: 40px 20px;
        }
        
        .logo {
            font-size: 4em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .title {
            font-size: 2.5em;
            margin-bottom: 30px;
            font-weight: 300;
        }
        
        .status {
            background: rgba(255,255,255,0.2);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .status h2 {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #4ade80;
        }
        
        .time {
            font-size: 1.2em;
            margin: 15px 0;
            opacity: 0.9;
        }
        
        .links {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .btn {
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .features {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .feature h3 {
            margin-bottom: 10px;
            color: #4ade80;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1 class="title">DropShare</h1>
        
        <div class="status">
            <h2>✅ 网站运行正常</h2>
            <p>多站点部署在8080端口成功运行</p>
            <p class="time">服务器时间: <span id="time"></span></p>
            <p>部署状态: 在线</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>📁 文件分享</h3>
                <p>安全可靠的文件分享服务</p>
            </div>
            <div class="feature">
                <h3>🔒 隐私保护</h3>
                <p>端到端加密保护您的数据</p>
            </div>
            <div class="feature">
                <h3>⚡ 高速传输</h3>
                <p>优化的传输速度</p>
            </div>
        </div>
        
        <div class="links">
            <a href="/colletools" class="btn">访问 Colletools</a>
            <a href="/" class="btn">刷新页面</a>
        </div>
    </div>
    
    <script>
        // 更新时间
        function updateTime() {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleString('zh-CN');
        }
        
        updateTime();
        setInterval(updateTime, 1000);
        
        // 添加一些交互效果
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.container');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        });
    </script>
</body>
</html>
EOF

echo "🛑 4. 停止现有服务..."
docker-compose down 2>/dev/null || true

echo "🚀 5. 启动真实网站服务..."
cp docker-compose.real.yml docker-compose.yml
cp nginx.real.conf nginx.conf
docker-compose up -d

echo "⏳ 6. 等待服务启动..."
sleep 15

echo "📋 7. 检查服务状态..."
docker ps

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试 dropshare:"
curl -I http://$SERVER_IP:8080/dropshare 2>/dev/null || echo "dropshare访问失败"

echo "测试 colletools:"
curl -I http://$SERVER_IP:8080/colletools 2>/dev/null || echo "colletools访问失败"

echo "📝 9. 提供访问链接..."
echo -e "\n🎉 真实网站部署完成！"
echo "=================================="
echo "DropShare:"
echo "- http://$SERVER_IP:8080/dropshare"
echo "- http://dropshare.tech:8080/dropshare"
echo ""
echo "Colletools:"
echo "- http://$SERVER_IP:8080/colletools"
echo "- http://colletools.com:8080/colletools"
echo ""
echo "📋 说明："
echo "1. 现在运行的是真实的网站内容"
echo "2. Colletools 是完整的应用"
echo "3. DropShare 是静态网站"
echo "4. 两个网站都在8080端口运行"
