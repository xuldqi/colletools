/**
 * local server entry file, for local development
 */
import app from './app.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3004; // 修改默认端口为3004，避免与其他服务冲突

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;