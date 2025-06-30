import React, { useState } from 'react';
import { Plus, Receipt, Wallet, Users, TrendingUp, Split } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentView } = useApp();

  const actions = [
    { 
      icon: Receipt, 
      label: 'Thêm giao dịch', 
      gradient: 'from-blue-500 to-blue-600',
      action: () => setCurrentView('transactions')
    },
    { 
      icon: Wallet, 
      label: 'Thêm ví', 
      gradient: 'from-green-500 to-emerald-600',
      action: () => setCurrentView('wallets')
    },
    { 
      icon: Split, 
      label: 'Chia hóa đơn', 
      gradient: 'from-pink-500 to-rose-600',
      action: () => setCurrentView('bill-splits')
    },
    { 
      icon: TrendingUp, 
      label: 'Lập ngân sách', 
      gradient: 'from-purple-500 to-violet-600',
      action: () => setCurrentView('budgets')
    },
    { 
      icon: Users, 
      label: 'Mời thành viên', 
      gradient: 'from-orange-500 to-amber-600',
      action: () => setCurrentView('accounts')
    }
  ];

  return (
    <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-40">
      {/* Action buttons */}
      <div className={`space-y-3 sm:space-y-4 mb-4 sm:mb-6 transition-all duration-500 ease-out ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              className="flex items-center space-x-3 sm:space-x-4 transform transition-all duration-300 hover:scale-105"
              style={{ 
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="bg-white/80 backdrop-blur-xl text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap border border-white/30">
                {action.label}
              </div>
              <button
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r ${action.gradient} text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-3xl backdrop-blur-sm border border-white/20`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-3xl backdrop-blur-sm border border-white/20 ${
          isOpen ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
        }`}
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </button>
    </div>
  );
};

export default FloatingActionButton;