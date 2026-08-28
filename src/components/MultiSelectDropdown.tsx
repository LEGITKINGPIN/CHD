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
    <div className="relative w-full text-sm" ref={containerRef}>
      <button
        type="button"
        className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-left flex justify-between items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate pr-2 font-medium text-slate-700">{getDisplayText()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0"><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2 w-4 h-4 cursor-pointer"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span className="text-slate-700 truncate" title={option.label}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
