const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  currentAccountId?: string;
}

export class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_URL;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public logout() {
    localStorage.removeItem('token');
  }

  public async register(name: string, email: string, password: string): Promise<AuthUser> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || 'Failed to register');
    }
    const data = json.data;
    this.setToken(data.token);
    return data.user;
  }

  public async login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || 'Failed to login');
    }
    const data = json.data;
    this.setToken(data.token);
    return data.user;
  }

  public async getProfile(): Promise<AuthUser> {
    const token = this.getToken();
    if (!token) throw new Error('No token');
    const response = await fetch(`${this.apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || 'Failed to fetch profile');
    }
    const data = json.data;
    return { id: data.id, email: data.email, name: data.name, currentAccountId: data.currentAccountId };
  }

  public async updateCurrentAccount(accountId: string): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${this.apiUrl}/auth/account`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ accountId })
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.error || 'Failed to update current account');
    }
  }
} 