import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend is healthy!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
