const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiWallet {
  id: string;
  accountId: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet';
  balance: number;
  currency: 'VND' | 'USD' | 'EUR';
  bankInfo?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  _id: string;
  accountId: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet';
  balance: number;
  currency: 'VND' | 'USD' | 'EUR';
  bankInfo?: string;
  color: string;
}

export class WalletApiService {
  private baseUrl = `${API_URL}/wallets`;

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  public async getWallets(accountId: string): Promise<Wallet[]> {
    const token = this.getToken();
    const url = `${this.baseUrl}?accountId=${accountId}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to fetch wallets');
    }
    return (json.data as ApiWallet[]).map(w => ({
      _id: w.id,
      accountId: w.accountId,
      name: w.name,
      type: w.type,
      balance: w.balance,
      currency: w.currency,
      bankInfo: w.bankInfo,
      color: w.color
    }));
  }

  public async createWallet(data: Omit<ApiWallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wallet> {
    const token = this.getToken();
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to create wallet');
    }
    const w = json.data as ApiWallet;
    return {
      _id: w.id,
      accountId: w.accountId,
      name: w.name,
      type: w.type,
      balance: w.balance,
      currency: w.currency,
      bankInfo: w.bankInfo,
      color: w.color
    };
  }

  public async updateWallet(id: string, updates: Partial<ApiWallet>): Promise<Wallet> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update wallet');
    }
    const w = json.data as ApiWallet;
    return {
      _id: w.id,
      accountId: w.accountId,
      name: w.name,
      type: w.type,
      balance: w.balance,
      currency: w.currency,
      bankInfo: w.bankInfo,
      color: w.color
    };
  }

  public async deleteWallet(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || 'Failed to delete wallet');
    }
  }
} 