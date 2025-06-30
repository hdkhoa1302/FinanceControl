import { Wallet, WalletType, Currency } from '../../types/domain';

export class WalletEntity {
  constructor(private readonly data: Wallet) {
    this.validate();
  }

  static create(params: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): WalletEntity {
    const now = new Date();
    return new WalletEntity({
      ...params,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    });
  }

  // Getters
  get id(): string { return this.data.id; }
  get accountId(): string { return this.data.accountId; }
  get name(): string { return this.data.name; }
  get type(): WalletType { return this.data.type; }
  get balance(): number { return this.data.balance; }
  get currency(): Currency { return this.data.currency; }
  get bankInfo(): string | undefined { return this.data.bankInfo; }
  get color(): string { return this.data.color; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date { return this.data.updatedAt; }

  // Business Logic
  updateBalance(amount: number): WalletEntity {
    const newBalance = this.data.balance + amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }

    return new WalletEntity({
      ...this.data,
      balance: newBalance,
      updatedAt: new Date()
    });
  }

  updateName(newName: string): WalletEntity {
    if (!newName.trim()) {
      throw new Error('Wallet name cannot be empty');
    }

    return new WalletEntity({
      ...this.data,
      name: newName.trim(),
      updatedAt: new Date()
    });
  }

  canDelete(): boolean {
    return this.data.balance === 0;
  }

  private validate(): void {
    if (!this.data.name.trim()) {
      throw new Error('Wallet name is required');
    }

    if (this.data.balance < 0) {
      throw new Error('Balance cannot be negative');
    }

    if (this.data.type === 'bank' && !this.data.bankInfo) {
      throw new Error('Bank info is required for bank wallets');
    }
  }

  private static generateId(): string {
    return `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toData(): Wallet {
    return { ...this.data };
  }
}