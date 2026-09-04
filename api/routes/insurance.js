import express from 'express';
import jwt from 'jsonwebtoken';
import InsuranceQuote from '../models/InsuranceQuote.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.js';
import { validateInsuranceQuote } from '../utils/validators.js';

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

// City-specific insurance rates
const CITY_INSURANCE_RATES = {
  'nyc': {
    'Progressive': { base: 120, ratings: 4.5 },
    'Geico': { base: 95, ratings: 4.3 },
    'StateFarm': { base: 110, ratings: 4.4 },
    'Allstate': { base: 130, ratings: 4.2 }
  },
  'chicago': {
    'Progressive': { base: 110, ratings: 4.5 },
    'Geico': { base: 85, ratings: 4.3 },
    'Allstate': { base: 120, ratings: 4.2 },
    'USAA': { base: 100, ratings: 4.6 }
  },
  'dc': {
    'Progressive': { base: 115, ratings: 4.5 },
    'Geico': { base: 90, ratings: 4.3 },
    'StateFarm': { base: 105, ratings: 4.4 }
  },
  'boston': {
    'Progressive': { base: 125, ratings: 4.5 },
    'Geico': { base: 100, ratings: 4.3 },
    'Allstate': { base: 135, ratings: 4.2 }
  },
  'la': {
    'Progressive': { base: 130, ratings: 4.5 },
    'Geico': { base: 105, ratings: 4.3 },
    'Allstate': { base: 140, ratings: 4.2 },
    'USAA': { base: 115, ratings: 4.6 }
  },
  'miami': {
    'Progressive': { base: 135, ratings: 4.5 },
    'Geico': { base: 110, ratings: 4.3 },
    'Allstate': { base: 145, ratings: 4.2 }
  }
};

// Get rates for city
const getInsuranceRates = (city = 'nyc') => {
  return CITY_INSURANCE_RATES[city] || CITY_INSURANCE_RATES['nyc'];
};

router.post('/get-quotes', verifyToken, cacheMiddleware(600), async (req, res) => {
  try {
    const { error, value } = validateInsuranceQuote(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { dmvPoints, tlcPoints } = value;
    const city = req.city || 'nyc';
    const rates = getInsuranceRates(city);

    const pointMultiplier = 1 + (dmvPoints * 0.15) + (tlcPoints * 0.20);

    const quotes = Object.entries(rates)
      .map(([company, data]) => ({
        company,
        monthlyPremium: Math.round(data.base * pointMultiplier),
        annualPremium: Math.round(data.base * pointMultiplier * 12),
        ratings: data.ratings,
        city,
        affiliateLink: `https://affiliate.${company.toLowerCase()}.com/${city}`
      }))
      .sort((a, b) => a.monthlyPremium - b.monthlyPremium);

    res.json({
      success: true,
      city,
      quotes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/save', verifyToken, async (req, res) => {
  try {
    const quote = new InsuranceQuote({
      userId: req.userId,
      ...req.body
    });

    await quote.save();
    clearCache('insurance');

    res.status(201).json({
      success: true,
      quote
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/saved', verifyToken, cacheMiddleware(300), async (req, res) => {
  try {
    const quotes = await InsuranceQuote.find({
      userId: req.userId,
      saved: true
    })
      .lean()
      .sort({ quotationDate: -1 })
      .limit(50);

    res.json({
      success: true,
      quotes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
