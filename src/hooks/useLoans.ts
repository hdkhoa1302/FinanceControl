import { useState, useEffect, useCallback } from 'react';
import { LoanEntity } from '../domain/entities/LoanEntity';
import { LoanService, LoanSummary } from '../application/services/LoanService';
import { ServiceContainer } from '../infrastructure/di/ServiceContainer';
import { CreateLoanRequest, FilterOptions } from '../types/application';

export const useLoans = (accountId: string) => {
  const [loans, setLoans] = useState<LoanEntity[]>([]);
  const [summary, setSummary] = useState<LoanSummary>({
    totalLent: 0,
    totalBorrowed: 0,
    activeLentCount: 0,
    activeBorrowedCount: 0,
    overdueCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loanService = ServiceContainer.getInstance().get<LoanService>('LoanService');

  const loadLoans = useCallback(async (filters?: FilterOptions) => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [loansResult, summaryResult] = await Promise.all([
        loanService.getLoansByAccount(accountId, filters),
        loanService.calculateSummary(accountId)
      ]);
      
      setLoans([...loansResult]);
      setSummary(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [loanService, accountId]);

  const createLoan = useCallback(async (request: CreateLoanRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await loanService.createLoan(request);
      await loadLoans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loanService, loadLoans]);

  const makePayment = useCallback(async (loanId: string, amount: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await loanService.makePayment(loanId, amount);
      await loadLoans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loanService, loadLoans]);

  const deleteLoan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await loanService.deleteLoan(id);
      await loadLoans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loanService, loadLoans]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  return {
    loans: loans.map(loan => ({
      _id: loan.id,
      type: loan.type,
      counterpart: loan.counterpart,
      counterpartContact: loan.counterpartContact,
      amount: loan.amount,
      interestRate: loan.interestRate,
      startDate: loan.startDate.toISOString(),
      dueDate: loan.dueDate.toISOString(),
      description: loan.description,
      status: loan.status,
      paidAmount: loan.paidAmount,
      paidDate: loan.paidDate?.toISOString(),
      createdAt: loan.createdAt.toISOString()
    })),
    summary,
    loading,
    error,
    loadLoans,
    createLoan,
    makePayment,
    deleteLoan
  };
};