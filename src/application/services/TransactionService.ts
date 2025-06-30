import { TransactionEntity } from '../../domain/entities/TransactionEntity';
import { TransactionRepository, WalletRepository } from '../../domain/repositories/Repository';
import { CreateTransactionRequest, FilterOptions } from '../../types/application';

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository
  ) {}

  async createTransaction(request: CreateTransactionRequest): Promise<TransactionEntity> {
    this.validateCreateRequest(request);

    // Validate wallet exists and belongs to account
    const wallet = await this.walletRepository.findById(request.walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.accountId !== request.accountId) {
      throw new Error('Wallet does not belong to this account');
    }

    // Create transaction
    const transaction = TransactionEntity.create({
      accountId: request.accountId,
      walletId: request.walletId,
      amount: request.amount,
      type: request.type as any,
      category: request.category,
      description: request.description,
      date: request.date
    });

    // Update wallet balance
    const signedAmount = transaction.getSignedAmount();
    await this.walletRepository.save(wallet.updateBalance(signedAmount));

    return this.transactionRepository.save(transaction);
  }

  async getTransactionsByAccount(accountId: string, filters?: FilterOptions): Promise<readonly TransactionEntity[]> {
    let transactions = await this.transactionRepository.findByAccountId(accountId);

    if (filters) {
      transactions = this.applyFilters(transactions, filters);
    }

    return transactions;
  }

  async getTransactionById(id: string): Promise<TransactionEntity | null> {
    return this.transactionRepository.findById(id);
  }

  async updateTransaction(id: string, updates: Partial<{ description: string; category: string }>): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    let updatedTransaction = transaction;

    if (updates.description) {
      updatedTransaction = updatedTransaction.updateDescription(updates.description);
    }

    if (updates.category) {
      updatedTransaction = updatedTransaction.updateCategory(updates.category);
    }

    return this.transactionRepository.save(updatedTransaction);
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Reverse wallet balance
    const wallet = await this.walletRepository.findById(transaction.walletId);
    if (wallet) {
      const reverseAmount = -transaction.getSignedAmount();
      await this.walletRepository.save(wallet.updateBalance(reverseAmount));
    }

    await this.transactionRepository.delete(id);
  }

  private applyFilters(transactions: readonly TransactionEntity[], filters: FilterOptions): readonly TransactionEntity[] {
    return transactions.filter(tx => {
      if (filters.type && tx.type !== filters.type) return false;
      if (filters.category && tx.category !== filters.category) return false;
      if (filters.walletId && tx.walletId !== filters.walletId) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!tx.description.toLowerCase().includes(searchLower) &&
            !tx.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.dateFrom && tx.date < filters.dateFrom) return false;
      if (filters.dateTo && tx.date > filters.dateTo) return false;
      return true;
    });
  }

  private validateCreateRequest(request: CreateTransactionRequest): void {
    if (!request.walletId) {
      throw new Error('Wallet ID is required');
    }

    if (!request.description?.trim()) {
      throw new Error('Description is required');
    }

    if (!request.category?.trim()) {
      throw new Error('Category is required');
    }

    if (request.amount === 0) {
      throw new Error('Amount cannot be zero');
    }

    if (!['income', 'expense', 'loan_received', 'loan_given'].includes(request.type)) {
      throw new Error('Invalid transaction type');
    }
  }
}