#!/bin/bash

# 检查 DropShare 状态
echo "🔍 检查 DropShare 状态..."
echo "========================"

echo "1. DropShare 服务检查:"
echo "--------------------"
echo "PM2 DropShare 进程:"
pm2 list | grep dropshare || echo "❌ 未找到 dropshare 进程"

echo ""
echo "8080 端口监听:"
netstat -tlnp | grep :8080 || echo "❌ 8080端口未监听"

echo ""
echo "2. 本地 DropShare 测试:"
echo "----------------------"
echo "测试 localhost:8080:"
curl -s -I http://localhost:8080 2>/dev/null | head -3 || echo "❌ localhost:8080 无响应"

echo ""
echo "如果有响应，获取页面内容片段:"
CONTENT=$(curl -s http://localhost:8080 2>/dev/null | head -5)
if [ -n "$CONTENT" ]; then
    echo "页面内容预览:"
    echo "$CONTENT"
else
    echo "❌ 无法获取页面内容"
fi

echo ""
echo "3. 外部 DropShare 访问测试:"
echo "------------------------"
echo "测试 dropshare.tech:"
curl -s -I http://dropshare.tech 2>/dev/null | head -3 || echo "❌ dropshare.tech 无法访问"

echo ""
echo "4. nginx 配置检查:"
echo "----------------"
echo "检查 dropshare.tech 的代理配置:"
grep -r "dropshare\.tech" /etc/nginx/sites-enabled/ 2>/dev/null || echo "❌ nginx 配置中未找到 dropshare.tech"

echo ""
echo "检查代理目标端口:"
grep -r "proxy_pass.*localhost:" /etc/nginx/sites-enabled/ | grep -v "3002" | head -3

echo ""
echo "5. 如果 DropShare 不工作，尝试修复:"
echo "================================"

# 检查 DropShare 是否真的在运行
if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "⚠️  DropShare 本地服务异常，尝试重启..."
    
    cd /var/www/dropshare 2>/dev/null || {
        echo "❌ DropShare 目录不存在"
        exit 1
    }
    
    echo "重启 DropShare PM2 进程..."
    pm2 restart dropshare 2>/dev/null || {
        echo "PM2 重启失败，尝试手动启动..."
        pm2 start index.js --name dropshare
    }
    
    sleep 3
    
    echo "重启后测试:"
    if curl -s http://localhost:8080 >/dev/null 2>&1; then
        echo "✅ DropShare 服务已恢复"
    else
        echo "❌ DropShare 服务仍然异常"
        echo "查看 PM2 日志:"
        pm2 logs dropshare --lines 5
    fi
fi

echo ""
echo "6. 最终状态总结:"
echo "==============="
echo "ColleTools: ✅ 正常运行 (从之前截图确认)"
echo -n "DropShare: "
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "✅ 本地服务正常"
    echo -n "外部访问: "
    if curl -s http://dropshare.tech >/dev/null 2>&1; then
        echo "✅ 外部访问正常"
    else
        echo "❌ 外部访问异常 (nginx配置问题)"
    fi
else
    echo "❌ 本地服务异常"
fi