const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiAccount {
  id: string;
  name: string;
  type: 'personal' | 'family';
  ownerId: string;
  members: Array<{
    userId: string;
    role: 'admin' | 'member' | 'viewer';
    name: string;
    joinedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  _id: string;
  name: string;
  type: 'personal' | 'family';
  owner: string;
  members: Array<{
    user: string;
    role: 'admin' | 'member' | 'viewer';
    name: string;
    joinedAt: string;
  }>;
  createdAt: string;
}

export class AccountService {
  private baseUrl = `${API_URL}/accounts`;

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  public async getAccounts(): Promise<Account[]> {
    const token = this.getToken();
    const res = await fetch(this.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to fetch accounts');
    }
    // Chuyển đổi ApiAccount -> Account
    const accounts: Account[] = json.data.map((acc: ApiAccount) => ({
      _id: acc.id,
      name: acc.name,
      type: acc.type,
      owner: acc.ownerId,
      members: acc.members.map(m => ({
        user: m.userId,
        role: m.role,
        name: m.name,
        joinedAt: m.joinedAt
      })),
      createdAt: acc.createdAt
    }));
    return accounts;
  }

  public async createAccount(name: string, type: 'personal' | 'family'): Promise<Account> {
    const token = this.getToken();
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name, type })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to create account');
    }
    const acc: ApiAccount = json.data;
    return {
      _id: acc.id,
      name: acc.name,
      type: acc.type,
      owner: acc.ownerId,
      members: acc.members.map(m => ({ user: m.userId, role: m.role, name: m.name, joinedAt: m.joinedAt })),
      createdAt: acc.createdAt
    };
  }
} 