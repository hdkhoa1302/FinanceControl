import { useState, useEffect } from 'react';
import { WalletApiService, Wallet } from '../services/WalletApiService';

const walletService = new WalletApiService();

export const useWalletsApi = (accountId: string) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!accountId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await walletService.getWallets(accountId);
      setWallets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [accountId]);

  const createWallet = async (data: Omit<Wallet, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newWallet = await walletService.createWallet(data as any);
      await reload();
      return newWallet;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
    setLoading(true);
    setError(null);
    try {
      const w = await walletService.updateWallet(id, updates as any);
      await reload();
      return w;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWallet = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await walletService.deleteWallet(id);
      await reload();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { wallets, loading, error, reload, createWallet, updateWallet, deleteWallet };
}; 