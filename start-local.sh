#!/bin/bash

echo "🚀 启动本地测试环境..."
echo "======================"

# 设置环境变量
export NODE_ENV=development
export PORT=3000

# 清理旧进程
echo "🧹 清理旧进程..."
pkill -f "tsx api/server.ts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# 启动后端
echo "🔧 启动后端服务 (端口 3000)..."
cd /Users/macmima1234/Documents/project/littleworld
tsx api/server.ts &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3

# 测试后端
echo "🧪 测试后端服务..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo "✅ 后端服务正常"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动前端
echo "🎨 启动前端服务 (端口 5173)..."
vite &
FRONTEND_PID=$!

# 等待前端启动
sleep 3

echo ""
echo "✅ 本地环境启动成功！"
echo "======================"
echo "🌐 访问地址："
echo "- 前端: http://localhost:5173"
echo "- 后端API: http://localhost:3000"
echo "- 健康检查: http://localhost:3000/health"
echo ""
echo "📋 进程信息："
echo "- 后端 PID: $BACKEND_PID"
echo "- 前端 PID: $FRONTEND_PID"
echo ""
echo "🛑 停止服务: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "按 Ctrl+C 停止所有服务..."

# 保持脚本运行
wait