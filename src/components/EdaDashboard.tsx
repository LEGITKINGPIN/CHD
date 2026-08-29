import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FileText, Map as MapIcon, Clock, AlertTriangle } from 'lucide-react';

interface EdaDashboardProps {
  selectedDatasetKeys: string[];
  selectedTypes: string[];
  selectedDistricts: string[];
  selectedArrest: string[];
}

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#64748b', '#0f172a'];

export default function EdaDashboard({ selectedDatasetKeys, selectedTypes, selectedDistricts, selectedArrest }: EdaDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEda() {
      if (selectedDatasetKeys.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/eda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: selectedDatasetKeys.join(','),
            filter: selectedTypes,
            district: selectedDistricts,
            arrest: selectedArrest
          })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to fetch EDA data');
        
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEda();
  }, [selectedDatasetKeys, selectedTypes, selectedDistricts, selectedArrest]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-[var(--color-slate)] font-semibold animate-pulse tracking-wide text-sm uppercase">Computing Exploratory Data Analysis...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-[var(--color-rose)] font-semibold text-sm">EDA unavailable: {error}</div>
      </div>
    );
  }

  // Prepare data for charts
  const crimeTypeData = Object.entries(data.distribution.crime_types)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const districtData = Object.entries(data.distribution.districts)
    .sort((a: any, b: any) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h2 className="text-[24px] font-bold text-[var(--color-navy-deep)] tracking-tight">Exploratory Data Analysis</h2>
          <p className="text-[14px] text-[var(--color-slate-muted)] mt-1">Distribution, categorical trends, and data quality metrics for the current filtered selection.</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-[var(--radius-control)] text-[var(--color-primary)]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-[12px] font-bold text-[var(--color-slate)] uppercase tracking-wider">Total Incidents</h3>
            </div>
            <p className="text-[28px] font-black text-[var(--color-navy-deep)] leading-none">{data.summary.total_incidents.toLocaleString()}</p>
            <p className="text-[11px] font-medium text-[var(--color-slate-muted)] mt-2">Filtered valid records</p>
          </div>
          
          <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--color-rose)]/10 rounded-[var(--radius-control)] text-[var(--color-rose)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-[12px] font-bold text-[var(--color-slate)] uppercase tracking-wider">Dominant Crime</h3>
            </div>
            <p className="text-[20px] font-bold text-[var(--color-navy-deep)] truncate leading-none" title={data.summary.top_crime}>{data.summary.top_crime}</p>
            <p className="text-[11px] font-medium text-[var(--color-slate-muted)] mt-2">Most frequent category</p>
          </div>

          <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--color-indigo)]/10 rounded-[var(--radius-control)] text-[var(--color-indigo)]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-[12px] font-bold text-[var(--color-slate)] uppercase tracking-wider">Peak Hour</h3>
            </div>
            <p className="text-[28px] font-black text-[var(--color-navy-deep)] leading-none">
              {String(data.summary.peak_hour).padStart(2, '0')}:00
            </p>
            <p className="text-[11px] font-medium text-[var(--color-slate-muted)] mt-2">Highest frequency window</p>
          </div>

          <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--color-teal)]/10 rounded-[var(--radius-control)] text-[var(--color-teal)]">
                <MapIcon className="w-5 h-5" />
              </div>
              <h3 className="text-[12px] font-bold text-[var(--color-slate)] uppercase tracking-wider">Data Quality</h3>
            </div>
            <p className="text-[24px] font-black text-[var(--color-navy-deep)] leading-none">
              {(((data.summary.total_source_rows - data.summary.dropped_rows) / data.summary.total_source_rows) * 100).toFixed(1)}% Valid
            </p>
            <p className="text-[11px] font-medium text-[var(--color-slate-muted)] mt-2">
              {data.summary.dropped_rows.toLocaleString()} dropped due to invalid geocoding
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crime Types Chart */}
          <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-1">Top Crime Categories</h3>
            <p className="text-[12px] font-medium text-[var(--color-slate-muted)] mb-6">Distribution of incidents by primary type (Top 10)</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-muted)', fontSize: 11, fontWeight: 500}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate)', fontSize: 11, fontWeight: 600}} width={120} />
                  <Tooltip 
                    cursor={{fill: 'var(--color-background)'}}
                    contentStyle={{borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 500, backgroundColor: 'var(--color-surface)'}}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Chart */}
          <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-1">Geographic Distribution</h3>
            <p className="text-[12px] font-medium text-[var(--color-slate-muted)] mb-6">Incident concentration by district or area</p>
            <div className="h-80 flex items-center justify-center relative">
              {districtData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={districtData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {districtData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 500, backgroundColor: 'var(--color-surface)'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[var(--color-slate-muted)] font-medium text-sm">District data unavailable for this dataset</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
