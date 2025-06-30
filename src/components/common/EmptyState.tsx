import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 sm:py-16 ${className}`}>
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100/80 to-gray-200/80 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-gray-200/50">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
      <p className="text-gray-500 mb-4 sm:mb-6 text-base sm:text-lg">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};