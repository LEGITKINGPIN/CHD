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
  }, [selectedDatasetKeys, selectedTypes, selectedDistricts]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Computing Exploratory Data Analysis...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-rose-500 font-medium">EDA unavailable: {error}</div>
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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Exploratory Data Analysis</h2>
          <p className="text-slate-500">Distribution, categorical trends, and data quality metrics for the current filtered selection.</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700">Total Incidents</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{data.summary.total_incidents.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Filtered valid records</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700">Dominant Crime</h3>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate" title={data.summary.top_crime}>{data.summary.top_crime}</p>
            <p className="text-xs text-slate-500 mt-1">Most frequent category</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700">Peak Hour</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {String(data.summary.peak_hour).padStart(2, '0')}:00
            </p>
            <p className="text-xs text-slate-500 mt-1">Highest frequency window</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <MapIcon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700">Data Quality</h3>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {(((data.summary.total_source_rows - data.summary.dropped_rows) / data.summary.total_source_rows) * 100).toFixed(1)}% Valid
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {data.summary.dropped_rows.toLocaleString()} dropped due to invalid geocoding
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crime Types Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Top Crime Categories</h3>
            <p className="text-sm text-slate-500 mb-6">Distribution of incidents by primary type (Top 10)</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} width={120} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Geographic Distribution</h3>
            <p className="text-sm text-slate-500 mb-6">Incident concentration by district or area</p>
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
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400">District data unavailable for this dataset</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
