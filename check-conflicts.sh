#!/bin/bash

# 服务器冲突检查脚本
echo "🔍 检查服务器资源冲突..."
echo "========================="

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFLICTS=0

# 1. 检查端口冲突
echo -e "${BLUE}📌 1. 检查端口占用...${NC}"
PORTS=("80" "443" "3000" "3001")

for port in "${PORTS[@]}"; do
    if lsof -i :$port >/dev/null 2>&1 || netstat -tulpn 2>/dev/null | grep -q ":$port "; then
        echo -e "${RED}❌ 端口 $port 已被占用${NC}"
        if command -v lsof >/dev/null 2>&1; then
            echo "占用进程:"
            lsof -i :$port | grep LISTEN || true
        fi
        CONFLICTS=$((CONFLICTS+1))
    else
        echo -e "${GREEN}✅ 端口 $port 可用${NC}"
    fi
done
echo ""

# 2. 检查Docker容器名称冲突
echo -e "${BLUE}🐳 2. 检查Docker容器名称冲突...${NC}"
CONTAINERS=("colletools-app" "colletools-app-secondary" "nginx-proxy" "certbot-primary" "certbot-secondary")

for container in "${CONTAINERS[@]}"; do
    if docker ps -a --format "{{.Names}}" 2>/dev/null | grep -q "^$container$"; then
        echo -e "${RED}❌ 容器名称 '$container' 已存在${NC}"
        CONFLICTS=$((CONFLICTS+1))
    else
        echo -e "${GREEN}✅ 容器名称 '$container' 可用${NC}"
    fi
done
echo ""

# 3. 检查Docker网络冲突
echo -e "${BLUE}🌐 3. 检查Docker网络冲突...${NC}"
NETWORKS=("colletools-network")

for network in "${NETWORKS[@]}"; do
    if docker network ls --format "{{.Name}}" 2>/dev/null | grep -q "^$network$"; then
        echo -e "${RED}❌ 网络名称 '$network' 已存在${NC}"
        CONFLICTS=$((CONFLICTS+1))
    else
        echo -e "${GREEN}✅ 网络名称 '$network' 可用${NC}"
    fi
done
echo ""

# 4. 检查nginx进程
echo -e "${BLUE}🔧 4. 检查系统nginx服务...${NC}"
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo -e "${RED}❌ 系统nginx服务正在运行（会与Docker nginx冲突）${NC}"
    echo "建议: sudo systemctl stop nginx && sudo systemctl disable nginx"
    CONFLICTS=$((CONFLICTS+1))
else
    echo -e "${GREEN}✅ 系统nginx服务未运行${NC}"
fi
echo ""

# 5. 检查现有的nginx Docker容器
echo -e "${BLUE}🐳 5. 检查其他nginx容器...${NC}"
NGINX_CONTAINERS=$(docker ps --format "{{.Names}}" 2>/dev/null | grep -i nginx | grep -v nginx-proxy || true)
if [ -n "$NGINX_CONTAINERS" ]; then
    echo -e "${YELLOW}⚠️  发现其他nginx容器:${NC}"
    echo "$NGINX_CONTAINERS"
    echo "可能会有端口冲突"
fi
echo ""

# 6. 建议的解决方案
echo -e "${BLUE}💡 解决方案建议：${NC}"
echo "========================="

if [ $CONFLICTS -gt 0 ]; then
    echo -e "${YELLOW}发现 $CONFLICTS 个潜在冲突${NC}"
    echo ""
    echo "1. 端口冲突解决方案:"
    echo "   - 修改docker-compose.yml中的端口映射"
    echo "   - 例如: '8080:80' 和 '8443:443'"
    echo ""
    echo "2. 容器名称冲突解决方案:"
    echo "   - 添加项目前缀，如: colletools-prod-nginx"
    echo "   - 或使用时间戳: colletools-nginx-$(date +%s)"
    echo ""
    echo "3. 如果系统nginx占用80/443端口:"
    echo "   - sudo systemctl stop nginx"
    echo "   - sudo systemctl disable nginx"
    echo ""
    echo "4. 使用项目独立配置:"
    echo "   - 复制docker-compose.yml为docker-compose.prod.yml"
    echo "   - 修改端口和容器名称"
    echo "   - 使用: docker-compose -f docker-compose.prod.yml up -d"
else
    echo -e "${GREEN}✅ 未发现冲突，可以安全部署${NC}"
fi

echo ""
echo -e "${BLUE}📋 其他检查项：${NC}"
echo "- 确保域名DNS已正确解析"
echo "- 确保防火墙规则已配置"
echo "- 确保有足够的磁盘空间"
echo "- 建议使用反向代理统一管理多个项目"