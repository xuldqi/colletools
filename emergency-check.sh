#!/bin/bash

# 紧急检查两个网站状态
echo "🚨 紧急检查网站状态..."
echo "====================="

echo "1. 基础服务检查:"
echo "---------------"
echo "nginx 状态:"
systemctl is-active nginx && echo "✅ nginx 运行中" || echo "❌ nginx 停止"

echo ""
echo "PM2 进程:"
pm2 list

echo ""
echo "2. 端口检查:"
echo "-----------"
echo "80 端口:"
netstat -tlnp | grep :80 || echo "❌ 80端口未监听"

echo "8080 端口:"
netstat -tlnp | grep :8080 || echo "❌ 8080端口未监听"

echo "3002 端口:"
netstat -tlnp | grep :3002 || echo "❌ 3002端口未监听"

echo ""
echo "3. 本地服务测试:"
echo "---------------"
echo "测试 localhost:8080 (DropShare):"
curl -s -I http://localhost:8080 | head -1 || echo "❌ 无响应"

echo "测试 localhost:3002 (ColleTools):"
curl -s -I http://localhost:3002 | head -1 || echo "❌ 无响应"

echo ""
echo "4. 外部访问测试:"
echo "---------------"
echo "测试 dropshare.tech:"
curl -s -I http://dropshare.tech | head -1 || echo "❌ 无法访问"

echo "测试 colletools.com:"
curl -s -I http://colletools.com | head -1 || echo "❌ 无法访问"

echo ""
echo "5. 系统资源检查:"
echo "---------------"
echo "内存使用:"
free -h | head -2

echo ""
echo "磁盘使用:"
df -h / | tail -1

echo ""
echo "6. 最新错误日志:"
echo "---------------"
echo "nginx 错误:"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "无法读取nginx日志"

echo ""
echo "PM2 日志:"
pm2 logs --lines 3 2>/dev/null || echo "无法读取PM2日志"

echo ""
echo "7. 快速修复尝试:"
echo "==============="

# 尝试重启所有服务
echo "重启 nginx..."
systemctl restart nginx
sleep 2

echo "重启 PM2 进程..."
pm2 restart all
sleep 3

echo ""
echo "修复后测试:"
echo "----------"
echo "nginx 状态:"
systemctl is-active nginx && echo "✅ nginx 已启动" || echo "❌ nginx 启动失败"

echo ""
echo "PM2 状态:"
pm2 list | grep -E "online|error" || echo "❌ PM2 进程异常"

echo ""
echo "外部访问再次测试:"
curl -s -I http://dropshare.tech | head -1 && echo "✅ dropshare.tech 恢复" || echo "❌ dropshare.tech 仍有问题"
curl -s -I http://colletools.com | head -1 && echo "✅ colletools.com 恢复" || echo "❌ colletools.com 仍有问题"