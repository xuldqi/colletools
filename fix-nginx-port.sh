#!/bin/bash

echo "🔧 修复nginx端口配置 - 从3001改为3000"
echo "======================================"

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

echo "📝 1. 备份当前nginx配置..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

echo "📝 2. 修复nginx配置 - API端口从3001改为3000..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;
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
    
    # API请求 - 修复端口为3000
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
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

echo "🔄 3. 测试nginx配置..."
if nginx -t; then
    echo "✅ nginx配置语法正确"
else
    echo "❌ nginx配置有错误，恢复备份..."
    cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default
    exit 1
fi

echo "🔄 4. 重新加载nginx配置..."
systemctl reload nginx

echo "⏳ 5. 等待配置生效..."
sleep 5

echo "🌐 6. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试前端页面:"
curl -I http://localhost 2>/dev/null | head -1 || echo "前端访问测试"

echo "测试API接口:"
curl -I http://localhost/api/health 2>/dev/null | head -1 || echo "API接口测试"

echo "📋 7. 检查服务状态..."
echo "PM2进程:"
pm2 list

echo -e "\n端口监听状态:"
netstat -tulpn | grep -E ":80|:3000"

echo -e "\n🎉 修复完成！"
echo "=============================="
echo "🌍 现在可以访问："
echo "- http://$SERVER_IP"
echo "- http://colletools.com (配置DNS后)"
echo ""
echo "✅ 修复内容："
echo "- API端口从3001修正为3000"
echo "- nginx配置已更新并重新加载"
echo "- 静态文件和API路由都应该正常工作"
echo ""
echo "📝 如果还有问题，检查："
echo "- pm2 logs colletools-api"
echo "- tail -f /var/log/nginx/error.log"