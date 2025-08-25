#!/bin/bash

# 安全部署脚本 - 包含冲突检查
echo "🛡️  ColleTools 安全部署脚本"
echo "=========================="

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查root权限
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 root 用户运行此脚本${NC}"
    exit 1
fi

# 1. 运行冲突检查
echo -e "${BLUE}🔍 1. 运行冲突检查...${NC}"
chmod +x check-conflicts.sh
./check-conflicts.sh

echo ""
echo -e "${YELLOW}是否继续部署？(y/n)${NC}"
read -r CONTINUE

if [ "$CONTINUE" != "y" ]; then
    echo "部署已取消"
    exit 0
fi

# 2. 检查是否需要使用备用端口
echo -e "${BLUE}📋 2. 检查端口配置...${NC}"
if lsof -i :80 >/dev/null 2>&1 || netstat -tulpn 2>/dev/null | grep -q ":80 "; then
    echo -e "${YELLOW}⚠️  端口80已被占用，将使用备用端口8080${NC}"
    sed -i.bak 's/^HTTP_PORT=.*/HTTP_PORT=8080/' .env
    sed -i.bak 's/^# HTTP_PORT=8080/HTTP_PORT=8080/' .env
fi

if lsof -i :443 >/dev/null 2>&1 || netstat -tulpn 2>/dev/null | grep -q ":443 "; then
    echo -e "${YELLOW}⚠️  端口443已被占用，将使用备用端口8443${NC}"
    sed -i.bak 's/^HTTPS_PORT=.*/HTTPS_PORT=8443/' .env
    sed -i.bak 's/^# HTTPS_PORT=8443/HTTPS_PORT=8443/' .env
fi

# 3. 生成唯一的部署ID
DEPLOY_ID="prod-$(date +%Y%m%d-%H%M%S)"
echo -e "${BLUE}📝 3. 设置部署ID: $DEPLOY_ID${NC}"
sed -i.bak "s/^DEPLOY_ID=.*/DEPLOY_ID=$DEPLOY_ID/" .env

# 4. 选择配置文件
echo -e "${BLUE}🔧 4. 选择部署配置...${NC}"
echo "1) 使用安全配置（推荐，避免冲突）"
echo "2) 使用标准配置（需要80/443端口）"
read -p "请选择 (1/2): " CONFIG_CHOICE

if [ "$CONFIG_CHOICE" = "1" ]; then
    COMPOSE_FILE="docker-compose.safe.yml"
    echo -e "${GREEN}✅ 使用安全配置${NC}"
else
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${YELLOW}⚠️  使用标准配置${NC}"
fi

# 5. 停止可能冲突的服务
echo -e "${BLUE}🛑 5. 停止现有服务...${NC}"
# 停止可能的旧容器
docker-compose -f docker-compose.yml down 2>/dev/null || true
docker-compose -f docker-compose.safe.yml down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# 停止系统nginx（如果需要）
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo -e "${YELLOW}停止系统nginx服务...${NC}"
    systemctl stop nginx
fi

# 6. 生成nginx配置
echo -e "${BLUE}📝 6. 生成nginx配置...${NC}"
./generate-nginx-config.sh

# 7. 构建并启动服务
echo -e "${BLUE}🚀 7. 构建并启动服务...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 服务启动成功${NC}"
else
    echo -e "${RED}❌ 服务启动失败${NC}"
    exit 1
fi

# 8. 等待服务启动
echo -e "${BLUE}⏳ 8. 等待服务启动...${NC}"
sleep 15

# 9. 检查服务状态
echo -e "${BLUE}📋 9. 检查服务状态...${NC}"
docker-compose -f "$COMPOSE_FILE" ps

# 10. 显示访问信息
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "========================"

# 获取实际使用的端口
source .env
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "服务器IP")

echo -e "${BLUE}访问地址:${NC}"
if [ "$HTTP_PORT" = "80" ]; then
    echo "- http://$PRIMARY_DOMAIN"
    echo "- http://$SECONDARY_DOMAIN"
else
    echo "- http://$PRIMARY_DOMAIN:$HTTP_PORT"
    echo "- http://$SECONDARY_DOMAIN:$HTTP_PORT"
    echo "- http://$SERVER_IP:$HTTP_PORT"
fi

if [ "$HTTPS_PORT" = "443" ]; then
    echo "- https://$PRIMARY_DOMAIN (需要SSL证书)"
    echo "- https://$SECONDARY_DOMAIN (需要SSL证书)"
else
    echo "- https://$PRIMARY_DOMAIN:$HTTPS_PORT (需要SSL证书)"
    echo "- https://$SECONDARY_DOMAIN:$HTTPS_PORT (需要SSL证书)"
fi

echo ""
echo -e "${BLUE}📝 管理命令:${NC}"
echo "查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "停止服务: docker-compose -f $COMPOSE_FILE down"
echo "重启服务: docker-compose -f $COMPOSE_FILE restart"
echo "检查冲突: ./check-conflicts.sh"

echo ""
echo -e "${YELLOW}⚠️  注意事项:${NC}"
echo "1. 如使用非标准端口，需要在域名后加端口号访问"
echo "2. 防火墙需要开放相应端口"
echo "3. SSL证书申请可能需要标准80/443端口"