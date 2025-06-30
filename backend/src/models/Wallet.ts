import mongoose, { Schema } from 'mongoose';
import { IWallet } from '@/types';

const walletSchema = new Schema<IWallet>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account ID is required']
  },
  name: {
    type: String,
    required: [true, 'Wallet name is required'],
    trim: true,
    maxlength: [100, 'Wallet name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['cash', 'bank', 'e-wallet'],
    required: [true, 'Wallet type is required']
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    enum: ['VND', 'USD', 'EUR'],
    default: 'VND'
  },
  bankInfo: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
walletSchema.index({ accountId: 1 });
walletSchema.index({ accountId: 1, type: 1 });

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);