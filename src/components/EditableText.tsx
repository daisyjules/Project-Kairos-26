import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  id?: string;
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  placeholder?: string;
  renderDisplay?: (val: string) => React.ReactNode;
  label?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  value,
  onSave,
  className = '',
  inputClassName = '',
  multiline = false,
  placeholder = 'Click to edit...',
  renderDisplay,
  label,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (currentVal.trim() !== '') {
      onSave(currentVal.trim());
    } else {
      setCurrentVal(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentVal(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div id={id} className="relative group/edit inline-flex flex-col w-full gap-1">
        {label && <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</span>}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-xl border-2 border-emerald-600 bg-white dark:bg-stone-800 p-2.5 text-sm text-stone-900 dark:text-stone-100 shadow-sm focus:outline-none ${inputClassName}`}
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-lg border-2 border-emerald-600 bg-white dark:bg-stone-800 px-2.5 py-1 text-sm text-stone-900 dark:text-stone-100 shadow-sm focus:outline-none ${inputClassName}`}
            placeholder={placeholder}
          />
        )}
        <div className="flex items-center gap-1.5 self-end mt-1">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-md bg-[#1E3A2F] text-white px-2.5 py-1 text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            title="Save changes (Enter)"
          >
            <Check className="h-3 w-3" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-2 py-1 text-xs font-medium hover:bg-stone-300 transition-colors cursor-pointer"
            title="Cancel (Esc)"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      onClick={() => setIsEditing(true)}
      title="Click to edit text"
      className={`group/text relative inline-flex items-baseline gap-1.5 cursor-pointer rounded-lg hover:bg-amber-100/40 dark:hover:bg-stone-800/60 px-1.5 -mx-1.5 transition-colors ${className}`}
    >
      {renderDisplay ? renderDisplay(value) : <span>{value || placeholder}</span>}
      <Pencil className="h-3.5 w-3.5 text-stone-400 opacity-0 group-hover/text:opacity-100 transition-opacity self-center shrink-0" />
    </div>
  );
};
