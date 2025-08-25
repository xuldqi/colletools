#!/bin/bash

# 快速修复 DropShare 路由双冒号问题
echo "⚡ 快速修复双冒号路由..."
echo "======================="

cd /var/www/dropshare || exit 1

# 备份原文件
cp index.js index.js.backup.$(date +%s)

# 直接用 sed 替换双冒号路由
echo "🔧 修复中..."
sed -i 's|/user::|/user/:id|g' index.js
sed -i 's|/file::|/file/:id|g' index.js  
sed -i 's|/path::|/path/:param|g' index.js
sed -i 's|/item::|/item/:id|g' index.js
sed -i 's|/data::|/data/:id|g' index.js

# 检查修复结果
echo ""
echo "🔍 修复后的路由："
grep -n "app\." index.js | grep -E "get|post|put|delete"

# 重启服务
echo ""
echo "🔄 重启服务..."
pm2 restart dropshare

sleep 2

echo ""
echo "🧪 测试..."
if curl -s http://localhost:3003 2>/dev/null | head -1 | grep -q "<!"; then
    echo "✅ 修复成功！"
else
    echo "❌ 仍有问题，查看日志:"
    pm2 logs dropshare --lines 3
fi