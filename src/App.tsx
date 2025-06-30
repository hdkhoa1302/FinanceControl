import React from 'react';
import { ServicesProvider } from './contexts/ServicesContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import Dashboard from './components/Dashboard/Dashboard';
import WalletList from './components/Wallets/WalletList';
import TransactionList from './components/Transactions/TransactionList';
import BillSplitList from './components/BillSplit/BillSplitList';
import AccountList from './components/Accounts/AccountList';
import LoanList from './components/Loans/LoanList';
import BudgetList from './components/Budgets/BudgetList';
import SettingsPage from './components/Settings/SettingsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallets':
        return <WalletList />;
      case 'transactions':
        return <TransactionList />;
      case 'bill-splits':
        return <BillSplitList />;
      case 'accounts':
        return <AccountList />;
      case 'loans':
        return <LoanList />;
      case 'budgets':
        return <BudgetList />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
};

function App() {
  const { user, authView } = useAuth();
  if (!user) {
    return authView === 'register' ? <RegisterForm /> : <LoginForm />;
  }
  return (
    <ServicesProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ServicesProvider>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);