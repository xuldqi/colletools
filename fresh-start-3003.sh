#!/bin/bash

echo "=== 全新启动 colletools 项目 (端口 3003) ==="
echo ""

# 1. 清理环境
echo "1. 清理环境..."
pm2 stop all 2>/dev/null || echo "没有运行中的 PM2 进程"
pm2 delete all 2>/dev/null || echo "没有 PM2 进程需要删除"
docker-compose down 2>/dev/null || echo "没有运行中的 Docker 容器"
docker system prune -f
echo ""

# 2. 检查项目目录
echo "2. 检查项目目录..."
pwd
ls -la
echo ""

# 3. 重新安装依赖
echo "3. 重新安装依赖..."
if [ -d "node_modules" ]; then
    echo "删除旧的 node_modules..."
    rm -rf node_modules package-lock.json
fi

echo "安装依赖..."
npm install
echo ""

# 4. 创建环境配置 (端口 3003)
echo "4. 创建环境配置 (端口 3003)..."
cat > .env << 'EOF'
NODE_ENV=development
PORT=3003
VITE_API_URL=http://localhost:3003
VITE_PORT=3003
EOF
echo "环境配置已创建 (端口 3003)"
echo ""

# 5. 检查端口占用
echo "5. 检查端口占用..."
echo "检查端口 3003："
lsof -i :3003 || echo "端口 3003 未被占用"
echo ""

# 6. 启动开发服务器 (端口 3003)
echo "6. 启动开发服务器 (端口 3003)..."
pm2 start npm --name "colletools-3003" -- run dev
echo ""

# 7. 等待启动
echo "7. 等待服务启动..."
sleep 20
echo ""

# 8. 检查状态
echo "8. 检查 PM2 状态..."
pm2 status
echo ""

# 9. 查看日志
echo "9. 查看应用日志..."
pm2 logs colletools-3003 --lines 15
echo ""

# 10. 测试访问
echo "10. 测试访问..."
echo "测试本地访问："
curl -I http://localhost:3003 2>/dev/null | head -1 || echo "本地访问失败"
echo ""

echo "=== 启动完成 ==="
echo ""
echo "访问地址："
echo "  本地: http://localhost:3003"
echo "  服务器: https://colletools.com"
echo ""
echo "PM2 管理命令："
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs colletools-3003"
echo "  重启应用: pm2 restart colletools-3003"
echo "  停止应用: pm2 stop colletools-3003"

