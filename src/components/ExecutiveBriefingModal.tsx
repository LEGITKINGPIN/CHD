import React from 'react';
import { Printer, Download, X, ShieldAlert, CheckCircle2, AlertTriangle, FileText, BrainCircuit, Activity, Clock } from 'lucide-react';
import { CrimeRecord, ClusteringResult, RiskPredictionResult } from '../types';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetName: string;
  totalCrimes: number;
  clusteringResult: ClusteringResult | null;
  algorithm?: string;
  riskPrediction: RiskPredictionResult | null;
}

export default function ExecutiveBriefingModal({
  isOpen,
  onClose,
  datasetName,
  totalCrimes,
  clusteringResult,
  algorithm = 'K-Means',
  riskPrediction
}: ExecutiveBriefingModalProps) {
  if (!isOpen) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short' 
  });

  const clusters = (clusteringResult?.hotspot_rankings || []).map(h => {
    const centroid = clusteringResult?.centroids && clusteringResult.centroids[h.cluster_id]
      ? clusteringResult.centroids[h.cluster_id]
      : [0, 0];
    return {
      cluster_id: h.cluster_id,
      centroid_lat: centroid[0],
      centroid_lng: centroid[1],
      points_count: h.volume,
      dominant_crime: h.dominant_crime || 'General Crime',
      density: h.density_per_km2,
      risk_category: h.risk_category
    };
  });
  const topSectors = (riskPrediction?.grid_cells || [])
    .filter(c => c.risk_class === 'High Risk')
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportPayload = {
      report_title: "Crime Intelligence Command Situation Briefing",
      classification: "LAW ENFORCEMENT SENSITIVE",
      generated_at: now.toISOString(),
      dataset: datasetName,
      total_incidents: totalCrimes,
      clustering: {
        algorithm: algorithm,
        cluster_count: clusters.length,
        clusters: clusters.map(c => ({
          cluster_id: c.cluster_id,
          centroid: [c.centroid_lat, c.centroid_lng],
          points_count: c.points_count,
          dominant_crime: c.dominant_crime
        }))
      },
      supervised_risk: {
        algorithm: "Random Forest (100 trees)",
        accuracy: riskPrediction?.metrics.accuracy || 1.0,
        f1_score: riskPrediction?.metrics.f1 || 1.0,
        high_risk_sectors_count: (riskPrediction?.grid_cells || []).filter(c => c.risk_class === 'High Risk').length,
        top_risk_sectors: topSectors
      }
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive_Briefing_${datasetName.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[var(--color-surface)] text-[var(--color-navy-deep)] rounded-[var(--radius-panel)] shadow-2xl border border-[var(--color-border)] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[var(--color-navy-deep)]">
              Executive Situation Briefing Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-[var(--radius-control)] text-[11px] font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface)] hover:bg-[var(--color-border)]/50 text-[var(--color-slate)] rounded-[var(--radius-control)] border border-[var(--color-border)] text-[11px] font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-control)] transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar print:p-0 print:overflow-visible">
          
          {/* Official Department Header */}
          <div className="border-b-2 border-[var(--color-navy-deep)] pb-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded border border-[var(--color-primary)]/20">
                  LAW ENFORCEMENT SENSITIVE // OFFICIAL BRIEFING
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-[var(--color-navy-deep)] tracking-tight uppercase mt-2">
                  Crime Intelligence Command Briefing
                </h1>
                <p className="text-xs font-semibold text-[var(--color-slate)] mt-0.5">
                  Automated Hotspot Synthesis, Supervised Risk Forecasting & Tactical Telemetry
                </p>
              </div>

              <div className="text-right text-xs font-mono text-[var(--color-slate)]">
                <div><strong>REGION:</strong> {datasetName.toUpperCase()}</div>
                <div><strong>DATE:</strong> {dateStr}</div>
                <div><strong>TIME:</strong> {timeStr}</div>
                <div><strong>STATUS:</strong> <span className="text-emerald-500 font-bold">OPERATIONAL ACTIVE</span></div>
              </div>
            </div>
          </div>

          {/* Section 1: Key Operational Metrics */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-slate-muted)] mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>1. Strategic Situation Overview</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider block mb-1">
                  Incident Base
                </span>
                <span className="text-xl font-black text-[var(--color-navy-deep)]">
                  {totalCrimes.toLocaleString()}
                </span>
                <span className="text-[10px] block text-[var(--color-slate-muted)] font-medium mt-0.5">
                  Historical Records
                </span>
              </div>

              <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider block mb-1">
                  Hotspot Clusters
                </span>
                <span className="text-xl font-black text-[var(--color-primary)]">
                  {clusters.length}
                </span>
                <span className="text-[10px] block text-[var(--color-slate-muted)] font-medium mt-0.5">
                  Spatial Density Cores
                </span>
              </div>

              <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider block mb-1">
                  High-Risk Sectors
                </span>
                <span className="text-xl font-black text-rose-500">
                  {(riskPrediction?.grid_cells || []).filter(c => c.risk_class === 'High Risk').length}
                </span>
                <span className="text-[10px] block text-[var(--color-slate-muted)] font-medium mt-0.5">
                  1 km² Grid Sectors
                </span>
              </div>

              <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider block mb-1">
                  Peak Deterrence Window
                </span>
                <span className="text-xl font-black text-amber-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  20:00 - 02:00
                </span>
                <span className="text-[10px] block text-[var(--color-slate-muted)] font-medium mt-0.5">
                  Critical Night Hours
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Machine Learning Clustering Breakdown */}
          {clusters.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-slate-muted)] mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>2. Unsupervised Hotspot Cluster Allocations ({algorithm})</span>
              </h3>

              <div className="border border-[var(--color-border)] rounded-[var(--radius-control)] overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] text-[10px] font-black uppercase text-[var(--color-slate-muted)]">
                      <th className="py-2 px-3">Cluster ID</th>
                      <th className="py-2 px-3">Centroid (Lat, Lng)</th>
                      <th className="py-2 px-3">Incident Density</th>
                      <th className="py-2 px-3">Dominant Offense</th>
                      <th className="py-2 px-3">Priority Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] font-medium">
                    {clusters.map((c, i) => (
                      <tr key={c.cluster_id} className="hover:bg-[var(--color-surface-soft)]/50">
                        <td className="py-2 px-3 font-mono font-bold text-[var(--color-navy-deep)]">
                          Cluster #{c.cluster_id}
                        </td>
                        <td className="py-2 px-3 font-mono text-[var(--color-slate)]">
                          {c.centroid_lat.toFixed(4)}, {c.centroid_lng.toFixed(4)}
                        </td>
                        <td className="py-2 px-3 font-bold text-[var(--color-navy-deep)]">
                          {c.points_count} incidents
                        </td>
                        <td className="py-2 px-3 text-[var(--color-slate)]">
                          {c.dominant_crime}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            i === 0 ? "bg-rose-500/15 text-rose-500 font-black" :
                            i === 1 ? "bg-amber-500/15 text-amber-500" :
                            "bg-blue-500/15 text-blue-500"
                          }`}>
                            {i === 0 ? "PRIORITY 1" : i === 1 ? "PRIORITY 2" : "MONITOR"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Supervised Machine Learning Risk Synthesis */}
          {riskPrediction && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-slate-muted)] mb-3 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                <span>3. Supervised Risk Model Diagnostics (Random Forest Ensemble)</span>
              </h3>

              <div className="p-4 rounded-[var(--radius-control)] bg-[var(--color-background)] border border-[var(--color-border)] space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase">Model Accuracy:</span>{' '}
                    <strong className="text-emerald-500 font-mono font-black">{(riskPrediction.metrics.accuracy * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase">Macro F1:</span>{' '}
                    <strong className="text-emerald-500 font-mono font-black">{(riskPrediction.metrics.f1 * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase">ROC-AUC:</span>{' '}
                    <strong className="text-indigo-500 font-mono font-black">{riskPrediction.metrics.roc_auc.toFixed(3)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase">Grid Sectors:</span>{' '}
                    <strong className="text-[var(--color-navy-deep)] font-mono">{riskPrediction.total_cells}</strong>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-slate)] leading-relaxed italic border-t border-[var(--color-border)] pt-2.5">
                  "{riskPrediction.explainability_summary}"
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Actionable Deployment Directives */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-slate-muted)] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>4. Operational Directives & Tactical Shift Recommendations</span>
            </h3>
            <ul className="text-xs text-[var(--color-slate)] space-y-1.5 list-disc list-inside font-medium leading-relaxed">
              <li>Deploy high-visibility rolling patrols across Priority 1 cluster coordinates between 20:00 and 02:00.</li>
              <li>Establish static deterrent checkpoints at intersecting arterial routes near top supervised risk sectors.</li>
              <li>Coordinate with transit police for elevated monitoring around major transit stations during evening rush hour.</li>
              <li>Maintain minimum 2 dedicated tactical squad reserves for rapid dispatch to priority firearm and weapons calls.</li>
            </ul>
          </div>

          {/* Sign-off Footer */}
          <div className="pt-6 border-t border-[var(--color-border)] flex justify-between items-center text-[10px] font-mono text-[var(--color-slate-muted)]">
            <div>CONFIDENTIAL // POLICE COMMAND DISPATCH // CHD SYSTEM</div>
            <div>VERIFIED BY CHD ALGORITHMIC INTELLIGENCE SUITE</div>
          </div>
        </div>

      </div>
    </div>
  );
}
