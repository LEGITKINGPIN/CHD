import React, { useState, useRef, useEffect } from 'react';

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
        className={`w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-control)] px-3 py-1.5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none text-left flex justify-between items-center ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--color-background)] text-[var(--color-slate-muted)]' : 'cursor-pointer hover:bg-[var(--color-surface-soft)] shadow-sm'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate pr-2 font-medium text-[var(--color-navy-deep)]">{getDisplayText()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-slate)] shrink-0"><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-control)] shadow-lg max-h-60 overflow-y-auto py-1">
          {options.map(option => (
            <label
              key={option.value}
              className={`flex items-center px-3 py-1.5 hover:bg-[var(--color-surface-soft)] cursor-pointer transition-colors ${selectedValues.includes(option.value) ? 'bg-[var(--color-indigo-soft)]' : ''}`}
            >
              <input
                type="checkbox"
                className="rounded-[4px] border-[var(--color-border-strong)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)] mr-2.5 w-4 h-4 cursor-pointer"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span className={`text-[13px] truncate ${selectedValues.includes(option.value) ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-slate)] font-medium'}`} title={option.label}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
