#!/bin/bash

# 简单部署脚本 - 直接运行 docker-compose
echo "🚀 简单部署 - 直接运行 docker-compose..."

# 检查当前目录
echo "📁 当前目录：$(pwd)"

# 检查必要文件
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml 文件不存在"
    exit 1
fi

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

# 直接启动服务（不重新构建）
echo "🚀 启动服务..."
docker-compose up -d

# 检查启动结果
if [ $? -eq 0 ]; then
    echo "✅ 服务启动成功！"
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    sleep 5
    
    # 检查容器状态
    echo "📊 容器状态："
    docker-compose ps
    
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
    echo "🔧 如果需要重新构建，请运行："
    echo "docker-compose up -d --build"
fi
