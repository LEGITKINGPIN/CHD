import React from 'react';
import { ShieldAlert, Map as MapIcon, BarChart3, Activity, Layers, Sun, Moon, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface HeaderProps {
  activeView: 'map' | 'eda' | 'trends' | 'compare' | 'risk';
  setActiveView: (view: 'map' | 'eda' | 'trends' | 'compare' | 'risk') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenBriefing?: () => void;
}

export default function Header({ activeView, setActiveView, theme = 'light', onToggleTheme, onOpenBriefing }: HeaderProps) {
  const tabs = [
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'eda', label: 'EDA', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: Activity },
    { id: 'compare', label: 'Compare', icon: Layers },
    { id: 'risk', label: 'Risk Model', icon: BrainCircuit },
  ];

  return (
    <header className="h-[60px] bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] flex items-center px-3 md:px-6 shrink-0 shadow-xs z-20 gap-2 md:gap-4 justify-between transition-colors duration-300">
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-indigo)]">
          <span className="font-black text-xl md:text-2xl tracking-tighter" style={{ letterSpacing: '-0.05em' }}>CHD</span>
        </div>
        <div className="pl-2 md:pl-3 border-l-2 border-[var(--color-border)]">
          <h1 className="text-[12px] md:text-[14px] font-black text-[var(--color-navy-deep)] leading-tight tracking-tight uppercase">Crime Hotspot Detection</h1>
          <p className="hidden md:block text-[9px] text-[var(--color-primary)] font-bold tracking-widest uppercase">Crime & Risk Intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 flex md:justify-center overflow-x-auto custom-scrollbar mx-1 md:mx-2 min-w-0 py-1">
        <div className="bg-[var(--color-surface-soft)] p-[3px] rounded-[var(--radius-control)] flex items-center gap-1 border border-[var(--color-border)] whitespace-nowrap w-max relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={clsx(
                  "relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer select-none",
                  isActive
                    ? "text-[var(--color-primary)]" 
                    : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] hover:bg-[var(--color-border)]/20"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-pill"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-[var(--color-surface)] rounded-md shadow-xs border border-[var(--color-border)] z-0"
                  />
                )}
                <Icon className="w-[14px] h-[14px] relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenBriefing && (
          <button
            onClick={onOpenBriefing}
            title="Generate Operational Situation Dossier (Print / PDF)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-control)] bg-[var(--color-surface-soft)] hover:bg-[var(--color-border)] text-[var(--color-navy-deep)] border border-[var(--color-border)] text-[11px] font-bold transition-all duration-200 shadow-xs cursor-pointer hover:shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Briefing Dossier</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-control)] bg-[var(--color-surface-soft)] hover:bg-[var(--color-border)] text-[var(--color-slate)] hover:text-[var(--color-navy-deep)] border border-[var(--color-border)] transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--color-indigo)] transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
}
