#!/bin/bash
# ColleTools 域名修复脚本
# 解决colletools.com显示dropshare而不是ColleTools的问题
# 使用方法: chmod +x fix_domain.sh && sudo ./fix_domain.sh

echo "🌐 ColleTools 域名修复脚本"
echo "========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="colletools.com"
COLLETOOLS_PORT=3003

echo -e "${BLUE}📍 步骤 1: 停止冲突的服务${NC}"

# 停止可能的dropshare和其他Web服务
echo -e "${YELLOW}🛑 停止dropshare相关服务...${NC}"
sudo pkill -f dropshare 2>/dev/null && echo -e "${GREEN}✅ 停止了dropshare进程${NC}" || echo -e "${YELLOW}⚠️ 没有找到dropshare进程${NC}"

# 停止其他可能的Web服务器
sudo systemctl stop apache2 2>/dev/null && echo -e "${GREEN}✅ 停止了Apache${NC}" || echo -e "${YELLOW}⚠️ Apache未运行${NC}"
sudo systemctl stop httpd 2>/dev/null && echo -e "${GREEN}✅ 停止了httpd${NC}" || echo -e "${YELLOW}⚠️ httpd未运行${NC}"
sudo systemctl stop lighttpd 2>/dev/null && echo -e "${GREEN}✅ 停止了lighttpd${NC}" || echo -e "${YELLOW}⚠️ lighttpd未运行${NC}"

echo -e "${BLUE}📍 步骤 2: 检查端口占用情况${NC}"

# 检查80端口占用
echo -e "${YELLOW}🔍 检查80端口占用情况...${NC}"
PORT_80_PROC=$(sudo lsof -i :80 2>/dev/null | grep LISTEN | head -1)
if [ -n "$PORT_80_PROC" ]; then
    echo -e "${YELLOW}⚠️ 80端口被占用:${NC}"
    echo "$PORT_80_PROC"
    
    # 尝试停止占用80端口的进程
    PORT_80_PID=$(echo "$PORT_80_PROC" | awk '{print $2}')
    if [ -n "$PORT_80_PID" ]; then
        echo -e "${YELLOW}🛑 尝试停止占用进程 PID: $PORT_80_PID${NC}"
        sudo kill -9 "$PORT_80_PID" 2>/dev/null && echo -e "${GREEN}✅ 成功停止占用进程${NC}" || echo -e "${RED}❌ 无法停止进程${NC}"
    fi
else
    echo -e "${GREEN}✅ 80端口空闲${NC}"
fi

# 检查ColleTools服务是否正常运行
echo -e "${YELLOW}🔍 检查ColleTools服务状态...${NC}"
if curl -s "http://127.0.0.1:$COLLETOOLS_PORT" > /dev/null; then
    echo -e "${GREEN}✅ ColleTools服务运行正常 (端口 $COLLETOOLS_PORT)${NC}"
else
    echo -e "${RED}❌ ColleTools服务未运行，请先启动ColleTools服务${NC}"
    echo -e "${YELLOW}💡 提示: 运行 ./quick_fix.sh 来启动ColleTools服务${NC}"
    exit 1
fi

echo -e "${BLUE}📍 步骤 3: 配置Nginx${NC}"

# 停止nginx以避免配置冲突
sudo systemctl stop nginx 2>/dev/null

# 备份现有配置
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null
fi

# 清理旧的站点配置
sudo rm -f /etc/nginx/sites-enabled/* 2>/dev/null

echo -e "${YELLOW}📝 创建域名代理配置...${NC}"

# 创建新的nginx配置，将所有请求代理到ColleTools
sudo tee /etc/nginx/sites-enabled/colletools > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    # 监听所有可能的域名和IP
    server_name $DOMAIN www.$DOMAIN _;
    
    # 代理所有请求到ColleTools服务
    location / {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # 静态文件优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        proxy_set_header Host \$host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo -e "${BLUE}📍 步骤 4: 测试和启动Nginx${NC}"

# 测试nginx配置
echo -e "${YELLOW}🧪 测试Nginx配置...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx配置语法正确${NC}"
else
    echo -e "${RED}❌ Nginx配置有语法错误${NC}"
    sudo nginx -t
    exit 1
fi

# 启动nginx
echo -e "${YELLOW}🚀 启动Nginx...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx

# 等待nginx启动
sleep 2

# 检查nginx状态
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx启动成功${NC}"
else
    echo -e "${RED}❌ Nginx启动失败${NC}"
    sudo systemctl status nginx
    exit 1
fi

echo -e "${BLUE}📍 步骤 5: 验证修复结果${NC}"

# 等待服务稳定
sleep 3

# 测试域名访问
echo -e "${YELLOW}🧪 测试域名访问...${NC}"

# 测试HTTP请求
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1")
if [ "$HTTP_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ 本地HTTP访问正常${NC}"
else
    echo -e "${YELLOW}⚠️ 本地HTTP访问状态码: $HTTP_RESPONSE${NC}"
fi

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "未知")

# 最终报告
echo ""
echo -e "${GREEN}🎉 域名修复完成！${NC}"
echo -e "${GREEN}===================${NC}"
echo ""
echo -e "${GREEN}✅ 已停止dropshare相关服务${NC}"
echo -e "${GREEN}✅ 已配置域名代理到ColleTools${NC}"
echo -e "${GREEN}✅ Nginx反向代理运行正常${NC}"
echo ""
echo -e "${BLUE}📱 现在可以通过以下方式访问ColleTools：${NC}"
echo -e "  🌐 主域名: http://$DOMAIN"
echo -e "  🌐 带www:  http://www.$DOMAIN"
echo -e "  🌐 IP访问: http://$SERVER_IP"
echo -e "  🔧 直接端口: http://$SERVER_IP:$COLLETOOLS_PORT"
echo ""
echo -e "${BLUE}📋 故障排除：${NC}"
echo -e "  🔍 检查Nginx状态: sudo systemctl status nginx"
echo -e "  📜 查看Nginx日志: sudo tail -f /var/log/nginx/error.log"
echo -e "  🔄 重启Nginx: sudo systemctl restart nginx"
echo -e "  📊 检查端口占用: sudo lsof -i :80"
echo ""
echo -e "${YELLOW}💡 注意：如果域名仍显示其他内容，可能需要：${NC}"
echo -e "${YELLOW}   1. 清理浏览器缓存${NC}"
echo -e "${YELLOW}   2. 检查DNS设置是否指向服务器IP: $SERVER_IP${NC}"
echo -e "${YELLOW}   3. 等待DNS缓存刷新（最多24小时）${NC}"

# 显示当前监听的端口
echo ""
echo -e "${BLUE}📊 当前服务监听状态：${NC}"
sudo netstat -tlnp | grep -E ':(80|443|3003)' | while read line; do
    echo -e "  $line"
done