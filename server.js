import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './api/config/database.js';
import { cityMiddleware } from './api/middleware/city.js';
import { generalLimiter, apiLimiter } from './api/middleware/rateLimiter.js';
import { errorHandler } from './api/middleware/errorHandler.js';

import authRoutes from './api/routes/auth.js';
import insuranceRoutes from './api/routes/insurance.js';
import pirpRoutes from './api/routes/pirp.js';
import tlcRoutes from './api/routes/tlc.js';
import adminRoutes from './api/routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('tiny'));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
  credentials: true
}));
app.use(express.json());
app.use(generalLimiter);
app.use(cityMiddleware);

// Admin dashboard (public/admin/login.html, public/admin/index.html)
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend is healthy!',
    city: req.city,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/insurance', apiLimiter, insuranceRoutes);
app.use('/api/pirp', apiLimiter, pirpRoutes);
app.use('/api/tlc', apiLimiter, tlcRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// Every route above stays reachable even if Mongo is briefly down --
// only DB-backed routes (auth, save, admin stats) will error individually.
// /api/health and /api/insurance/get-quotes never depend on a connection.
connectDB().catch((err) => {
  console.error('MongoDB did not connect at startup, continuing without it:', err.message);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
