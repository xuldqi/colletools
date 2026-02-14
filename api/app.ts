/**
 * This is a API server
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import toolsRoutes from './routes/tools.js';
import downloadRoutes from './routes/download.js';
import emailRoutes from './routes/email.js';

// load env
dotenv.config();

// ES模块中获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/email', emailRoutes);

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
 * SPA路由支持 - 所有非API路由都返回index.html
 */
app.get('*', (req: Request, res: Response): void => {
  // 如果是API路由，跳过
  if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
    return;
  }
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
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'API not found'
  });
});

export default app;