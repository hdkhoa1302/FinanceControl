import mongoose, { Schema } from 'mongoose';
import { IAccount, IAccountMember } from '@/types';

const accountMemberSchema = new Schema<IAccountMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'viewer'],
    default: 'member'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const accountSchema = new Schema<IAccount>({
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [100, 'Account name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['personal', 'family'],
    required: [true, 'Account type is required']
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  members: [accountMemberSchema]
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
accountSchema.index({ ownerId: 1 });
accountSchema.index({ 'members.userId': 1 });

export const Account = mongoose.model<IAccount>('Account', accountSchema);