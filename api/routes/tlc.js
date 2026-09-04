import express from 'express';
import jwt from 'jsonwebtoken';
import TLCTicket from '../models/TLCTicket.js';
import User from '../models/User.js';

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

router.post('/add-ticket', verifyToken, async (req, res) => {
  try {
    const { violationType, dmvPoints, tlcPoints, fineAmount } = req.body;

    const insurancePenalty = dmvPoints * 25 + tlcPoints * 35;

    const ticket = new TLCTicket({
      userId: req.userId,
      violationType,
      dmvPoints,
      tlcPoints,
      fineAmount,
      insurancePenalty,
      penaltyDuration: 36
    });

    if (tlcPoints >= 3) {
      ticket.riskLevel = 'high';
    } else if (tlcPoints >= 2) {
      ticket.riskLevel = 'medium';
    } else {
      ticket.riskLevel = 'low';
    }

    await ticket.save();

    const user = await User.findById(req.userId);
    user.dmvPoints += dmvPoints;
    user.tlcPoints += tlcPoints;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Ticket added',
      ticket,
      warning: ticket.riskLevel === 'high'
        ? 'High risk! Consider PIRP course to reduce points and insurance costs.'
        : ''
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const tickets = await TLCTicket.find({
      userId: req.userId
    }).sort({ ticketDate: -1 });

    res.json({
      success: true,
      message: 'Ticket history',
      tickets,
      totalTickets: tickets.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/penalty-risk', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const tickets = await TLCTicket.find({ userId: req.userId });

    const totalPenalty = tickets.reduce((sum, t) => sum + t.insurancePenalty, 0);
    const licenseRisk = user.tlcPoints >= 5 ? 'CRITICAL - Suspension Risk!' :
                       user.tlcPoints >= 4 ? 'High' :
                       user.tlcPoints >= 2 ? 'Medium' : 'Low';

    res.json({
      success: true,
      message: 'Penalty risk analysis',
      currentPoints: {
        dmv: user.dmvPoints,
        tlc: user.tlcPoints
      },
      totalInsurancePenalty: totalPenalty,
      monthlyPenalty: Math.round(totalPenalty / 36),
      licenseRisk,
      recommendation: user.tlcPoints >= 2
        ? 'Enroll in PIRP course to reduce 4 points and save $150-300/year'
        : 'Good record, maintain safe driving'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
