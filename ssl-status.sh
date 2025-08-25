#!/bin/bash

# SSL证书状态检查脚本
echo "🔐 SSL证书状态检查"
echo "=================="

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 加载环境变量
if [ -f ".env" ]; then
    source .env
else
    echo -e "${RED}❌ .env 文件不存在${NC}"
    exit 1
fi

# 检查SSL目录
echo -e "${BLUE}📁 检查SSL证书目录...${NC}"
if [ -d "ssl/live" ]; then
    echo -e "${GREEN}✅ SSL目录存在${NC}"
    echo "证书目录内容:"
    ls -la ssl/live/
else
    echo -e "${RED}❌ SSL目录不存在${NC}"
    echo "请先申请SSL证书"
    exit 1
fi
echo ""

# 检查每个域名的证书
for domain in "$PRIMARY_DOMAIN" "$SECONDARY_DOMAIN"; do
    echo -e "${BLUE}🌐 检查域名: $domain${NC}"
    
    cert_path="ssl/live/$domain/fullchain.pem"
    key_path="ssl/live/$domain/privkey.pem"
    
    # 检查证书文件是否存在
    if [ -f "$cert_path" ] && [ -f "$key_path" ]; then
        echo -e "${GREEN}✅ 证书文件存在${NC}"
        
        # 获取证书信息
        subject=$(openssl x509 -in "$cert_path" -text -noout | grep "Subject:" | sed 's/.*CN=//')
        issuer=$(openssl x509 -in "$cert_path" -text -noout | grep "Issuer:" | sed 's/.*O=//' | sed 's/,.*//')
        start_date=$(openssl x509 -in "$cert_path" -text -noout | grep "Not Before" | cut -d: -f2-)
        end_date=$(openssl x509 -in "$cert_path" -text -noout | grep "Not After" | cut -d: -f2-)
        
        # 计算剩余天数
        end_epoch=$(date -d "$end_date" +%s)
        current_epoch=$(date +%s)
        days_left=$(( (end_epoch - current_epoch) / 86400 ))
        
        echo "证书主体: $subject"
        echo "颁发者: $issuer"
        echo "开始时间: $start_date"
        echo "结束时间: $end_date"
        
        if [ $days_left -gt 60 ]; then
            echo -e "${GREEN}✅ 证书有效期: $days_left 天${NC}"
        elif [ $days_left -gt 30 ]; then
            echo -e "${YELLOW}⚠️  证书有效期: $days_left 天（建议准备续期）${NC}"
        elif [ $days_left -gt 0 ]; then
            echo -e "${RED}⚠️  证书即将过期: $days_left 天（需要立即续期）${NC}"
        else
            echo -e "${RED}❌ 证书已过期${NC}"
        fi
        
        # 验证证书链
        echo -n "证书链验证: "
        if openssl verify -CAfile "$cert_path" "$cert_path" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ 通过${NC}"
        else
            echo -e "${YELLOW}⚠️  警告（可能是自签名证书）${NC}"
        fi
        
    else
        echo -e "${RED}❌ 证书文件不存在${NC}"
        [ ! -f "$cert_path" ] && echo "缺少: $cert_path"
        [ ! -f "$key_path" ] && echo "缺少: $key_path"
    fi
    echo ""
done

# 检查自动续期任务
echo -e "${BLUE}🔄 检查自动续期配置...${NC}"
if crontab -l 2>/dev/null | grep -q "ssl-renew.sh"; then
    echo -e "${GREEN}✅ 自动续期任务已配置${NC}"
    echo "定时任务:"
    crontab -l | grep ssl-renew
else
    echo -e "${YELLOW}⚠️  自动续期任务未配置${NC}"
    echo "运行 ./setup-auto-renewal.sh 来配置自动续期"
fi
echo ""

# 总结
echo -e "${BLUE}📋 SSL状态总结${NC}"
echo "=================="
echo "主域名: $PRIMARY_DOMAIN"
echo "第二域名: $SECONDARY_DOMAIN"
echo ""
echo -e "${BLUE}🔧 常用SSL命令:${NC}"
echo "申请新证书: docker-compose run --rm certbot-primary"
echo "手动续期: ./ssl-renew.sh"
echo "设置自动续期: ./setup-auto-renewal.sh"
echo "测试HTTPS: curl -I https://$PRIMARY_DOMAIN"