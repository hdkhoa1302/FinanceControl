import React from 'react';
import { Menu, Bell, User as UserIcon, ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { setSidebarOpen } = useApp();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm">QT</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                QuanLyTaiChinh
              </h1>
              <p className="text-xs text-gray-500/80 hidden md:block">Quản lý tài chính thông minh</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Account switcher removed until accounts feature is implemented */}

          <button className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white/50 transition-all duration-200 backdrop-blur-sm relative border border-white/20">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-lg"></span>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-white/30">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-200/80 to-gray-300/80 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;