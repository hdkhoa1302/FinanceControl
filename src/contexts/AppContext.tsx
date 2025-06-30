import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account } from '../types/index';
import { useWallets } from '../hooks/useWallets';
import { useTransactions } from '../hooks/useTransactions';
import { useBillSplits } from '../hooks/useBillSplits';
import { useAuth } from './AuthContext';
import { useAccounts } from '../hooks/useAccounts';

interface AppContextType {
  user: any | null;
  accounts: Account[];
  currentAccount: Account | null;
  currentView: string;
  sidebarOpen: boolean;
  setCurrentView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
  switchAccount: (accountId: string) => void;
  reloadAccounts: () => Promise<void>;
  // Expose hooks data
  wallets: ReturnType<typeof useWallets>['wallets'];
  transactions: ReturnType<typeof useTransactions>['transactions'];
  billSplits: ReturnType<typeof useBillSplits>['billSplits'];
  walletsLoading: boolean;
  transactionsLoading: boolean;
  // Expose hook methods
  createWallet: ReturnType<typeof useWallets>['createWallet'];
  updateWallet: ReturnType<typeof useWallets>['updateWallet'];
  deleteWallet: ReturnType<typeof useWallets>['deleteWallet'];
  createTransaction: ReturnType<typeof useTransactions>['createTransaction'];
  updateTransaction: ReturnType<typeof useTransactions>['updateTransaction'];
  deleteTransaction: ReturnType<typeof useTransactions>['deleteTransaction'];
  createBillSplit: ReturnType<typeof useBillSplits>['createBillSplit'];
  updateBillSplitParticipantPayment: ReturnType<typeof useBillSplits>['updateParticipantPayment'];
  settleBillSplit: ReturnType<typeof useBillSplits>['settleBillSplit'];
  deleteBillSplit: ReturnType<typeof useBillSplits>['deleteBillSplit'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { accounts, reload } = useAccounts();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentAccountId, setCurrentAccountId] = useState<string | undefined>(user?.currentAccountId);
  useEffect(() => {
    if (user?.currentAccountId) {
      setCurrentAccountId(user.currentAccountId);
    }
  }, [user?.currentAccountId]);
  const currentAccount = accounts.find(acc => acc._id === currentAccountId) || null;

  // Use custom hooks for data management
  const {
    wallets,
    loading: walletsLoading,
    createWallet,
    updateWallet,
    deleteWallet
  } = useWallets(currentAccount?._id || '');

  const {
    transactions,
    loading: transactionsLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions(currentAccount?._id || '');

  const {
    billSplits,
    createBillSplit,
    updateParticipantPayment: updateBillSplitParticipantPayment,
    settleBillSplit,
    deleteBillSplit
  } = useBillSplits(currentAccount?._id || '');

  const switchAccount = (accountId: string) => {
    setCurrentAccountId(accountId);
  };

  const reloadAccounts = reload;

  return (
    <AppContext.Provider value={{
      user,
      accounts,
      currentAccount,
      reloadAccounts,
      currentView,
      sidebarOpen,
      setCurrentView,
      setSidebarOpen,
      switchAccount,
      wallets,
      transactions,
      billSplits,
      walletsLoading,
      transactionsLoading,
      createWallet,
      updateWallet,
      deleteWallet,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      createBillSplit,
      updateBillSplitParticipantPayment,
      settleBillSplit,
      deleteBillSplit
    }}>
      {children}
    </AppContext.Provider>
  );
};