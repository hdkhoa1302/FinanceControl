import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'from-blue-400 to-blue-600',
    success: 'from-green-400 to-emerald-500',
    warning: 'from-yellow-400 to-orange-500',
    danger: 'from-red-400 to-red-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
          <span className="text-sm text-gray-500">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200/50 rounded-full ${sizeClasses[size]} backdrop-blur-sm`}>
        <div 
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${variantClasses[variant]} transition-all duration-500 shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};