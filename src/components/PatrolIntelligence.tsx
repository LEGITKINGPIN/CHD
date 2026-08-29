import React from 'react';
import { ClusteringResult } from '../types';
import { ShieldAlert, MapPin, Clock, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

interface PatrolIntelligenceProps {
  clusteringResult: ClusteringResult | null;
  algorithm: string;
  onLocateHotspot: (lng: number, lat: number) => void;
}

export default function PatrolIntelligence({ clusteringResult, algorithm, onLocateHotspot }: PatrolIntelligenceProps) {
  
  if (!clusteringResult || !clusteringResult.hotspot_rankings) {
    return (
      <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 flex items-center justify-center">
        <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-panel)] p-12 text-center max-w-lg">
          <div className="mx-auto w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-[var(--color-slate-muted)]" />
          </div>
          <h3 className="text-[18px] font-bold text-[var(--color-navy-deep)] mb-2">No Patrol Intelligence Available</h3>
          <p className="text-[14px] text-[var(--color-slate-muted)] font-medium">
            Please run a clustering analysis (e.g., K-Means or DBSCAN) from the Map view to generate strategic decision-support intelligence for historical hotspots.
          </p>
        </div>
      </div>
    );
  }

  const hotspots = clusteringResult.hotspot_rankings.slice(0, 10); // Show top 10

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        
        <header className="mb-4 md:mb-8">
          <h2 className="text-[24px] font-bold text-[var(--color-navy-deep)] tracking-tight">Patrol Intelligence</h2>
          <p className="text-[14px] text-[var(--color-slate-muted)] mt-1 flex items-center gap-2">
            <span>Decision support based on <strong className="text-[var(--color-navy-deep)]">{algorithm}</strong> historical clustering results.</span>
            <span className="px-2.5 py-1 bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] text-[11px] font-bold rounded-full border border-[var(--color-indigo)]/20 uppercase tracking-wider">
              STRATEGIC SUPPORT
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotspots.map((hotspot, index) => {
            const isCritical = hotspot.risk_category.toLowerCase().includes('critical');
            const isHigh = hotspot.risk_category.toLowerCase().includes('high');
            const isModerate = hotspot.risk_category.toLowerCase().includes('moderate');
            const centroid = clusteringResult.centroids[hotspot.cluster_id];
            
            return (
              <div key={hotspot.cluster_id} className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col">
                {/* Header */}
                <div className={clsx(
                  "px-6 py-4 border-b flex justify-between items-center",
                  isCritical ? "bg-red-50 border-red-100" : 
                  isHigh ? "bg-orange-50 border-orange-100" : 
                  isModerate ? "bg-amber-50 border-amber-100" :
                  "bg-[var(--color-surface-soft)] border-[var(--color-border)]"
                )}>
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold text-white",
                      isCritical ? "bg-red-600" : 
                      isHigh ? "bg-orange-500" : 
                      isModerate ? "bg-amber-500" :
                      "bg-[var(--color-slate)]"
                    )}>
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-[var(--color-navy-deep)] text-[18px]">Hotspot #{hotspot.cluster_id}</h3>
                  </div>
                  <span className={clsx(
                    "px-2.5 py-1 text-[11px] font-bold rounded-[var(--radius-control)] border uppercase tracking-wider",
                    isCritical ? "bg-red-100 text-red-700 border-red-200" : 
                    isHigh ? "bg-orange-100 text-orange-700 border-orange-200" : 
                    isModerate ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-[var(--color-slate)]/10 text-[var(--color-slate)] border-[var(--color-border)]"
                  )}>
                    {hotspot.risk_category.toUpperCase()}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col gap-5">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Total Incidents
                      </p>
                      <p className="text-[24px] font-black text-[var(--color-navy-deep)] leading-none">{hotspot.volume}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-teal)]" /> Density
                      </p>
                      <p className="text-[24px] font-black text-[var(--color-navy-deep)] leading-none">{hotspot.density_per_km2.toLocaleString()} <span className="text-[14px] text-[var(--color-slate-muted)] font-medium">/ km²</span></p>
                    </div>
                  </div>

                  {/* Temporal & Categorical */}
                  <div className="bg-[var(--color-background)] p-4 rounded-[var(--radius-control)] border border-[var(--color-border)] space-y-3.5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-[var(--color-slate-muted)] mt-0.5" />
                      <div>
                        <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-wider">Dominant Crime</p>
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{(hotspot as any).dominant_crime || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[var(--color-slate-muted)] mt-0.5" />
                      <div>
                        <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-wider">Peak Period</p>
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{(hotspot as any).peak_hour || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[var(--color-slate-muted)] mt-0.5" />
                      <div>
                        <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-wider">Peak Day</p>
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{(hotspot as any).peak_day || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="mt-auto pt-5 border-t border-[var(--color-border)] flex flex-col gap-4">
                    <p className="text-[13px] italic text-[var(--color-primary)] font-medium bg-[var(--color-primary)]/5 p-4 rounded-[var(--radius-control)] border border-[var(--color-primary)]/10">
                      "{(hotspot as any).insight || "Historical concentration indicates consistent incident volume."}"
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-[11px] font-mono font-medium text-[var(--color-slate-muted)] bg-[var(--color-background)] px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                        {centroid ? `${centroid[0].toFixed(4)}, ${centroid[1].toFixed(4)}` : "Coordinates unavailable"}
                      </div>
                      <button 
                        onClick={() => centroid && onLocateHotspot(centroid[1], centroid[0])}
                        disabled={!centroid}
                        className="px-4 py-3 md:py-2 bg-[var(--color-navy-deep)] hover:bg-[var(--color-navy)] text-[var(--color-surface)] text-[12px] font-bold rounded-[var(--radius-control)] transition-colors flex items-center gap-2 disabled:opacity-50 min-h-[44px] md:min-h-0"
                      >
                        <MapPin className="w-3.5 h-3.5" /> View on Map
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>

        {hotspots.length === 0 && (
          <div className="text-center text-[var(--color-slate-muted)] font-medium p-8">No valid hotspots detected in the current clustering run.</div>
        )}
      </div>
    </div>
  );
}
