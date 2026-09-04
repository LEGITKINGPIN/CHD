import React, { useState, useMemo } from 'react';
import { ClusteringResult, TacticalPatrolRoute, PatrolCheckpoint } from '../types';
import { ShieldAlert, MapPin, Clock, Calendar, AlertTriangle, TrendingUp, Navigation, Car, ShieldCheck, Route, Zap, Compass } from 'lucide-react';
import { clsx } from 'clsx';

interface PatrolIntelligenceProps {
  clusteringResult: ClusteringResult | null;
  algorithm: string;
  onLocateHotspot: (lng: number, lat: number) => void;
  onGoToMap?: () => void;
  onDeployPatrolRoute?: (route: TacticalPatrolRoute) => void;
  activePatrolRoute?: TacticalPatrolRoute | null;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PatrolIntelligence({ 
  clusteringResult, 
  algorithm, 
  onLocateHotspot, 
  onGoToMap,
  onDeployPatrolRoute,
  activePatrolRoute 
}: PatrolIntelligenceProps) {
  
  const [strategy, setStrategy] = useState<'risk-first' | 'shortest-path'>('risk-first');

  if (!clusteringResult || !clusteringResult.hotspot_rankings) {
    return (
      <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 flex items-center justify-center">
        <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-panel)] p-12 text-center max-w-lg">
          <div className="mx-auto w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-[var(--color-slate-muted)]" />
          </div>
          <h3 className="text-[18px] font-bold text-[var(--color-navy-deep)] mb-2">No Patrol Intelligence Available</h3>
          <p className="text-[14px] text-[var(--color-slate-muted)] font-medium mb-6">
            Please run a clustering analysis (e.g., K-Means or DBSCAN) from the Map view to generate strategic decision-support intelligence for historical hotspots.
          </p>
          {onGoToMap && (
            <button 
              onClick={onGoToMap}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold text-[14px] rounded-[var(--radius-control)] shadow-sm hover:opacity-90 transition-opacity"
            >
              <MapPin className="w-4 h-4" /> Go to Map View
            </button>
          )}
        </div>
      </div>
    );
  }

  // Generate automated tactical patrol route
  const generatedRoute: TacticalPatrolRoute | null = useMemo(() => {
    if (!clusteringResult || !clusteringResult.hotspot_rankings || !clusteringResult.centroids) return null;
    
    // Filter hotspots with valid centroid coordinates
    const validHotspots = clusteringResult.hotspot_rankings
      .filter(h => clusteringResult.centroids[h.cluster_id] && clusteringResult.centroids[h.cluster_id].length >= 2)
      .slice(0, 8); // Top 8 hotspots for effective operational dispatch

    if (validHotspots.length === 0) return null;

    let ordered: typeof validHotspots = [];
    let remaining = [...validHotspots];

    // Seed start: Highest priority hotspot
    ordered.push(remaining.shift()!);

    while (remaining.length > 0) {
      const current = ordered[ordered.length - 1];
      const curCentroid = clusteringResult.centroids[current.cluster_id];
      let bestIdx = 0;
      let bestScore = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        const cCentroid = clusteringResult.centroids[candidate.cluster_id];
        const distKm = getDistanceKm(curCentroid[0], curCentroid[1], cCentroid[0], cCentroid[1]);

        if (strategy === 'risk-first') {
          // Weight distance by inverse risk priority
          const riskWeight = candidate.risk_category.toLowerCase().includes('critical') ? 0.4 :
                             candidate.risk_category.toLowerCase().includes('high') ? 0.7 : 1.0;
          const score = distKm * riskWeight;
          if (score < bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        } else {
          // Pure shortest geometric transit distance
          if (distKm < bestScore) {
            bestScore = distKm;
            bestIdx = i;
          }
        }
      }
      ordered.push(remaining.splice(bestIdx, 1)[0]);
    }

    // Build checkpoints and cumulative distance
    let totalKm = 0;
    const checkpoints: PatrolCheckpoint[] = ordered.map((h, idx) => {
      const c = clusteringResult.centroids[h.cluster_id];
      const lat = c[0];
      const lng = c[1];

      if (idx > 0) {
        const prevC = clusteringResult.centroids[ordered[idx - 1].cluster_id];
        totalKm += getDistanceKm(prevC[0], prevC[1], lat, lng);
      }

      const domCrime = (h.dominant_crime || '').toUpperCase();
      const isCritical = h.risk_category.toLowerCase().includes('critical');
      const isViolent = ['BATTERY', 'ASSAULT', 'ROBBERY', 'HOMICIDE', 'WEAPONS'].some(v => domCrime.includes(v));

      let recommendedUnit = 'Standard Beat Patrol (Cruiser)';
      let tacticalAction = 'High-visibility presence; maintain deterrent patrol sweeps.';

      if (isCritical || isViolent) {
        recommendedUnit = 'Heavy Rapid Response (Armed Unit)';
        tacticalAction = 'Stationary beacon deterrence at intersection; intensive stop-and-inquire presence during peak window.';
      } else if (domCrime.includes('THEFT') || domCrime.includes('BURGLARY')) {
        recommendedUnit = 'Covert Recon & Rapid Interceptor';
        tacticalAction = 'Staggered patrol sweeps around commercial corridors; monitor known alleyways and egress points.';
      } else if (h.density_per_km2 > 50) {
        recommendedUnit = 'Two-Officer Motor Patrol Squad';
        tacticalAction = 'Frequent saturation sweeps; establish visible checkpoint presence.';
      }

      const peakShift = h.peak_hour !== undefined 
        ? `Shift Window: ${String(h.peak_hour).padStart(2, '0')}:00 - ${String((Number(h.peak_hour) + 4) % 24).padStart(2, '0')}:00`
        : 'Active Vigilance (Full Shift)';

      return {
        order: idx + 1,
        clusterId: h.cluster_id,
        lat,
        lng,
        riskCategory: h.risk_category,
        density: h.density_per_km2,
        volume: h.volume,
        dominantCrime: h.dominant_crime || 'General Incidents',
        recommendedUnit,
        peakShift,
        tacticalAction
      };
    });

    const transitMins = (totalKm / 32) * 60; // 32 km/h avg urban speed
    const dwellMins = checkpoints.length * 20; // 20 mins per checkpoint
    const estimatedDurationMins = Math.round(transitMins + dwellMins);
    const coordinates: [number, number][] = checkpoints.map(cp => [cp.lng, cp.lat]);

    return {
      id: `route-${strategy}-${checkpoints.length}`,
      title: `Tactical Circuit ${algorithm} (${checkpoints.length} Checkpoints)`,
      strategy,
      checkpoints,
      coordinates,
      totalDistanceKm: parseFloat(totalKm.toFixed(1)),
      estimatedDurationMins,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [clusteringResult, algorithm, strategy]);

  const hotspots = clusteringResult.hotspot_rankings.slice(0, 10);

  const isCurrentRouteDeployed = activePatrolRoute && generatedRoute && activePatrolRoute.id === generatedRoute.id;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-[24px] font-bold text-[var(--color-navy-deep)] tracking-tight">Patrol Intelligence & Tactical Routing</h2>
            <p className="text-[14px] text-[var(--color-slate-muted)] mt-1 flex items-center gap-2">
              <span>Decision support based on <strong className="text-[var(--color-navy-deep)]">{algorithm}</strong> historical clustering results.</span>
              <span className="px-2.5 py-0.5 bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] text-[11px] font-bold rounded-full border border-[var(--color-indigo)]/20 uppercase tracking-wider">
                STRATEGIC DISPATCH
              </span>
            </p>
          </div>
        </header>

        {/* Tactical Patrol Route Dispatch Banner */}
        {generatedRoute && (
          <div className="bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-surface-soft)] rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-md p-5 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-[var(--color-border)]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[var(--radius-control)]">
                    <Route className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Automated Tactical Circuit
                  </span>
                  {isCurrentRouteDeployed && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      ACTIVE ON MAP
                    </span>
                  )}
                </div>
                <h3 className="text-[20px] font-black text-[var(--color-navy-deep)] tracking-tight">
                  {generatedRoute.title}
                </h3>
                <p className="text-[13px] text-[var(--color-slate-muted)] font-medium mt-1">
                  Sequenced patrol circuit connecting high-density risk centroids to maximize deterrence coverage.
                </p>
              </div>

              {/* Strategy Selector & Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-[var(--color-background)] p-1 rounded-[var(--radius-control)] border border-[var(--color-border)] flex items-center text-xs font-semibold">
                  <button
                    onClick={() => setStrategy('risk-first')}
                    className={clsx(
                      "px-3 py-1.5 rounded-[4px] transition-all",
                      strategy === 'risk-first'
                        ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm"
                        : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                    )}
                  >
                    Risk-Priority
                  </button>
                  <button
                    onClick={() => setStrategy('shortest-path')}
                    className={clsx(
                      "px-3 py-1.5 rounded-[4px] transition-all",
                      strategy === 'shortest-path'
                        ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm"
                        : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                    )}
                  >
                    Shortest Transit
                  </button>
                </div>

                {onDeployPatrolRoute && (
                  <button
                    onClick={() => onDeployPatrolRoute(generatedRoute)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-indigo)] hover:opacity-95 text-white font-bold text-[13px] rounded-[var(--radius-control)] shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Navigation className="w-4 h-4" />
                    {isCurrentRouteDeployed ? 'View Route on Map' : 'Deploy Route to Map'}
                  </button>
                )}
              </div>
            </div>

            {/* Route Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 pb-5">
              <div className="bg-[var(--color-background)] p-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                <div className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Total Distance
                </div>
                <div className="text-[22px] font-black text-[var(--color-navy-deep)] leading-none">
                  {generatedRoute.totalDistanceKm} <span className="text-[13px] font-semibold text-[var(--color-slate-muted)]">km</span>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                <div className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-teal)]" /> Checkpoints
                </div>
                <div className="text-[22px] font-black text-[var(--color-navy-deep)] leading-none">
                  {generatedRoute.checkpoints.length} <span className="text-[13px] font-semibold text-[var(--color-slate-muted)]">stops</span>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                <div className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-warning)]" /> Est. Tour Duration
                </div>
                <div className="text-[22px] font-black text-[var(--color-navy-deep)] leading-none">
                  {Math.floor(generatedRoute.estimatedDurationMins / 60)}h {generatedRoute.estimatedDurationMins % 60}m
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                <div className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[var(--color-critical)]" /> Deployment Unit
                </div>
                <div className="text-[13px] font-bold text-[var(--color-navy-deep)] truncate leading-tight mt-1" title="Armed Rapid Response Cruiser">
                  Rapid Response Cruiser
                </div>
              </div>
            </div>

            {/* Waypoint Circuit Sequence */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <div className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Checkpoint Sequencing & Dispatch Order
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {generatedRoute.checkpoints.map((cp) => {
                  const isCrit = cp.riskCategory.toLowerCase().includes('critical');
                  const isH = cp.riskCategory.toLowerCase().includes('high');
                  return (
                    <div 
                      key={cp.order}
                      onClick={() => onLocateHotspot(cp.lng, cp.lat)}
                      className="bg-[var(--color-background)] hover:bg-[var(--color-surface-soft)] p-3 rounded-[var(--radius-control)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-navy-deep)] text-white text-[11px] font-black">
                          {cp.order}
                        </span>
                        <span className={clsx(
                          "px-2 py-0.5 text-[10px] font-bold rounded border uppercase",
                          isCrit ? "bg-[var(--color-critical)]/15 text-[var(--color-critical)] border-[var(--color-critical)]/30" :
                          isH ? "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30" :
                          "bg-[var(--color-indigo)]/15 text-[var(--color-indigo)] border-[var(--color-indigo)]/30"
                        )}>
                          Cluster #{cp.clusterId}
                        </span>
                      </div>
                      <div className="text-[12px] font-bold text-[var(--color-navy-deep)] truncate mb-1" title={cp.dominantCrime}>
                        {cp.dominantCrime}
                      </div>
                      <div className="text-[10px] text-[var(--color-slate-muted)] font-medium">
                        {cp.peakShift.replace('Shift Window: ', 'Peak: ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section Divider */}
        <div className="pt-2">
          <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
            Detailed Hotspot Tactical Profiles
          </h3>
        </div>

        {/* Hotspot Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotspots.map((hotspot, index) => {
            const isCritical = hotspot.risk_category.toLowerCase().includes('critical');
            const isHigh = hotspot.risk_category.toLowerCase().includes('high');
            const isModerate = hotspot.risk_category.toLowerCase().includes('moderate');
            const centroid = clusteringResult.centroids[hotspot.cluster_id];
            
            // Check if this hotspot is in the generated route
            const routeStop = generatedRoute?.checkpoints.find(cp => cp.clusterId === hotspot.cluster_id);

            return (
              <div key={hotspot.cluster_id} className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col">
                {/* Header */}
                <div className={clsx(
                  "px-6 py-4 border-b flex justify-between items-center",
                  isCritical ? "bg-[var(--color-critical)]/10 border-[var(--color-critical)]/20" : 
                  isHigh ? "bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20" : 
                  isModerate ? "bg-amber-500/10 border-amber-500/20" :
                  "bg-[var(--color-surface-soft)] border-[var(--color-border)]"
                )}>
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold text-white shadow-sm",
                      isCritical ? "bg-[var(--color-critical)]" : 
                      isHigh ? "bg-[var(--color-warning)]" : 
                      isModerate ? "bg-amber-500" :
                      "bg-[var(--color-slate)]"
                    )}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--color-navy-deep)] text-[17px] leading-tight">Hotspot #{hotspot.cluster_id}</h3>
                      {routeStop && (
                        <span className="text-[10px] font-bold text-[var(--color-primary)] tracking-wider uppercase">
                          Patrol Waypoint #{routeStop.order}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={clsx(
                    "px-2.5 py-1 text-[11px] font-bold rounded-[var(--radius-control)] border uppercase tracking-wider",
                    isCritical ? "bg-[var(--color-critical)]/15 text-[var(--color-critical)] border-[var(--color-critical)]/30" : 
                    isHigh ? "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30" : 
                    isModerate ? "bg-amber-500/15 text-amber-500 border-amber-500/30" :
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
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{hotspot.dominant_crime || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[var(--color-slate-muted)] mt-0.5" />
                      <div>
                        <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-wider">Peak Period</p>
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{hotspot.peak_hour !== undefined ? `${hotspot.peak_hour}:00` : "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[var(--color-slate-muted)] mt-0.5" />
                      <div>
                        <p className="text-[11px] text-[var(--color-slate-muted)] font-bold uppercase tracking-wider">Peak Day</p>
                        <p className="font-semibold text-[13px] text-[var(--color-navy-deep)]">{hotspot.peak_day || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Deployment */}
                  {routeStop && (
                    <div className="bg-[var(--color-surface-soft)] p-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)] text-xs">
                      <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" /> Recommended Patrol Unit
                      </div>
                      <div className="font-bold text-[var(--color-navy-deep)] mb-1.5">
                        {routeStop.recommendedUnit}
                      </div>
                      <div className="text-[11px] text-[var(--color-slate)] leading-relaxed">
                        {routeStop.tacticalAction}
                      </div>
                    </div>
                  )}

                  {/* AI Insight */}
                  <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex flex-col gap-3">
                    <p className="text-[12px] italic text-[var(--color-primary)] font-medium bg-[var(--color-primary)]/5 p-3 rounded-[var(--radius-control)] border border-[var(--color-primary)]/10 leading-relaxed">
                      "{hotspot.insight || "Historical concentration indicates consistent incident volume during peak windows."}"
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-[11px] font-mono font-medium text-[var(--color-slate-muted)] bg-[var(--color-background)] px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
                        {centroid ? `${centroid[0].toFixed(4)}, ${centroid[1].toFixed(4)}` : "Coordinates unavailable"}
                      </div>
                      <button 
                        onClick={() => centroid && onLocateHotspot(centroid[1], centroid[0])}
                        disabled={!centroid}
                        className="px-4 py-2 bg-[var(--color-surface-soft)] hover:bg-[var(--color-border)] text-[var(--color-navy-deep)] border border-[var(--color-border)] text-[12px] font-bold rounded-[var(--radius-control)] transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> View on Map
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
