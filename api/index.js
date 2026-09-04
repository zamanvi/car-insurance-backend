import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { cityMiddleware } from './middleware/city.js';

// Routes
import authRoutes from './routes/auth.js';
import pirpRoutes from './routes/pirp.js';
import insuranceRoutes from './routes/insurance.js';
import tlcRoutes from './routes/tlc.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

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
