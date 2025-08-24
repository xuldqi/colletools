#!/bin/bash

# SSL 证书续期脚本
echo "🔄 SSL 证书续期脚本..."

# 检查证书有效期
echo "📅 检查当前证书有效期..."
if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
    echo "证书有效期："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    echo ""
    
    # 计算剩余天数
    END_DATE=$(openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep "Not After" | cut -d: -f2-)
    END_EPOCH=$(date -d "$END_DATE" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($END_EPOCH - $CURRENT_EPOCH) / 86400 ))
    
    echo "剩余天数：$DAYS_LEFT 天"
    echo ""
    
    if [ $DAYS_LEFT -lt 30 ]; then
        echo "⚠️  证书即将过期，需要续期"
    else
        echo "✅ 证书有效期充足"
    fi
else
    echo "❌ 证书文件不存在"
fi

# 续期证书
echo "🔄 开始续期证书..."
docker-compose run --rm certbot renew

# 检查续期结果
if [ $? -eq 0 ]; then
    echo "✅ 证书续期成功！"
    
    # 重新加载 Nginx 配置
    echo "🔄 重新加载 Nginx 配置..."
    docker-compose exec nginx nginx -s reload
    
    # 显示新的证书信息
    echo "📋 新的证书信息："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    
else
    echo "❌ 证书续期失败"
    echo "请检查错误日志："
    docker-compose logs certbot
fi

echo ""
echo "🌐 测试 HTTPS 访问："
echo "curl -I https://colletools.com"
