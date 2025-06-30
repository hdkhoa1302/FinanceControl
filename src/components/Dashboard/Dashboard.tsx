import React from 'react';
import BalanceOverview from './BalanceOverview';
import WalletChart from './WalletChart';
import TrendChart from './TrendChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Tổng quan tài chính
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Hôm nay, {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <BalanceOverview />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <WalletChart />
        <TrendChart />
      </div>
    </div>
  );
};

export default Dashboard;