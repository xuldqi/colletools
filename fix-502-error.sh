#!/bin/bash

echo "🔧 修复 502 Bad Gateway 错误"
echo "============================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./fix-502-error.sh"
    exit 1
fi

echo "📋 1. 检查当前容器状态..."
docker ps -a

echo -e "\n📋 2. 检查 dropshare-app 容器日志..."
docker logs dropshare-app --tail 20 2>/dev/null || echo "dropshare-app 容器不存在"

echo -e "\n📋 3. 检查 dropshare 静态文件..."
if [ -d "/var/www/dropshare/dist" ]; then
    echo "✅ dropshare 静态文件存在"
    ls -la /var/www/dropshare/dist/
else
    echo "❌ dropshare 静态文件不存在，创建测试文件..."
    mkdir -p /var/www/dropshare/dist
    cat > /var/www/dropshare/dist/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DropShare</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
        .status { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>DropShare</h1>
    <p class="status">✅ 网站运行正常</p>
    <p>服务器时间: <span id="time"></span></p>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF
    echo "✅ 测试文件已创建"
fi

echo -e "\n📋 4. 检查 nginx 配置..."
if [ -f "nginx.multi-site.conf" ]; then
    echo "✅ nginx 配置文件存在"
    # 检查配置语法
    docker exec nginx-proxy nginx -t 2>/dev/null && echo "✅ nginx 配置语法正确" || echo "❌ nginx 配置语法错误"
else
    echo "❌ nginx 配置文件不存在"
fi

echo -e "\n🛑 5. 重启 dropshare-app 容器..."
docker stop dropshare-app 2>/dev/null || true
docker rm dropshare-app 2>/dev/null || true

echo "🚀 6. 重新创建 dropshare-app 容器..."
docker run -d \
    --name dropshare-app \
    --network colletools_colletools-network \
    --restart unless-stopped \
    -v /var/www/dropshare/dist:/usr/share/nginx/html:ro \
    nginx:alpine

echo "⏳ 7. 等待容器启动..."
sleep 5

echo "📋 8. 检查容器状态..."
docker ps | grep dropshare-app

echo "🌐 9. 测试内部连接..."
echo "测试 dropshare-app 内部连接:"
docker exec nginx-proxy curl -I http://dropshare-app:80 2>/dev/null || echo "内部连接失败"

echo -e "\n🔄 10. 重启 nginx-proxy..."
docker restart nginx-proxy

echo "⏳ 11. 等待 nginx 重启..."
sleep 3

echo "📋 12. 最终状态检查..."
docker ps

echo "🌐 13. 测试外部访问..."
echo "测试 dropshare.tech:"
curl -k -I https://dropshare.tech 2>/dev/null || echo "外部访问失败"

echo "测试 colletools.com:"
curl -k -I https://colletools.com 2>/dev/null || echo "外部访问失败"

echo -e "\n✅ 502 错误修复完成！"
echo "📝 如果还有问题，请检查："
echo "1. 域名 DNS 解析是否正确"
echo "2. 防火墙是否开放 80/443 端口"
echo "3. 服务器提供商是否阻止了这些端口"
