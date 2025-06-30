// Generic Repository Interface
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<readonly T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}

// Specific Repository Interfaces
export interface WalletRepository extends Repository<import('../entities/WalletEntity').WalletEntity> {
  findByAccountId(accountId: string): Promise<readonly import('../entities/WalletEntity').WalletEntity[]>;
  getTotalBalance(accountId: string): Promise<number>;
}

export interface TransactionRepository extends Repository<import('../entities/TransactionEntity').TransactionEntity> {
  findByAccountId(accountId: string): Promise<readonly import('../entities/TransactionEntity').TransactionEntity[]>;
  findByWalletId(walletId: string): Promise<readonly import('../entities/TransactionEntity').TransactionEntity[]>;
  findByDateRange(accountId: string, from: Date, to: Date): Promise<readonly import('../entities/TransactionEntity').TransactionEntity[]>;
}

export interface BillSplitRepository extends Repository<import('../entities/BillSplitEntity').BillSplitEntity> {
  findByAccountId(accountId: string): Promise<readonly import('../entities/BillSplitEntity').BillSplitEntity[]>;
  findUnsettled(accountId: string): Promise<readonly import('../entities/BillSplitEntity').BillSplitEntity[]>;
}

export interface LoanRepository extends Repository<import('../entities/LoanEntity').LoanEntity> {
  findByAccountId(accountId: string): Promise<readonly import('../entities/LoanEntity').LoanEntity[]>;
  findByType(accountId: string, type: string): Promise<readonly import('../entities/LoanEntity').LoanEntity[]>;
  findOverdue(accountId: string): Promise<readonly import('../entities/LoanEntity').LoanEntity[]>;
}