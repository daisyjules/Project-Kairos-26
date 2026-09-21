import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Pencil, Check } from 'lucide-react';
import { formatTZS, formatPercent } from '../utils/formatters';

interface EditableNumberInputProps {
  id?: string;
  value: number;
  onSave: (newValue: number) => void;
  formatType?: 'currency' | 'percent' | 'integer' | 'decimal';
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  suffix?: string;
  className?: string;
  badgeSize?: 'sm' | 'md' | 'lg';
}

export const EditableNumberInput: React.FC<EditableNumberInputProps> = ({
  id,
  value,
  onSave,
  formatType = 'currency',
  step = 100000,
  min = 0,
  max = 100000000,
  label,
  suffix = '',
  className = '',
  badgeSize = 'md',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputVal(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const parsed = parseFloat(inputVal.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onSave(clamped);
    } else {
      setInputVal(String(value));
    }
    setIsEditing(false);
  };

  const handleStep = (direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const delta = direction === 'up' ? step : -step;
    const nextVal = Math.max(min, Math.min(max, value + delta));
    onSave(nextVal);
  };

  const renderFormatted = () => {
    if (formatType === 'currency') return formatTZS(value);
    if (formatType === 'percent') return formatPercent(value, 1);
    if (formatType === 'integer') return `${Math.round(value).toLocaleString()}${suffix ? ` ${suffix}` : ''}`;
    return `${value.toLocaleString()}${suffix ? ` ${suffix}` : ''}`;
  };

  if (isEditing) {
    return (
      <div id={id} className="inline-flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-900 shadow-sm">
        <input
          ref={inputRef}
          type="number"
          step={step}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="w-28 font-mono-num text-sm font-bold bg-transparent text-gray-900 px-1 text-right focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSave}
          className="p-1 rounded bg-gray-900 text-white hover:bg-black transition-colors"
          title="Apply"
        >
          <Check className="h-3 w-3" />
        </button>
      </div>
    );
  }

  const textClasses =
    badgeSize === 'lg'
      ? 'text-2xl sm:text-3xl font-bold font-mono-num'
      : badgeSize === 'sm'
      ? 'text-xs font-semibold font-mono-num'
      : 'text-sm sm:text-base font-bold font-mono-num';

  return (
    <div
      id={id}
      className={`group/num inline-flex items-center gap-1 rounded-md hover:bg-gray-100/80 px-1 py-0.5 transition-colors cursor-pointer ${className}`}
      onClick={() => setIsEditing(true)}
      title="Click to edit number, or use +/- buttons"
    >
      {label && <span className="text-[11px] font-medium text-gray-500 mr-1">{label}:</span>}
      <span className={textClasses}>
        {renderFormatted()}
      </span>
      
      {/* Quick Stepper Controls */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover/num:opacity-100 transition-opacity ml-1 bg-gray-100 rounded p-0.5 border border-gray-200">
        <button
          type="button"
          onClick={(e) => handleStep('down', e)}
          className="p-0.5 rounded hover:bg-gray-200 text-gray-600"
          title={`Decrease by ${step.toLocaleString()}`}
        >
          <Minus className="h-2.5 w-2.5" />
        </button>
        <button
          type="button"
          onClick={(e) => handleStep('up', e)}
          className="p-0.5 rounded hover:bg-gray-200 text-gray-600"
          title={`Increase by ${step.toLocaleString()}`}
        >
          <Plus className="h-2.5 w-2.5" />
        </button>
        <Pencil className="h-2.5 w-2.5 text-gray-400 ml-0.5" />
      </div>
    </div>
  );
};
