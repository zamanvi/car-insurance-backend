import express from 'express';
import jwt from 'jsonwebtoken';
import PIRPEnrollment from '../models/PIRPEnrollment.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/enroll', verifyToken, async (req, res) => {
  try {
    const { courseProvider } = req.body;

    const existing = await PIRPEnrollment.findOne({
      userId: req.userId,
      isCompleted: false
    });

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in a course' });
    }

    const enrollment = new PIRPEnrollment({
      userId: req.userId,
      courseProvider
    });

    await enrollment.save();
    clearCache('pirp');

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      enrollment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/progress/:id', verifyToken, async (req, res) => {
  try {
    const { hoursCompleted } = req.body;

    const enrollment = await PIRPEnrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (enrollment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    enrollment.hoursCompleted = hoursCompleted;
    enrollment.progress = Math.round((hoursCompleted / 6) * 100);

    if (hoursCompleted >= 6) {
      enrollment.isCompleted = true;
      enrollment.completionDate = new Date();
    }

    await enrollment.save();
    clearCache('pirp');

    res.json({
      success: true,
      message: 'Progress updated',
      enrollment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', verifyToken, cacheMiddleware(60), async (req, res) => {
  try {
    const enrollment = await PIRPEnrollment.findOne({
      userId: req.userId
    }).sort({ enrollmentDate: -1 });

    if (!enrollment) {
      return res.json({ success: true, message: 'Not enrolled yet' });
    }

    res.json({
      success: true,
      enrollment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/savings', verifyToken, cacheMiddleware(300), async (req, res) => {
  try {
    const enrollment = await PIRPEnrollment.findOne({
      userId: req.userId,
      isCompleted: true
    });

    if (!enrollment) {
      return res.json({
        success: true,
        message: 'No completed PIRP',
        savings: 0
      });
    }

    const baseSavings = enrollment.courseProvider === 'DriveSmartNY' ? 300 : 200;

    res.json({
      success: true,
      message: 'Estimated savings',
      pointsReduced: enrollment.pointsReduced,
      annualSavings: baseSavings,
      monthlySavings: Math.round(baseSavings / 12),
      completionDate: enrollment.completionDate
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
