#!/bin/bash

# 超简单部署脚本 - 只使用 nginx 静态文件
echo "🚀 超简单部署 - 只使用 nginx..."

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ dist 目录不存在，请先构建项目"
    echo "运行：npm run build"
    exit 1
fi

# 使用超简单配置
echo "📝 使用超简单配置..."
cp docker-compose.ultra-simple.yml docker-compose.yml

# 创建 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=colletools.com
SSL_EMAIL=admin@colletools.com
EOF
fi

# 创建必要目录
mkdir -p ssl

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
    echo ""
    echo "📁 静态文件来自：./dist 目录"
else
    echo "❌ 部署失败"
    echo "查看日志：docker-compose logs"
fi
