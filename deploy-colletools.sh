#!/bin/bash

# Colletools.com 专用部署脚本
echo "🚀 开始部署 Colletools.com..."

# 检查是否在正确的目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p uploads logs ssl

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    if [ -f "colletools-only.env" ]; then
        cp colletools-only.env .env
        echo "✅ 已从 colletools-only.env 创建 .env 文件"
        echo "⚠️  请编辑 .env 文件，设置正确的邮箱地址"
    else
        echo "❌ 错误：找不到 colletools-only.env 文件"
        exit 1
    fi
else
    echo "✅ .env 文件已存在"
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建并启动容器
echo "🔨 构建并启动容器..."
docker-compose up -d --build

# 检查容器状态
echo "📊 检查容器状态..."
docker-compose ps

echo "✅ 部署完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 .env 文件，设置正确的邮箱地址"
echo "2. 运行 'docker-compose restart' 重新加载配置"
echo "3. 检查日志：'docker-compose logs -f'"
echo ""
echo "🌐 访问地址："
echo "- Colletools: https://colletools.com"
echo ""
echo "🔧 域名配置说明："
echo "- colletools.com 将运行在端口 3000"
echo "- 自动申请 SSL 证书"
echo "- 支持 www.colletools.com"
