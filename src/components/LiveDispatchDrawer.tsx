import React, { useState } from 'react';
import { Radio, RefreshCw, X, Crosshair, ShieldAlert, AlertTriangle, Info, Clock, Users, ArrowUpRight, DownloadCloud } from 'lucide-react';
import { LiveDispatchIncident } from '../types';
import { clsx } from 'clsx';

interface LiveDispatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: LiveDispatchIncident[];
  activeUnits: number;
  isLoading: boolean;
  onRefresh: () => void;
  refreshInterval: number; // in seconds (0 = off)
  onSetRefreshInterval: (seconds: number) => void;
  nextSyncCountdown: number;
  onLocateIncident: (incident: LiveDispatchIncident) => void;
  onSyncSocrata?: () => void;
  isSyncingSocrata?: boolean;
}

export default function LiveDispatchDrawer({
  isOpen,
  onClose,
  incidents,
  activeUnits,
  isLoading,
  onRefresh,
  refreshInterval,
  onSetRefreshInterval,
  nextSyncCountdown,
  onLocateIncident,
  onSyncSocrata,
  isSyncingSocrata = false,
}: LiveDispatchDrawerProps) {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.primary_type.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.district.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter(i => i.severity === 'HIGH').length;
  const moderateCount = incidents.filter(i => i.severity === 'MODERATE').length;

  return (
    <div className="absolute top-4 right-4 bottom-20 z-40 w-[380px] max-w-[calc(100vw-32px)] flex flex-col bg-[var(--color-surface)]/95 backdrop-blur-md rounded-[var(--radius-panel)] shadow-2xl border border-[var(--color-border)] overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[13px] font-black text-[var(--color-navy-deep)] tracking-tight uppercase">
                CAD Live Dispatch
              </h3>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-slate-muted)] font-medium">
              Real-time 911 incident telemetry & unit tracking
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-control)] transition-colors cursor-pointer"
          title="Close Dispatch Feed"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Bar: Refresh interval, Countdown, Manual Sync */}
      <div className="px-3.5 py-2.5 bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] flex items-center justify-between gap-2 shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider">
            Auto-Sync:
          </span>
          <div className="flex items-center bg-[var(--color-surface)] p-0.5 rounded-md border border-[var(--color-border)] text-[10px] font-bold">
            {[
              { label: 'Off', val: 0 },
              { label: '10s', val: 10 },
              { label: '30s', val: 30 },
              { label: '60s', val: 60 }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => onSetRefreshInterval(item.val)}
                className={clsx(
                  "px-1.5 py-0.5 rounded transition-all cursor-pointer",
                  refreshInterval === item.val
                    ? "bg-[var(--color-primary)] text-white font-extrabold shadow-sm"
                    : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {refreshInterval > 0 && (
            <span className="text-[10px] font-mono text-[var(--color-slate-muted)] font-semibold">
              in {nextSyncCountdown}s
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Fetch Fresh CAD Incidents"
            className="flex items-center gap-1 px-2 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-border)]/50 text-[var(--color-navy-deep)] rounded-[var(--radius-control)] border border-[var(--color-border)] text-[10px] font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={clsx("w-3 h-3", isLoading && "animate-spin text-[var(--color-primary)]")} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Socrata Live Portal Quick Sync Banner */}
      {onSyncSocrata && (
        <div className="px-3.5 py-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border-b border-[var(--color-border)] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="text-[10px] font-bold text-[var(--color-navy-deep)] truncate">
              Chicago Socrata Portal Ingestion
            </span>
          </div>
          <button
            onClick={onSyncSocrata}
            disabled={isSyncingSocrata}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-primary)]/30 rounded shadow-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            <DownloadCloud className="w-3 h-3" />
            <span>{isSyncingSocrata ? 'Fetching...' : 'Ingest API'}</span>
          </button>
        </div>
      )}

      {/* Severity Filter Tabs */}
      <div className="px-3.5 pt-2.5 pb-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-b border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={clsx(
            "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap",
            filterSeverity === 'ALL'
              ? "bg-[var(--color-navy-deep)] text-white shadow-sm"
              : "bg-[var(--color-surface-soft)] text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] border border-[var(--color-border)]"
          )}
        >
          ALL ({incidents.length})
        </button>
        <button
          onClick={() => setFilterSeverity('CRITICAL')}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap",
            filterSeverity === 'CRITICAL'
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setFilterSeverity('HIGH')}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap",
            filterSeverity === 'HIGH'
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          High ({highCount})
        </button>
        <button
          onClick={() => setFilterSeverity('MODERATE')}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap",
            filterSeverity === 'MODERATE'
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Moderate ({moderateCount})
        </button>
      </div>

      {/* Incidents Feed List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar min-h-0">
        {filteredIncidents.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-slate-muted)]">
            <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-[12px] font-semibold">No incidents match active filter</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isCrit = incident.severity === 'CRITICAL';
            const isHigh = incident.severity === 'HIGH';
            return (
              <div
                key={incident.id}
                className={clsx(
                  "p-3 rounded-[var(--radius-control)] border transition-all duration-200 hover:shadow-md bg-[var(--color-surface)]",
                  incident.is_new 
                    ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30 animate-pulse" 
                    : "border-[var(--color-border)] hover:border-[var(--color-slate-muted)]/50"
                )}
              >
                {/* Incident Card Top Row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={clsx(
                      "text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded",
                      isCrit 
                        ? "bg-rose-500/15 text-rose-500 border border-rose-500/30" 
                        : isHigh 
                        ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" 
                        : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                    )}>
                      {incident.severity}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-slate-muted)]">
                      {incident.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-[var(--color-slate-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--color-slate-muted)]" />
                    {incident.time_ago}
                  </span>
                </div>

                {/* Primary Type & Description */}
                <h4 className="text-[12px] font-black text-[var(--color-navy-deep)] leading-snug mb-1">
                  {incident.primary_type}
                </h4>
                <p className="text-[11px] text-[var(--color-slate)] leading-relaxed line-clamp-2 mb-2">
                  {incident.description}
                </p>

                {/* District, Units, Status & Action */}
                <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-2 flex-wrap text-[10px]">
                  <div className="flex items-center gap-2 text-[var(--color-slate-muted)] font-medium">
                    <span className="font-semibold text-[var(--color-navy-deep)]">
                      {incident.district}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {incident.assigned_units.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      "font-mono font-bold px-1.5 py-0.5 rounded text-[9px]",
                      incident.status === 'DISPATCHED' ? "bg-rose-500/10 text-rose-500" :
                      incident.status === 'EN ROUTE' ? "bg-amber-500/10 text-amber-500" :
                      incident.status === 'ON SCENE' ? "bg-blue-500/10 text-blue-500" :
                      "bg-emerald-500/10 text-emerald-600"
                    )}>
                      {incident.status}
                    </span>

                    <button
                      onClick={() => onLocateIncident(incident)}
                      title="Fly to Coordinate & Radar Ping"
                      className="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-colors cursor-pointer"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: Live Active Units Counter */}
      <div className="px-4 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between text-[11px] font-bold text-[var(--color-slate-muted)] shrink-0">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{activeUnits} Patrol Units Monitored</span>
        </div>
        <span className="text-[10px] font-mono">
          Buffer: {incidents.length} events
        </span>
      </div>
    </div>
  );
}
