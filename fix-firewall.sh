#!/bin/bash

echo "🔥 修复防火墙 - 开放80端口"
echo "=========================="

# 检查并配置ufw防火墙
if command -v ufw &> /dev/null; then
    echo "配置ufw防火墙..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    ufw status
fi

# 检查并配置iptables
if command -v iptables &> /dev/null; then
    echo "配置iptables..."
    iptables -I INPUT -p tcp --dport 80 -j ACCEPT
    iptables -I INPUT -p tcp --dport 443 -j ACCEPT
    iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
fi

# 检查并配置firewalld
if command -v firewall-cmd &> /dev/null; then
    echo "配置firewalld..."
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    firewall-cmd --list-services
fi

echo "检查端口监听状态："
netstat -tulpn | grep -E ":80|:443"

echo "测试本地访问："
curl -I http://localhost

echo "获取外网IP："
curl -s ifconfig.me

echo ""
echo "⚠️  如果还是无法访问，请检查："
echo "1. 云服务器安全组是否开放80端口"
echo "2. VPS提供商防火墙设置"
echo "3. 路由器端口转发设置"