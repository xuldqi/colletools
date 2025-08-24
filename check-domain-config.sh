#!/bin/bash

# 域名配置诊断脚本
echo "🔍 诊断域名配置..."

echo "📋 1. 检查 .env 文件配置："
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    echo "📄 文件内容："
    cat .env
    echo ""
else
    echo "❌ .env 文件不存在"
fi

echo "📋 2. 检查 Docker 容器状态："
docker-compose ps
echo ""

echo "📋 3. 检查容器环境变量："
echo "主应用容器环境变量："
docker-compose exec -T colletools-app env | grep -E "(DOMAIN|PORT)" || echo "容器未运行"
echo ""

echo "📋 4. 检查 Nginx 配置："
echo "Nginx 容器环境变量："
docker-compose exec -T nginx env | grep -E "(PRIMARY_DOMAIN|SECONDARY_DOMAIN)" || echo "Nginx 容器未运行"
echo ""

echo "📋 5. 检查端口监听："
netstat -tulpn | grep -E ":80|:443" || echo "端口未监听"
echo ""

echo "📋 6. 检查 SSL 证书："
if [ -d "ssl/live/colletools.com" ]; then
    echo "✅ colletools.com SSL 证书存在"
    ls -la ssl/live/colletools.com/
else
    echo "❌ colletools.com SSL 证书不存在"
fi
echo ""

echo "📋 7. 检查应用日志："
echo "主应用日志（最近10行）："
docker-compose logs --tail=10 colletools-app || echo "无法获取日志"
echo ""

echo "📋 8. 检查 Nginx 日志："
echo "Nginx 访问日志（最近5行）："
docker-compose logs --tail=5 nginx || echo "无法获取日志"
echo ""

echo "🔧 修复建议："
echo "1. 如果 .env 文件配置错误，运行：./fix-domain-config.sh"
echo "2. 如果容器未运行，运行：docker-compose up -d"
echo "3. 如果 SSL 证书问题，运行：docker-compose logs certbot-primary"
echo "4. 如果仍有问题，运行：docker-compose down -v && docker-compose up -d --build"
