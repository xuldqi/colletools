#!/bin/bash

# 修复外部访问问题
echo "🔧 诊断和修复外部访问问题..."
echo "==========================="

echo "1. DNS解析检查:"
echo "-------------"
echo "dropshare.tech 解析结果:"
nslookup dropshare.tech

echo ""
echo "colletools.com 解析结果:"
nslookup colletools.com

echo ""
echo "本服务器IP:"
hostname -I
echo "公网IP:"
curl -s ipinfo.io/ip 2>/dev/null || echo "无法获取公网IP"

echo ""
echo "2. 防火墙检查:"
echo "------------"
echo "UFW状态:"
ufw status 2>/dev/null || echo "UFW未安装或未启用"

echo ""
echo "iptables规则 (80端口):"
iptables -L | grep -i "80\|http" || echo "未找到80端口相关规则"

echo ""
echo "3. 端口监听详情:"
echo "---------------"
echo "80端口监听情况:"
ss -tlnp | grep :80

echo ""
echo "nginx进程详情:"
ps aux | grep nginx | grep -v grep

echo ""
echo "4. 测试外部可达性:"
echo "----------------"
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "测试本机IP ($SERVER_IP) 的80端口:"

# 测试IP直接访问
echo "通过IP访问测试:"
curl -s -I -H "Host: dropshare.tech" http://$SERVER_IP/ | head -3
echo ""
curl -s -I -H "Host: colletools.com" http://$SERVER_IP/ | head -3

echo ""
echo "5. nginx配置验证:"
echo "---------------"
echo "检查default_server配置:"
grep -r "default_server" /etc/nginx/sites-enabled/ || echo "未找到default_server"

echo ""
echo "检查server_name配置:"
grep -r "server_name.*dropshare\|server_name.*colletools" /etc/nginx/sites-enabled/

echo ""
echo "6. 常见问题修复:"
echo "==============="

# 确保nginx监听所有接口
echo "检查nginx监听配置..."
if grep -q "listen.*127.0.0.1" /etc/nginx/sites-enabled/*; then
    echo "⚠️  发现nginx只监听localhost，正在修复..."
    sed -i 's/listen 127.0.0.1:80/listen 80/g' /etc/nginx/sites-enabled/*
    sed -i 's/listen 127.0.0.1:443/listen 443/g' /etc/nginx/sites-enabled/*
    nginx -t && systemctl reload nginx
    echo "✅ nginx监听配置已修复"
fi

# 检查防火墙
echo ""
echo "检查并开放80端口..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow 80/tcp 2>/dev/null
    ufw allow 'Nginx Full' 2>/dev/null
    echo "✅ 防火墙规则已更新"
fi

echo ""
echo "7. 最终验证:"
echo "==========="
sleep 2
echo "重新测试外部访问:"

# 再次测试
echo "dropshare.tech:"
curl -s -I http://dropshare.tech | head -1

echo "colletools.com:"
curl -s -I http://colletools.com | head -1

echo ""
echo "📋 诊断总结:"
echo "==========="
echo "如果curl显示200但浏览器无法访问，通常是:"
echo "1. 🔍 DNS问题 - 域名未指向此服务器IP"
echo "2. 🔥 防火墙问题 - 80端口被阻挡"
echo "3. 🌐 网络问题 - 服务器网络配置"
echo ""
echo "下一步："
echo "- 检查域名DNS解析是否指向 $SERVER_IP"
echo "- 联系服务器提供商检查防火墙设置"
echo "- 或使用IP直接访问: http://$SERVER_IP"