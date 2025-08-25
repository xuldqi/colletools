#!/bin/bash

# 修复端口不匹配问题
echo "🔧 修复 DropShare 端口配置..."
echo "==========================="

echo "🔍 1. 检查服务端口..."
echo "PM2 进程："
pm2 list | grep dropshare

echo ""
echo "端口占用情况："
netstat -tlnp | grep :8080
netstat -tlnp | grep :3003

echo ""
echo "🧪 2. 测试端口响应..."
for port in 8080 3003; do
    echo "测试端口 $port:"
    if curl -s http://localhost:$port 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html"; then
        echo "  ✅ 端口 $port 有响应"
        WORKING_PORT=$port
    else
        echo "  ❌ 端口 $port 无响应"
    fi
done

if [ -z "$WORKING_PORT" ]; then
    echo "❌ 没有找到工作的端口"
    exit 1
fi

echo ""
echo "✅ DropShare 运行在端口: $WORKING_PORT"

echo ""
echo "🔍 3. 检查当前 nginx 配置..."
if [ -f "/etc/nginx/sites-enabled/domains-simple" ]; then
    echo "当前 nginx 配置中的端口："
    grep -n "localhost:" /etc/nginx/sites-enabled/domains-simple
elif [ -f "/etc/nginx/sites-enabled/multi-domains" ]; then
    echo "当前 nginx 配置中的端口："
    grep -n "localhost:" /etc/nginx/sites-enabled/multi-domains
else
    echo "⚠️ 找不到 nginx 配置文件"
fi

echo ""
echo "🔧 4. 更新 nginx 配置到正确端口..."

# 备份配置
if [ -f "/etc/nginx/sites-enabled/domains-simple" ]; then
    CONFIG_FILE="/etc/nginx/sites-enabled/domains-simple"
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%s)"
    
    # 更新端口
    sed -i "s|localhost:3003|localhost:$WORKING_PORT|g" "$CONFIG_FILE"
    sed -i "s|localhost:3002|localhost:$WORKING_PORT|g" "$CONFIG_FILE"
    
    echo "✅ 已更新 domains-simple 配置"
    
elif [ -f "/etc/nginx/sites-enabled/multi-domains" ]; then
    CONFIG_FILE="/etc/nginx/sites-enabled/multi-domains"
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%s)"
    
    # 只更新 dropshare 相关的端口，保留 colletools 的端口
    sed -i "/dropshare.tech/,/^}/s|localhost:3003|localhost:$WORKING_PORT|g" "$CONFIG_FILE"
    
    echo "✅ 已更新 multi-domains 配置"
fi

echo ""
echo "🧪 5. 测试 nginx 配置..."
if nginx -t; then
    echo "✅ nginx 配置测试通过"
    
    echo ""
    echo "🔄 6. 重启 nginx..."
    systemctl reload nginx
    echo "✅ nginx 已重启"
    
    sleep 2
    
    echo ""
    echo "🌐 7. 测试外部访问..."
    if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
        echo "🎉 dropshare.tech 访问恢复正常！"
    elif curl -I http://dropshare.tech 2>/dev/null | grep -q "502"; then
        echo "❌ 仍然 502，可能还有其他配置问题"
    else
        echo "⚠️ 其他状态码，查看详情："
        curl -I http://dropshare.tech 2>/dev/null | head -3
    fi
    
else
    echo "❌ nginx 配置有错误"
    nginx -t
fi

echo ""
echo "📋 总结："
echo "- DropShare 运行端口: $WORKING_PORT"
echo "- nginx 配置已更新"
echo "- 访问: http://dropshare.tech"