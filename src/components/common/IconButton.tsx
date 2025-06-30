import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  tooltip,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 backdrop-blur-sm border relative overflow-hidden group active:scale-95';
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-2',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-12 h-12 p-3'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 border-transparent',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 border-transparent',
    secondary: 'text-gray-600 hover:text-gray-700 hover:bg-white/50 border-white/30',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50/50 border-transparent',
    success: 'text-green-600 hover:text-green-700 hover:bg-green-50/50 border-transparent'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${className}
      `}
    >
      {loading ? (
        <svg className={`animate-spin ${iconSizeClasses[size]}`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Icon className={iconSizeClasses[size]} />
      )}
    </button>
  );
};