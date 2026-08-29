import React from 'react';
import { ShieldAlert, Map as MapIcon, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  activeView: 'map' | 'eda' | 'trends' | 'compare' | 'patrol';
  setActiveView: (view: 'map' | 'eda' | 'trends' | 'compare' | 'patrol') => void;
}

export default function Header({ activeView, setActiveView }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Crime Hotspot Detection</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Crime & Risk Intelligence</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
          {[
            { id: 'map', label: 'Map', icon: MapIcon },
            { id: 'eda', label: 'EDA', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: BarChart3 },
            { id: 'compare', label: 'Compare', icon: BarChart3 },
            { id: 'patrol', label: 'Patrol Intel', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  activeView === tab.id 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
          SYSTEM HEALTH: OPTIMAL
        </div>
      </div>
    </header>
  );
}
