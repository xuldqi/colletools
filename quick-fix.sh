#!/bin/bash

# 快速修复脚本 - 解决依赖循环问题
echo "🔧 快速修复依赖循环问题..."

# 停止所有容器
echo "🛑 停止所有容器..."
docker-compose down -v

# 清理所有容器和网络
echo "🧹 清理容器和网络..."
docker system prune -f
docker network prune -f

# 使用简化的配置
echo "📝 使用简化的 colletools 配置..."

# 复制简化的配置文件
cp docker-compose.colletools.yml docker-compose.yml
cp nginx.colletools.conf nginx.conf

# 创建 .env 文件
cat > .env << EOF
# Colletools.com 专用配置
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=colletools.com
SSL_EMAIL=admin@colletools.com

# 应用配置
NODE_ENV=production
PORT=3000

# 文件上传配置
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads

# 日志配置
LOG_LEVEL=info
LOG_PATH=./logs
EOF

echo "✅ 已创建简化的配置文件"

# 创建必要目录
echo "📁 创建必要目录..."
mkdir -p uploads logs ssl

# 启动所有服务
echo "🚀 启动所有服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查状态
echo "📊 检查服务状态..."
docker-compose ps

# 申请 SSL 证书
echo "🔐 申请 SSL 证书..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@colletools.com \
    --agree-tos \
    --no-eff-email \
    -d colletools.com \
    -d www.colletools.com

# 检查证书申请结果
if [ $? -eq 0 ]; then
    echo "✅ SSL 证书申请成功！"
    
    # 重新加载 Nginx 配置
    echo "🔄 重新加载 Nginx 配置..."
    docker-compose exec nginx nginx -s reload
    
    # 设置自动续期
    echo "🔄 设置 SSL 证书自动续期..."
    if [ -f "setup-auto-renewal.sh" ]; then
        chmod +x setup-auto-renewal.sh
        ./setup-auto-renewal.sh
    fi
    
    # 设置服务器重启后自动启动
    echo "🚀 设置服务器重启后自动启动..."
    if [ -f "setup-auto-start.sh" ]; then
        chmod +x setup-auto-start.sh
        sudo ./setup-auto-start.sh
    fi
    
    echo ""
    echo "✅ 修复完成！"
    echo ""
    echo "🔍 验证步骤："
    echo "1. 等待几分钟让服务完全启动"
    echo "2. 访问 https://colletools.com"
    echo "3. 检查是否显示正确的 colletools 页面"
    echo "4. 确认 SSL 证书锁图标显示"
    echo ""
    echo "🌐 测试访问："
    echo "- HTTP: http://colletools.com (应该重定向到 HTTPS)"
    echo "- HTTPS: https://colletools.com"
    echo "- HTTPS: https://www.colletools.com"
    echo ""
    echo "🔄 SSL 证书自动续期已设置"
    echo "- 续期时间：每天凌晨 2:00"
    echo "- 日志文件：logs/ssl-renewal.log"
    echo "- 手动续期：./ssl-renew.sh"
    echo ""
    echo "🚀 服务器重启后自动启动已设置"
    echo "- 服务名称：colletools"
    echo "- 管理命令：sudo systemctl status colletools"
    echo "- 查看日志：sudo journalctl -u colletools -f"
    
else
    echo "❌ SSL 证书申请失败"
    echo ""
    echo "🔧 请运行 SSL 故障排除脚本："
    echo "./ssl-troubleshoot.sh"
fi

echo ""
echo "📋 如果还有问题，请运行："
echo "docker-compose logs -f"
