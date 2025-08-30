#!/bin/bash
# Nginx配置清理脚本
# 解决nginx重定向到dropshare的问题，彻底清理所有冲突配置
# 使用方法: chmod +x clean_nginx_config.sh && sudo ./clean_nginx_config.sh

echo "🧹 Nginx配置清理脚本"
echo "===================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COLLETOOLS_PORT=3003
BACKUP_DIR="/root/nginx_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}📍 步骤 1: 检查当前配置问题${NC}"

# 检查ColleTools服务状态
echo -e "${YELLOW}🔍 检查ColleTools服务状态...${NC}"
if curl -s "http://127.0.0.1:$COLLETOOLS_PORT" > /dev/null; then
    echo -e "${GREEN}✅ ColleTools服务运行正常 (端口 $COLLETOOLS_PORT)${NC}"
else
    echo -e "${RED}❌ ColleTools服务未运行${NC}"
    echo -e "${YELLOW}💡 请先运行 ./quick_fix.sh 启动ColleTools服务${NC}"
    exit 1
fi

# 检查现有的重定向配置
echo -e "${YELLOW}🔍 检查重定向配置问题...${NC}"
REDIRECT_FILES=$(sudo grep -r "return 301" /etc/nginx/ 2>/dev/null | grep -v ".backup" | wc -l)
DROPSHARE_FILES=$(sudo grep -r "dropshare" /etc/nginx/ 2>/dev/null | wc -l)

if [ "$REDIRECT_FILES" -gt 0 ]; then
    echo -e "${RED}❌ 发现 $REDIRECT_FILES 个文件包含301重定向规则${NC}"
fi

if [ "$DROPSHARE_FILES" -gt 0 ]; then
    echo -e "${RED}❌ 发现 $DROPSHARE_FILES 个文件包含dropshare配置${NC}"
fi

# 显示问题配置文件
echo -e "${YELLOW}🔍 问题配置文件:${NC}"
sudo grep -r "return 301\|dropshare" /etc/nginx/ 2>/dev/null | head -10

echo -e "${BLUE}📍 步骤 2: 备份现有配置${NC}"

