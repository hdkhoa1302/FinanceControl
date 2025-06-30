// Dependency Injection Container
import { WalletService } from '../../application/services/WalletService';
import { TransactionService } from '../../application/services/TransactionService';
import { BillSplitService } from '../../application/services/BillSplitService';
import { LoanService } from '../../application/services/LoanService';

import { InMemoryWalletRepository } from '../repositories/InMemoryWalletRepository';
import { InMemoryTransactionRepository } from '../repositories/InMemoryTransactionRepository';
import { InMemoryBillSplitRepository } from '../repositories/InMemoryBillSplitRepository';
import { InMemoryLoanRepository } from '../repositories/InMemoryLoanRepository';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private services = new Map<string, any>();

  private constructor() {
    this.registerServices();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service;
  }

  private registerServices(): void {
    // Repositories
    const walletRepository = new InMemoryWalletRepository();
    const transactionRepository = new InMemoryTransactionRepository();
    const billSplitRepository = new InMemoryBillSplitRepository();
    const loanRepository = new InMemoryLoanRepository();

    this.services.set('WalletRepository', walletRepository);
    this.services.set('TransactionRepository', transactionRepository);
    this.services.set('BillSplitRepository', billSplitRepository);
    this.services.set('LoanRepository', loanRepository);

    // Services
    this.services.set('WalletService', new WalletService(walletRepository));
    this.services.set('TransactionService', new TransactionService(transactionRepository, walletRepository));
    this.services.set('BillSplitService', new BillSplitService(billSplitRepository));
    this.services.set('LoanService', new LoanService(loanRepository));
  }
}