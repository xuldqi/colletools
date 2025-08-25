#!/bin/bash

# 修复nginx配置冲突问题
echo "🔧 修复nginx配置冲突..."
echo "======================="

echo "1. 检查当前nginx配置文件:"
echo "-----------------------"
echo "sites-available 目录:"
ls -la /etc/nginx/sites-available/

echo ""
echo "sites-enabled 目录:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "2. 检查配置内容冲突:"
echo "------------------"
echo "=== dropshare-simple 配置 ==="
if [ -f "/etc/nginx/sites-available/dropshare-simple" ]; then
    cat /etc/nginx/sites-available/dropshare-simple
else
    echo "dropshare-simple 不存在"
fi

echo ""
echo "=== 其他相关配置 ==="
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ] && [[ "$config" != *"dropshare-simple"* ]]; then
        echo "--- $(basename $config) ---"
        grep -A 20 -B 2 "server_name.*dropshare\|server_name.*colletools" "$config" 2>/dev/null || echo "无相关配置"
        echo ""
    fi
done

echo ""
echo "3. 发现的问题:"
echo "============"

# 检查是否有重复的server_name
DROPSHARE_COUNT=$(grep -r "server_name.*dropshare" /etc/nginx/sites-enabled/ 2>/dev/null | wc -l)
COLLETOOLS_COUNT=$(grep -r "server_name.*colletools" /etc/nginx/sites-enabled/ 2>/dev/null | wc -l)

echo "dropshare.tech 配置数量: $DROPSHARE_COUNT"
echo "colletools.com 配置数量: $COLLETOOLS_COUNT"

if [ "$DROPSHARE_COUNT" -gt 1 ]; then
    echo "❌ dropshare.tech 有重复配置！"
fi

if [ "$COLLETOOLS_COUNT" -eq 0 ]; then
    echo "❌ colletools.com 没有配置！"
elif [ "$COLLETOOLS_COUNT" -gt 1 ]; then
    echo "❌ colletools.com 有重复配置！"
fi

echo ""
echo "4. 修复配置冲突:"
echo "==============="

# 备份所有现有配置
echo "备份现有配置..."
mkdir -p /tmp/nginx-config-backup-$(date +%s)
cp -r /etc/nginx/sites-enabled/* /tmp/nginx-config-backup-$(date +%s)/ 2>/dev/null

# 禁用所有现有配置
echo "禁用所有现有配置..."
rm -f /etc/nginx/sites-enabled/*

# 创建统一的完整配置
echo "创建完整的多域名配置..."
cat > /etc/nginx/sites-available/complete-sites << 'EOF'
# DropShare 配置 (dropshare.tech)
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
        
        # 超时设置
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
        client_max_body_size 100M;
    }
}

# ColleTools 配置 (colletools.com)
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
        client_max_body_size 100M;
    }
}

# HTTP到HTTPS重定向 (如果以后需要SSL)
# server {
#     listen 80;
#     server_name dropshare.tech www.dropshare.tech colletools.com www.colletools.com;
#     return 301 https://$host$request_uri;
# }
EOF

# 启用新配置
echo "启用统一配置..."
ln -sf /etc/nginx/sites-available/complete-sites /etc/nginx/sites-enabled/complete-sites

echo ""
echo "5. 测试新配置:"
echo "============"
if nginx -t; then
    echo "✅ nginx配置测试通过"
    
    echo "重启nginx..."
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        echo "✅ nginx重启成功"
    else
        echo "❌ nginx重启失败"
        systemctl status nginx --no-pager -l
    fi
else
    echo "❌ nginx配置测试失败"
    nginx -t
    
    # 恢复备份
    echo "恢复备份配置..."
    rm -f /etc/nginx/sites-enabled/*
    cp /tmp/nginx-config-backup-*/* /etc/nginx/sites-enabled/ 2>/dev/null
    nginx -t && systemctl restart nginx
fi

echo ""
echo "6. 验证修复结果:"
echo "==============="
sleep 2

echo "测试外部访问:"
echo "dropshare.tech:"
curl -s -I http://dropshare.tech | head -1

echo "colletools.com:"
curl -s -I http://colletools.com | head -1

echo ""
echo "🎉 修复完成！现在应该可以通过浏览器正常访问:"
echo "- http://dropshare.tech"
echo "- http://colletools.com"
echo ""
echo "如果还有问题，可能是浏览器DNS缓存，尝试:"
echo "- 清除浏览器缓存"
echo "- 使用隐私模式访问"
echo "- 或直接用IP访问: http://$(hostname -I | awk '{print $1}')"