# 创建备份目录
echo -e "${YELLOW}💾 备份nginx配置到 $BACKUP_DIR${NC}"
sudo mkdir -p "$BACKUP_DIR"
sudo cp -r /etc/nginx/* "$BACKUP_DIR/" 2>/dev/null

# 显示备份的内容
BACKUP_COUNT=$(sudo find "$BACKUP_DIR" -type f | wc -l)
echo -e "${GREEN}✅ 已备份 $BACKUP_COUNT 个配置文件${NC}"

echo -e "${BLUE}📍 步骤 3: 停止nginx服务${NC}"

sudo systemctl stop nginx
echo -e "${GREEN}✅ Nginx服务已停止${NC}"

echo -e "${BLUE}📍 步骤 4: 清理所有配置文件${NC}"

# 显示将要删除的文件
echo -e "${YELLOW}📋 将要清理的配置文件:${NC}"
sudo ls -la /etc/nginx/sites-available/ 2>/dev/null
sudo ls -la /etc/nginx/sites-enabled/ 2>/dev/null

# 完全清理sites目录
echo -e "${YELLOW}🗑️ 清理sites-available目录...${NC}"
sudo rm -rf /etc/nginx/sites-available/*
echo -e "${GREEN}✅ sites-available目录已清理${NC}"

echo -e "${YELLOW}🗑️ 清理sites-enabled目录...${NC}"
sudo rm -rf /etc/nginx/sites-enabled/*
echo -e "${GREEN}✅ sites-enabled目录已清理${NC}"

# 清理可能的配置文件碎片
echo -e "${YELLOW}🧹 清理配置文件碎片...${NC}"
sudo find /etc/nginx/conf.d/ -name "*dropshare*" -delete 2>/dev/null || true
sudo find /etc/nginx/conf.d/ -name "*ssl*" -delete 2>/dev/null || true
echo -e "${GREEN}✅ 配置碎片已清理${NC}"

echo -e "${BLUE}📍 步骤 5: 创建全新的ColleTools配置${NC}"

# 创建干净的ColleTools配置
echo -e "${YELLOW}📝 创建ColleTools nginx配置...${NC}"
sudo tee /etc/nginx/sites-available/colletools > /dev/null <<EOF
# ColleTools Website Configuration
# Generated on $(date)

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name colletools.com www.colletools.com;
    
    # 禁用不必要的日志（可选）
    # access_log off;
    # error_log /var/log/nginx/colletools_error.log error;
    
    # 代理到ColleTools服务
    location / {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        
        # 基本代理头
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        proxy_set_header Host \$host;
        
        # 缓存设置
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # 压缩
        gzip on;
        gzip_vary on;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

echo -e "${GREEN}✅ ColleTools配置文件已创建${NC}"

echo -e "${BLUE}📍 步骤 6: 启用配置并测试${NC}"

# 启用站点
sudo ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/
echo -e "${GREEN}✅ ColleTools站点配置已启用${NC}"

# 测试nginx配置语法
echo -e "${YELLOW}🧪 测试nginx配置语法...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx配置语法正确${NC}"
else
    echo -e "${RED}❌ Nginx配置语法错误${NC}"
    echo -e "${YELLOW}💡 正在显示配置文件内容进行检查...${NC}"
    sudo cat /etc/nginx/sites-available/colletools
    exit 1
fi

echo -e "${BLUE}📍 步骤 7: 启动nginx服务${NC}"

# 确保80端口空闲
echo -e "${YELLOW}🔍 检查80端口占用...${NC}"
PORT_80_PROC=$(sudo lsof -i :80 2>/dev/null)
if [ -n "$PORT_80_PROC" ]; then
    echo -e "${YELLOW}⚠️ 80端口仍被占用，正在清理...${NC}"
    echo "$PORT_80_PROC"
    sudo lsof -ti:80 | xargs sudo kill -9 2>/dev/null || true
    sleep 2
fi

# 启动nginx
echo -e "${YELLOW}🚀 启动nginx服务...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx

# 等待启动
sleep 3

# 检查nginx状态
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx启动成功${NC}"
else
    echo -e "${RED}❌ Nginx启动失败${NC}"
    echo -e "${YELLOW}📋 错误信息:${NC}"
    sudo systemctl status nginx --no-pager -l
    echo -e "${YELLOW}📋 错误日志:${NC}"
    sudo tail -20 /var/log/nginx/error.log 2>/dev/null || echo "无错误日志"
    exit 1
fi

echo -e "${BLUE}📍 步骤 8: 验证修复结果${NC}"

# 等待服务稳定
sleep 5

# 测试本地访问
echo -e "${YELLOW}🧪 测试本地HTTP访问...${NC}"
LOCAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1" 2>/dev/null || echo "000")

if [ "$LOCAL_TEST" = "200" ]; then
    echo -e "${GREEN}✅ 本地访问正常 (HTTP 200)${NC}"
elif [ "$LOCAL_TEST" = "301" ] || [ "$LOCAL_TEST" = "302" ]; then
    echo -e "${RED}❌ 仍有重定向问题 (HTTP $LOCAL_TEST)${NC}"
    curl -I "http://127.0.0.1" 2>/dev/null | head -10
    exit 1
else
    echo -e "${YELLOW}⚠️ 本地访问状态码: $LOCAL_TEST${NC}"
fi

# 测试代理是否正常
echo -e "${YELLOW}🧪 测试代理功能...${NC}"
PROXY_TEST=$(curl -s "http://127.0.0.1" 2>/dev/null | head -1)
if echo "$PROXY_TEST" | grep -q "<!DOCTYPE html\|<html"; then
    echo -e "${GREEN}✅ 代理功能正常，返回HTML内容${NC}"
else
    echo -e "${YELLOW}⚠️ 代理响应内容: ${PROXY_TEST:0:100}...${NC}"
fi

# 获取服务器信息
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "未知")

# 最终报告
echo ""
echo -e "${GREEN}🎉 Nginx配置清理完成！${NC}"
echo -e "${GREEN}========================${NC}"
echo ""
echo -e "${GREEN}✅ 已备份原配置到: $BACKUP_DIR${NC}"
echo -e "${GREEN}✅ 已清理所有重定向配置${NC}"
echo -e "${GREEN}✅ 已创建干净的ColleTools配置${NC}"
echo -e "${GREEN}✅ Nginx服务运行正常${NC}"
echo ""
echo -e "${BLUE}🌐 现在可以访问 ColleTools:${NC}"
echo -e "  主域名: http://colletools.com"
echo -e "  IP访问: http://$SERVER_IP"
echo ""
echo -e "${BLUE}📊 当前服务状态:${NC}"
sudo netstat -tlnp | grep -E ':(80|443|3003)' | while read line; do
    echo -e "  $line"
done
echo ""
echo -e "${BLUE}📋 管理命令:${NC}"
echo -e "  查看nginx状态: sudo systemctl status nginx"
echo -e "  查看nginx日志: sudo tail -f /var/log/nginx/error.log"
echo -e "  重载nginx配置: sudo systemctl reload nginx"
echo -e "  恢复备份配置: sudo cp -r $BACKUP_DIR/* /etc/nginx/"
echo ""
echo -e "${YELLOW}💡 提示: 如果域名仍有问题，请清除浏览器缓存或等待DNS刷新${NC}"