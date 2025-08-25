#!/bin/bash

echo "🚀 最简单的colletools部署方式"
echo "==============================="

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

echo "🛑 1. 停止Docker服务..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true

echo "📦 2. 安装依赖..."
# 安装Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
fi

# 安装PM2
npm install -g pm2 tsx

# 安装nginx
apt update
apt install nginx -y

echo "🏗️ 3. 构建前端..."
npm install
npm run build

echo "🖥️ 4. 启动后端API..."
# 停止现有的PM2进程
pm2 stop colletools-api 2>/dev/null || true
pm2 delete colletools-api 2>/dev/null || true

# 启动API服务器
cd api
pm2 start server.ts --name colletools-api --interpreter tsx
cd ..

echo "🌐 5. 配置nginx..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;
    
    # 设置最大文件上传大小
    client_max_body_size 100M;
    
    # 静态文件
    location / {
        root /var/www/colletools/dist;
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API请求
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 文件上传超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# 重启nginx
systemctl restart nginx
systemctl enable nginx

echo "⏳ 6. 等待服务启动..."
sleep 10

echo "📋 7. 检查服务状态..."
echo "PM2进程:"
pm2 list

echo -e "\nNginx状态:"
systemctl status nginx --no-pager -l

echo -e "\n端口监听:"
netstat -tulpn | grep -E ":80|:3001"

echo "🌐 8. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试前端:"
curl -I http://localhost 2>/dev/null | head -1 || echo "前端访问失败"

echo "测试API:"
curl -I http://localhost/api/health 2>/dev/null | head -1 || echo "API可能还在启动中..."

echo -e "\n🎉 部署完成！"
echo "================================="
echo "🌍 网站访问地址:"
echo "- http://$SERVER_IP"
echo "- http://colletools.com (配置DNS后)"
echo ""
echo "📋 管理命令:"
echo "- 查看API日志: pm2 logs colletools-api"
echo "- 重启API: pm2 restart colletools-api" 
echo "- 重启nginx: systemctl restart nginx"
echo ""
echo "✅ 这是最简单可靠的部署方式："
echo "- Node.js API用PM2管理"
echo "- React前端用nginx服务" 
echo "- 80端口直接访问"