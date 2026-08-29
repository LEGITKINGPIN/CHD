import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface MacroDashboardProps {
  selectedDatasetKeys: string[];
  selectedTypes?: string[];
  selectedDistricts?: string[];
  selectedArrest?: string[];
}

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#64748b', '#0f172a'];

export default function MacroDashboard({ selectedDatasetKeys, selectedTypes = ['ALL'], selectedDistricts = ['ALL'], selectedArrest = ['ALL'] }: MacroDashboardProps) {
  const [data, setData] = useState<{hourly: any, monthly: any, weekly: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
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
        
        if (!res.ok) {
          throw new Error(json.detail || 'Failed to fetch data');
        }
        
        const temporal = json.temporal;
        
        // Transform the data for Recharts
        const hourlyData = Object.entries(temporal.hourly).map(([hour, count]) => ({
          hour: `${hour.padStart(2, '0')}:00`,
          count: count as number
        }));
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = Object.entries(temporal.monthly).map(([month, count]) => ({
          month: monthNames[parseInt(month) - 1],
          count: count as number
        }));
        
        const weeklyData = Object.entries(temporal.weekly).map(([day, count]) => ({
          day,
          count: count as number
        }));

        setData({
          hourly: hourlyData,
          monthly: monthlyData,
          weekly: weeklyData
        });
      } catch (err: any) {
        setError(err.message || 'Error loading temporal trends');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedDatasetKeys, selectedTypes, selectedDistricts]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Analyzing Temporal Trends...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-rose-500 font-medium">Insights unavailable: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Temporal Insights</h2>
            <p className="text-slate-500">Macro-level time-series analysis for {selectedDatasetKeys.join(', ')}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hourly Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Hourly Crime Volume</h3>
            <p className="text-sm text-slate-500 mb-4">Crimes occurring throughout the 24-hour day cycle.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.hourly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Composition Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Day of Week Distribution</h3>
            <div className="h-72 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.weekly}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="day"
                  >
                    {data.weekly.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Crime Volume</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly} margin={{ top: 5, right: 0, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11}} 
                    interval={0}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
