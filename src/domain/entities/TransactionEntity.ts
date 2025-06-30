import { Transaction, TransactionType } from '../../types/domain';

export class TransactionEntity {
  constructor(private readonly data: Transaction) {
    this.validate();
  }

  static create(params: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): TransactionEntity {
    const now = new Date();
    return new TransactionEntity({
      ...params,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    });
  }

  // Getters
  get id(): string { return this.data.id; }
  get accountId(): string { return this.data.accountId; }
  get walletId(): string { return this.data.walletId; }
  get amount(): number { return this.data.amount; }
  get type(): TransactionType { return this.data.type; }
  get category(): string { return this.data.category; }
  get description(): string { return this.data.description; }
  get date(): Date { return this.data.date; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date { return this.data.updatedAt; }

  // Business Logic
  isIncome(): boolean {
    return this.data.type === 'income' || this.data.type === 'loan_received';
  }

  isExpense(): boolean {
    return this.data.type === 'expense' || this.data.type === 'loan_given';
  }

  getSignedAmount(): number {
    return this.isIncome() ? Math.abs(this.data.amount) : -Math.abs(this.data.amount);
  }

  updateDescription(newDescription: string): TransactionEntity {
    if (!newDescription.trim()) {
      throw new Error('Description cannot be empty');
    }

    return new TransactionEntity({
      ...this.data,
      description: newDescription.trim(),
      updatedAt: new Date()
    });
  }

  updateCategory(newCategory: string): TransactionEntity {
    if (!newCategory.trim()) {
      throw new Error('Category cannot be empty');
    }

    return new TransactionEntity({
      ...this.data,
      category: newCategory.trim(),
      updatedAt: new Date()
    });
  }

  private validate(): void {
    if (!this.data.description.trim()) {
      throw new Error('Transaction description is required');
    }

    if (!this.data.category.trim()) {
      throw new Error('Transaction category is required');
    }

    if (this.data.amount === 0) {
      throw new Error('Transaction amount cannot be zero');
    }

    if (this.data.date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }
  }

  private static generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toData(): Transaction {
    return { ...this.data };
  }
}