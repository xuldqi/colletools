#!/bin/bash

# 修复域名配置脚本
echo "🔧 修复域名配置..."

# 检查当前 .env 文件
if [ -f ".env" ]; then
    echo "📋 当前 .env 文件内容："
    cat .env
    echo ""
else
    echo "❌ .env 文件不存在"
    exit 1
fi

# 备份当前配置
cp .env .env.backup
echo "✅ 已备份当前配置到 .env.backup"

# 创建正确的 colletools 配置
cat > .env << EOF
# Colletools.com 专用配置
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=colletools.com

# SSL 证书邮箱（请替换为您的邮箱）
SSL_EMAIL=your-email@example.com

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

echo "✅ 已创建新的 .env 配置"
echo "📋 新的 .env 文件内容："
cat .env
echo ""

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 清理容器和网络
echo "🧹 清理容器和网络..."
docker-compose down -v
docker system prune -f

# 重新启动服务
echo "🚀 重新启动服务..."
docker-compose up -d --build

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

echo ""
echo "✅ 域名配置修复完成！"
echo ""
echo "🔍 验证步骤："
echo "1. 等待几分钟让 SSL 证书申请完成"
echo "2. 访问 https://colletools.com"
echo "3. 检查是否显示正确的 colletools 页面"
echo ""
echo "📋 如果还有问题，请运行："
echo "docker-compose logs -f"
