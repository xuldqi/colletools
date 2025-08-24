#!/bin/bash

# SSL 证书设置脚本
echo "🔐 SSL 证书设置脚本..."

# 检查当前 SSL 证书状态
echo "📋 检查当前 SSL 证书状态..."

if [ -d "ssl/live/colletools.com" ]; then
    echo "✅ colletools.com SSL 证书已存在"
    ls -la ssl/live/colletools.com/
    echo ""
    
    # 检查证书有效期
    echo "📅 检查证书有效期："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    echo ""
else
    echo "❌ colletools.com SSL 证书不存在"
    echo ""
fi

# 创建 SSL 目录
echo "📁 创建 SSL 目录..."
mkdir -p ssl/live/colletools.com

# 检查域名解析
echo "🌐 检查域名解析..."
echo "colletools.com 解析结果："
nslookup colletools.com || echo "无法解析域名"
echo ""

echo "www.colletools.com 解析结果："
nslookup www.colletools.com || echo "无法解析域名"
echo ""

# 检查端口状态
echo "🔌 检查端口状态..."
netstat -tulpn | grep -E ":80|:443" || echo "端口未监听"
echo ""

# 启动基础服务（不包含 SSL）
echo "🚀 启动基础服务..."
docker-compose up -d nginx colletools-app

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps
echo ""

# 申请 SSL 证书
echo "🔐 申请 SSL 证书..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@colletools.com \
    --agree-tos \
    --no-eff-email \
    -d colletools.com \
    -d www.colletools.com

# 检查证书申请结果
if [ $? -eq 0 ]; then
    echo "✅ SSL 证书申请成功！"
    
    # 重新加载 Nginx 配置
    echo "🔄 重新加载 Nginx 配置..."
    docker-compose exec nginx nginx -s reload
    
    # 显示证书信息
    echo "📋 证书信息："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    
else
    echo "❌ SSL 证书申请失败"
    echo ""
    echo "🔧 故障排除步骤："
    echo "1. 确保域名 DNS 已正确指向服务器"
    echo "2. 确保 80 和 443 端口已开放"
    echo "3. 检查防火墙设置"
    echo "4. 查看详细错误日志："
    echo "   docker-compose logs certbot"
fi

echo ""
echo "🌐 测试访问："
echo "- HTTP: http://colletools.com"
echo "- HTTPS: https://colletools.com"
echo "- HTTPS: https://www.colletools.com"
