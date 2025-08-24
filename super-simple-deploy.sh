#!/bin/bash

# 超级简单部署脚本
echo "🚀 超级简单部署..."

# 检查当前目录
echo "📁 当前目录：$(pwd)"

# 使用简化的配置文件
echo "📝 使用简化配置..."
cp docker-compose.simple.yml docker-compose.yml
cp Dockerfile.simple Dockerfile

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

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 检查结果
if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "📊 容器状态："
    docker-compose ps
    echo ""
    echo "🌐 访问地址："
    echo "- http://colletools.com"
    echo "- https://colletools.com"
else
    echo "❌ 部署失败"
    echo "查看日志：docker-compose logs"
fi
