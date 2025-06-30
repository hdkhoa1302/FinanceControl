import { useState, useEffect, useCallback } from 'react';
import { BillSplitEntity } from '../domain/entities/BillSplitEntity';
import { BillSplitService } from '../application/services/BillSplitService';
import { ServiceContainer } from '../infrastructure/di/ServiceContainer';
import { CreateBillSplitRequest } from '../types/application';

export const useBillSplits = (accountId: string) => {
  const [billSplits, setBillSplits] = useState<BillSplitEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const billSplitService = ServiceContainer.getInstance().get<BillSplitService>('BillSplitService');

  const loadBillSplits = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await billSplitService.getBillSplitsByAccount(accountId);
      setBillSplits([...result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [billSplitService, accountId]);

  const createBillSplit = useCallback(async (request: CreateBillSplitRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await billSplitService.createBillSplit(request);
      await loadBillSplits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [billSplitService, loadBillSplits]);

  const updateParticipantPayment = useCallback(async (billId: string, participantName: string, paid: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await billSplitService.updateParticipantPayment(billId, participantName, paid);
      await loadBillSplits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [billSplitService, loadBillSplits]);

  const settleBillSplit = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await billSplitService.settleBillSplit(id);
      await loadBillSplits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [billSplitService, loadBillSplits]);

  const deleteBillSplit = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await billSplitService.deleteBillSplit(id);
      await loadBillSplits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [billSplitService, loadBillSplits]);

  useEffect(() => {
    loadBillSplits();
  }, [loadBillSplits]);

  return {
    billSplits: billSplits.map(bill => ({
      _id: bill.id,
      account: bill.accountId,
      title: bill.title,
      description: bill.description,
      totalAmount: bill.totalAmount,
      payer: bill.payerId,
      payerName: bill.payerName,
      participants: bill.participants,
      splitType: bill.splitType,
      date: bill.date.toISOString(),
      settled: bill.settled
    })),
    loading,
    error,
    loadBillSplits,
    createBillSplit,
    updateParticipantPayment,
    settleBillSplit,
    deleteBillSplit
  };
};