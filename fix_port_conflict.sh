#!/bin/bash
# 端口冲突解决脚本
# 解决nginx启动失败的端口占用问题
# 使用方法: chmod +x fix_port_conflict.sh && sudo ./fix_port_conflict.sh

echo "🔧 端口冲突解决脚本"
echo "==================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COLLETOOLS_PORT=3003
WEB_PORT=80
ALTERNATIVE_PORT=8080

echo -e "${BLUE}📍 步骤 1: 诊断端口占用情况${NC}"

# 检查ColleTools服务状态
echo -e "${YELLOW}🔍 检查ColleTools服务状态...${NC}"
if curl -s "http://127.0.0.1:$COLLETOOLS_PORT" > /dev/null; then
    echo -e "${GREEN}✅ ColleTools服务运行正常 (端口 $COLLETOOLS_PORT)${NC}"
else
    echo -e "${RED}❌ ColleTools服务未运行${NC}"
    echo -e "${YELLOW}💡 请先运行 ./quick_fix.sh 启动ColleTools服务${NC}"
    exit 1
fi

# 检查80端口占用
echo -e "${YELLOW}🔍 检查80端口占用情况...${NC}"
PORT_80_INFO=$(sudo lsof -i :80 2>/dev/null)

if [ -n "$PORT_80_INFO" ]; then
    echo -e "${RED}❌ 80端口被占用:${NC}"
    echo "$PORT_80_INFO"
    echo ""
    
    # 提取占用进程的PID和进程名
    PIDS=$(echo "$PORT_80_INFO" | grep LISTEN | awk '{print $2}' | sort -u)
    PROCESSES=$(echo "$PORT_80_INFO" | grep LISTEN | awk '{print $1}' | sort -u)
    
    echo -e "${YELLOW}📋 占用端口的进程:${NC}"
    for pid in $PIDS; do
        PROCESS_INFO=$(ps -p $pid -o pid,ppid,cmd --no-headers 2>/dev/null)
        if [ -n "$PROCESS_INFO" ]; then
            echo -e "  PID: $pid - $PROCESS_INFO"
        fi
    done
else
    echo -e "${GREEN}✅ 80端口空闲${NC}"
fi

echo -e "${BLUE}📍 步骤 2: 选择解决方案${NC}"

# 提供解决方案选项
echo -e "${YELLOW}请选择解决方案:${NC}"
echo -e "  1. 强制清理80端口占用 (推荐)"
echo -e "  2. 使用替代端口8080"
echo -e "  3. 重启服务器彻底清理"
echo -e "  4. 让ColleTools直接监听80端口"

