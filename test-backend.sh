#!/bin/bash

echo "🧪 测试后端服务..."
echo "=================="

# 设置环境变量
export NODE_ENV=development
export PORT=3000

# 进入项目目录
cd /Users/macmima1234/Documents/project/littleworld

# 启动后端
echo "🚀 启动后端服务..."
tsx api/server.ts &
PID=$!

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 测试健康检查
echo "📋 测试健康检查端点..."
curl -v http://localhost:3000/health
echo ""

# 测试API
echo "📋 测试API端点..."
curl -v http://localhost:3000/api/health
echo ""

# 显示日志
echo "📜 服务日志："
sleep 2

# 停止服务
echo "🛑 停止服务..."
kill $PID

echo "✅ 测试完成"