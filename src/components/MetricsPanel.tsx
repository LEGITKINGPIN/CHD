import React from 'react';
import { ClusteringResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

interface MetricsPanelProps {
  result: ClusteringResult;
  algorithm: string;
}

export default function MetricsPanel({ result, algorithm }: MetricsPanelProps) {
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
    <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur shadow-lg rounded-xl border border-slate-200 p-5 z-20">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
        Model Diagnostics
      </h3>
      <p className="text-xs text-slate-500 mb-4">{algorithm} execution results</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clusters</div>
          <div className="text-xl font-bold text-slate-900">{result.metrics.numClusters}</div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3" title={silhouetteVal === null ? "Requires >1 valid cluster to compute." : undefined}>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Silhouette</div>
          <div className="text-xl font-bold text-slate-900">{silhouetteVal !== null ? silhouetteVal.toFixed(3) : 'N/A'}</div>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Cluster Distribution</h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.label === -1 ? '#cbd5e1' : COLORS[entry.label % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs leading-relaxed border border-blue-100">
        <strong className="block mb-1 font-semibold">Evaluation:</strong>
        {silhouetteVal !== null ? (
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
  );
}
