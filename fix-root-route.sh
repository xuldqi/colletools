#!/bin/bash

# 修复根路由脚本
echo "🔧 修复ColleTools根路由..."

# 项目目录
PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

# 备份原文件
cp api/app.ts api/app.ts.backup

# 创建临时修复文件
cat > temp_fix.js << 'EOF'
const fs = require('fs');

// 读取原文件
let content = fs.readFileSync('api/app.ts', 'utf8');

// 检查是否已经有根路由处理
if (!content.includes("app.get('/', (req: Request, res: Response)")) {
    // 找到health endpoint的位置
    const healthEndpoint = `app.use('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString()
  });
});`;

    const rootHandler = `
/**
 * 根路径处理
 */
app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('ColleTools is running!');
});`;

    // 在health endpoint之后添加根路由处理
    content = content.replace(healthEndpoint, healthEndpoint + rootHandler);
    
    // 写入文件
    fs.writeFileSync('api/app.ts', content);
    console.log('✅ 根路由处理器已添加');
} else {
    console.log('✅ 根路由处理器已存在');
}
EOF

# 运行修复
node temp_fix.js

# 清理临时文件
rm temp_fix.js

# 重启服务
echo "🔄 重启PM2服务..."
pm2 restart colletools

# 等待启动
echo "⏳ 等待服务启动..."
sleep 3

# 测试
echo "🧪 测试服务..."
curl http://localhost:3002/health
echo ""
curl http://localhost:3002/

echo "✅ 修复完成！"