import React from 'react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string;
  subValue?: string;
  badge?: {
    text: string;
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  };
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  subValue,
  badge,
  icon,
  highlight = false,
}) => {
  const getBadgeClasses = (variant: string = 'neutral') => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'danger':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      id={id}
      className={`relative rounded-xl border p-4 sm:p-5 transition-all ${
        highlight
          ? 'border-gray-900 bg-gray-50/50 shadow-2xs'
          : 'border-gray-200 bg-white shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-600">
          {label}
        </span>
        {icon && (
          <span className="text-gray-400">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <span className="font-mono-num text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
        {badge && (
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getBadgeClasses(
              badge.variant
            )}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subValue && (
        <p className="mt-1 text-xs text-gray-500 leading-normal">
          {subValue}
        </p>
      )}
    </div>
  );
};
