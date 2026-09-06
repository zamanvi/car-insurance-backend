import express from 'express';
import User from '../models/User.js';
import PIRPEnrollment from '../models/PIRPEnrollment.js';
import InsuranceQuote from '../models/InsuranceQuote.js';
import QuoteLog from '../models/QuoteLog.js';
import TLCTicket from '../models/TLCTicket.js';
import jwt from 'jsonwebtoken';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/stats/users', verifyAdmin, cacheMiddleware(60), async (req, res) => {
  try {
    const [totalUsers, recentUsers] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.find({ isActive: true })
        .select('email name phone dmvPoints tlcPoints createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    res.json({
      success: true,
      totalUsers,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/pirp', verifyAdmin, cacheMiddleware(60), async (req, res) => {
  try {
    const [totalEnrollments, enrollments] = await Promise.all([
      PIRPEnrollment.countDocuments(),
      PIRPEnrollment.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $sort: { enrollmentDate: -1 } },
        { $limit: 10 },
        {
          $project: {
            userEmail: '$user.email',
            courseProvider: 1,
            progress: 1,
            isCompleted: 1,
            enrollmentDate: 1,
            estimatedSavings: 1
          }
        }
      ])
    ]);

    res.json({
      success: true,
      totalEnrollments,
      enrollments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/quotes', verifyAdmin, cacheMiddleware(60), async (req, res) => {
  try {
    // The app has no login, so real driver traffic never creates an
    // InsuranceQuote (that model requires userId) -- it lands in QuoteLog
    // instead (see api/routes/insurance.js /get-quotes). totalQuotes must
    // count both so the dashboard doesn't sit at 0 forever, and the
    // recent list comes from QuoteLog since that's where real rows are.
    const [loggedCount, savedCount, quotes] = await Promise.all([
      QuoteLog.countDocuments(),
      InsuranceQuote.countDocuments(),
      QuoteLog.find()
        .lean()
        .sort({ createdAt: -1 })
        .limit(15)
        .select('city dmvPoints tlcPoints vehicleType estimatedYearly createdAt')
    ]);

    res.json({
      success: true,
      totalQuotes: loggedCount + savedCount,
      quotes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/tickets', verifyAdmin, cacheMiddleware(60), async (req, res) => {
  try {
    const totalTickets = await TLCTicket.countDocuments();
    const highRiskTickets = await TLCTicket.countDocuments({ riskLevel: 'high' });

    res.json({
      success: true,
      totalTickets,
      highRiskTickets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
