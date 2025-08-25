#!/bin/bash

# 统一部署脚本 - 支持生产和测试环境
echo "🚀 ColleTools 部署脚本"
echo "====================="

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 获取部署模式
MODE=${1:-production}

if [ "$MODE" != "production" ] && [ "$MODE" != "test" ]; then
    echo -e "${RED}❌ 无效的部署模式: $MODE${NC}"
    echo "用法: $0 [production|test]"
    exit 1
fi

echo -e "${BLUE}📋 部署模式: $MODE${NC}"

# 检查必要文件
echo -e "${BLUE}📁 1. 检查项目文件...${NC}"
required_files=(".env" "docker-compose.yml" "generate-nginx-config.sh")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ 文件 $file 不存在${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ 项目文件检查通过${NC}"

# 生成nginx配置
echo -e "${BLUE}📝 2. 生成nginx配置...${NC}"
chmod +x generate-nginx-config.sh
./generate-nginx-config.sh

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ nginx配置生成成功${NC}"
else
    echo -e "${RED}❌ nginx配置生成失败${NC}"
    exit 1
fi

# 停止现有服务
echo -e "${BLUE}🛑 3. 停止现有服务...${NC}"
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

# 清理
echo -e "${BLUE}🧹 4. 清理Docker资源...${NC}"
docker system prune -f >/dev/null 2>&1

# 选择配置文件
if [ "$MODE" = "test" ]; then
    COMPOSE_FILE="docker-compose.simple.yml"
    echo -e "${YELLOW}⚙️  使用测试配置${NC}"
else
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${BLUE}⚙️  使用生产配置${NC}"
fi

# 构建并启动服务
echo -e "${BLUE}🚀 5. 构建并启动服务...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 服务启动成功${NC}"
else
    echo -e "${RED}❌ 服务启动失败${NC}"
    echo "查看日志: docker-compose -f $COMPOSE_FILE logs"
    exit 1
fi

# 等待服务启动
echo -e "${BLUE}⏳ 6. 等待服务启动...${NC}"
sleep 15

# 检查服务状态
echo -e "${BLUE}📋 7. 检查服务状态...${NC}"
docker-compose -f "$COMPOSE_FILE" ps

# 测试访问
echo -e "${BLUE}🌐 8. 测试访问...${NC}"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "服务器IP获取失败")
echo "服务器IP: $SERVER_IP"

if [ "$MODE" = "test" ]; then
    TEST_PORT=8080
    echo "测试端口 $TEST_PORT:"
    curl -I http://localhost:$TEST_PORT 2>/dev/null | head -1 || echo "本地访问失败"
else
    echo "测试HTTP访问:"
    curl -I http://localhost 2>/dev/null | head -1 || echo "本地访问失败"
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "========================"

if [ "$MODE" = "test" ]; then
    echo -e "${YELLOW}测试环境访问地址:${NC}"
    echo "- http://localhost:8080"
    echo "- http://$SERVER_IP:8080"
else
    echo -e "${BLUE}生产环境访问地址:${NC}"
    echo "- http://colletools.com"
    echo "- http://dropshare.com"
    echo "- http://$SERVER_IP"
fi

echo ""
echo -e "${BLUE}📝 管理命令:${NC}"
echo "查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "停止服务: docker-compose -f $COMPOSE_FILE down"
echo "重启服务: docker-compose -f $COMPOSE_FILE restart"
echo "检查状态: ./deployment-status.sh"