import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../../contexts/AppContext';

const TrendChart: React.FC = () => {
  const { transactions } = useApp();

  // Generate trend data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const trendData = last7Days.map(date => {
    const dayTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.toDateString() === date.toDateString();
    });

    const income = dayTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const expense = dayTransactions
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return {
      date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      income: income / 1000,
      expense: expense / 1000,
      net: (income - expense) / 1000
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/30">
          <p className="font-bold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat('vi-VN').format(entry.value * 1000)}đ
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-6 border-b border-gray-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Xu hướng 7 ngày
          </h3>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Thu nhập</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Chi tiêu</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Ròng</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="p-6">
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
                name="Thu nhập"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={2}
                name="Chi tiêu"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
                name="Ròng"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;