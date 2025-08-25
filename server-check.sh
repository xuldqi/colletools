#!/bin/bash

echo "🔍 服务器部署前检查"
echo "===================="

echo "1. 检查Docker状态..."
if command -v docker &> /dev/null; then
    echo "✅ Docker已安装"
    if docker ps &> /dev/null; then
        echo "✅ Docker服务运行中"
        docker --version
    else
        echo "❌ Docker服务未运行"
        echo "启动Docker: sudo systemctl start docker"
    fi
else
    echo "❌ Docker未安装"
    echo "安装Docker: curl -fsSL https://get.docker.com | sh"
fi

echo -e "\n2. 检查端口占用..."
if command -v netstat &> /dev/null; then
    netstat -tulpn | grep -E ":80|:443|:8080"
else
    ss -tulpn | grep -E ":80|:443|:8080"
fi

echo -e "\n3. 检查系统资源..."
df -h
free -h

echo -e "\n4. 检查当前用户权限..."
if [ "$EUID" -eq 0 ]; then
    echo "✅ 当前为root用户"
else
    echo "❌ 需要root权限，使用: sudo su"
fi

echo -e "\n5. 检查防火墙..."
if command -v ufw &> /dev/null; then
    ufw status | grep "8080"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-ports | grep "8080"
else
    echo "未检测到防火墙配置工具"
fi

echo -e "\n6. 获取服务器IP..."
curl -s ifconfig.me 2>/dev/null || echo "无法获取外网IP"