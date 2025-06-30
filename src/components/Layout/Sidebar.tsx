import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  HandHeart, 
  PieChart, 
  Settings, 
  X,
  Users,
  Split
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan', color: 'from-blue-500 to-blue-600' },
  { id: 'accounts', icon: Users, label: 'Tài khoản', color: 'from-green-500 to-emerald-600' },
  { id: 'wallets', icon: Wallet, label: 'Ví tiền', color: 'from-purple-500 to-violet-600' },
  { id: 'transactions', icon: Receipt, label: 'Giao dịch', color: 'from-orange-500 to-amber-600' },
  { id: 'bill-splits', icon: Split, label: 'Chia hóa đơn', color: 'from-pink-500 to-rose-600' },
  { id: 'loans', icon: HandHeart, label: 'Cho vay/Đi vay', color: 'from-red-500 to-red-600' },
  { id: 'budgets', icon: PieChart, label: 'Ngân sách', color: 'from-indigo-500 to-purple-600' },
  { id: 'settings', icon: Settings, label: 'Cài đặt', color: 'from-gray-500 to-gray-600' },
];

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, switchAccount } = useApp();
  const { accounts, loading, error } = useAccounts();
  const { updateCurrentAccount } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 sm:w-72 bg-white/70 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-out border-r border-white/30
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-white/20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">QT</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-sm sm:text-base">
                QuanLyTaiChinh
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 sm:p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg border border-blue-200/50 backdrop-blur-sm' 
                      : 'text-gray-700 hover:bg-white/50 hover:shadow-md hover:scale-[1.02]'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'bg-gray-100/50 group-hover:bg-white/80'
                    }
                  `}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Danh sách tài khoản */}
          <div className="px-4 sm:px-6 mt-4">
            <h3 className="text-sm font-semibold mb-2">Tài khoản</h3>
            {loading && <p className="text-sm text-gray-500">Đang tải...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && !error && accounts.map(acc => (
              <button
                key={acc._id}
                onClick={async () => {
                  await updateCurrentAccount(acc._id);
                  switchAccount(acc._id);
                  setSidebarOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 mb-1 text-sm flex justify-between items-center"
              >
                <span>{acc.name}</span>
              </button>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-4 sm:p-6">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl sm:rounded-3xl border border-blue-100/50 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quản lý tài chính
                </p>
                <p className="text-xs text-gray-600 mt-1">Thông minh & Hiệu quả</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;