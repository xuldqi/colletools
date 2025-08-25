import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString() 
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({ 
    message: 'ColleTools Test Server',
    endpoints: ['/health', '/api/health']
  });
});

app.listen(PORT, () => {
  console.log(`✅ 测试服务器已启动`);
  console.log(`🌐 访问地址: http://localhost:${PORT}`);
  console.log(`📋 健康检查: http://localhost:${PORT}/health`);
});