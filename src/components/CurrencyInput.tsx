import React from 'react';

interface CurrencyInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  helperText?: string;
  unit?: string;
  isCurrency?: boolean;
  slider?: boolean;
  warningIfAbove?: number;
  warningMessage?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  step = 50000,
  min = 0,
  max,
  helperText,
  unit = 'TZS',
  isCurrency = true,
  slider = false,
  warningIfAbove,
  warningMessage,
}) => {
  const isOverWarning = warningIfAbove !== undefined && value > warningIfAbove;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, '');
    const num = parseFloat(raw);
    onChange(isNaN(num) ? 0 : num);
  };

  const handleStep = (delta: number) => {
    const next = Math.max(min, value + delta);
    if (max !== undefined && next > max) {
      onChange(max);
    } else {
      onChange(next);
    }
  };

  return (
    <div className="flex flex-col gap-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-stone-600 dark:text-stone-400">
          {label}
        </label>
        {isOverWarning && warningMessage && (
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            ⚠️ {warningMessage}
          </span>
        )}
      </div>

      <div className="relative flex items-center rounded-lg border border-stone-200 bg-white/80 dark:border-stone-800 dark:bg-stone-900/80 shadow-xs focus-within:border-stone-900 dark:focus-within:border-stone-300 transition-colors">
        {isCurrency && (
          <span className="pl-3 text-xs font-semibold text-stone-400 dark:text-stone-500 select-none">
            {unit}
          </span>
        )}
        <input
          type="text"
          value={isCurrency ? Math.round(value).toLocaleString('en-US') : value}
          onChange={handleTextChange}
          className={`w-full bg-transparent py-2.5 px-3 font-mono-num text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden ${
            isOverWarning ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        />
        <div className="flex items-center pr-1.5 gap-1">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 text-xs font-semibold select-none cursor-pointer active:scale-95 transition-all"
            title={`Decrease by ${isCurrency ? `${step.toLocaleString()} TZS` : step}`}
          >
            -
          </button>
          <button
            type="button"
            onClick={() => handleStep(step)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 text-xs font-semibold select-none cursor-pointer active:scale-95 transition-all"
            title={`Increase by ${isCurrency ? `${step.toLocaleString()} TZS` : step}`}
          >
            +
          </button>
        </div>
      </div>

      {slider && max !== undefined && (
        <div className="pt-1 flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 dark:bg-stone-800 accent-[#2D4A3E] dark:accent-[#5C8770]"
          />
        </div>
      )}

      {helperText && (
        <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
          {helperText}
        </span>
      )}
    </div>
  );
};
