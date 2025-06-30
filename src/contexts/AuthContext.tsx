import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser } from '../services/AuthService';

interface AuthContextType {
  user: AuthUser | null;
  updateCurrentAccount: (accountId: string) => Promise<void>;
  authView: 'login' | 'register';
  setAuthView: (view: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const authService = new AuthService();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then(u => setUser(u))
        .catch(() => authService.logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await authService.register(name, email, password);
    setUser(u);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateCurrentAccount = async (accountId: string) => {
    await authService.updateCurrentAccount(accountId);
    setUser(prev => prev ? { ...prev, currentAccountId: accountId } : null);
  };

  return (
    <AuthContext.Provider value={{ user, authView, setAuthView, login, register, logout, updateCurrentAccount }}>
      {children}
    </AuthContext.Provider>
  );
}; 