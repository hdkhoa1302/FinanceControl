import { WalletEntity } from '../../domain/entities/WalletEntity';
import { WalletRepository } from '../../domain/repositories/Repository';
import { CreateWalletRequest } from '../../types/application';

export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async createWallet(request: CreateWalletRequest): Promise<WalletEntity> {
    this.validateCreateRequest(request);

    const wallet = WalletEntity.create({
      accountId: request.accountId,
      name: request.name,
      type: request.type as any,
      balance: request.balance,
      currency: request.currency as any,
      bankInfo: request.bankInfo,
      color: request.color
    });

    return this.walletRepository.save(wallet);
  }

  async getWalletsByAccount(accountId: string): Promise<readonly WalletEntity[]> {
    return this.walletRepository.findByAccountId(accountId);
  }

  async getWalletById(id: string): Promise<WalletEntity | null> {
    return this.walletRepository.findById(id);
  }

  async updateWallet(id: string, updates: Partial<{ name: string; color: string; bankInfo: string }>): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    let updatedWallet = wallet;

    if (updates.name) {
      updatedWallet = updatedWallet.updateName(updates.name);
    }

    return this.walletRepository.save(updatedWallet);
  }

  async deleteWallet(id: string): Promise<void> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (!wallet.canDelete()) {
      throw new Error('Cannot delete wallet with non-zero balance');
    }

    await this.walletRepository.delete(id);
  }

  async updateBalance(id: string, amount: number): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const updatedWallet = wallet.updateBalance(amount);
    return this.walletRepository.save(updatedWallet);
  }

  async getTotalBalance(accountId: string): Promise<number> {
    return this.walletRepository.getTotalBalance(accountId);
  }

  private validateCreateRequest(request: CreateWalletRequest): void {
    if (!request.name?.trim()) {
      throw new Error('Wallet name is required');
    }

    if (!request.accountId) {
      throw new Error('Account ID is required');
    }

    if (!['cash', 'bank', 'e-wallet'].includes(request.type)) {
      throw new Error('Invalid wallet type');
    }

    if (request.balance < 0) {
      throw new Error('Balance cannot be negative');
    }
  }
}