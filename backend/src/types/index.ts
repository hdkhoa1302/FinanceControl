import { Document, Types } from 'mongoose';

// Base interfaces
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  currentAccountId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAccount extends Document {
  _id: Types.ObjectId;
  name: string;
  type: 'personal' | 'family';
  ownerId: Types.ObjectId;
  members: IAccountMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountMember {
  userId: Types.ObjectId;
  role: 'admin' | 'member' | 'viewer';
  name: string;
  joinedAt: Date;
}

export interface IWallet extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet';
  balance: number;
  currency: 'VND' | 'USD' | 'EUR';
  bankInfo?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  walletId: Types.ObjectId;
  amount: number;
  type: 'income' | 'expense' | 'loan_received' | 'loan_given';
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBillSplit extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  title: string;
  description?: string;
  totalAmount: number;
  payerId: Types.ObjectId;
  payerName: string;
  participants: IBillSplitParticipant[];
  splitType: 'equal' | 'custom' | 'percentage';
  date: Date;
  settled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBillSplitParticipant {
  name: string;
  contact?: string;
  share: number;
  amount: number;
  paid: boolean;
  paidDate?: Date;
}

export interface ILoan extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  type: 'lent' | 'borrowed';
  counterpart: string;
  counterpartContact?: string;
  amount: number;
  interestRate: number;
  startDate: Date;
  dueDate: Date;
  description: string;
  status: 'active' | 'paid' | 'overdue';
  paidAmount: number;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    currentAccountId?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterQuery {
  search?: string;
  type?: string;
  category?: string;
  walletId?: string;
  dateFrom?: string;
  dateTo?: string;
}