#!/bin/bash
# 双网站恢复脚本
# 恢复dropshare服务并配置两个域名分别访问不同网站
# 使用方法: chmod +x restore_dual_websites.sh && sudo ./restore_dual_websites.sh

echo "🔄 双网站恢复脚本"
echo "=================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COLLETOOLS_PORT=3003
DROPSHARE_PORT=8080
DROPSHARE_SERVICE="/usr/local/bin/dropshare-service"

echo -e "${BLUE}📍 步骤 1: 检查当前服务状态${NC}"

# 检查ColleTools服务
echo -e "${YELLOW}🔍 检查ColleTools服务状态...${NC}"
if curl -s "http://127.0.0.1:$COLLETOOLS_PORT" > /dev/null; then
    echo -e "${GREEN}✅ ColleTools服务运行正常 (端口 $COLLETOOLS_PORT)${NC}"
else
    echo -e "${RED}❌ ColleTools服务未运行${NC}"
    echo -e "${YELLOW}💡 正在启动ColleTools服务...${NC}"
    
    cd /var/www/colletools
    nohup npm run preview -- --port $COLLETOOLS_PORT --host 0.0.0.0 > colletools.log 2>&1 &
    sleep 5
    
    if curl -s "http://127.0.0.1:$COLLETOOLS_PORT" > /dev/null; then
        echo -e "${GREEN}✅ ColleTools服务启动成功${NC}"
    else
        echo -e "${RED}❌ ColleTools服务启动失败${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📍 步骤 2: 恢复dropshare服务${NC}"

# 检查8080端口是否被占用
PORT_8080_PROC=$(sudo lsof -i :$DROPSHARE_PORT 2>/dev/null)
if [ -n "$PORT_8080_PROC" ]; then
    echo -e "${YELLOW}⚠️ 端口$DROPSHARE_PORT已被占用，正在清理...${NC}"
    sudo lsof -ti:$DROPSHARE_PORT | xargs sudo kill -9 2>/dev/null
    sleep 2
fi

# 尝试启动dropshare服务
echo -e "${YELLOW}🚀 启动dropshare服务...${NC}"

# 方法1: systemctl方式
if sudo systemctl list-unit-files | grep -q dropshare; then
    echo -e "${YELLOW}尝试通过systemctl启动dropshare...${NC}"
    sudo systemctl start dropshare
    sleep 3
    
    if sudo systemctl is-active --quiet dropshare; then
        echo -e "${GREEN}✅ dropshare服务启动成功 (systemctl)${NC}"
        
        # 获取dropshare监听端口
        DROPSHARE_ACTUAL_PORT=$(sudo netstat -tlnp | grep dropshare | grep LISTEN | head -1 | awk '{print $4}' | cut -d: -f2)
        if [ -n "$DROPSHARE_ACTUAL_PORT" ]; then
            DROPSHARE_PORT=$DROPSHARE_ACTUAL_PORT
            echo -e "${GREEN}✅ dropshare运行在端口: $DROPSHARE_PORT${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ systemctl启动失败，尝试手动启动...${NC}"
    fi
fi

# 方法2: 手动启动
if ! curl -s "http://127.0.0.1:$DROPSHARE_PORT" > /dev/null; then
    echo -e "${YELLOW}尝试手动启动dropshare...${NC}"
    
    # 查找dropshare程序
    if [ ! -f "$DROPSHARE_SERVICE" ]; then
        POSSIBLE_PATHS=(
            "/usr/bin/dropshare"
            "/usr/sbin/dropshare" 
            "/opt/dropshare/bin/dropshare"
            "/var/www/dropshare/dropshare"
        )
        
        for path in "${POSSIBLE_PATHS[@]}"; do
            if [ -f "$path" ]; then
                DROPSHARE_SERVICE="$path"
                break
            fi
        done
    fi
    
    if [ -f "$DROPSHARE_SERVICE" ]; then
        # 后台启动dropshare
        nohup sudo "$DROPSHARE_SERVICE" --port $DROPSHARE_PORT > dropshare.log 2>&1 &
        sleep 5
        
        if curl -s "http://127.0.0.1:$DROPSHARE_PORT" > /dev/null; then
            echo -e "${GREEN}✅ dropshare手动启动成功${NC}"
        fi
    fi
    
    # 最后检查
    if ! curl -s "http://127.0.0.1:$DROPSHARE_PORT" > /dev/null; then
        echo -e "${YELLOW}⚠️ 无法自动启动dropshare${NC}"
        echo -e "${YELLOW}💡 可能需要手动启动dropshare服务${NC}"
        echo -e "${YELLOW}脚本将继续配置nginx，但dropshare可能无法访问${NC}"
    fi
fi

echo -e "${BLUE}📍 步骤 3: 配置nginx双域名代理${NC}"

# 停止nginx避免冲突
sudo systemctl stop nginx 2>/dev/null

# 清理现有配置
sudo rm -f /etc/nginx/sites-enabled/*

# 创建双域名配置
echo -e "${YELLOW}📝 创建双域名nginx配置...${NC}"
sudo tee /etc/nginx/sites-available/dual-sites > /dev/null <<'EOF'
# ColleTools 网站配置
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    
    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    access_log /var/log/nginx/colletools_access.log;
    error_log /var/log/nginx/colletools_error.log;
}

# Dropshare 网站配置  
server {
    listen 80;
    server_name dropshare.tech www.dropshare.tech;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    access_log /var/log/nginx/dropshare_access.log;
    error_log /var/log/nginx/dropshare_error.log;
}

# 默认服务器
server {
    listen 80 default_server;
    server_name _;
    
    return 301 http://colletools.com$request_uri;
}
EOF

# 启用配置
sudo ln -s /etc/nginx/sites-available/dual-sites /etc/nginx/sites-enabled/

echo -e "${BLUE}📍 步骤 4: 启动nginx${NC}"

# 测试nginx配置
if sudo nginx -t; then
    echo -e "${GREEN}✅ nginx配置语法正确${NC}"
else
    echo -e "${RED}❌ nginx配置语法错误${NC}"
    exit 1
fi

# 启动nginx
sudo systemctl start nginx
sudo systemctl enable nginx

sleep 3

if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ nginx启动成功${NC}"
else
    echo -e "${RED}❌ nginx启动失败${NC}"
    exit 1
fi

echo -e "${BLUE}📍 步骤 5: 验证配置${NC}"

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "未知")

# 测试服务
echo -e "${YELLOW}🧪 测试服务访问...${NC}"
COLLETOOLS_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1" -H "Host: colletools.com")
DROPSHARE_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1" -H "Host: dropshare.tech")

echo ""
echo -e "${GREEN}🎉 双网站配置完成！${NC}"
echo -e "${GREEN}==================${NC}"
echo ""
echo -e "${BLUE}🌐 访问地址:${NC}"
echo -e "  ColleTools: http://colletools.com (状态: $COLLETOOLS_TEST)"
echo -e "  Dropshare:  http://dropshare.tech (状态: $DROPSHARE_TEST)"
echo -e "  服务器IP:   $SERVER_IP"
echo ""
echo -e "${BLUE}📊 当前服务状态:${NC}"
sudo netstat -tlnp | grep -E ':(80|3003|8080)'
echo ""
echo -e "${YELLOW}💡 提示: 请清除浏览器缓存后测试访问${NC}"