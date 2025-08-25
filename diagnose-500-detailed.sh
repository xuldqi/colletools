#!/bin/bash

# 详细诊断 500 错误
echo "🔍 详细诊断 dropshare.tech 500 错误..."
echo "======================================="

echo "1. 当前时间和基本信息："
date
echo "当前用户: $(whoami)"
echo ""

echo "2. PM2 进程状态："
pm2 list
echo ""

echo "3. 端口占用详情："
echo "端口 8080:"
netstat -tlnp | grep :8080
echo "端口 3003:"
netstat -tlnp | grep :3003
echo "端口 3002:"
netstat -tlnp | grep :3002
echo ""

echo "4. 测试各端口响应："
for port in 8080 3003 3002; do
    echo "测试 localhost:$port"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null || echo "连接失败")
    echo "  状态码: $HTTP_STATUS"
    
    if [ "$HTTP_STATUS" = "200" ]; then
        CONTENT=$(curl -s http://localhost:$port 2>/dev/null | head -1)
        echo "  内容: ${CONTENT:0:100}..."
    fi
    echo ""
done

echo "5. nginx 配置检查："
echo "活动的 nginx 配置文件:"
ls -la /etc/nginx/sites-enabled/
echo ""

echo "dropshare.tech 相关配置:"
for config_file in /etc/nginx/sites-enabled/*; do
    if [ -f "$config_file" ]; then
        echo "文件: $config_file"
        grep -n -A 3 -B 3 "dropshare\.tech" "$config_file" 2>/dev/null || echo "  未找到 dropshare.tech"
        echo ""
    fi
done

echo "6. nginx 错误日志 (最新10行):"
tail -10 /var/log/nginx/error.log 2>/dev/null || echo "无法读取 nginx 错误日志"
echo ""

echo "7. 测试外部访问详情:"
echo "curl -v http://dropshare.tech 的结果:"
curl -v -s http://dropshare.tech 2>&1 | head -15
echo ""

echo "8. DNS 解析检查:"
echo "dropshare.tech 解析到:"
nslookup dropshare.tech 2>/dev/null | grep Address | tail -1 || echo "DNS解析失败"
echo ""

echo "9. DropShare 应用日志 (最新5行):"
pm2 logs dropshare --lines 5 2>/dev/null || echo "无法获取 PM2 日志"
echo ""

echo "10. 建议的修复步骤:"
echo "===================="

# 检查是否是nginx配置问题
if grep -q "dropshare\.tech" /etc/nginx/sites-enabled/* 2>/dev/null; then
    echo "✓ nginx 配置中找到 dropshare.tech"
    
    # 检查proxy_pass配置
    PROXY_PORT=$(grep -A 5 "dropshare\.tech" /etc/nginx/sites-enabled/* | grep "proxy_pass.*localhost:" | head -1 | sed 's/.*localhost:\([0-9]*\).*/\1/')
    if [ -n "$PROXY_PORT" ]; then
        echo "✓ nginx 代理端口: $PROXY_PORT"
        
        # 测试该端口
        TEST_RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PROXY_PORT 2>/dev/null || echo "fail")
        if [ "$TEST_RESULT" = "200" ]; then
            echo "✓ 代理目标端口响应正常"
            echo "🤔 问题可能在于:"
            echo "   - nginx 缓存"
            echo "   - SSL证书问题 (如果使用HTTPS)"
            echo "   - 其他 nginx 配置冲突"
            echo ""
            echo "建议运行:"
            echo "   sudo nginx -s reload"
            echo "   sudo systemctl restart nginx"
        else
            echo "❌ 代理目标端口 $PROXY_PORT 无响应"
            echo "需要修复端口配置"
        fi
    else
        echo "❌ 未找到 proxy_pass 配置"
    fi
else
    echo "❌ nginx 配置中未找到 dropshare.tech"
    echo "需要添加 dropshare.tech 的 server 配置"
fi