import express from 'express';

const app = express();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend is healthy!',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// City middleware - Extract city from request
app.use(cityMiddleware);

// Performance middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined'));

// Rate limiting
app.use(generalLimiter);
app.use('/api/', apiLimiter);

// Database connection
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Car Insurance Calculator Backend v1.0',
    timestamp: new Date().toISOString()
  });
});

// Serve admin panel
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pirp', pirpRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/tlc', tlcRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
});

// Error handling
app.use(errorHandler);

export default app;
