import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  rounded = 'lg'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 backdrop-blur-xl border relative overflow-hidden group active:scale-95 select-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600/90 hover:to-purple-700/90 text-white focus:ring-blue-500/30 disabled:from-blue-300/50 disabled:to-purple-300/50 border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white/70 hover:bg-white/90 text-gray-900 focus:ring-gray-500/30 disabled:bg-white/40 disabled:text-gray-400 border-white/30 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-red-500/90 to-rose-600/90 hover:from-red-600/90 hover:to-rose-700/90 text-white focus:ring-red-500/30 disabled:from-red-300/50 disabled:to-rose-300/50 border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    success: 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-600/90 hover:to-emerald-700/90 text-white focus:ring-green-500/30 disabled:from-green-300/50 disabled:to-emerald-300/50 border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    warning: 'bg-gradient-to-r from-yellow-500/90 to-orange-600/90 hover:from-yellow-600/90 hover:to-orange-700/90 text-white focus:ring-yellow-500/30 disabled:from-yellow-300/50 disabled:to-orange-300/50 border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    info: 'bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-600/90 hover:to-blue-700/90 text-white focus:ring-cyan-500/30 disabled:from-cyan-300/50 disabled:to-blue-300/50 border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-white/50 text-gray-700 focus:ring-gray-500/30 disabled:text-gray-400 border-transparent hover:border-white/30 hover:backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]'
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const isDisabled = disabled || loading;
  const hasGradient = ['primary', 'danger', 'success', 'warning', 'info'].includes(variant);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'cursor-not-allowed opacity-60 transform-none hover:scale-100 active:scale-100' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Shimmer effect for gradient variants */}
      {hasGradient && !isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      )}
      
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center">
        {loading && (
          <svg className={`animate-spin ${iconSizeClasses[size]} ${children || Icon ? 'mr-2' : ''}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {Icon && !loading && iconPosition === 'left' && (
          <Icon className={`${iconSizeClasses[size]} transition-transform duration-200 group-hover:scale-110 ${children ? '' : ''}`} />
        )}
        
        {children && (
          <span className="font-medium whitespace-nowrap">{children}</span>
        )}
        
        {Icon && !loading && iconPosition === 'right' && (
          <Icon className={`${iconSizeClasses[size]} transition-transform duration-200 group-hover:scale-110`} />
        )}
      </div>
    </button>
  );
};

export default Button;