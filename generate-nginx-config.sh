#!/bin/bash

# 从模板生成nginx配置文件
echo "📝 生成nginx配置文件..."

# 检查模板文件是否存在
if [ ! -f "nginx.conf.template" ]; then
    echo "❌ 模板文件 nginx.conf.template 不存在"
    exit 1
fi

# 检查环境变量文件是否存在
if [ ! -f ".env" ]; then
    echo "❌ 环境变量文件 .env 不存在"
    exit 1
fi

# 加载环境变量
source .env

# 检查必要的环境变量
if [ -z "$PRIMARY_DOMAIN" ] || [ -z "$SECONDARY_DOMAIN" ]; then
    echo "❌ 环境变量 PRIMARY_DOMAIN 或 SECONDARY_DOMAIN 未设置"
    exit 1
fi

echo "🔧 使用域名配置："
echo "主域名: $PRIMARY_DOMAIN"
echo "第二域名: $SECONDARY_DOMAIN"

# 检查使用哪个compose文件来决定容器名称
if [ -f "docker-compose.safe.yml" ] && grep -q "colletools-app-prod" docker-compose.safe.yml; then
    APP_NAME="colletools-app-prod"
    APP_SECONDARY_NAME="colletools-app-secondary-prod"
    echo "使用安全配置的容器名称"
else
    APP_NAME="colletools-app"
    APP_SECONDARY_NAME="colletools-app-secondary"
    echo "使用标准配置的容器名称"
fi

# 生成nginx配置文件
cp nginx.conf.template nginx.conf

# 替换占位符
sed -i.bak "s/PRIMARY_DOMAIN_PLACEHOLDER/$PRIMARY_DOMAIN/g" nginx.conf
sed -i.bak "s/SECONDARY_DOMAIN_PLACEHOLDER/$SECONDARY_DOMAIN/g" nginx.conf
sed -i.bak "s/colletools-app:/$APP_NAME:/g" nginx.conf
sed -i.bak "s/colletools-app-secondary:/$APP_SECONDARY_NAME:/g" nginx.conf

# 删除备份文件
rm -f nginx.conf.bak

echo "✅ nginx.conf 配置文件已生成"
echo "可以使用以下命令测试配置："
echo "docker run --rm -v \$(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx:alpine nginx -t"