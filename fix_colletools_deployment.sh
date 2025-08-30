#!/bin/bash
# ColleTools 服务器部署修复脚本
# 使用方法: chmod +x fix_colletools_deployment.sh && sudo ./fix_colletools_deployment.sh

echo "🚀 ColleTools 服务器部署修复脚本"
echo "================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_DIR="/var/www/colletools"
DOMAIN="colletools.com"
PORT=3003

echo -e "${BLUE}📍 步骤 1: 检查和修复项目目录${NC}"
# 确保在正确的项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ 项目目录不存在: $PROJECT_DIR${NC}"
    echo -e "${YELLOW}正在创建项目目录并克隆仓库...${NC}"
    sudo mkdir -p /var/www
    cd /var/www
    sudo git clone https://github.com/xuldqi/colletools.git colletools
    sudo chown -R $USER:$USER $PROJECT_DIR
else
    echo -e "${GREEN}✅ 项目目录存在${NC}"
fi

cd $PROJECT_DIR

echo -e "${BLUE}📍 步骤 2: 修复Git仓库配置${NC}"
# 检查和修复Git远程仓库
CURRENT_ORIGIN=$(git remote get-url origin 2>/dev/null || echo "none")
CORRECT_ORIGIN="https://github.com/xuldqi/colletools.git"

if [ "$CURRENT_ORIGIN" != "$CORRECT_ORIGIN" ]; then
    echo -e "${YELLOW}🔧 修复Git远程仓库配置${NC}"
    git remote set-url origin $CORRECT_ORIGIN
    echo -e "${GREEN}✅ Git远程仓库已设置为: $CORRECT_ORIGIN${NC}"
else
    echo -e "${GREEN}✅ Git远程仓库配置正确${NC}"
fi

echo -e "${BLUE}📍 步骤 3: 更新代码和依赖${NC}"
# 强制拉取最新代码并修复损坏的文件
echo -e "${YELLOW}🔄 强制更新代码...${NC}"
git fetch origin
git reset --hard origin/main
git clean -fd

# 安装依赖
echo -e "${YELLOW}📦 安装/更新依赖...${NC}"
npm install

echo -e "${BLUE}📍 步骤 4: 构建项目${NC}"
# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build

echo -e "${BLUE}📍 步骤 5: 停止现有进程${NC}"
# 停止占用端口的进程
echo -e "${YELLOW}🛑 停止端口 $PORT 上的进程...${NC}"
sudo lsof -ti:$PORT | xargs sudo kill -9 2>/dev/null || true

# 停止PM2进程（如果存在）
if command -v pm2 &> /dev/null; then
    pm2 stop colletools 2>/dev/null || true
    pm2 delete colletools 2>/dev/null || true
fi

echo -e "${BLUE}📍 步骤 6: 配置Nginx${NC}"
# 停止nginx以避免冲突
sudo systemctl stop nginx 2>/dev/null || true

# 备份现有nginx配置
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    sudo cp /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-available/$DOMAIN.backup.$(date +%Y%m%d_%H%M%S)
fi

# 创建新的nginx配置
echo -e "${YELLOW}📝 创建Nginx配置...${NC}"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # 反向代理到Node.js应用
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        
        # WebSocket支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
sudo rm -f /etc/nginx/sites-enabled/$DOMAIN
sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# 删除默认站点（如果存在且会冲突）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试nginx配置
echo -e "${YELLOW}🧪 测试Nginx配置...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx配置语法正确${NC}"
else
    echo -e "${RED}❌ Nginx配置有误，请检查${NC}"
    exit 1
fi

echo -e "${BLUE}📍 步骤 7: 启动服务${NC}"

# 启动Node.js应用
echo -e "${YELLOW}🚀 启动Node.js应用...${NC}"
if command -v pm2 &> /dev/null; then
    # 使用PM2管理
    pm2 start npm --name "colletools" -- run preview -- --port $PORT --host 0.0.0.0
    pm2 save
    pm2 startup
    echo -e "${GREEN}✅ 使用PM2启动应用${NC}"
else
    # 使用nohup后台运行
    nohup npm run preview -- --port $PORT --host 0.0.0.0 > colletools.log 2>&1 &
    echo -e "${GREEN}✅ 使用nohup后台启动应用${NC}"
fi

# 等待应用启动
sleep 5

# 检查应用是否运行
if curl -s "http://127.0.0.1:$PORT" > /dev/null; then
    echo -e "${GREEN}✅ Node.js应用启动成功${NC}"
else
    echo -e "${RED}❌ Node.js应用启动失败${NC}"
    echo "查看日志: tail -f colletools.log"
    exit 1
fi

# 启动nginx
echo -e "${YELLOW}🔄 启动Nginx...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx

if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx启动成功${NC}"
else
    echo -e "${RED}❌ Nginx启动失败${NC}"
    sudo systemctl status nginx
    exit 1
fi

echo -e "${BLUE}📍 步骤 8: SSL证书修复（可选）${NC}"
# 尝试修复SSL证书
if command -v certbot &> /dev/null; then
    echo -e "${YELLOW}🔐 尝试修复SSL证书...${NC}"
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN 2>/dev/null || {
        echo -e "${YELLOW}⚠️ SSL证书配置失败，但HTTP访问正常${NC}"
    }
fi

echo -e "${BLUE}📍 步骤 9: 验证部署${NC}"
# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "未知")

echo ""
echo -e "${GREEN}🎉 ColleTools 部署完成！${NC}"
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}✅ 项目已更新到最新版本（包含翻译修复）${NC}"
echo -e "${GREEN}✅ Node.js应用运行在端口 $PORT${NC}"
echo -e "${GREEN}✅ Nginx反向代理已配置${NC}"
echo ""
echo -e "${BLUE}📱 访问方式：${NC}"
echo -e "  🌐 域名访问: http://$DOMAIN"
echo -e "  🌐 IP访问:   http://$SERVER_IP"
echo -e "  🔧 直接端口: http://$SERVER_IP:$PORT"
echo ""
echo -e "${BLUE}📋 管理命令：${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "  📊 查看状态: pm2 status"
    echo -e "  📜 查看日志: pm2 logs colletools"
    echo -e "  🔄 重启应用: pm2 restart colletools"
else
    echo -e "  📊 查看进程: ps aux | grep node"
    echo -e "  📜 查看日志: tail -f $PROJECT_DIR/colletools.log"
fi
echo -e "  🔄 重启Nginx: sudo systemctl restart nginx"
echo -e "  📊 Nginx状态: sudo systemctl status nginx"
echo ""
echo -e "${YELLOW}💡 提示：如果域名仍显示dropshare，请检查DNS设置是否指向正确的服务器IP${NC}"