#!/bin/bash

# 部署状态检查脚本
echo "🔍 部署状态检查..."

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Docker 服务
echo -e "${BLUE}🐳 1. 检查 Docker 服务...${NC}"
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✅ Docker 服务运行正常${NC}"
else
    echo -e "${RED}❌ Docker 服务未运行${NC}"
    echo "启动 Docker：sudo systemctl start docker"
fi
echo ""

# 检查 Docker Compose
echo -e "${BLUE}📦 2. 检查 Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose 已安装${NC}"
    docker-compose --version
else
    echo -e "${RED}❌ Docker Compose 未安装${NC}"
fi
echo ""

# 检查项目目录
echo -e "${BLUE}📁 3. 检查项目目录...${NC}"
if [ -d "/var/www/colletools" ]; then
    echo -e "${GREEN}✅ 项目目录存在${NC}"
    cd /var/www/colletools
    echo "当前目录：$(pwd)"
else
    echo -e "${RED}❌ 项目目录不存在${NC}"
    echo "请先克隆项目：git clone https://github.com/xuldqi/colletools.git /var/www/colletools"
    exit 1
fi
echo ""

# 检查 Docker Compose 配置
echo -e "${BLUE}📋 4. 检查 Docker Compose 配置...${NC}"
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✅ docker-compose.yml 存在${NC}"
else
    echo -e "${RED}❌ docker-compose.yml 不存在${NC}"
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env 文件存在${NC}"
    echo "环境变量："
    grep -E "^(PRIMARY_DOMAIN|SECONDARY_DOMAIN|SSL_EMAIL)" .env
else
    echo -e "${YELLOW}⚠️  .env 文件不存在${NC}"
fi
echo ""

# 检查容器状态
echo -e "${BLUE}🐳 5. 检查容器状态...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ 容器运行正常${NC}"
    docker-compose ps
else
    echo -e "${YELLOW}⚠️  容器未运行${NC}"
    echo "启动容器：docker-compose up -d"
fi
echo ""

# 检查端口监听
echo -e "${BLUE}🔌 6. 检查端口监听...${NC}"
if netstat -tulpn | grep -q ":80 "; then
    echo -e "${GREEN}✅ 80 端口正在监听${NC}"
else
    echo -e "${RED}❌ 80 端口未监听${NC}"
fi

if netstat -tulpn | grep -q ":443 "; then
    echo -e "${GREEN}✅ 443 端口正在监听${NC}"
else
    echo -e "${YELLOW}⚠️  443 端口未监听${NC}"
fi
echo ""

# 检查 systemd 服务
echo -e "${BLUE}⚙️  7. 检查 systemd 服务...${NC}"
if systemctl is-enabled --quiet colletools; then
    echo -e "${GREEN}✅ colletools 服务已启用（开机自启）${NC}"
else
    echo -e "${YELLOW}⚠️  colletools 服务未启用${NC}"
    echo "启用服务：sudo systemctl enable colletools"
fi

if systemctl is-active --quiet colletools; then
    echo -e "${GREEN}✅ colletools 服务运行正常${NC}"
else
    echo -e "${YELLOW}⚠️  colletools 服务未运行${NC}"
    echo "启动服务：sudo systemctl start colletools"
fi
echo ""

# 检查 SSL 证书
echo -e "${BLUE}🔐 8. 检查 SSL 证书...${NC}"
if [ -f "ssl/live/colletools.com/fullchain.pem" ]; then
    echo -e "${GREEN}✅ SSL 证书存在${NC}"
    # 检查证书有效期
    END_DATE=$(openssl x509 -in ssl/live/colletools.com/fullchain.pem -text -noout | grep "Not After" | cut -d: -f2-)
    END_EPOCH=$(date -d "$END_DATE" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($END_EPOCH - $CURRENT_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -gt 30 ]; then
        echo -e "${GREEN}✅ 证书有效期充足：$DAYS_LEFT 天${NC}"
    else
        echo -e "${YELLOW}⚠️  证书即将过期：$DAYS_LEFT 天${NC}"
    fi
else
    echo -e "${RED}❌ SSL 证书不存在${NC}"
fi
echo ""

# 检查自动续期
echo -e "${BLUE}🔄 9. 检查自动续期...${NC}"
if crontab -l 2>/dev/null | grep -q "ssl-renew.sh"; then
    echo -e "${GREEN}✅ 自动续期任务已设置${NC}"
    crontab -l | grep "ssl-renew"
else
    echo -e "${YELLOW}⚠️  自动续期任务未设置${NC}"
    echo "设置自动续期：./setup-auto-renewal.sh"
fi
echo ""

# 测试网站访问
echo -e "${BLUE}🌐 10. 测试网站访问...${NC}"
if curl -I https://colletools.com 2>/dev/null | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ HTTPS 访问正常${NC}"
else
    echo -e "${RED}❌ HTTPS 访问失败${NC}"
fi

if curl -I http://colletools.com 2>/dev/null | grep -q "301\|302"; then
    echo -e "${GREEN}✅ HTTP 重定向正常${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP 重定向异常${NC}"
fi
echo ""

# 总结
echo -e "${BLUE}📋 部署状态总结：${NC}"
if docker-compose ps | grep -q "Up" && systemctl is-active --quiet colletools; then
    echo -e "${GREEN}✅ 部署状态良好${NC}"
else
    echo -e "${YELLOW}⚠️  部署需要关注${NC}"
fi

echo ""
echo -e "${BLUE}🔧 常用管理命令：${NC}"
echo "启动服务：docker-compose up -d"
echo "停止服务：docker-compose down"
echo "查看日志：docker-compose logs -f"
echo "重启服务：sudo systemctl restart colletools"
echo "查看状态：sudo systemctl status colletools"
echo "SSL 状态：./ssl-status.sh"
