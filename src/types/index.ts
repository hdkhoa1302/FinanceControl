export interface Account {
  _id: string;
  name: string;
  type: 'personal' | 'family';
  owner: string;
  members: Array<{
    user: string;
    role: 'admin' | 'member' | 'viewer';
    name: string;
  }>;
  createdAt: string;
}

export interface Wallet {
  _id: string;
  account: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet';
  balance: number;
  currency: string;
  bankInfo?: string;
  color?: string;
}

export interface Transaction {
  _id: string;
  account: string;
  wallet: string;
  walletName?: string;
  amount: number;
  type: 'income' | 'expense' | 'loan_received' | 'loan_given';
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  _id: string;
  account: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  categories: Array<{
    name: string;
    allocated: number;
    spent: number;
  }>;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  currentAccount: string;
}

export interface BillSplit {
  _id: string;
  account: string;
  title: string;
  description?: string;
  totalAmount: number;
  payer: string;
  payerName: string;
  participants: Array<{
    name: string;
    contact?: string;
    share: number;
    amount: number;
    paid: boolean;
    paidDate?: string;
  }>;
  splitType: 'equal' | 'custom' | 'percentage';
  date: string;
  settled: boolean;
  transactionId?: string;
}

// Domain Events
export interface DomainEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

// Service Interfaces
export interface ITransactionService {
  createTransaction(transaction: Omit<Transaction, '_id'>): Promise<Transaction>;
  getTransactions(filters?: TransactionFilters): Promise<Transaction[]>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}

export interface IWalletService {
  createWallet(wallet: Omit<Wallet, '_id'>): Promise<Wallet>;
  getWallets(accountId: string): Promise<Wallet[]>;
  updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet>;
  deleteWallet(id: string): Promise<void>;
  updateBalance(id: string, amount: number): Promise<Wallet>;
}

export interface IBillSplitService {
  createBillSplit(billSplit: Omit<BillSplit, '_id'>): Promise<BillSplit>;
  getBillSplits(accountId: string): Promise<BillSplit[]>;
  updateParticipantPayment(billId: string, participantName: string, paid: boolean): Promise<BillSplit>;
  settleBillSplit(id: string): Promise<BillSplit>;
  deleteBillSplit(id: string): Promise<void>;
}

export interface TransactionFilters {
  walletId?: string;
  type?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Repository Interfaces
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filters?: any): Promise<T[]>;
  create(entity: Omit<T, '_id'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface ITransactionRepository extends IRepository<Transaction> {
  findByWallet(walletId: string): Promise<Transaction[]>;
  findByDateRange(from: string, to: string): Promise<Transaction[]>;
  findByType(type: string): Promise<Transaction[]>;
}

export interface IWalletRepository extends IRepository<Wallet> {
  findByAccount(accountId: string): Promise<Wallet[]>;
}

export interface IBillSplitRepository extends IRepository<BillSplit> {
  findByAccount(accountId: string): Promise<BillSplit[]>;
  findByPayer(payerId: string): Promise<BillSplit[]>;
  findUnsettled(accountId: string): Promise<BillSplit[]>;
}