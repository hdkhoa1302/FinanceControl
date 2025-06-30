import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  size = 'sm',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium backdrop-blur-sm border';
  
  const sizeClasses = {
    sm: 'text-xs px-2 sm:px-3 py-1',
    md: 'text-sm px-3 sm:px-4 py-1.5'
  };

  const statusClasses = {
    success: 'bg-green-100/80 text-green-700 border-green-200/50',
    warning: 'bg-yellow-100/80 text-yellow-700 border-yellow-200/50',
    error: 'bg-red-100/80 text-red-700 border-red-200/50',
    info: 'bg-blue-100/80 text-blue-700 border-blue-200/50',
    neutral: 'bg-gray-100/80 text-gray-700 border-gray-200/50'
  };

  return (
    <span className={`
      ${baseClasses}
      ${sizeClasses[size]}
      ${statusClasses[status]}
      ${className}
    `}>
      {children}
    </span>
  );
};