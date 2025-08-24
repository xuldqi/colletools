#!/bin/bash

# 简化的 Docker Compose 启动脚本
echo "🚀 启动 Docker Compose 服务..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，启动 Docker..."
    sudo systemctl start docker
    sleep 5
fi

# 检查 Docker Compose 配置
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml 文件不存在"
    exit 1
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
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
    echo "✅ 已创建 .env 文件"
fi

# 创建必要目录
echo "📁 创建必要目录..."
mkdir -p uploads logs ssl

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 检查启动结果
if [ $? -eq 0 ]; then
    echo "✅ 服务启动成功！"
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    sleep 10
    
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
    echo "❌ 服务启动失败"
    echo ""
    echo "🔧 故障排除："
    echo "1. 查看构建日志：docker-compose logs"
    echo "2. 检查 Docker 状态：docker info"
    echo "3. 检查磁盘空间：df -h"
    echo "4. 重新构建：docker-compose build --no-cache"
fi