read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}📍 执行方案1: 强制清理80端口占用${NC}"
        
        if [ -n "$PORT_80_INFO" ]; then
            echo -e "${YELLOW}🛑 正在强制停止占用80端口的进程...${NC}"
            
            # 尝试优雅停止nginx
            sudo systemctl stop nginx 2>/dev/null
            sleep 2
            
            # 强制杀死占用80端口的进程
            sudo lsof -ti:80 | xargs sudo kill -9 2>/dev/null
            sleep 2
            
            # 再次检查
            REMAINING=$(sudo lsof -i :80 2>/dev/null)
            if [ -z "$REMAINING" ]; then
                echo -e "${GREEN}✅ 80端口已清理${NC}"
            else
                echo -e "${RED}❌ 仍有进程占用80端口:${NC}"
                echo "$REMAINING"
                echo -e "${YELLOW}💡 建议重启服务器: sudo reboot${NC}"
                exit 1
            fi
        fi
        
        # 配置nginx
        echo -e "${YELLOW}📝 配置nginx...${NC}"
        sudo rm -f /etc/nginx/sites-enabled/*
        
        sudo tee /etc/nginx/sites-available/colletools > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name colletools.com www.colletools.com _;
    
    location / {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
        
        sudo ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/
        
        # 测试配置
        if sudo nginx -t; then
            echo -e "${GREEN}✅ Nginx配置语法正确${NC}"
        else
            echo -e "${RED}❌ Nginx配置错误${NC}"
            exit 1
        fi
        
        # 启动nginx
        echo -e "${YELLOW}🚀 启动nginx...${NC}"
        sudo systemctl start nginx
        sudo systemctl enable nginx
        
        sleep 3
        
        if sudo systemctl is-active --quiet nginx; then
            echo -e "${GREEN}✅ Nginx启动成功${NC}"
            echo -e "${GREEN}🌐 现在可以通过 http://colletools.com 访问${NC}"
        else
            echo -e "${RED}❌ Nginx启动失败${NC}"
            sudo systemctl status nginx
        fi
        ;;
        
    2)
        echo -e "${BLUE}📍 执行方案2: 使用替代端口8080${NC}"
        
        sudo systemctl stop nginx 2>/dev/null
        sudo rm -f /etc/nginx/sites-enabled/*
        
        sudo tee /etc/nginx/sites-available/colletools > /dev/null <<EOF
server {
    listen $ALTERNATIVE_PORT;
    server_name colletools.com www.colletools.com _;
    
    location / {
        proxy_pass http://127.0.0.1:$COLLETOOLS_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
        
        sudo ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/
        
        if sudo nginx -t && sudo systemctl start nginx; then
            echo -e "${GREEN}✅ Nginx在端口$ALTERNATIVE_PORT启动成功${NC}"
            echo -e "${GREEN}🌐 现在可以通过 http://colletools.com:$ALTERNATIVE_PORT 访问${NC}"
        else
            echo -e "${RED}❌ Nginx启动失败${NC}"
        fi
        ;;
        
    3)
        echo -e "${BLUE}📍 执行方案3: 重启服务器${NC}"
        echo -e "${YELLOW}⚠️ 服务器将在5秒后重启...${NC}"
        echo -e "${YELLOW}重启后请运行: sudo systemctl start nginx${NC}"
        sleep 5
        sudo reboot
        ;;
        
    4)
        echo -e "${BLUE}📍 执行方案4: ColleTools直接监听80端口${NC}"
        
        # 停止所有Web服务
        sudo systemctl stop nginx 2>/dev/null
        sudo systemctl disable nginx 2>/dev/null
        sudo lsof -ti:80 | xargs sudo kill -9 2>/dev/null
        
        # 停止当前ColleTools
        sudo lsof -ti:$COLLETOOLS_PORT | xargs sudo kill -9 2>/dev/null
        sleep 2
        
        # 在80端口启动ColleTools
        echo -e "${YELLOW}🚀 在80端口启动ColleTools...${NC}"
        cd /var/www/colletools
        
        # 使用PM2启动（如果可用）
        if command -v pm2 &> /dev/null; then
            pm2 stop colletools 2>/dev/null
            pm2 delete colletools 2>/dev/null
            pm2 start npm --name "colletools" -- run preview -- --port 80 --host 0.0.0.0
            pm2 save
            echo -e "${GREEN}✅ 使用PM2在80端口启动ColleTools${NC}"
        else
            # 使用nohup后台启动
            nohup npm run preview -- --port 80 --host 0.0.0.0 > colletools-80.log 2>&1 &
            echo -e "${GREEN}✅ 在80端口后台启动ColleTools${NC}"
        fi
        
        sleep 5
        
        if curl -s "http://127.0.0.1:80" > /dev/null; then
            echo -e "${GREEN}✅ ColleTools在80端口运行正常${NC}"
            echo -e "${GREEN}🌐 现在可以直接通过 http://colletools.com 访问${NC}"
        else
            echo -e "${RED}❌ ColleTools在80端口启动失败${NC}"
        fi
        ;;
        
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📊 当前端口状态:${NC}"
sudo netstat -tlnp | grep -E ':(80|8080|3003)' || echo "没有相关端口在监听"

echo ""
echo -e "${GREEN}🎉 端口冲突解决脚本执行完成！${NC}"

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "未知")
echo -e "${BLUE}服务器IP: $SERVER_IP${NC}"