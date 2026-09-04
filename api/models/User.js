import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  phone: String,
  city: {
    type: String,
    enum: ['nyc', 'chicago', 'dc', 'boston', 'la', 'miami'],
    default: 'nyc',
    index: true
  },
  dmvPoints: {
    type: Number,
    default: 0,
    index: true
  },
  tlcPoints: {
    type: Number,
    default: 0,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastLogin: Date
});

// Compound indexes for city-based queries
userSchema.index({ city: 1, email: 1 });
userSchema.index({ city: 1, isActive: 1 });
userSchema.index({ city: 1, createdAt: -1 });

export default mongoose.model('User', userSchema);
