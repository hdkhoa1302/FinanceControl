import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '@/types';

const transactionSchema = new Schema<ITransaction>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account ID is required']
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: [true, 'Wallet ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    validate: {
      validator: function(value: number) {
        return value !== 0;
      },
      message: 'Amount cannot be zero'
    }
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'loan_received', 'loan_given'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Transaction date cannot be in the future'
    }
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
transactionSchema.index({ accountId: 1, date: -1 });
transactionSchema.index({ walletId: 1, date: -1 });
transactionSchema.index({ accountId: 1, type: 1 });
transactionSchema.index({ accountId: 1, category: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);