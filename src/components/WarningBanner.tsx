import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface WarningBannerProps {
  id?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  id,
  type = 'warning',
  title,
  message,
  actionText,
  onAction,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          container: 'border-rose-300 bg-rose-50/90 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200',
          icon: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
          btn: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          container: 'border-amber-300 bg-amber-50/90 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
          btn: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'success':
        return {
          container: 'border-emerald-300 bg-emerald-50/90 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200',
          icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
          btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        };
      case 'info':
      default:
        return {
          container: 'border-stone-300 bg-stone-100/90 text-stone-900 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-200',
          icon: <Info className="h-5 w-5 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />,
          btn: 'bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-700 dark:hover:bg-stone-600',
        };
    }
  };

  const style = getStyles();

  return (
    <div
      id={id}
      className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-4 shadow-2xs ${style.container}`}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
          <p className="mt-0.5 text-xs opacity-90 leading-relaxed font-serif-body sm:text-[13px]">{message}</p>
        </div>
      </div>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${style.btn}`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
