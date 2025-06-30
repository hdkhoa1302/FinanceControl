import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../common/StatCard';

const BalanceOverview: React.FC = () => {
  const { wallets, transactions } = useApp();
  const [showBalance, setShowBalance] = React.useState(true);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const monthlyExpense = monthlyTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const formatCurrency = (amount: number) => {
    if (!showBalance) return '••••••••';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-blue-500/90 to-purple-600/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white backdrop-blur-xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-blue-100 font-medium text-sm sm:text-base">Tổng số dư</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              {showBalance ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-blue-100 text-xs sm:text-sm">{wallets.length} ví đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Monthly Income */}
      <StatCard
        title="Thu nhập tháng này"
        value={formatCurrency(monthlyIncome)}
        subtitle="+12.5% so với tháng trước"
        icon={TrendingUp}
        gradient="from-green-500/90 to-green-600/90"
        iconColor="text-green-600"
        trend={{ value: "+12.5% so với tháng trước", isPositive: true }}
      />

      {/* Monthly Expense */}
      <StatCard
        title="Chi tiêu tháng này"
        value={formatCurrency(monthlyExpense)}
        subtitle="-8.3% so với tháng trước"
        icon={TrendingDown}
        gradient="from-red-500/90 to-red-600/90"
        iconColor="text-red-600"
        trend={{ value: "-8.3% so với tháng trước", isPositive: true }}
      />

      {/* Savings Rate */}
      <StatCard
        title="Tỷ lệ tiết kiệm"
        value={`${savingsRate}%`}
        subtitle="Mục tiêu: 20%"
        icon={TrendingUp}
        gradient="from-purple-500/90 to-purple-600/90"
        iconColor="text-purple-600"
      />
    </div>
  );
};

export default BalanceOverview;