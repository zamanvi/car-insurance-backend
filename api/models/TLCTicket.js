import mongoose from 'mongoose';

const tlcTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  violationType: String,
  dmvPoints: Number,
  tlcPoints: Number,
  fineAmount: Number,
  insurancePenalty: Number,
  penaltyDuration: Number,
  ticketDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

tlcTicketSchema.index({ userId: 1, ticketDate: -1 });

export default mongoose.model('TLCTicket', tlcTicketSchema);
