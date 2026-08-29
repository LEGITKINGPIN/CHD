import React from 'react';
import { ShieldAlert, Map as MapIcon, BarChart3, Activity, Layers, ActivitySquare } from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  activeView: 'map' | 'eda' | 'trends' | 'compare' | 'patrol';
  setActiveView: (view: 'map' | 'eda' | 'trends' | 'compare' | 'patrol') => void;
}

export default function Header({ activeView, setActiveView }: HeaderProps) {
  return (
    <header className="h-[60px] bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3 md:px-6 shrink-0 shadow-sm z-20 gap-2 md:gap-4">
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-indigo)]">
          <span className="font-black text-xl md:text-2xl tracking-tighter" style={{ letterSpacing: '-0.05em' }}>CHD</span>
        </div>
        <div className="pl-2 md:pl-3 border-l-2 border-[var(--color-border)]">
          <h1 className="text-[12px] md:text-[14px] font-black text-[var(--color-navy-deep)] leading-tight tracking-tight uppercase">Crime Hotspot Detection</h1>
          <p className="hidden md:block text-[9px] text-[var(--color-primary)] font-bold tracking-widest uppercase">Crime & Risk Intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 flex md:justify-center overflow-x-auto custom-scrollbar mx-1 md:mx-2 min-w-0">
        <div className="bg-[var(--color-surface-soft)] p-[3px] rounded-[var(--radius-control)] flex items-center gap-1 border border-[var(--color-border)] whitespace-nowrap w-max">
          {[
            { id: 'map', label: 'Map', icon: MapIcon },
            { id: 'eda', label: 'EDA', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: Activity },
            { id: 'compare', label: 'Compare', icon: Layers },
            { id: 'patrol', label: 'Patrol Intel', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200",
                  activeView === tab.id 
                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm border border-[var(--color-border)]" 
                    : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] hover:bg-[var(--color-border)]/30 border border-transparent"
                )}
              >
                <Icon className="w-[14px] h-[14px]" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 bg-emerald-50 text-[var(--color-success)] text-[11px] font-semibold rounded-full border border-emerald-100" title="SYSTEM HEALTH: OPTIMAL">
          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-success)] shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
          <span className="hidden md:inline">SYSTEM HEALTH: OPTIMAL</span>
        </div>
      </div>
    </header>
  );
}
