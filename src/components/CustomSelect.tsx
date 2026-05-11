import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
  color?: string;
}

interface Props {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ value, options, onChange, placeholder, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm transition-all duration-150"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: open ? '0 0 0 3px rgba(139,92,246,0.1)' : 'none',
          color: selected ? 'var(--text-1)' : 'var(--text-3)',
          minWidth: 0,
        }}
      >
        {selected?.color && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: selected.color }}
          />
        )}
        {selected?.emoji && (
          <span className="shrink-0 leading-none">{selected.emoji}</span>
        )}
        <span className="flex-1 text-left truncate">
          {selected ? selected.label : (placeholder ?? 'Selecionar')}
        </span>
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--text-3)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl overflow-hidden"
          style={{
            background: 'rgba(14, 11, 30, 0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
            minWidth: '180px',
          }}
        >
          <ul className="py-1 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors duration-100"
                    style={{
                      background: isSelected
                        ? 'rgba(139,92,246,0.15)'
                        : 'transparent',
                      color: isSelected ? '#C4B5FD' : 'var(--text-2)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {opt.color && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: opt.color }}
                      />
                    )}
                    {opt.emoji && (
                      <span className="shrink-0 leading-none w-5 text-center">{opt.emoji}</span>
                    )}
                    <span className="flex-1 text-left truncate">{opt.label}</span>
                    {isSelected && (
                      <Check size={13} className="shrink-0" style={{ color: '#A78BFA' }} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
