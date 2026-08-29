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
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex items-center justify-center">
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center max-w-lg">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Patrol Intelligence Available</h3>
          <p className="text-slate-500">
            Please run a clustering analysis (e.g., K-Means or DBSCAN) from the Map view to generate strategic decision-support intelligence for historical hotspots.
          </p>
        </div>
      </div>
    );
  }

  const hotspots = clusteringResult.hotspot_rankings.slice(0, 10); // Show top 10

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Patrol Intelligence</h2>
          <p className="text-slate-500 flex items-center gap-2">
            <span>Decision support based on <strong>{algorithm}</strong> historical clustering results.</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
              STRATEGIC SUPPORT
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotspots.map((hotspot, index) => {
            const isCritical = hotspot.risk_category.toLowerCase().includes('critical');
            const isHigh = hotspot.risk_category.toLowerCase().includes('high');
            const centroid = clusteringResult.centroids[hotspot.cluster_id];
            
            return (
              <div key={hotspot.cluster_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className={clsx(
                  "px-5 py-3 border-b flex justify-between items-center",
                  isCritical ? "bg-rose-50 border-rose-100" : isHigh ? "bg-orange-50 border-orange-100" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white",
                      isCritical ? "bg-rose-600" : isHigh ? "bg-orange-500" : "bg-slate-400"
                    )}>
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg">Hotspot #{hotspot.cluster_id}</h3>
                  </div>
                  <span className={clsx(
                    "px-2.5 py-1 text-xs font-bold rounded-md border",
                    isCritical ? "bg-rose-100 text-rose-700 border-rose-200" : 
                    isHigh ? "bg-orange-100 text-orange-700 border-orange-200" : 
                    "bg-slate-100 text-slate-700 border-slate-200"
                  )}>
                    {hotspot.risk_category.toUpperCase()}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Total Incidents
                      </p>
                      <p className="text-lg font-bold text-slate-900">{hotspot.volume}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Density
                      </p>
                      <p className="text-lg font-bold text-slate-900">{hotspot.density_per_km2.toLocaleString()} / km²</p>
                    </div>
                  </div>

                  {/* Temporal & Categorical */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Dominant Crime</p>
                        <p className="font-medium text-slate-900">{(hotspot as any).dominant_crime || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Peak Period</p>
                        <p className="font-medium text-slate-900">{(hotspot as any).peak_hour || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Peak Day</p>
                        <p className="font-medium text-slate-900">{(hotspot as any).peak_day || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <p className="text-sm italic text-slate-600 bg-blue-50/50 p-3 rounded-md border border-blue-100/50">
                      "{(hotspot as any).insight || "Historical concentration indicates consistent incident volume."}"
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {centroid ? `${centroid[0].toFixed(4)}, ${centroid[1].toFixed(4)}` : "Coordinates unavailable"}
                      </div>
                      <button 
                        onClick={() => centroid && onLocateHotspot(centroid[1], centroid[0])}
                        disabled={!centroid}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
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
          <div className="text-center text-slate-500 p-8">No valid hotspots detected in the current clustering run.</div>
        )}
      </div>
    </div>
  );
}
