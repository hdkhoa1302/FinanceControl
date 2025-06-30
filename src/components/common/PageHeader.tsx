import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Button from './Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  children
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 mt-2 text-base sm:text-lg">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {children}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            icon={actionIcon}
            size="lg"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};