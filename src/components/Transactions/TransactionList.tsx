import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TransactionFormModal from './TransactionFormModal';
import Button from '../common/Button';
import Input from '../common/Input';
import { currencyFormatter, dateFormatter } from '../../utils/formatters';

const TransactionList: React.FC = () => {
  const { transactions, wallets } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWallet = selectedWallet === 'all' || tx.wallet === selectedWallet;
    return matchesType && matchesSearch && matchesWallet;
  });

  const getTransactionIcon = (type: string) => {
    return ['income', 'loan_received'].includes(type) ? TrendingUp : TrendingDown;
  };

  const getTransactionGradient = (type: string) => {
    return ['income', 'loan_received'].includes(type) 
      ? 'from-green-400/20 to-emerald-500/20'
      : 'from-red-400/20 to-rose-500/20';
  };

  const getTransactionLabel = (type: string) => {
    const labels = {
      income: 'Thu',
      expense: 'Chi',
      loan_received: 'Vay',
      loan_given: 'Cho vay'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const typeOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'income', label: 'Thu nhập' },
    { value: 'expense', label: 'Chi tiêu' }
  ];

  return (
    <div className="space-y-4">
      {/* Header Section - Single Clean Background */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Giao dịch
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg">
              {filteredTransactions.length} giao dịch
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                showFilters 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <Button
              onClick={() => setShowForm(true)}
              icon={Plus}
              size="lg"
            >
              Thêm giao dịch
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - Distinct Background */}
      <div className="bg-blue-50/60 backdrop-blur-xl rounded-2xl p-4 shadow-md border border-blue-200/30">
        <div className="space-y-3">
          {/* Search Bar */}
          <Input
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            size="sm"
            className="bg-white/90"
          />

          {/* Filters - Collapsible */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200/40">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="px-3 py-2 border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
              >
                <option value="all">Tất cả ví</option>
                {wallets.map(wallet => (
                  <option key={wallet._id} value={wallet._id}>{wallet.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Transaction List Section - Clean Single Background */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50/40 rounded-2xl border border-gray-200/30">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100/60 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Không có giao dịch</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-base sm:text-lg">Chưa có giao dịch nào phù hợp</p>
          <Button onClick={() => setShowForm(true)} size="lg">
            Thêm giao dịch đầu tiên
          </Button>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {/* List Header - Clean Design */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 px-4 py-3 border-b border-gray-200/50">
            <h3 className="font-bold text-gray-700 text-sm">
              Danh sách giao dịch ({filteredTransactions.length})
            </h3>
          </div>

          {/* Transaction Items - Simplified Layout */}
          <div className="divide-y divide-gray-100/60">
            {filteredTransactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.type);
              const gradient = getTransactionGradient(transaction.type);
              
              return (
                <div 
                  key={transaction._id} 
                  className={`flex items-center justify-between p-3 sm:p-4 transition-all duration-300 hover:bg-blue-50/30 group ${
                    index % 2 === 0 ? 'bg-white/60' : 'bg-gray-50/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Icon - Single Background */}
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    
                    {/* Content - Clean Layout */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {transaction.description}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                          ['income', 'loan_received'].includes(transaction.type)
                            ? 'bg-green-100/80 text-green-700 border border-green-200/50'
                            : 'bg-red-100/80 text-red-700 border border-red-200/50'
                        }`}>
                          {getTransactionLabel(transaction.type)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                        <span className="truncate font-medium">{transaction.category}</span>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span>{dateFormatter.formatDate(transaction.date)}</span>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className="truncate">{transaction.walletName}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount - Clean Background */}
                  <div className="text-right flex-shrink-0 ml-3 bg-white/80 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200/40">
                    <p className={`font-bold text-sm sm:text-base ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : '-'}{currencyFormatter.formatAbsolute(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dateFormatter.formatTime(transaction.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TransactionFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default TransactionList;