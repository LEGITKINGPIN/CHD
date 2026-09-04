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
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-[var(--color-slate)] font-semibold animate-pulse tracking-wide text-sm uppercase">Analyzing Temporal Trends...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-[var(--color-rose)] font-semibold text-sm">Insights unavailable: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-[24px] font-bold text-[var(--color-navy-deep)] tracking-tight">Temporal Insights</h2>
            <p className="text-[14px] text-[var(--color-slate-muted)] mt-1">Macro-level time-series analysis for {selectedDatasetKeys.join(', ')}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hourly Trend Chart */}
          <div className="bg-[var(--color-surface)] p-4 md:p-6 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] lg:col-span-2 overflow-hidden">
            <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-1">Hourly Crime Volume</h3>
            <p className="text-[12px] font-medium text-[var(--color-slate-muted)] mb-4">Crimes occurring throughout the 24-hour day cycle.</p>
            <div className="h-64 md:h-72 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.hourly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-muted)', fontSize: 11, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-muted)', fontSize: 11, fontWeight: 500}} />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)', fontSize: '12px', fontWeight: 500, backgroundColor: 'var(--color-surface)', color: 'var(--color-navy-deep)'}}
                    itemStyle={{color: 'var(--color-navy-deep)'}}
                    labelStyle={{color: 'var(--color-slate-muted)'}}
                  />
                  <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Composition Chart */}
          <div className="bg-[var(--color-surface)] p-4 md:p-6 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-hidden">
            <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-1">Day of Week Distribution</h3>
            <p className="text-[12px] font-medium text-[var(--color-slate-muted)] mb-4">Relative frequency across week days.</p>
            <div className="h-56 md:h-64 flex items-center justify-center relative w-full overflow-hidden">
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
                    contentStyle={{borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)', fontSize: '12px', fontWeight: 500, backgroundColor: 'var(--color-surface)', color: 'var(--color-navy-deep)'}}
                    itemStyle={{color: 'var(--color-navy-deep)'}}
                    labelStyle={{color: 'var(--color-slate-muted)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-[var(--color-surface)] p-4 md:p-6 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-hidden">
            <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)] mb-1">Monthly Crime Volume</h3>
            <p className="text-[12px] font-medium text-[var(--color-slate-muted)] mb-4">Long-term seasonal volume over months.</p>
            <div className="h-56 md:h-64 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly} margin={{ top: 5, right: 0, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--color-slate-muted)', fontSize: 11, fontWeight: 500}} 
                    interval={0}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-muted)', fontSize: 11, fontWeight: 500}} />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--color-surface-soft)'}}
                    contentStyle={{borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)', fontSize: '12px', fontWeight: 500, backgroundColor: 'var(--color-surface)', color: 'var(--color-navy-deep)'}}
                    itemStyle={{color: 'var(--color-navy-deep)'}}
                    labelStyle={{color: 'var(--color-slate-muted)'}}
                  />
                  <Bar dataKey="count" fill="var(--color-indigo)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
