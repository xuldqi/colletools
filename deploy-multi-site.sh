#!/bin/bash

# 多站点部署脚本 - 同时运行 colletools 和 dropshare
echo "🚀 多站点部署 - colletools + dropshare..."

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./deploy-multi-site.sh"
    exit 1
fi

# 停止所有现有服务
echo "🛑 停止所有现有服务..."
docker-compose down 2>/dev/null || true
cd /var/www/dropshare && docker-compose down 2>/dev/null || true
cd /var/www/colletools

# 停止系统服务
echo "🛑 停止系统服务..."
systemctl stop nginx apache2 2>/dev/null || true

# 使用多站点配置
echo "📝 使用多站点配置..."
cp docker-compose.multi-site.yml docker-compose.yml
cp nginx.multi-site.conf nginx.conf

# 创建 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=dropshare.com
SSL_EMAIL=admin@colletools.com
NODE_ENV=production
PORT=3000
EOF
fi

# 创建必要目录
mkdir -p uploads logs ssl

# 检查 dropshare 静态文件
echo "📁 检查 dropshare 静态文件..."
if [ ! -d "/var/www/dropshare/dist" ]; then
    echo "⚠️  dropshare 静态文件不存在，创建占位符..."
    mkdir -p /var/www/dropshare/dist
    echo "<h1>Dropshare.com</h1><p>网站正在建设中...</p>" > /var/www/dropshare/dist/index.html
fi

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建并启动服务
echo "🔨 构建并启动多站点服务..."
docker-compose up -d --build

# 检查启动结果
if [ $? -eq 0 ]; then
    echo "✅ 多站点部署成功！"
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    sleep 15
    
    # 检查容器状态
    echo "📊 容器状态："
    docker-compose ps
    
    # 检查端口监听
    echo "🔌 端口监听状态："
    netstat -tulpn | grep -E ":80|:443" || echo "端口未监听"
    
    echo ""
    echo "🌐 访问地址："
    echo "- Colletools: https://colletools.com"
    echo "- Dropshare: https://dropshare.com"
    echo ""
    echo "📋 管理命令："
    echo "查看日志：docker-compose logs -f"
    echo "停止服务：docker-compose down"
    echo "重启服务：docker-compose restart"
    echo ""
    echo "🔧 如果需要更新 dropshare："
    echo "1. 更新 /var/www/dropshare/dist 目录"
    echo "2. 重启 dropshare-app: docker-compose restart dropshare-app"
    
else
    echo "❌ 部署失败"
    echo ""
    echo "🔧 故障排除："
    echo "1. 查看构建日志：docker-compose logs"
    echo "2. 检查 Docker 状态：docker info"
    echo "3. 重新构建：docker-compose build --no-cache"
fi
