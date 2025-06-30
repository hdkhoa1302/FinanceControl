import React from 'react';

interface FilterOption {
  key: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  className = ''
}) => {
  return (
    <div className={`bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 ${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
              activeFilter === filter.key
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-200/50 backdrop-blur-sm'
                : 'text-gray-600 hover:bg-white/50 border border-transparent'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};