/**
 * This is a API server
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import toolsRoutes from './routes/tools.js';
import downloadRoutes from './routes/download.js';

// load env
dotenv.config();


const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
 * 根路径处理
 */
app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('ColleTools is running!');
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