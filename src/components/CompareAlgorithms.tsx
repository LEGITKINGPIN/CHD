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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              Algorithm Comparison
              {customMarker && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                  Custom Area Active ({customMarker.radiusKm.toFixed(1)} km)
                </span>
              )}
            </h2>
            <p className="text-slate-500 mt-1">Run multiple clustering algorithms concurrently to evaluate their relative performance on the current dataset.</p>
          </div>
          <button
            onClick={runComparison}
            disabled={loading || selectedDatasetKeys.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Computing...</span>
            ) : (
              <span className="flex items-center gap-2"><Play className="w-4 h-4"/> Run Comparison</span>
            )}
          </button>
        </header>

        {error && error === 'No records match the filter criteria.' ? (
          <div className="p-8 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-3 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
            <div className="text-amber-800 font-medium text-lg">No matching records found</div>
            <p className="text-amber-600 max-w-md mx-auto text-sm">
              The current combination of dataset, filters, and custom area selection yielded zero results. Try broadening your filters or increasing the custom area radius to compare models.
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            Error running comparison: {error}
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100">
                  {results.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{res.algorithm}</td>
                      <td className="px-6 py-4">
                        {res.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm">
                            <CheckCircle2 className="w-4 h-4" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-sm" title={res.message}>
                            <XCircle className="w-4 h-4" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {res.status === 'success' ? res.metrics.numClusters : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {res.status === 'success' ? res.metrics.numNoise : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {res.status === 'success' && res.metrics.silhouette !== null 
                          ? res.metrics.silhouette.toFixed(3) 
                          : <span className="text-slate-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {res.status === 'success' && res.metrics.daviesBouldin !== null 
                          ? res.metrics.daviesBouldin.toFixed(3) 
                          : <span className="text-slate-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {res.status === 'success' ? `${res.metrics.runtimeMs.toFixed(0)}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => onVisualizeAlgorithm && onVisualizeAlgorithm(res.algorithm)}
                          disabled={res.status !== 'success'}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 transition-colors"
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500"/> How to interpret these metrics?
                </h3>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                  <li><strong>Silhouette Score (-1 to 1):</strong> Higher is better. Measures how similar an object is to its own cluster compared to other clusters.</li>
                  <li><strong>Davies-Bouldin Index:</strong> Lower is better. Measures the average similarity between each cluster and its most similar one.</li>
                  <li><strong>N/A Values:</strong> Geometric metrics are mathematically undefined for algorithms that produce only a single cluster or consider all points as noise.</li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500"/> Scientific Integrity
                </h3>
                <p className="text-sm text-slate-600">
                  K-Means uses Euclidean distance on projected UTM coordinates, while DBSCAN uses Haversine distance on spherical coordinates. The metrics are calculated accordingly to preserve geometric correctness, preventing distorted evaluation.
                </p>
              </div>
            </div>

          </div>
        ) : (
          !loading && (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Comparison Run</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Click "Run Comparison" to execute K-Means, DBSCAN, and Hierarchical clustering concurrently and compare their evaluation metrics.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
