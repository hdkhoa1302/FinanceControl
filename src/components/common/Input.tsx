import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const inputClasses = `
    w-full border rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 backdrop-blur-sm
    ${error 
      ? 'border-red-300/50 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' 
      : 'border-white/30 focus:border-blue-500 focus:ring-blue-500/20 bg-white/70'
    }
    ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${sizeClasses[size]}
    ${props.disabled ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed' : 'hover:bg-white/80'}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`${iconSizeClasses[size]} text-gray-400`} />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Icon className={`${iconSizeClasses[size]} text-gray-400`} />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 bg-red-50/50 px-3 py-1 rounded-xl backdrop-blur-sm border border-red-200/50">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 bg-gray-50/50 px-3 py-1 rounded-xl backdrop-blur-sm border border-gray-200/50">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;