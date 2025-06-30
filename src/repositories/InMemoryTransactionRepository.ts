import { Transaction, ITransactionRepository } from '../types';

export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];
  private nextId = 1;

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.find(t => t._id === id) || null;
  }

  async findAll(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async findByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.wallet === walletId);
  }

  async findByDateRange(from: string, to: string): Promise<Transaction[]> {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    return this.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= fromDate && transactionDate <= toDate;
    });
  }

  async findByType(type: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.type === type);
  }

  async create(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      _id: `tx${this.nextId++}`
    };
    
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const index = this.transactions.findIndex(t => t._id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions[index] = { ...this.transactions[index], ...updates };
    return this.transactions[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.transactions.findIndex(t => t._id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions.splice(index, 1);
  }

  // For testing and initialization
  seed(transactions: Transaction[]): void {
    this.transactions = [...transactions];
    this.nextId = Math.max(...transactions.map(t => parseInt(t._id.replace('tx', ''))), 0) + 1;
  }
}