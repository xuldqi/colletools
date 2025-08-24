#!/bin/bash

# SSL 证书故障排除脚本
echo "🔧 SSL 证书故障排除脚本..."

echo "📋 1. 检查域名 DNS 解析..."
echo "colletools.com 解析结果："
dig colletools.com +short || echo "无法解析"
echo ""

echo "📋 2. 检查端口监听状态..."
echo "80 端口："
netstat -tulpn | grep :80 || echo "80 端口未监听"
echo ""

echo "443 端口："
netstat -tulpn | grep :443 || echo "443 端口未监听"
echo ""

echo "📋 3. 检查防火墙状态..."
if command -v ufw &> /dev/null; then
    echo "UFW 状态："
    ufw status
else
    echo "UFW 未安装"
fi
echo ""

echo "📋 4. 检查 Docker 容器状态..."
docker-compose ps
echo ""

echo "📋 5. 检查 Nginx 配置..."
if docker-compose ps | grep -q nginx; then
    echo "Nginx 配置测试："
    docker-compose exec nginx nginx -t
    echo ""
    
    echo "Nginx 错误日志（最近10行）："
    docker-compose logs --tail=10 nginx
else
    echo "Nginx 容器未运行"
fi
echo ""

echo "📋 6. 检查 SSL 证书文件..."
if [ -d "ssl/live/colletools.com" ]; then
    echo "SSL 证书文件："
    ls -la ssl/live/colletools.com/
    echo ""
    
    if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
        echo "证书有效期："
        openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
        echo ""
        
        echo "证书主题："
        openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep "Subject:"
        echo ""
    fi
else
    echo "❌ SSL 证书目录不存在"
fi
echo ""

echo "📋 7. 测试 HTTP 访问..."
echo "测试 HTTP 重定向："
curl -I http://colletools.com 2>/dev/null | head -5 || echo "HTTP 访问失败"
echo ""

echo "📋 8. 测试 HTTPS 访问..."
echo "测试 HTTPS 连接："
curl -I https://colletools.com 2>/dev/null | head -5 || echo "HTTPS 访问失败"
echo ""

echo "📋 9. 检查 Let's Encrypt 验证路径..."
if [ -d "/var/www/certbot" ]; then
    echo "Certbot 目录存在"
    ls -la /var/www/certbot/
else
    echo "❌ Certbot 目录不存在"
fi
echo ""

echo "📋 10. 检查 Certbot 日志..."
echo "Certbot 日志（最近10行）："
docker-compose logs --tail=10 certbot 2>/dev/null || echo "无法获取 Certbot 日志"
echo ""

echo "🔧 常见问题解决方案："
echo ""
echo "1. 如果 DNS 解析失败："
echo "   - 检查域名 DNS 设置"
echo "   - 等待 DNS 传播（最多24小时）"
echo ""
echo "2. 如果端口未监听："
echo "   - 检查防火墙设置：ufw allow 80 && ufw allow 443"
echo "   - 检查 Docker 容器是否运行"
echo ""
echo "3. 如果 SSL 证书申请失败："
echo "   - 确保域名正确解析到服务器"
echo "   - 确保 80 端口可访问"
echo "   - 检查 Certbot 日志"
echo ""
echo "4. 如果证书过期："
echo "   - 运行：./ssl-renew.sh"
echo ""
echo "5. 如果配置错误："
echo "   - 运行：./quick-fix.sh"
