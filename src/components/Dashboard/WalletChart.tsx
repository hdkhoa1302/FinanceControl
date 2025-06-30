import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useApp } from '../../contexts/AppContext';

const WalletChart: React.FC = () => {
  const { wallets } = useApp();

  const data = wallets.map(wallet => ({
    name: wallet.name,
    value: wallet.balance,
    color: wallet.color || '#3B82F6',
    type: wallet.type
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/30">
          <p className="font-bold text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600 capitalize">{data.payload.type}</p>
          <p className="text-sm font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Phân bổ tài sản
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-200/50">
            {wallets.length} ví
          </span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="p-6">
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Wallet Details */}
        <div className="mt-6 space-y-3 bg-gray-50/40 rounded-xl p-4 border border-gray-200/30">
          {data.map((wallet, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-gray-200/40">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: wallet.color }}
                ></div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{wallet.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{wallet.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(wallet.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletChart;