import { useState, useEffect, useCallback } from 'react';
import { TransactionEntity } from '../domain/entities/TransactionEntity';
import { TransactionService } from '../application/services/TransactionService';
import { ServiceContainer } from '../infrastructure/di/ServiceContainer';
import { CreateTransactionRequest, FilterOptions } from '../types/application';

export const useTransactions = (accountId: string) => {
  const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transactionService = ServiceContainer.getInstance().get<TransactionService>('TransactionService');

  const loadTransactions = useCallback(async (filters?: FilterOptions) => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await transactionService.getTransactionsByAccount(accountId, filters);
      setTransactions([...result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [transactionService, accountId]);

  const createTransaction = useCallback(async (request: CreateTransactionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await transactionService.createTransaction(request);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [transactionService, loadTransactions]);

  const updateTransaction = useCallback(async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await transactionService.updateTransaction(id, updates);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [transactionService, loadTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await transactionService.deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [transactionService, loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions: transactions.map(tx => ({
      _id: tx.id,
      account: tx.accountId,
      wallet: tx.walletId,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      date: tx.date.toISOString()
    })),
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};