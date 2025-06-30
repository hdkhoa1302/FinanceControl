import { WalletRepository } from '../../domain/repositories/Repository';
import { WalletEntity } from '../../domain/entities/WalletEntity';

export class InMemoryWalletRepository implements WalletRepository {
  private wallets = new Map<string, WalletEntity>();

  async findById(id: string): Promise<WalletEntity | null> {
    return this.wallets.get(id) || null;
  }

  async findAll(): Promise<readonly WalletEntity[]> {
    return Array.from(this.wallets.values());
  }

  async findByAccountId(accountId: string): Promise<readonly WalletEntity[]> {
    return Array.from(this.wallets.values())
      .filter(wallet => wallet.accountId === accountId);
  }

  async save(wallet: WalletEntity): Promise<WalletEntity> {
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  async delete(id: string): Promise<void> {
    this.wallets.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.wallets.has(id);
  }

  async getTotalBalance(accountId: string): Promise<number> {
    const wallets = await this.findByAccountId(accountId);
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  }

  // For testing and seeding
  seed(wallets: WalletEntity[]): void {
    this.wallets.clear();
    wallets.forEach(wallet => this.wallets.set(wallet.id, wallet));
  }

  clear(): void {
    this.wallets.clear();
  }
}