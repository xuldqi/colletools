#!/bin/bash

# 快速状态检查脚本
echo "🔍 快速状态检查..."
echo "=================="

echo "1. 服务状态:"
echo "-----------"
echo -n "nginx: "
systemctl is-active nginx 2>/dev/null && echo "✅ 运行中" || echo "❌ 停止"

echo "PM2 进程:"
pm2 list 2>/dev/null | grep -E "online|error|stopped" || echo "❌ PM2 无进程"

echo ""
echo "2. 端口检查:"
echo "-----------"
netstat -tlnp | grep -E ":80|:8080|:3002" || echo "❌ 关键端口未监听"

echo ""
echo "3. 本地服务测试:"
echo "---------------"
echo -n "localhost:8080 (DropShare): "
curl -s -I http://localhost:8080 2>/dev/null | head -1 || echo "❌ 无响应"

echo -n "localhost:3002 (ColleTools): "  
curl -s -I http://localhost:3002 2>/dev/null | head -1 || echo "❌ 无响应"

echo ""
echo "4. 外部访问测试:"
echo "---------------"
echo -n "dropshare.tech: "
curl -s -I http://dropshare.tech 2>/dev/null | head -1 || echo "❌ 无法访问"

echo -n "colletools.com: "
curl -s -I http://colletools.com 2>/dev/null | head -1 || echo "❌ 无法访问"