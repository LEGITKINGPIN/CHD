import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Clock, BarChart3, Database } from 'lucide-react';
import { clsx } from 'clsx';

interface CompareAlgorithmsProps {
  selectedDatasetKeys: string[];
  selectedTypes: string[];
  selectedDistricts: string[];
  selectedArrest: string[];
  customMarker?: {lng: number, lat: number, radiusKm: number} | null;
  onVisualizeAlgorithm?: (algorithm: string) => void;
}

export default function CompareAlgorithms({ 
  selectedDatasetKeys, 
  selectedTypes, 
  selectedDistricts,
  selectedArrest,
  customMarker,
  onVisualizeAlgorithm 
}: CompareAlgorithmsProps) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const algorithms = ["K-MEANS", "DBSCAN", "HIERARCHICAL"];

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/compare-clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: selectedDatasetKeys.join(','),
          filter: selectedTypes,
          district: selectedDistricts,
          arrest: selectedArrest,
          algorithms: algorithms,
          customMarker: customMarker
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Comparison failed');
      
      setResults(data.comparison);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedDatasetKeys.length > 0) {
      runComparison();
    }
  }, [selectedDatasetKeys, selectedTypes, selectedDistricts, selectedArrest, customMarker]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        
        <header className="mb-4 md:mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[24px] font-bold text-[var(--color-navy-deep)] flex items-center gap-3 tracking-tight">
              Algorithm Comparison
              {customMarker && (
                <span className="text-[11px] font-bold px-2.5 py-1 bg-[var(--color-rose)]/10 text-[var(--color-rose)] rounded-full border border-[var(--color-rose)]/20 uppercase tracking-wider">
                  Custom Area Active ({customMarker.radiusKm.toFixed(1)} km)
                </span>
              )}
            </h2>
            <p className="text-[14px] text-[var(--color-slate-muted)] mt-1">Run multiple clustering algorithms concurrently to evaluate their relative performance on the current dataset.</p>
          </div>
          <button
            onClick={runComparison}
            disabled={loading || selectedDatasetKeys.length === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:opacity-50 text-[var(--color-surface)] text-[13px] font-semibold rounded-[var(--radius-control)] transition-colors shadow-sm min-h-[44px]"
          >
            {loading ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Computing...</span>
            ) : (
              <span className="flex items-center gap-2"><Play className="w-4 h-4"/> Run Comparison</span>
            )}
          </button>
        </header>

        {error && error === 'No records match the filter criteria.' ? (
          <div className="p-8 bg-[var(--color-warning)]/10 rounded-[var(--radius-panel)] border border-[var(--color-warning)]/20 text-center space-y-3 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-warning)]"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
            <div className="text-[var(--color-navy-deep)] font-bold text-[16px]">No matching records found</div>
            <p className="text-[var(--color-slate-muted)] max-w-md mx-auto text-[13px] font-medium">
              The current combination of dataset, filters, and custom area selection yielded zero results. Try broadening your filters or increasing the custom area radius to compare models.
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-[var(--color-rose)]/10 text-[var(--color-rose)] rounded-[var(--radius-control)] border border-[var(--color-rose)]/20 text-[13px] font-bold">
            Error running comparison: {error}
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-x-auto custom-scrollbar w-full">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[var(--color-slate-muted)] text-[11px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Algorithm</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Clusters</th>
                    <th className="px-6 py-4 text-right">Noise Points</th>
                    <th className="px-6 py-4 text-right">Silhouette</th>
                    <th className="px-6 py-4 text-right">Davies-Bouldin</th>
                    <th className="px-6 py-4 text-right">Runtime</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {results.map((res, i) => (
                    <tr key={i} className="hover:bg-[var(--color-surface-soft)] transition-colors">
                      <td className="px-6 py-4 font-bold text-[14px] text-[var(--color-navy-deep)]">{res.algorithm}</td>
                      <td className="px-6 py-4">
                        {res.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-[var(--color-teal)] font-bold text-[12px]">
                            <CheckCircle2 className="w-4 h-4" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[var(--color-rose)] font-bold text-[12px]" title={res.message}>
                            <XCircle className="w-4 h-4" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[13px] text-[var(--color-slate)]">
                        {res.status === 'success' ? res.metrics.numClusters : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[13px] text-[var(--color-slate)]">
                        {res.status === 'success' ? res.metrics.numNoise : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[13px] text-[var(--color-slate)]">
                        {res.status === 'success' && res.metrics.silhouette !== null 
                          ? res.metrics.silhouette.toFixed(3) 
                          : <span className="text-[var(--color-slate-muted)]">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[13px] text-[var(--color-slate)]">
                        {res.status === 'success' && res.metrics.daviesBouldin !== null 
                          ? res.metrics.daviesBouldin.toFixed(3) 
                          : <span className="text-[var(--color-slate-muted)]">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[13px] text-[var(--color-slate)]">
                        {res.status === 'success' ? `${res.metrics.runtimeMs.toFixed(0)}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => onVisualizeAlgorithm && onVisualizeAlgorithm(res.algorithm)}
                          disabled={res.status !== 'success'}
                          className="px-4 py-1.5 text-[11px] font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-[var(--radius-control)] disabled:opacity-50 transition-colors uppercase tracking-wider"
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[var(--color-surface)] p-4 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
                <h3 className="font-bold text-[14px] text-[var(--color-navy-deep)] mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--color-primary)]"/> How to interpret these metrics?
                </h3>
                <ul className="text-[13px] text-[var(--color-slate)] space-y-2 list-disc pl-5 font-medium">
                  <li><strong>Silhouette Score (-1 to 1):</strong> Higher is better. Measures how similar an object is to its own cluster compared to other clusters.</li>
                  <li><strong>Davies-Bouldin Index:</strong> Lower is better. Measures the average similarity between each cluster and its most similar one.</li>
                  <li><strong>N/A Values:</strong> Geometric metrics are mathematically undefined for algorithms that produce only a single cluster or consider all points as noise.</li>
                </ul>
              </div>
              <div className="bg-[var(--color-surface)] p-4 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
                <h3 className="font-bold text-[14px] text-[var(--color-navy-deep)] mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--color-teal)]"/> Scientific Integrity
                </h3>
                <p className="text-[13px] text-[var(--color-slate)] font-medium leading-relaxed">
                  K-Means uses Euclidean distance on projected UTM coordinates, while DBSCAN uses Haversine distance on spherical coordinates. The metrics are calculated accordingly to preserve geometric correctness, preventing distorted evaluation.
                </p>
              </div>
            </div>

          </div>
        ) : (
          !loading && (
            <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-panel)] p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-[var(--color-slate-muted)]" />
              </div>
              <h3 className="text-[18px] font-bold text-[var(--color-navy-deep)] mb-2">No Comparison Run</h3>
              <p className="text-[14px] text-[var(--color-slate)] font-medium max-w-md mx-auto">
                Click "Run Comparison" to execute K-Means, DBSCAN, and Hierarchical clustering concurrently and compare their evaluation metrics.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
