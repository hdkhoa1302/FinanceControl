import { Transaction, ITransactionService, TransactionFilters, DomainEvent } from '../types';
import { ITransactionRepository } from '../types';
import { EventBus } from '../utils/EventBus';

export class TransactionService implements ITransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private eventBus: EventBus
  ) {}

  async createTransaction(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
    // Business logic validation
    this.validateTransaction(transaction);
    
    const newTransaction = await this.transactionRepository.create({
      ...transaction,
      date: transaction.date || new Date().toISOString()
    });

    // Emit domain event
    this.eventBus.emit({
      type: 'TRANSACTION_CREATED',
      payload: newTransaction,
      timestamp: new Date()
    });

    return newTransaction;
  }

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    if (!filters) {
      return this.transactionRepository.findAll();
    }

    let transactions = await this.transactionRepository.findAll();

    // Apply filters
    if (filters.walletId) {
      transactions = transactions.filter(t => t.wallet === filters.walletId);
    }
    
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.dateTo!));
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    return this.transactionRepository.update(id, updates);
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.delete(id);

    // Emit domain event for balance adjustment
    this.eventBus.emit({
      type: 'TRANSACTION_DELETED',
      payload: { transaction },
      timestamp: new Date()
    });
  }

  private validateTransaction(transaction: Omit<Transaction, '_id'>): void {
    if (!transaction.wallet) {
      throw new Error('Wallet is required');
    }
    
    if (!transaction.description?.trim()) {
      throw new Error('Description is required');
    }
    
    if (!transaction.category?.trim()) {
      throw new Error('Category is required');
    }
    
    if (transaction.amount === 0) {
      throw new Error('Amount cannot be zero');
    }
  }
}