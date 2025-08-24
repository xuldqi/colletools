#!/bin/bash

# 包含服务器升级的部署脚本
echo "🚀 服务器升级 + 部署脚本..."

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./deploy-with-upgrade.sh"
    exit 1
fi

# 升级服务器
echo "🔧 升级服务器..."
chmod +x upgrade-server.sh
./upgrade-server.sh

# 等待升级完成
echo "⏳ 等待升级完成..."
sleep 10

# 进入项目目录
cd /var/www/colletools

# 使用升级版的 Dockerfile
echo "📝 使用升级版 Dockerfile..."
cp Dockerfile.upgraded Dockerfile

# 创建 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=colletools.com
SSL_EMAIL=admin@colletools.com
NODE_ENV=production
PORT=3000
EOF
fi

# 创建必要目录
mkdir -p uploads logs ssl

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 检查启动结果
if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    
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
    echo "- HTTP: http://colletools.com"
    echo "- HTTPS: https://colletools.com"
    echo ""
    echo "📋 管理命令："
    echo "查看日志：docker-compose logs -f"
    echo "停止服务：docker-compose down"
    echo "重启服务：docker-compose restart"
    
else
    echo "❌ 部署失败"
    echo ""
    echo "🔧 故障排除："
    echo "1. 查看构建日志：docker-compose logs"
    echo "2. 检查 Docker 状态：docker info"
    echo "3. 重新构建：docker-compose build --no-cache"
fi
