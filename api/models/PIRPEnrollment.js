import mongoose from 'mongoose';

const pirpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseProvider: {
    type: String,
    enum: ['SafetyAmerica', 'DriveSmartNY', 'NYSDefensiveDriving'],
    required: true,
    index: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  hoursCompleted: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 6
  },
  progress: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  completionDate: Date,
  pointsReduced: {
    type: Number,
    default: 4
  },
  estimatedSavings: {
    type: Number,
    default: 150
  },
  certificateUrl: String
});

pirpSchema.index({ userId: 1, isCompleted: 1 });
pirpSchema.index({ courseProvider: 1, enrollmentDate: -1 });

export default mongoose.model('PIRPEnrollment', pirpSchema);
