#!/bin/bash

echo "🐳 Docker 快速测试"
echo "=================="

# 1. 测试 Docker 是否正常
echo "1. 测试 Docker..."
docker run --rm hello-world

if [ $? -eq 0 ]; then
    echo "✅ Docker 正常工作"
else
    echo "❌ Docker 有问题"
    exit 1
fi

# 2. 测试简单的 nginx 容器
echo ""
echo "2. 测试 nginx 容器..."
docker run -d --name test-nginx -p 8083:80 nginx:alpine

sleep 3

if curl -I http://localhost:8083 2>/dev/null | grep -q "200\|301"; then
    echo "✅ nginx 容器正常"
else
    echo "❌ nginx 容器无法访问"
fi

# 清理
docker stop test-nginx
docker rm test-nginx

echo ""
echo "3. Docker 基础测试完成"