import mongoose, { Schema } from 'mongoose';
import { IBillSplit, IBillSplitParticipant } from '@/types';

const participantSchema = new Schema<IBillSplitParticipant>({
  name: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true
  },
  contact: {
    type: String,
    trim: true
  },
  share: {
    type: Number,
    required: [true, 'Share percentage is required'],
    min: [0, 'Share cannot be negative'],
    max: [100, 'Share cannot exceed 100%']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paid: {
    type: Boolean,
    default: false
  },
  paidDate: {
    type: Date
  }
}, { _id: false });

const billSplitSchema = new Schema<IBillSplit>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0.01, 'Total amount must be positive']
  },
  payerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payer ID is required']
  },
  payerName: {
    type: String,
    required: [true, 'Payer name is required'],
    trim: true
  },
  participants: {
    type: [participantSchema],
    validate: {
      validator: function(participants: IBillSplitParticipant[]) {
        return participants.length > 0;
      },
      message: 'At least one participant is required'
    }
  },
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage'],
    required: [true, 'Split type is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  settled: {
    type: Boolean,
    default: false
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
billSplitSchema.index({ accountId: 1, date: -1 });
billSplitSchema.index({ payerId: 1 });
billSplitSchema.index({ accountId: 1, settled: 1 });

export const BillSplit = mongoose.model<IBillSplit>('BillSplit', billSplitSchema);