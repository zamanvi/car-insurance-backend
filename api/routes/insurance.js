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

// Real, currently-active carriers per city, verified against DFS/company
// sites -- NOT a "base premium" per carrier. These companies don't publish
// rate cards (rates depend on broker quote, driving history, vehicle age,
// etc.), so attaching a specific invented dollar figure to a specific real
// company's name would be a fabricated pricing claim about that business.
// Each entry is just "who to check with" -- the website is where a driver
// gets a REAL quote. (Earlier version listed Global Liberty, which was
// liquidated/insolvent in 2021, and "Ideal Indemnity", which does not
// exist as a real company -- both removed.)
const CITY_CARRIERS = {
  nyc: [
    { provider: 'American Transit', website: 'https://www.american-transit.com' },
    { provider: 'Hereford Insurance', website: 'https://www.herefordinsurance.com' },
    { provider: 'Affirmative Direct', website: 'https://www.affirmativedirect.com' }
  ],
  chicago: [
    { provider: 'Progressive Commercial', website: 'https://www.progressivecommercial.com' },
    { provider: 'Geico Commercial', website: 'https://www.geico.com/commercial-auto-insurance/' },
    { provider: 'State Farm', website: 'https://www.statefarm.com' }
  ],
  dc: [
    { provider: 'Progressive Commercial', website: 'https://www.progressivecommercial.com' },
    { provider: 'Geico Commercial', website: 'https://www.geico.com/commercial-auto-insurance/' }
  ],
  boston: [
    { provider: 'Progressive Commercial', website: 'https://www.progressivecommercial.com' },
    { provider: 'Geico Commercial', website: 'https://www.geico.com/commercial-auto-insurance/' }
  ],
  la: [
    { provider: 'Progressive Commercial', website: 'https://www.progressivecommercial.com' },
    { provider: 'Geico Commercial', website: 'https://www.geico.com/commercial-auto-insurance/' },
    { provider: 'USAA', website: 'https://www.usaa.com' }
  ],
  miami: [
    { provider: 'Progressive Commercial', website: 'https://www.progressivecommercial.com' },
    { provider: 'Geico Commercial', website: 'https://www.geico.com/commercial-auto-insurance/' }
  ]
};

// A single ballpark market-rate estimate, driven by public rate-trend data
// for each city -- deliberately NOT attributed to any one named carrier
// (see CITY_CARRIERS comment above for why). Presented to the driver as
// "estimated, not an official quote."
const CITY_BASE_ESTIMATE = {
  nyc: 7500,
  chicago: 3200,
  dc: 3400,
  boston: 3600,
  la: 3300,
  miami: 3500
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
    const base = CITY_BASE_ESTIMATE[city] || CITY_BASE_ESTIMATE.nyc;

    const estimatedYearly = computeFinalPremium(base, { dmvPoints, tlcPoints, vehicleType, yearsLicensed });

    res.json({
      success: true,
      city,
      estimate: {
        yearly: estimatedYearly,
        monthly: Math.round(estimatedYearly / 12),
        disclaimer: 'Estimated only -- not an official quote from any insurer.'
      },
      carriers: carriers.map(({ provider, website }) => ({ provider, website }))
    });

    // Fire-and-forget anonymous usage log. The app has no login, so this
    // is the only signal the admin dashboard has of real driver traffic --
    // it must never be able to fail or delay the response above.
    QuoteLog.create({
      city,
      dmvPoints,
      tlcPoints,
      vehicleType,
      yearsLicensed,
      estimatedYearly
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
