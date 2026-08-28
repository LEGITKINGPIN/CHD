import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface NationalTrend {
  year: string;
  total: number;
  ipc: number;
  sll: number;
  rate: number;
}

interface IpcComposition {
  id: string;
  name: string;
  cases: number;
  pct: number;
}

interface StateRate {
  id: string;
  name: string;
  rate: number;
  total: number;
}

interface CrimeOverview {
  year: string;
  nationalTrend: NationalTrend[];
  ipcComposition: IpcComposition[];
  stateRates: StateRate[];
  source: string;
}

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#64748b', '#0f172a'];

export default function MacroDashboard() {
  const [data, setData] = useState<CrimeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://indiandataproject.org/data/crime/2025-26/overview.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Loading National Insights...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-rose-500 font-medium">Failed to load insights: {error}</div>
      </div>
    );
  }

  // Format tick functions for charts
  const formatCompactNumber = (number: number) => {
    return Intl.NumberFormat('en-IN', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">National Crime Overview</h2>
            <p className="text-slate-500">Macro-level statistics powered by Indian Data Project ({data.year})</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* National Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">National Crime Rate Trend</h3>
            <p className="text-sm text-slate-500 mb-4">Crimes per 100,000 population over the last decade.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.nationalTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [value, 'Crime Rate']}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* IPC Composition Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">IPC Crime Composition</h3>
            <p className="text-sm text-slate-500 mb-4">Breakdown of major Indian Penal Code crimes.</p>
            <div className="h-72 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ipcComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="pct"
                    nameKey="name"
                  >
                    {data.ipcComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* State Rates Chart (Full width) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Crime Rates by State</h3>
            <p className="text-sm text-slate-500 mb-6">Total cognizable crimes per 100,000 population across Indian states & UTs.</p>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.stateRates} margin={{ top: 5, right: 0, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11}} 
                    interval={0}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={formatCompactNumber} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [value, 'Crime Rate']}
                    labelFormatter={(label) => {
                      const state = data.stateRates.find(s => s.id === label);
                      return state ? state.name : label;
                    }}
                  />
                  <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
        
        <footer className="mt-8 text-center text-sm text-slate-400">
          Source: {data.source}
        </footer>

      </div>
    </div>
  );
}
