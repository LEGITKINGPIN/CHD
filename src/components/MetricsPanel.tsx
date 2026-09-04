import React from 'react';
import { ClusteringResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

interface MetricsPanelProps {
  result: ClusteringResult;
  algorithm: string;
  onClusterHover?: (clusterId: number | null) => void;
  hoveredClusterId?: number | null;
}

export default function MetricsPanel({ result, algorithm, onClusterHover, hoveredClusterId }: MetricsPanelProps) {
  const silhouetteVal = result.metrics.silhouette;
  // Aggregate clusters sizes
  const clusterCounts = new Map<number, number>();
  result.labels.forEach(l => {
    clusterCounts.set(l, (clusterCounts.get(l) || 0) + 1);
  });

  const chartData = Array.from(clusterCounts.entries())
    .map(([label, count]) => ({
      name: label === -1 ? 'Noise' : `C-${label}`,
      count,
      label
    }))
    .sort((a, b) => b.count - a.count);

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#cbd5e1'];

  return (
    <div className="w-full md:w-80 bg-[var(--color-surface)]/95 backdrop-blur shadow-lg rounded-[var(--radius-panel)] border border-[var(--color-border)] flex flex-col max-h-full">
      
      <div className="p-5 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-background)] rounded-t-[var(--radius-panel)]">
        <h3 className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-1">
          Model Diagnostics
        </h3>
        <p className="text-[14px] font-bold text-[var(--color-navy-deep)] leading-tight">{algorithm} execution results</p>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-control)] p-3">
            <div className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1">Clusters</div>
            <div className="text-[20px] font-black text-[var(--color-navy-deep)] leading-none">{result.metrics.numClusters}</div>
          </div>
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-control)] p-3" title={silhouetteVal == null ? "Requires >1 valid cluster to compute." : undefined}>
            <div className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider mb-1">Silhouette</div>
            <div className="text-[20px] font-black text-[var(--color-navy-deep)] leading-none">{silhouetteVal != null ? silhouetteVal.toFixed(3) : 'N/A'}</div>
          </div>
        </div>

      <div className="mb-2">
        <h4 className="text-[11px] font-bold text-[var(--color-slate-muted)] mb-3 uppercase tracking-widest">Cluster Distribution</h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-slate-muted)' }} />
              <Tooltip 
                cursor={{ fill: 'var(--color-surface-soft)' }}
                contentStyle={{ 
                  borderRadius: 'var(--radius-control)', 
                  border: '1px solid var(--color-border)', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-navy-deep)'
                }}
                itemStyle={{ fontSize: '12px', color: 'var(--color-navy-deep)' }}
                labelStyle={{ color: 'var(--color-slate-muted)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.label === -1 ? '#cbd5e1' : COLORS[entry.label % 5]} 
                    onMouseEnter={() => onClusterHover && onClusterHover(entry.label)}
                    onMouseLeave={() => onClusterHover && onClusterHover(null)}
                    style={{ 
                      opacity: hoveredClusterId !== undefined && hoveredClusterId !== null && hoveredClusterId !== entry.label ? 0.3 : 1,
                      transition: 'opacity 0.2s',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {result.hotspot_rankings && result.hotspot_rankings.length > 0 && (
        <div className="mb-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          <h4 className="text-[11px] font-bold text-[var(--color-slate-muted)] mb-3 uppercase tracking-widest mt-4">Top Hotspots by Intensity</h4>
          <div className="space-y-2">
            {result.hotspot_rankings.slice(0, 5).map((ranking, idx) => (
              <div 
                key={ranking.cluster_id} 
                className={`bg-[var(--color-background)] rounded-[var(--radius-control)] p-3 border flex items-center justify-between transition-all cursor-pointer ${hoveredClusterId === ranking.cluster_id ? 'border-[var(--color-primary)] shadow-sm' : 'border-[var(--color-border)]'} ${hoveredClusterId !== undefined && hoveredClusterId !== null && hoveredClusterId !== ranking.cluster_id ? 'opacity-50' : 'opacity-100'}`}
                onMouseEnter={() => onClusterHover && onClusterHover(ranking.cluster_id)}
                onMouseLeave={() => onClusterHover && onClusterHover(null)}
              >
                 <div>
                    <div className="text-[12px] font-bold text-[var(--color-navy-deep)] mb-0.5">Cluster {ranking.cluster_id}</div>
                    <div className="text-[11px] font-medium text-[var(--color-slate-muted)]">Vol: {ranking.volume} | Area: {ranking.area_sq_km} km²</div>
                 </div>
                 <div className={`text-[11px] font-bold px-2 py-1.5 rounded-[var(--radius-control)] uppercase tracking-wider ${
                    ranking.risk_category === 'Critical Hotspot' ? 'bg-[var(--color-rose)]/15 text-[var(--color-rose)] border border-[var(--color-rose)]/30' :
                    ranking.risk_category === 'High Risk' ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[var(--color-warning)]/30' :
                    'bg-[var(--color-indigo)]/15 text-[var(--color-indigo)] border border-[var(--color-indigo)]/30'
                 }`}>
                   {ranking.density_per_km2.toFixed(1)} /km²
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
        <div className="mt-5 p-4 bg-[var(--color-primary)]/5 text-[var(--color-primary)] rounded-[var(--radius-control)] text-[12px] font-medium leading-relaxed border border-[var(--color-primary)]/10">
          <strong className="block mb-1 font-semibold">Evaluation:</strong>
          {silhouetteVal != null ? (
            <span>
              Silhouette score of {silhouetteVal.toFixed(2)} indicates 
              {silhouetteVal > 0.5 ? ' strong ' : silhouetteVal > 0.25 ? ' fair ' : ' weak '}
              spatial structure. 
            </span>
          ) : (
            <span>Insufficient distinct clusters to calculate spatial metrics. </span>
          )}
          The algorithm identified {result.metrics.numClusters} dense regions.
        </div>
      </div>
    </div>
  );
}
