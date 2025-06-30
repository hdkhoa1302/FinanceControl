import { LoanRepository } from '../../domain/repositories/Repository';
import { LoanEntity } from '../../domain/entities/LoanEntity';

export class InMemoryLoanRepository implements LoanRepository {
  private loans = new Map<string, LoanEntity>();

  async findById(id: string): Promise<LoanEntity | null> {
    return this.loans.get(id) || null;
  }

  async findAll(): Promise<readonly LoanEntity[]> {
    return Array.from(this.loans.values());
  }

  async findByAccountId(accountId: string): Promise<readonly LoanEntity[]> {
    return Array.from(this.loans.values())
      .filter(loan => loan.accountId === accountId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async findByType(accountId: string, type: string): Promise<readonly LoanEntity[]> {
    return Array.from(this.loans.values())
      .filter(loan => loan.accountId === accountId && loan.type === type);
  }

  async findOverdue(accountId: string): Promise<readonly LoanEntity[]> {
    return Array.from(this.loans.values())
      .filter(loan => loan.accountId === accountId && loan.isOverdue());
  }

  async save(loan: LoanEntity): Promise<LoanEntity> {
    this.loans.set(loan.id, loan);
    return loan;
  }

  async delete(id: string): Promise<void> {
    this.loans.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.loans.has(id);
  }

  // For testing and seeding
  seed(loans: LoanEntity[]): void {
    this.loans.clear();
    loans.forEach(loan => this.loans.set(loan.id, loan));
  }

  clear(): void {
    this.loans.clear();
  }
}