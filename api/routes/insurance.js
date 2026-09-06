import express from 'express';
import jwt from 'jsonwebtoken';
import InsuranceQuote from '../models/InsuranceQuote.js';
import QuoteLog from '../models/QuoteLog.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.js';
import { validateInsuranceQuote } from '../utils/validators.js';

const router = express.Router();

// Saving/viewing a driver's own quote history needs an account; getting a
// quote itself does not -- v1 apps have no login (see FINAL_PROJECT_BRIEF),
// so /get-quotes below stays public and this is only used on /save, /saved.
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

// Real carriers per city. NYC is the one that matters right now -- these
// are the actual major TLC/hack insurers, with base premiums matched to
// the Hack Rate design concept so the instant local estimate in the app
// and this live quote never disagree by an absurd margin.
const CITY_CARRIERS = {
  nyc: [
    { provider: 'American Transit', base: 7140 },
    { provider: 'Global Liberty', base: 7890 },
    { provider: 'Ideal Indemnity', base: 8320 }
  ],
  chicago: [
    { provider: 'Progressive Commercial', base: 3200 },
    { provider: 'Geico Commercial', base: 2950 },
    { provider: 'State Farm', base: 3100 }
  ],
  dc: [
    { provider: 'Progressive Commercial', base: 3400 },
    { provider: 'Geico Commercial', base: 3150 }
  ],
  boston: [
    { provider: 'Progressive Commercial', base: 3600 },
    { provider: 'Geico Commercial', base: 3350 }
  ],
  la: [
    { provider: 'Progressive Commercial', base: 3300 },
    { provider: 'Geico Commercial', base: 3050 },
    { provider: 'USAA', base: 2900 }
  ],
  miami: [
    { provider: 'Progressive Commercial', base: 3500 },
    { provider: 'Geico Commercial', base: 3250 }
  ]
};

function computeFinalPremium(base, { dmvPoints, tlcPoints, vehicleType, yearsLicensed }) {
  const pointsFactor = 1 + (dmvPoints + tlcPoints) * 0.015;

  let vehicleFactor = 1.0;
  if (vehicleType === 'SUV') vehicleFactor = 1.08;
  else if (vehicleType === 'Wheelchair accessible') vehicleFactor = 0.95;

  const experienceDiscount = Math.max(0, Math.min(0.10, (yearsLicensed - 2) * 0.02));

  return Math.round(base * pointsFactor * vehicleFactor * (1 - experienceDiscount));
}

router.post('/get-quotes', cacheMiddleware(600), async (req, res) => {
  try {
    const { error, value } = validateInsuranceQuote(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { dmvPoints, tlcPoints, vehicleType, yearsLicensed } = value;
    const city = req.city || 'nyc';
    const carriers = CITY_CARRIERS[city] || CITY_CARRIERS.nyc;

    const quotes = carriers
      .map(({ provider, base }) => {
        const finalPremium = computeFinalPremium(base, { dmvPoints, tlcPoints, vehicleType, yearsLicensed });
        return {
          provider,
          finalPremium,
          monthlyPremium: Math.round(finalPremium / 12),
          city,
          affiliateLink: `https://affiliate.example.com/${city}/${encodeURIComponent(provider)}`
        };
      })
      .sort((a, b) => a.finalPremium - b.finalPremium)
      .map((q, i) => ({ ...q, isBestRate: i === 0 }));

    res.json({
      success: true,
      city,
      quotes
    });

    // Fire-and-forget anonymous usage log. The app has no login, so this
    // is the only signal the admin dashboard has of real driver traffic --
    // it must never be able to fail or delay the response above.
    const best = quotes[0];
    QuoteLog.create({
      city,
      dmvPoints,
      tlcPoints,
      vehicleType,
      yearsLicensed,
      bestProvider: best?.provider,
      bestPremium: best?.finalPremium
    }).catch((err) => console.error('QuoteLog insert failed:', err.message));

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
