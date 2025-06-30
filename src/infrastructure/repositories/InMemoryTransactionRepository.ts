import { TransactionRepository } from '../../domain/repositories/Repository';
import { TransactionEntity } from '../../domain/entities/TransactionEntity';

export class InMemoryTransactionRepository implements TransactionRepository {
  private transactions = new Map<string, TransactionEntity>();

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.transactions.get(id) || null;
  }

  async findAll(): Promise<readonly TransactionEntity[]> {
    return Array.from(this.transactions.values());
  }

  async findByAccountId(accountId: string): Promise<readonly TransactionEntity[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.accountId === accountId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async findByWalletId(walletId: string): Promise<readonly TransactionEntity[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.walletId === walletId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async findByDateRange(accountId: string, from: Date, to: Date): Promise<readonly TransactionEntity[]> {
    return Array.from(this.transactions.values())
      .filter(tx => 
        tx.accountId === accountId &&
        tx.date >= from &&
        tx.date <= to
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async delete(id: string): Promise<void> {
    this.transactions.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.transactions.has(id);
  }

  // For testing and seeding
  seed(transactions: TransactionEntity[]): void {
    this.transactions.clear();
    transactions.forEach(tx => this.transactions.set(tx.id, tx));
  }

  clear(): void {
    this.transactions.clear();
  }
}