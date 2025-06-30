import React, { createContext, ReactNode } from 'react';
import { ITransactionService, IWalletService, IBillSplitService } from '../types';
import { TransactionService } from '../services/TransactionService';
import { WalletService } from '../services/WalletService';
import { BillSplitService } from '../services/BillSplitService';
import { InMemoryTransactionRepository } from '../repositories/InMemoryTransactionRepository';
import { InMemoryWalletRepository } from '../repositories/InMemoryWalletRepository';
import { InMemoryBillSplitRepository } from '../repositories/InMemoryBillSplitRepository';
import { EventBus } from '../utils/EventBus';

interface ServicesContextType {
  transactionService: ITransactionService;
  walletService: IWalletService;
  billSplitService: IBillSplitService;
  eventBus: EventBus;
}

export const ServicesContext = createContext<ServicesContextType | null>(null);

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children }) => {
  // Create singleton instances
  const eventBus = new EventBus();
  const transactionRepository = new InMemoryTransactionRepository();
  const walletRepository = new InMemoryWalletRepository();
  const billSplitRepository = new InMemoryBillSplitRepository();
  
  const transactionService = new TransactionService(transactionRepository, eventBus);
  const walletService = new WalletService(walletRepository, eventBus);
  const billSplitService = new BillSplitService(billSplitRepository, eventBus);

  // Set up event handlers for business logic
  React.useEffect(() => {
    // When a transaction is created, update wallet balance
    const unsubscribeTransactionCreated = eventBus.subscribe('TRANSACTION_CREATED', (event) => {
      const transaction = event.payload;
      walletService.updateBalance(transaction.wallet, transaction.amount);
    });

    // When a transaction is deleted, reverse wallet balance
    const unsubscribeTransactionDeleted = eventBus.subscribe('TRANSACTION_DELETED', (event) => {
      const { transaction } = event.payload;
      walletService.updateBalance(transaction.wallet, -transaction.amount);
    });

    return () => {
      unsubscribeTransactionCreated();
      unsubscribeTransactionDeleted();
    };
  }, [eventBus, walletService]);

  const value: ServicesContextType = {
    transactionService,
    walletService,
    billSplitService,
    eventBus
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};