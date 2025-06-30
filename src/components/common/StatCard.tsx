import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconColor,
  trend
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white backdrop-blur-xl shadow-2xl border border-white/20 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-blue-100 font-medium text-sm sm:text-base">{title}</span>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-blue-100 text-xs sm:text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${trend.isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs sm:text-sm text-blue-200">{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};