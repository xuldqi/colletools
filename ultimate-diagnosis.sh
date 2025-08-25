#!/bin/bash

# 终极网络访问诊断
echo "🔍 终极网络访问诊断..."
echo "===================="

SERVER_IP=$(hostname -I | awk '{print $1}')
PUBLIC_IP=$(curl -s ipinfo.io/ip 2>/dev/null)

echo "服务器内网IP: $SERVER_IP"
echo "服务器公网IP: $PUBLIC_IP"

echo ""
echo "1. 完整端口测试:"
echo "==============="
echo "测试各种端口访问:"

# 测试80端口
echo "端口80 (HTTP):"
nc -z -v localhost 80 2>&1 | head -1
netstat -tlnp | grep :80

echo ""
echo "端口8080 (DropShare):"
nc -z -v localhost 8080 2>&1 | head -1

echo ""
echo "端口3002 (ColleTools):"
nc -z -v localhost 3002 2>&1 | head -1

echo ""
echo "2. 云服务器防火墙检查:"
echo "====================" 
echo "UFW状态:"
ufw status verbose 2>/dev/null || echo "UFW未启用"

echo ""
echo "iptables INPUT链:"
iptables -L INPUT -n | head -10

echo ""
echo "3. 网络服务详细信息:"
echo "=================="
echo "nginx进程:"
ps aux | grep nginx | grep -v grep

echo ""
echo "nginx监听端口:"
ss -tlnp | grep nginx

echo ""
echo "4. 测试外部连通性:"
echo "================="

# 测试公网IP直接访问
if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "$SERVER_IP" ]; then
    echo "通过公网IP访问测试:"
    curl -s -I -m 10 http://$PUBLIC_IP/ | head -3
    echo ""
fi

# 测试内网IP访问
echo "通过内网IP访问测试:"
curl -s -I -H "Host: dropshare.tech" http://$SERVER_IP/ | head -3
echo ""
curl -s -I -H "Host: colletools.com" http://$SERVER_IP/ | head -3

echo ""
echo "5. DNS完整测试:"
echo "=============="
echo "dropshare.tech DNS记录:"
dig dropshare.tech +short 2>/dev/null || nslookup dropshare.tech

echo ""
echo "colletools.com DNS记录:"
dig colletools.com +short 2>/dev/null || nslookup colletools.com

echo ""
echo "6. 创建应急访问方案:"
echo "=================="

# 创建8081端口直接访问
echo "创建备用端口访问..."

# 停止可能占用8081的进程
fuser -k 8081/tcp 2>/dev/null || true

# 创建nginx备用配置
cat > /etc/nginx/sites-available/emergency-access << 'EOF'
server {
    listen 8081;
    server_name _;
    
    location /dropshare/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /colletools/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;  
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        return 200 "Emergency Access Page\\n\\nDropShare: http://$SERVER_IP:8081/dropshare/\\nColleTools: http://$SERVER_IP:8081/colletools/\\n";
        add_header Content-Type text/plain;
    }
}
EOF

ln -sf /etc/nginx/sites-available/emergency-access /etc/nginx/sites-enabled/emergency-access

# 测试配置并重启
if nginx -t; then
    systemctl reload nginx
    echo "✅ 应急访问配置已启用"
    
    sleep 2
    echo "应急访问测试:"
    curl -s http://localhost:8081/ | head -5
else
    echo "❌ 应急配置失败"
fi

echo ""
echo "7. 完整解决方案:"
echo "==============="

echo "🔗 备用访问方式 (如果主域名不工作):"
echo "1. 直接IP访问: http://$SERVER_IP:8081/"
echo "2. DropShare: http://$SERVER_IP:8081/dropshare/"
echo "3. ColleTools: http://$SERVER_IP:8081/colletools/"

if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "$SERVER_IP" ]; then
    echo "4. 公网IP访问: http://$PUBLIC_IP:8081/"
fi

echo ""
echo "🛠️ 如果仍无法访问，检查云服务商设置:"
echo "- 阿里云/腾讯云: 安全组开放80端口和8081端口"
echo "- AWS: Security Groups开放HTTP (80)和Custom (8081)"
echo "- Google Cloud: 防火墙规则允许tcp:80,8081"

echo ""
echo "📱 客户端排查:"
echo "- 清除DNS缓存: ipconfig /flushdns (Windows) 或 sudo dscacheutil -flushcache (Mac)"
echo "- 尝试手机热点网络"
echo "- 使用不同浏览器或隐私模式"
echo "- 检查本地防火墙/杀毒软件"

echo ""
echo "🎯 下一步行动:"
if curl -s -I http://localhost:80 >/dev/null 2>&1; then
    echo "✅ 服务器端配置完全正常"
    echo "❓ 问题很可能在于:"
    echo "   1. 云服务商安全组未开放80端口"
    echo "   2. 客户端网络/DNS问题"
    echo "   3. CDN/代理服务干扰"
else
    echo "❌ 服务器端仍有问题"
    echo "需要进一步检查nginx配置"
fi