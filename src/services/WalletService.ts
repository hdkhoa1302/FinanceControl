import { Wallet, IWalletService } from '../types';
import { IWalletRepository } from '../types';
import { EventBus } from '../utils/EventBus';

export class WalletService implements IWalletService {
  constructor(
    private walletRepository: IWalletRepository,
    private eventBus: EventBus
  ) {}

  async createWallet(wallet: Omit<Wallet, '_id'>): Promise<Wallet> {
    this.validateWallet(wallet);
    
    const newWallet = await this.walletRepository.create({
      ...wallet,
      currency: wallet.currency || 'VND',
      balance: wallet.balance || 0
    });

    this.eventBus.emit({
      type: 'WALLET_CREATED',
      payload: newWallet,
      timestamp: new Date()
    });

    return newWallet;
  }

  async getWallets(accountId: string): Promise<Wallet[]> {
    return this.walletRepository.findByAccount(accountId);
  }

  async updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findById(id);
    if (!existingWallet) {
      throw new Error('Wallet not found');
    }

    if (updates.name) {
      this.validateWalletName(updates.name);
    }

    return this.walletRepository.update(id, updates);
  }

  async deleteWallet(id: string): Promise<void> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balance !== 0) {
      throw new Error('Cannot delete wallet with non-zero balance');
    }

    await this.walletRepository.delete(id);

    this.eventBus.emit({
      type: 'WALLET_DELETED',
      payload: { walletId: id },
      timestamp: new Date()
    });
  }

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const oldBalance = wallet.balance;
    const newBalance = oldBalance + amount;

    const updatedWallet = await this.walletRepository.update(id, { balance: newBalance });

    this.eventBus.emit({
      type: 'WALLET_BALANCE_UPDATED',
      payload: { walletId: id, oldBalance, newBalance },
      timestamp: new Date()
    });

    return updatedWallet;
  }

  private validateWallet(wallet: Omit<Wallet, '_id'>): void {
    this.validateWalletName(wallet.name);
    
    if (!wallet.account) {
      throw new Error('Account is required');
    }
    
    if (!['cash', 'bank', 'e-wallet'].includes(wallet.type)) {
      throw new Error('Invalid wallet type');
    }
  }

  private validateWalletName(name: string): void {
    if (!name?.trim()) {
      throw new Error('Wallet name is required');
    }
    
    if (name.trim().length < 2) {
      throw new Error('Wallet name must be at least 2 characters');
    }
  }
}