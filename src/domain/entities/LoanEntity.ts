import { Loan, LoanType, LoanStatus } from '../../types/domain';

export class LoanEntity {
  constructor(private readonly data: Loan) {
    this.validate();
  }

  static create(params: Omit<Loan, 'id' | 'status' | 'paidAmount' | 'createdAt' | 'updatedAt'>): LoanEntity {
    const now = new Date();
    return new LoanEntity({
      ...params,
      id: this.generateId(),
      status: 'active',
      paidAmount: 0,
      createdAt: now,
      updatedAt: now
    });
  }

  // Getters
  get id(): string { return this.data.id; }
  get accountId(): string { return this.data.accountId; }
  get type(): LoanType { return this.data.type; }
  get counterpart(): string { return this.data.counterpart; }
  get counterpartContact(): string | undefined { return this.data.counterpartContact; }
  get amount(): number { return this.data.amount; }
  get interestRate(): number { return this.data.interestRate; }
  get startDate(): Date { return this.data.startDate; }
  get dueDate(): Date { return this.data.dueDate; }
  get description(): string { return this.data.description; }
  get status(): LoanStatus { return this.data.status; }
  get paidAmount(): number { return this.data.paidAmount; }
  get paidDate(): Date | undefined { return this.data.paidDate; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date { return this.data.updatedAt; }

  // Business Logic
  calculateInterest(endDate?: Date): number {
    if (this.data.interestRate === 0) return 0;
    
    const end = endDate || new Date();
    const days = Math.floor((end.getTime() - this.data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const months = days / 30;
    
    return (this.data.amount * this.data.interestRate * months) / 100;
  }

  getTotalAmount(endDate?: Date): number {
    return this.data.amount + this.calculateInterest(endDate);
  }

  getRemainingAmount(endDate?: Date): number {
    return this.getTotalAmount(endDate) - this.data.paidAmount;
  }

  getPaymentProgress(): number {
    const total = this.getTotalAmount();
    return total > 0 ? (this.data.paidAmount / total) * 100 : 0;
  }

  isOverdue(): boolean {
    return new Date() > this.data.dueDate && this.data.status === 'active';
  }

  makePayment(amount: number): LoanEntity {
    if (this.data.status !== 'active') {
      throw new Error('Loan cannot be paid in current status');
    }

    if (amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    const totalAmount = this.getTotalAmount();
    const newPaidAmount = Math.min(this.data.paidAmount + amount, totalAmount);
    const isFullyPaid = newPaidAmount >= totalAmount;

    return new LoanEntity({
      ...this.data,
      paidAmount: newPaidAmount,
      status: isFullyPaid ? 'paid' : 'active',
      paidDate: isFullyPaid ? new Date() : this.data.paidDate,
      updatedAt: new Date()
    });
  }

  private validate(): void {
    if (!this.data.counterpart.trim()) {
      throw new Error('Counterpart name is required');
    }

    if (this.data.amount <= 0) {
      throw new Error('Loan amount must be positive');
    }

    if (this.data.interestRate < 0) {
      throw new Error('Interest rate cannot be negative');
    }

    if (this.data.dueDate <= this.data.startDate) {
      throw new Error('Due date must be after start date');
    }

    if (this.data.paidAmount < 0) {
      throw new Error('Paid amount cannot be negative');
    }
  }

  private static generateId(): string {
    return `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toData(): Loan {
    return { ...this.data };
  }
}