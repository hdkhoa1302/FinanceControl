// Domain Types - Core business entities
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly currentAccountId: string;
  readonly createdAt: Date;
}

export interface Account {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly ownerId: string;
  readonly members: readonly AccountMember[];
  readonly createdAt: Date;
}

export type AccountType = 'personal' | 'family';

export interface AccountMember {
  readonly userId: string;
  readonly role: UserRole;
  readonly name: string;
  readonly joinedAt: Date;
}

export type UserRole = 'admin' | 'member' | 'viewer';

export interface Wallet {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly type: WalletType;
  readonly balance: number;
  readonly currency: Currency;
  readonly bankInfo?: string;
  readonly color: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type WalletType = 'cash' | 'bank' | 'e-wallet';
export type Currency = 'VND' | 'USD' | 'EUR';

export interface Transaction {
  readonly id: string;
  readonly accountId: string;
  readonly walletId: string;
  readonly amount: number;
  readonly type: TransactionType;
  readonly category: string;
  readonly description: string;
  readonly date: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type TransactionType = 'income' | 'expense' | 'loan_received' | 'loan_given';

export interface BillSplit {
  readonly id: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly totalAmount: number;
  readonly payerId: string;
  readonly payerName: string;
  readonly participants: readonly BillSplitParticipant[];
  readonly splitType: SplitType;
  readonly date: Date;
  readonly settled: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface BillSplitParticipant {
  readonly name: string;
  readonly contact?: string;
  readonly share: number;
  readonly amount: number;
  readonly paid: boolean;
  readonly paidDate?: Date;
}

export type SplitType = 'equal' | 'custom' | 'percentage';

export interface Loan {
  readonly id: string;
  readonly accountId: string;
  readonly type: LoanType;
  readonly counterpart: string;
  readonly counterpartContact?: string;
  readonly amount: number;
  readonly interestRate: number;
  readonly startDate: Date;
  readonly dueDate: Date;
  readonly description: string;
  readonly status: LoanStatus;
  readonly paidAmount: number;
  readonly paidDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type LoanType = 'lent' | 'borrowed';
export type LoanStatus = 'active' | 'paid' | 'overdue';