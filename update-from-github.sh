#!/bin/bash

# ColleTools GitHub 自动更新脚本
echo "🔄 从 GitHub 更新 ColleTools..."
echo "================================"

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目目录
PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

echo -e "${BLUE}📍 当前目录: $(pwd)${NC}"

# 1. 备份当前状态
echo -e "${BLUE}💾 1. 备份当前状态...${NC}"
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
git stash push -m "Backup before update $(date)"
echo -e "${GREEN}✅ 状态已备份${NC}"

# 2. 拉取最新代码
echo -e "${BLUE}📥 2. 拉取最新代码...${NC}"
if git pull origin main; then
    echo -e "${GREEN}✅ 代码更新成功${NC}"
else
    echo -e "${RED}❌ 代码更新失败${NC}"
    echo -e "${YELLOW}⚠️  恢复备份状态...${NC}"
    git stash pop
    exit 1
fi

# 3. 检查package.json是否有变化
echo -e "${BLUE}📦 3. 检查依赖变化...${NC}"
if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
    echo -e "${YELLOW}📦 package.json 有变化，重新安装依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        git stash pop
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装成功${NC}"
else
    echo -e "${GREEN}✅ 依赖无变化，跳过安装${NC}"
fi

# 4. 构建项目（如果需要）
echo -e "${BLUE}🔨 4. 构建项目...${NC}"
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 构建失败${NC}"
        git stash pop
        exit 1
    fi
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${YELLOW}⚠️  跳过构建步骤${NC}"
fi

# 5. 重启PM2服务
echo -e "${BLUE}🔄 5. 重启服务...${NC}"
if pm2 restart colletools; then
    echo -e "${GREEN}✅ 服务重启成功${NC}"
else
    echo -e "${RED}❌ 服务重启失败${NC}"
    echo -e "${YELLOW}⚠️  尝试重新启动...${NC}"
    pm2 delete colletools 2>/dev/null
    PORT=3002 pm2 start "npx tsx api/server.ts" --name colletools --env production
fi

# 6. 等待服务启动
echo -e "${BLUE}⏳ 6. 等待服务启动...${NC}"
sleep 5

# 7. 健康检查
echo -e "${BLUE}🧪 7. 健康检查...${NC}"
if curl -f http://localhost:3002/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 健康检查通过${NC}"
else
    echo -e "${RED}❌ 健康检查失败${NC}"
    echo -e "${YELLOW}⚠️  查看错误日志:${NC}"
    pm2 logs colletools --lines 10 --err
    exit 1
fi

# 8. 显示服务状态
echo -e "${BLUE}📊 8. 服务状态...${NC}"
pm2 status

# 9. 测试网站访问
echo -e "${BLUE}🌐 9. 测试网站访问...${NC}"
if curl -I https://colletools.com >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 网站访问正常${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS访问可能有问题，检查HTTP:${NC}"
    if curl -I http://localhost >/dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTP访问正常${NC}"
    fi
fi

# 10. 清理
echo -e "${BLUE}🧹 10. 清理备份...${NC}"
git stash drop 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 更新完成！${NC}"
echo "================================"
echo -e "${BLUE}访问地址:${NC}"
echo "- https://colletools.com"
echo "- https://dropshare.com"
echo ""
echo -e "${BLUE}管理命令:${NC}"
echo "- 查看日志: pm2 logs colletools"
echo "- 重启服务: pm2 restart colletools"
echo "- 查看状态: pm2 status"
echo ""
echo -e "${BLUE}如果有问题:${NC}"
echo "- 查看错误: pm2 logs colletools --err"
echo "- 回滚版本: git log --oneline -10"