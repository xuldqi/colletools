#!/bin/bash

# SSL 证书续期脚本
echo "🔄 SSL 证书续期脚本..."
echo "📅 开始时间：$(date)"

# 设置日志文件
LOG_FILE="logs/ssl-renewal.log"
mkdir -p logs

# 记录到日志文件
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "开始 SSL 证书续期检查"

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
    
    log "证书剩余天数：$DAYS_LEFT 天"
    echo "剩余天数：$DAYS_LEFT 天"
    echo ""
    
    if [ $DAYS_LEFT -lt 30 ]; then
        log "⚠️  证书即将过期，需要续期"
        echo "⚠️  证书即将过期，需要续期"
    else
        log "✅ 证书有效期充足，无需续期"
        echo "✅ 证书有效期充足，无需续期"
        exit 0
    fi
else
    log "❌ 证书文件不存在，需要申请新证书"
    echo "❌ 证书文件不存在，需要申请新证书"
fi

# 检查 Docker 容器状态
log "检查 Docker 容器状态"
if ! docker-compose ps | grep -q "Up"; then
    log "❌ Docker 容器未运行，启动服务"
    echo "❌ Docker 容器未运行，启动服务"
    docker-compose up -d nginx colletools-app
    sleep 10
fi

# 续期证书
log "开始续期证书"
echo "🔄 开始续期证书..."
docker-compose run --rm certbot renew

# 检查续期结果
if [ $? -eq 0 ]; then
    log "✅ 证书续期成功"
    echo "✅ 证书续期成功！"
    
    # 重新加载 Nginx 配置
    log "重新加载 Nginx 配置"
    echo "🔄 重新加载 Nginx 配置..."
    docker-compose exec nginx nginx -s reload
    
    # 显示新的证书信息
    echo "📋 新的证书信息："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    
    # 测试 HTTPS 访问
    log "测试 HTTPS 访问"
    echo "🌐 测试 HTTPS 访问："
    if curl -I https://colletools.com 2>/dev/null | grep -q "200\|301\|302"; then
        log "✅ HTTPS 访问正常"
        echo "✅ HTTPS 访问正常"
    else
        log "❌ HTTPS 访问失败"
        echo "❌ HTTPS 访问失败"
    fi
    
else
    log "❌ 证书续期失败"
    echo "❌ 证书续期失败"
    echo "请检查错误日志："
    docker-compose logs certbot
    exit 1
fi

log "SSL 证书续期完成"
echo ""
echo "📊 续期日志已保存到：$LOG_FILE"
echo "🌐 测试 HTTPS 访问："
echo "curl -I https://colletools.com"
