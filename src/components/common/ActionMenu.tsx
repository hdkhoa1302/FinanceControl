import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, DivideIcon as LucideIcon } from 'lucide-react';
import Button from './Button';

interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={MoreVertical}
        className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 rounded-xl sm:rounded-2xl"
      />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-2 z-50">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                  item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50/50'
                    : 'text-gray-700 hover:bg-gray-50/50'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};