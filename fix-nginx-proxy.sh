#!/bin/bash

# 修复 nginx 代理配置
echo "🔧 修复 dropshare.tech nginx 代理配置..."
echo "========================================"

echo "🔍 1. 确认 DropShare 服务状态..."
if curl -s http://localhost:8080 | head -1 | grep -q "<!DOCTYPE\|<html"; then
    echo "✅ DropShare 服务正常 (localhost:8080)"
else
    echo "❌ DropShare 服务异常"
    exit 1
fi

echo ""
echo "🔍 2. 检查当前 nginx 配置..."
echo "当前启用的配置文件:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "寻找 dropshare.tech 配置:"
FOUND_CONFIG=""
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ] && grep -q "dropshare\.tech" "$config"; then
        FOUND_CONFIG="$config"
        echo "✅ 在 $config 中找到 dropshare.tech"
        echo "当前配置内容:"
        grep -A 10 -B 2 "dropshare\.tech" "$config"
        break
    fi
done

if [ -z "$FOUND_CONFIG" ]; then
    echo "❌ 未找到 dropshare.tech 配置"
    echo "🔧 创建新的 nginx 配置..."
    
    # 创建简单的代理配置
    cat > /etc/nginx/sites-available/dropshare-proxy << 'EOF'
server {
    listen 80;
    server_name dropshare.tech www.dropshare.tech;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
    }
}
EOF
    
    # 启用配置
    ln -sf /etc/nginx/sites-available/dropshare-proxy /etc/nginx/sites-enabled/dropshare-proxy
    echo "✅ 创建并启用了新的代理配置"
    
else
    echo ""
    echo "🔧 3. 修复现有配置..."
    
    # 备份
    cp "$FOUND_CONFIG" "$FOUND_CONFIG.backup.$(date +%s)"
    
    # 确保代理端口正确
    sed -i 's|proxy_pass http://localhost:[0-9]*|proxy_pass http://localhost:8080|g' "$FOUND_CONFIG"
    
    echo "✅ 已更新代理端口为 8080"
fi

echo ""
echo "🧪 4. 测试 nginx 配置..."
if nginx -t; then
    echo "✅ nginx 配置语法正确"
else
    echo "❌ nginx 配置有语法错误"
    nginx -t
    exit 1
fi

echo ""
echo "🔄 5. 重启 nginx..."
systemctl restart nginx
sleep 2

if systemctl is-active --quiet nginx; then
    echo "✅ nginx 重启成功"
else
    echo "❌ nginx 启动失败"
    systemctl status nginx --no-pager -l
    exit 1
fi

echo ""
echo "🌐 6. 测试网站访问..."
echo "测试 HTTP 访问:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://dropshare.tech 2>/dev/null || echo "连接失败")
echo "状态码: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "🎉 dropshare.tech 访问成功！"
    
    # 显示页面内容片段确认
    CONTENT=$(curl -s http://dropshare.tech | head -2)
    echo "页面内容预览:"
    echo "$CONTENT"
    
elif [ "$HTTP_STATUS" = "502" ]; then
    echo "❌ 仍然是 502 Bad Gateway"
    echo "检查后端服务:"
    curl -I http://localhost:8080
    
elif [ "$HTTP_STATUS" = "500" ]; then
    echo "❌ 仍然是 500 Internal Server Error"
    echo "检查 nginx 错误日志:"
    tail -5 /var/log/nginx/error.log
    
else
    echo "⚠️ 其他状态码: $HTTP_STATUS"
    echo "详细响应:"
    curl -I http://dropshare.tech
fi

echo ""
echo "📋 配置总结:"
echo "============="
echo "✅ DropShare 服务: localhost:8080"
echo "✅ nginx 配置: dropshare.tech → localhost:8080" 
echo "🌐 访问地址: http://dropshare.tech"
echo ""
echo "如果还有问题，检查:"
echo "- DNS 解析: nslookup dropshare.tech"
echo "- 防火墙: sudo ufw status"
echo "- nginx 日志: tail -f /var/log/nginx/error.log"