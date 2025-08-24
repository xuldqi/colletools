#!/bin/bash

# SSL 证书状态检查脚本
echo "🔍 SSL 证书状态检查..."

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查证书文件
echo -e "${BLUE}📋 1. 检查证书文件...${NC}"
if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
    echo -e "${GREEN}✅ 证书文件存在${NC}"
    ls -la ssl/live/colletools.com/
else
    echo -e "${RED}❌ 证书文件不存在${NC}"
fi
echo ""

# 检查证书有效期
echo -e "${BLUE}📅 2. 检查证书有效期...${NC}"
if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
    echo "证书有效期："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep -A 2 "Validity"
    echo ""
    
    # 计算剩余天数
    END_DATE=$(openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep "Not After" | cut -d: -f2-)
    END_EPOCH=$(date -d "$END_DATE" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($END_EPOCH - $CURRENT_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -gt 30 ]; then
        echo -e "${GREEN}✅ 证书有效期充足：$DAYS_LEFT 天${NC}"
    elif [ $DAYS_LEFT -gt 7 ]; then
        echo -e "${YELLOW}⚠️  证书即将过期：$DAYS_LEFT 天${NC}"
    else
        echo -e "${RED}❌ 证书即将过期：$DAYS_LEFT 天${NC}"
    fi
else
    echo -e "${RED}❌ 无法检查证书有效期${NC}"
fi
echo ""

# 检查证书主题
echo -e "${BLUE}🌐 3. 检查证书主题...${NC}"
if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
    echo "证书主题："
    openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep "Subject:"
    echo ""
else
    echo -e "${RED}❌ 无法检查证书主题${NC}"
fi

# 检查自动续期任务
echo -e "${BLUE}🔄 4. 检查自动续期任务...${NC}"
if crontab -l 2>/dev/null | grep -q "ssl-renew.sh"; then
    echo -e "${GREEN}✅ 自动续期任务已设置${NC}"
    crontab -l | grep "ssl-renew"
else
    echo -e "${YELLOW}⚠️  自动续期任务未设置${NC}"
    echo "运行以下命令设置自动续期："
    echo "./setup-auto-renewal.sh"
fi
echo ""

# 检查续期日志
echo -e "${BLUE}📊 5. 检查续期日志...${NC}"
if [ -f "logs/ssl-renewal.log" ]; then
    echo -e "${GREEN}✅ 续期日志文件存在${NC}"
    echo "最近的续期记录："
    tail -5 logs/ssl-renewal.log
else
    echo -e "${YELLOW}⚠️  续期日志文件不存在${NC}"
fi
echo ""

# 测试 HTTPS 访问
echo -e "${BLUE}🌐 6. 测试 HTTPS 访问...${NC}"
if curl -I https://colletools.com 2>/dev/null | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ HTTPS 访问正常${NC}"
    echo "响应头："
    curl -I https://colletools.com 2>/dev/null | head -5
else
    echo -e "${RED}❌ HTTPS 访问失败${NC}"
fi
echo ""

# 检查 Docker 容器状态
echo -e "${BLUE}🐳 7. 检查 Docker 容器状态...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker 容器运行正常${NC}"
    docker-compose ps
else
    echo -e "${RED}❌ Docker 容器未运行${NC}"
fi
echo ""

# 总结
echo -e "${BLUE}📋 SSL 证书状态总结：${NC}"
if [ -f "ssl/live/colletools.com/fullchain.pem" ] && [ $DAYS_LEFT -gt 30 ]; then
    echo -e "${GREEN}✅ SSL 证书状态良好${NC}"
else
    echo -e "${YELLOW}⚠️  SSL 证书需要关注${NC}"
fi

echo ""
echo -e "${BLUE}🔧 常用命令：${NC}"
echo "手动续期：./ssl-renew.sh"
echo "设置自动续期：./setup-auto-renewal.sh"
echo "故障排除：./ssl-troubleshoot.sh"
echo "查看续期日志：tail -f logs/ssl-renewal.log"
