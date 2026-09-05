export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "✅ Backend is healthy!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
}
