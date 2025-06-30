import mongoose, { Schema } from 'mongoose';
import { ILoan } from '@/types';

const loanSchema = new Schema<ILoan>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account ID is required']
  },
  type: {
    type: String,
    enum: ['lent', 'borrowed'],
    required: [true, 'Loan type is required']
  },
  counterpart: {
    type: String,
    required: [true, 'Counterpart name is required'],
    trim: true,
    maxlength: [100, 'Counterpart name cannot exceed 100 characters']
  },
  counterpartContact: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be positive']
  },
  interestRate: {
    type: Number,
    default: 0,
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(this: ILoan, value: Date) {
        return value > this.startDate;
      },
      message: 'Due date must be after start date'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'paid', 'overdue'],
    default: 'active'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  paidDate: {
    type: Date
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
loanSchema.index({ accountId: 1, startDate: -1 });
loanSchema.index({ accountId: 1, type: 1 });
loanSchema.index({ accountId: 1, status: 1 });
loanSchema.index({ dueDate: 1, status: 1 });

export const Loan = mongoose.model<ILoan>('Loan', loanSchema);