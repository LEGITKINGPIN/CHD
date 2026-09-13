import React, { useEffect } from 'react';
import { ShieldAlert, Crosshair, X, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { LiveDispatchIncident } from '../types';
import { clsx } from 'clsx';

interface LiveAlertToastProps {
  alert: LiveDispatchIncident | null;
  onDismiss: () => void;
  onLocate: (incident: LiveDispatchIncident) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function LiveAlertToast({
  alert,
  onDismiss,
  onLocate,
  soundEnabled,
  onToggleSound
}: LiveAlertToastProps) {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [alert, onDismiss]);

  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-[calc(100vw-32px)] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={clsx(
        "rounded-[var(--radius-panel)] p-3.5 shadow-2xl border backdrop-blur-md transition-all overflow-hidden relative",
        isCritical 
          ? "bg-rose-950/90 text-white border-rose-500/40 shadow-rose-950/50" 
          : "bg-amber-950/90 text-white border-amber-500/40 shadow-amber-950/50"
      )}>
        {/* Progress timer bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full overflow-hidden">
          <div className={clsx(
            "h-full animate-[shrink_7s_linear_forwards]",
            isCritical ? "bg-rose-500" : "bg-amber-500"
          )} style={{ width: '100%' }} />
        </div>

        <div className="flex items-start justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={clsx(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isCritical ? "bg-rose-400" : "bg-amber-400"
              )} />
              <span className={clsx(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                isCritical ? "bg-rose-500" : "bg-amber-500"
              )} />
            </span>
            <span className={clsx(
              "text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded",
              isCritical ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            )}>
              {isCritical ? 'CRITICAL DISPATCH' : 'PRIORITY ALERT'}
            </span>
            <span className="text-[10px] font-mono text-white/70">
              {alert.time_ago}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onDismiss}
              title="Dismiss Alert"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mb-2.5">
          <h4 className="text-[13px] font-black tracking-tight text-white flex items-center gap-1.5">
            {isCritical ? <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{alert.primary_type}</span>
          </h4>
          <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 leading-relaxed">
            {alert.description}
          </p>
          <div className="text-[10px] font-medium text-white/60 mt-1 flex items-center gap-2">
            <span>{alert.district}</span>
            <span>•</span>
            <span>{alert.id}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <span className="text-[10px] font-mono font-bold text-white/70">
            {alert.status}
          </span>
          <button
            onClick={() => onLocate(alert)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-white text-slate-900 hover:bg-white/90 rounded-[var(--radius-control)] shadow-sm transition-all cursor-pointer"
          >
            <Crosshair className="w-3 h-3" />
            <span>Track on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
}
