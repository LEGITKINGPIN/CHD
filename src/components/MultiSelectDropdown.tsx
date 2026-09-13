import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiSelectDropdownProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  disabled = false
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (value === 'ALL') {
      onChange(['ALL']);
      return;
    }

    let newSelected = [...selectedValues];
    if (newSelected.includes('ALL')) {
      newSelected = newSelected.filter(v => v !== 'ALL');
    }

    if (newSelected.includes(value)) {
      newSelected = newSelected.filter(v => v !== value);
    } else {
      newSelected.push(value);
    }

    if (newSelected.length === 0) {
      newSelected = ['ALL'];
    }

    onChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0 || selectedValues.includes('ALL')) return placeholder;
    if (selectedValues.length === 1) {
      const opt = options.find(o => o.value === selectedValues[0]);
      return opt ? opt.label : selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative w-full text-[13px]" ref={containerRef}>
      <button
        type="button"
        className={`w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-control)] px-3 py-1.5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none text-left flex justify-between items-center transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--color-background)] text-[var(--color-slate-muted)]' : 'cursor-pointer hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-border-strong)] shadow-xs'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate pr-2 font-medium text-[var(--color-navy-deep)]">{getDisplayText()}</span>
        <ChevronDown 
          className={`w-4 h-4 text-[var(--color-slate)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--color-primary)]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1.5 w-full bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-[var(--radius-control)] shadow-xl max-h-60 overflow-y-auto py-1 custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex items-center px-3 py-2 hover:bg-[var(--color-surface-soft)] cursor-pointer transition-colors duration-150 select-none ${isSelected ? 'bg-[var(--color-indigo-soft)]' : ''}`}
              >
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center mr-2.5 shrink-0 transition-colors duration-150 ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-[var(--color-border-strong)] bg-[var(--color-surface)]'}`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleToggle(option.value)}
                />
                <span className={`text-[13px] truncate ${isSelected ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-slate)] font-medium'}`} title={option.label}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
