import mongoose from 'mongoose';

// Anonymous usage log for /api/insurance/get-quotes. The app has no
// login (v1 design), so real driver traffic never creates a User or an
// InsuranceQuote (that model requires userId). This is what actually
// lets the admin dashboard reflect real usage instead of staying at
// zero forever.
const quoteLogSchema = new mongoose.Schema({
  city: {
    type: String,
    default: 'nyc',
    index: true
  },
  dmvPoints: Number,
  tlcPoints: Number,
  vehicleType: String,
  yearsLicensed: Number,
  bestProvider: String,
  bestPremium: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('QuoteLog', quoteLogSchema);
