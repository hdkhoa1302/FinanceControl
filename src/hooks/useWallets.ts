import { useState, useEffect, useCallback } from 'react';
import { WalletEntity } from '../domain/entities/WalletEntity';
import { WalletService } from '../application/services/WalletService';
import { ServiceContainer } from '../infrastructure/di/ServiceContainer';
import { CreateWalletRequest } from '../types/application';

export const useWallets = (accountId: string) => {
  const [wallets, setWallets] = useState<WalletEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletService = ServiceContainer.getInstance().get<WalletService>('WalletService');

  const loadWallets = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await walletService.getWalletsByAccount(accountId);
      setWallets([...result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [walletService, accountId]);

  const createWallet = useCallback(async (request: CreateWalletRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await walletService.createWallet(request);
      await loadWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [walletService, loadWallets]);

  const updateWallet = useCallback(async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await walletService.updateWallet(id, updates);
      await loadWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [walletService, loadWallets]);

  const deleteWallet = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await walletService.deleteWallet(id);
      await loadWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [walletService, loadWallets]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets: wallets.map(w => ({
      _id: w.id,
      account: w.accountId,
      name: w.name,
      type: w.type,
      balance: w.balance,
      currency: w.currency,
      bankInfo: w.bankInfo,
      color: w.color
    })),
    loading,
    error,
    loadWallets,
    createWallet,
    updateWallet,
    deleteWallet
  };
};