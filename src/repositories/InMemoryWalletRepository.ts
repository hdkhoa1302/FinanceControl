import { Wallet, IWalletRepository } from '../types';

export class InMemoryWalletRepository implements IWalletRepository {
  private wallets: Wallet[] = [];
  private nextId = 1;

  async findById(id: string): Promise<Wallet | null> {
    return this.wallets.find(w => w._id === id) || null;
  }

  async findAll(): Promise<Wallet[]> {
    return [...this.wallets];
  }

  async findByAccount(accountId: string): Promise<Wallet[]> {
    return this.wallets.filter(w => w.account === accountId);
  }

  async create(wallet: Omit<Wallet, '_id'>): Promise<Wallet> {
    const newWallet: Wallet = {
      ...wallet,
      _id: `wallet${this.nextId++}`
    };
    
    this.wallets.push(newWallet);
    return newWallet;
  }

  async update(id: string, updates: Partial<Wallet>): Promise<Wallet> {
    const index = this.wallets.findIndex(w => w._id === id);
    if (index === -1) {
      throw new Error('Wallet not found');
    }

    this.wallets[index] = { ...this.wallets[index], ...updates };
    return this.wallets[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.wallets.findIndex(w => w._id === id);
    if (index === -1) {
      throw new Error('Wallet not found');
    }

    this.wallets.splice(index, 1);
  }

  // For testing and initialization
  seed(wallets: Wallet[]): void {
    this.wallets = [...wallets];
    this.nextId = Math.max(...wallets.map(w => parseInt(w._id.replace('wallet', ''))), 0) + 1;
  }
}