import { LoanEntity } from '../../domain/entities/LoanEntity';
import { LoanRepository } from '../../domain/repositories/Repository';
import { CreateLoanRequest, FilterOptions } from '../../types/application';

export interface LoanSummary {
  readonly totalLent: number;
  readonly totalBorrowed: number;
  readonly activeLentCount: number;
  readonly activeBorrowedCount: number;
  readonly overdueCount: number;
}

export class LoanService {
  constructor(private readonly loanRepository: LoanRepository) {}

  async createLoan(request: CreateLoanRequest): Promise<LoanEntity> {
    this.validateCreateRequest(request);

    const loan = LoanEntity.create({
      accountId: request.accountId,
      type: request.type as any,
      counterpart: request.counterpart,
      counterpartContact: request.counterpartContact,
      amount: request.amount,
      interestRate: request.interestRate,
      startDate: request.startDate,
      dueDate: request.dueDate,
      description: request.description
    });

    return this.loanRepository.save(loan);
  }

  async getLoansByAccount(accountId: string, filters?: FilterOptions): Promise<readonly LoanEntity[]> {
    let loans = await this.loanRepository.findByAccountId(accountId);

    if (filters) {
      loans = this.applyFilters(loans, filters);
    }

    return loans;
  }

  async getLoanById(id: string): Promise<LoanEntity | null> {
    return this.loanRepository.findById(id);
  }

  async makePayment(loanId: string, amount: number): Promise<LoanEntity> {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    const updatedLoan = loan.makePayment(amount);
    return this.loanRepository.save(updatedLoan);
  }

  async deleteLoan(id: string): Promise<void> {
    const exists = await this.loanRepository.exists(id);
    if (!exists) {
      throw new Error('Loan not found');
    }

    await this.loanRepository.delete(id);
  }

  async calculateSummary(accountId: string): Promise<LoanSummary> {
    const loans = await this.loanRepository.findByAccountId(accountId);
    
    const activeLentLoans = loans.filter(l => l.type === 'lent' && l.status === 'active');
    const activeBorrowedLoans = loans.filter(l => l.type === 'borrowed' && l.status === 'active');
    
    return {
      totalLent: activeLentLoans.reduce((sum, l) => sum + l.getRemainingAmount(), 0),
      totalBorrowed: activeBorrowedLoans.reduce((sum, l) => sum + l.getRemainingAmount(), 0),
      activeLentCount: activeLentLoans.length,
      activeBorrowedCount: activeBorrowedLoans.length,
      overdueCount: loans.filter(l => l.isOverdue()).length
    };
  }

  private applyFilters(loans: readonly LoanEntity[], filters: FilterOptions): readonly LoanEntity[] {
    return loans.filter(loan => {
      if (filters.type && loan.type !== filters.type) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!loan.counterpart.toLowerCase().includes(searchLower) &&
            !loan.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.dateFrom && loan.startDate < filters.dateFrom) return false;
      if (filters.dateTo && loan.startDate > filters.dateTo) return false;
      return true;
    });
  }

  private validateCreateRequest(request: CreateLoanRequest): void {
    if (!request.counterpart?.trim()) {
      throw new Error('Counterpart name is required');
    }

    if (request.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (request.interestRate < 0) {
      throw new Error('Interest rate cannot be negative');
    }

    if (request.dueDate <= request.startDate) {
      throw new Error('Due date must be after start date');
    }

    if (!request.description?.trim()) {
      throw new Error('Description is required');
    }

    if (!['lent', 'borrowed'].includes(request.type)) {
      throw new Error('Invalid loan type');
    }
  }
}