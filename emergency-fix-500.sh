#!/bin/bash

# 紧急修复 500 错误
echo "🚨 紧急修复 DropShare 500 错误..."
echo "=============================="

cd /var/www/dropshare || exit 1

echo "🔍 1. 检查当前状态..."
pm2 list | grep dropshare

echo ""
echo "🔍 2. 查看最新错误日志..."
pm2 logs dropshare --lines 10

echo ""
echo "🔧 3. 紧急路由修复..."
# 备份
cp index.js index.js.emergency.bak

# 快速替换所有双冒号
sed -i 's|::|:id|g' index.js
sed -i 's|/user:id|/user/:id|g' index.js
sed -i 's|/file:id|/file/:id|g' index.js  
sed -i 's|/path:id|/path/:param|g' index.js

echo "✅ 路由修复完成"

echo ""
echo "🔄 4. 重启服务..."
pm2 restart dropshare
sleep 3

echo ""
echo "🧪 5. 测试本地服务..."
for port in 3003 8080; do
    echo "测试端口 $port:"
    if curl -s http://localhost:$port 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html"; then
        echo "  ✅ 端口 $port 响应正常"
    else
        echo "  ❌ 端口 $port 无响应"
    fi
done

echo ""
echo "🌐 6. 测试外部访问..."
if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
    echo "✅ 外部访问恢复正常"
elif curl -I http://dropshare.tech 2>/dev/null | grep -q "502"; then
    echo "⚠️ 仍然是 502 错误，检查端口配置"
elif curl -I http://dropshare.tech 2>/dev/null | grep -q "500"; then
    echo "❌ 仍然是 500 错误，查看日志"
    pm2 logs dropshare --lines 5
else
    echo "⚠️ 其他错误状态"
fi

echo ""
echo "📋 如果仍有问题："
echo "1. 检查 nginx 配置端口是否正确"
echo "2. 查看完整日志: pm2 logs dropshare"
echo "3. 重启 nginx: sudo systemctl reload nginx"