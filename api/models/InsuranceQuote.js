import mongoose from 'mongoose';

const insuranceQuoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: String,
    enum: ['Progressive', 'Geico', 'StateFarm', 'Allstate', 'USAA'],
    required: true,
    index: true
  },
  monthlyPremium: {
    type: Number,
    required: true
  },
  annualPremium: Number,
  coverage: String,
  drivingRecord: String,
  tlcPoints: Number,
  deductible: Number,
  quotationDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiryDate: Date,
  affiliateLink: String,
  ratings: Number,
  saved: {
    type: Boolean,
    default: true
  }
});

insuranceQuoteSchema.index({ userId: 1, saved: 1 });

export default mongoose.model('InsuranceQuote', insuranceQuoteSchema);
