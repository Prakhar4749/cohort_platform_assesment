
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'success', 'failed'],
    default: 'processing'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);