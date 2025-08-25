#!/bin/bash

# SSL证书自动续期脚本
echo "🔄 开始SSL证书续期检查..."

# 设置项目目录
PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

# 检查证书是否需要续期（30天内过期）
renew_needed=false

for domain in "${PRIMARY_DOMAIN}" "${SECONDARY_DOMAIN}"; do
    if [ -f "ssl/live/$domain/fullchain.pem" ]; then
        end_date=$(openssl x509 -in "ssl/live/$domain/fullchain.pem" -text -noout | grep "Not After" | cut -d: -f2-)
        end_epoch=$(date -d "$end_date" +%s)
        current_epoch=$(date +%s)
        days_left=$(( (end_epoch - current_epoch) / 86400 ))
        
        echo "域名 $domain 证书剩余 $days_left 天"
        
        if [ $days_left -lt 30 ]; then
            echo "⚠️ 域名 $domain 证书需要续期"
            renew_needed=true
        fi
    else
        echo "❌ 域名 $domain 证书不存在"
        renew_needed=true
    fi
done

if [ "$renew_needed" = true ]; then
    echo "🔄 开始续期证书..."
    
    # 停止nginx容器以释放80端口
    docker-compose stop nginx
    
    # 续期主域名证书
    docker-compose run --rm certbot-primary
    
    # 续期第二域名证书
    docker-compose run --rm certbot-secondary
    
    # 重启nginx容器
    docker-compose start nginx
    
    # 测试nginx配置
    docker-compose exec nginx nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ SSL证书续期成功"
        # 重载nginx配置
        docker-compose exec nginx nginx -s reload
    else
        echo "❌ nginx配置测试失败"
        exit 1
    fi
else
    echo "✅ 所有证书都有效，无需续期"
fi

echo "🎉 SSL续期检查完成"