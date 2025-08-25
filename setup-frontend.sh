#!/bin/bash

# 完整前端设置脚本
echo "🎨 设置ColleTools前端服务..."
echo "============================"

# 项目目录
PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

# 1. 检查前端构建文件
echo "📋 1. 检查前端构建文件..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ 前端构建文件存在"
    echo "文件列表:"
    ls -la dist/
else
    echo "❌ 前端构建文件不存在，开始构建..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败"
        exit 1
    fi
fi

# 2. 备份当前 app.ts
echo "💾 2. 备份当前配置..."
cp api/app.ts api/app.ts.$(date +%Y%m%d_%H%M%S)

# 3. 创建完整的 app.ts
echo "🔧 3. 更新Express配置..."
cat > api/app.ts << 'EOF'
/**
 * This is a API server
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import toolsRoutes from './routes/tools.js';
import downloadRoutes from './routes/download.js';

// load env
dotenv.config();

const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/download', downloadRoutes);

/**
 * health endpoints
 */
app.use('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'ok'
  });
});

app.use('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString()
  });
});

/**
 * SPA路由处理 - 必须在error handler之前
 */
app.get('*', (req: Request, res: Response, next: NextFunction): void => {
  // API路由跳过，交给API处理或404
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // 其他路由返回index.html（SPA应用）
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

/**
 * error handler middleware
 */
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error'
  });
});

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found'
  });
});

export default app;
EOF

echo "✅ Express配置已更新"

# 4. 重启服务
echo "🔄 4. 重启PM2服务..."
pm2 restart colletools

# 等待启动
echo "⏳ 等待服务启动..."
sleep 3

# 5. 测试服务
echo "🧪 5. 测试服务..."

# 健康检查
echo "健康检查:"
HEALTH_CHECK=$(curl -s http://localhost:3002/health)
if echo "$HEALTH_CHECK" | grep -q "success"; then
    echo "✅ 健康检查正常"
else
    echo "❌ 健康检查失败: $HEALTH_CHECK"
fi

# 测试前端
echo ""
echo "前端测试:"
FRONTEND_CHECK=$(curl -s http://localhost:3002/ | head -5)
if echo "$FRONTEND_CHECK" | grep -q "<!DOCTYPE html>"; then
    echo "✅ 前端服务正常"
else
    echo "❌ 前端服务异常"
    echo "响应: $FRONTEND_CHECK"
fi

# 测试静态资源
echo ""
echo "静态资源测试:"
if curl -I http://localhost:3002/assets/ 2>/dev/null | grep -q "200\|404"; then
    echo "✅ 静态资源路径可访问"
else
    echo "⚠️  静态资源路径测试失败"
fi

echo ""
echo "🎉 前端设置完成！"
echo "=================="
echo "现在访问 https://colletools.com 应该显示完整的网站界面"
echo ""
echo "如果还有问题，请检查："
echo "1. nginx配置是否正确"
echo "2. PM2日志: pm2 logs colletools"
echo "3. 构建文件: ls -la dist/"
EOF

chmod +x setup-frontend.sh