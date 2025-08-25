#!/bin/bash

# ColleTools 直接部署脚本（无Docker）
echo "🚀 ColleTools 直接部署"
echo "======================"

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 root 用户运行此脚本${NC}"
    exit 1
fi

# 1. 检查必要软件
echo -e "${BLUE}📋 1. 检查必要软件...${NC}"

# 检查 Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js 已安装: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  安装 Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
fi

# 检查 PM2
if command -v pm2 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PM2 已安装${NC}"
else
    echo -e "${YELLOW}⚠️  安装 PM2...${NC}"
    npm install -g pm2
fi

# 检查 Nginx
if command -v nginx >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx 已安装${NC}"
else
    echo -e "${YELLOW}⚠️  安装 Nginx...${NC}"
    apt-get update
    apt-get install -y nginx
fi

# 2. 设置项目目录
echo -e "${BLUE}📁 2. 设置项目目录...${NC}"
PROJECT_DIR="/var/www/colletools"

if [ ! -d "$PROJECT_DIR" ]; then
    mkdir -p "$PROJECT_DIR"
    echo -e "${GREEN}✅ 创建项目目录: $PROJECT_DIR${NC}"
fi

# 如果当前不在项目目录，需要复制文件
CURRENT_DIR=$(pwd)
if [ "$CURRENT_DIR" != "$PROJECT_DIR" ]; then
    echo -e "${BLUE}📦 复制项目文件到 $PROJECT_DIR...${NC}"
    cp -r * "$PROJECT_DIR/"
    chown -R www-data:www-data "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# 3. 安装依赖和构建
echo -e "${BLUE}📦 3. 安装依赖...${NC}"
npm install

echo -e "${BLUE}🔨 4. 构建项目...${NC}"
npm run build

# 4. 创建必要目录
echo -e "${BLUE}📁 5. 创建必要目录...${NC}"
mkdir -p uploads logs
chown -R www-data:www-data uploads logs

# 5. 停止旧的PM2进程
echo -e "${BLUE}🛑 6. 停止旧进程...${NC}"
pm2 stop colletools 2>/dev/null || true
pm2 delete colletools 2>/dev/null || true

# 6. 启动应用
echo -e "${BLUE}🚀 7. 启动应用...${NC}"
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启（如果还没设置）
if ! pm2 startup | grep -q "already configured"; then
    echo -e "${BLUE}⚙️  设置开机自启...${NC}"
    pm2 startup systemd -u www-data --hp /var/www
fi

# 7. 配置 Nginx
echo -e "${BLUE}🔧 8. 配置 Nginx...${NC}"

# 备份现有配置
if [ -f "/etc/nginx/sites-enabled/colletools" ]; then
    cp /etc/nginx/sites-enabled/colletools /etc/nginx/sites-enabled/colletools.bak
fi

# 复制新配置
cp nginx.direct.conf /etc/nginx/sites-available/colletools

# 启用站点
ln -sf /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/colletools

# 测试nginx配置
if nginx -t; then
    echo -e "${GREEN}✅ Nginx 配置正确${NC}"
    systemctl reload nginx
else
    echo -e "${RED}❌ Nginx 配置错误${NC}"
    exit 1
fi

# 8. 配置防火墙
echo -e "${BLUE}🔥 9. 配置防火墙...${NC}"
ufw allow 80/tcp >/dev/null 2>&1
ufw allow 443/tcp >/dev/null 2>&1

# 9. 测试部署
echo -e "${BLUE}🧪 10. 测试部署...${NC}"
sleep 3

# 测试PM2状态
echo "PM2 状态:"
pm2 status

# 测试应用访问
echo ""
echo "测试本地访问:"
curl -I http://localhost:3002/health 2>/dev/null | head -1 || echo "本地访问失败"

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "获取IP失败")

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "========================"
echo -e "${BLUE}访问地址:${NC}"
echo "- http://colletools.com"
echo "- http://dropshare.com"
echo "- http://$SERVER_IP"
echo ""
echo -e "${BLUE}管理命令:${NC}"
echo "- 查看状态: pm2 status"
echo "- 查看日志: pm2 logs colletools"
echo "- 重启应用: pm2 restart colletools"
echo "- 重启nginx: sudo systemctl reload nginx"
echo ""
echo -e "${BLUE}下一步:${NC}"
echo "1. 确保域名DNS解析到 $SERVER_IP"
echo "2. 可选：配置SSL证书"
echo "   sudo certbot --nginx -d colletools.com"