import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false
}) => {
  const baseClasses = 'rounded-2xl sm:rounded-3xl shadow-xl border transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/70 backdrop-blur-xl border-white/30',
    gradient: 'bg-gradient-to-br backdrop-blur-xl border-white/20',
    glass: 'bg-white/50 backdrop-blur-xl border-white/20'
  };

  const paddingClasses = {
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10'
  };

  const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-[1.02]' : '';

  return (
    <div className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};