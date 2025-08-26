#!/bin/bash

# ColleTools 服务器更新部署脚本

echo "🚀 开始更新 ColleTools..."

# 进入项目目录
cd /var/www/colletools

echo "📦 解决 Git 冲突并拉取最新代码..."
# 强制重置本地修改
git reset --hard HEAD
# 拉取最新代码
git pull origin main

echo "📋 安装依赖..."
npm install

echo "🔧 构建项目..."
npm run build

echo "⚙️  配置 PM2..."
# 创建 ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "colletools",
    script: "api/server.ts",
    interpreter: "tsx",
    env: {
      PORT: 3002,
      NODE_ENV: "production"
    }
  }]
}
EOF

echo "🔄 重启服务..."
# 删除旧进程
pm2 delete colletools 2>/dev/null || true
# 启动新进程
pm2 start ecosystem.config.js
# 保存配置
pm2 save

echo "🌐 重载 Nginx..."
sudo systemctl reload nginx

echo "✅ 检查服务状态..."
pm2 status
echo "🎉 更新完成！"

# 显示访问信息
echo ""
echo "服务访问信息:"
echo "- 本地: http://localhost:3002"
echo "- 线上: 请检查你的域名配置"
echo ""
echo "日志查看: pm2 logs colletools"