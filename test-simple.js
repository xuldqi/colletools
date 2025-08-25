const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
  console.log('Test health endpoint: http://localhost:3000/health');
});