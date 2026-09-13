import React, { useState, useEffect, useMemo } from 'react';
import { RiskPredictionResult, RiskGridCell, FeatureRankingItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  BrainCircuit, ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, 
  MapPin, RefreshCw, Sparkles, Layers, Sliders, ArrowUpRight, Search, Activity, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

interface RiskDashboardProps {
  selectedDatasetKeys: string[];
  onDeployRiskGrid?: (cells: RiskGridCell[]) => void;
  onLocateSector?: (lng: number, lat: number) => void;
  onGoToMap?: () => void;
  activeRiskGrid?: RiskGridCell[] | null;
  onPredictionsLoaded?: (res: RiskPredictionResult) => void;
}

const FEATURE_NAMES: Record<string, string> = {
  total_crimes: 'Historical Incident Volume',
  violent_ratio: 'Violent Offense Proportion',
  night_ratio: 'Nighttime Vulnerability Ratio',
  weekend_ratio: 'Weekend Incident Ratio',
  grid_lng: 'Spatial Longitude Coordinate',
  grid_lat: 'Spatial Latitude Coordinate',
};

const FEATURE_COLORS = ['#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981'];

const RISK_COLORS: Record<string, string> = {
  'High Risk': '#ef4444',
  'Medium Risk': '#f59e0b',
  'Low Risk': '#10b981',
};

export default function RiskDashboard({
  selectedDatasetKeys,
  onDeployRiskGrid,
  onLocateSector,
  onGoToMap,
  activeRiskGrid,
  onPredictionsLoaded
}: RiskDashboardProps) {
  const [result, setResult] = useState<RiskPredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hyperparameters
  const [nEstimators, setNEstimators] = useState<number>(100);
  const [testSize, setTestSize] = useState<number>(0.20);

  // Sector Table Filters
  const [sectorSearch, setSectorSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High Risk' | 'Medium Risk' | 'Low Risk'>('ALL');

  const datasetKey = selectedDatasetKeys[0] || 'delhi';

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: datasetKey,
          n_estimators: nEstimators,
          test_size: testSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Prediction model execution failed');
      setResult(data);
      onPredictionsLoaded?.(data);
    } catch (err: any) {
      setError(err.message || 'Error executing Random Forest risk classifier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [datasetKey]);

  // Formatted chart data for Feature Importance
  const featureChartData = useMemo(() => {
    if (!result || !result.feature_ranking) return [];
    return result.feature_ranking.map((item, idx) => ({
      name: FEATURE_NAMES[item.feature] || item.feature,
      rawFeature: item.feature,
      importance: item.importance,
      color: FEATURE_COLORS[idx % FEATURE_COLORS.length],
    }));
  }, [result]);

  // Filtered sectors for table
  const filteredSectors = useMemo(() => {
    if (!result || !result.grid_cells) return [];
    return result.grid_cells.filter((cell) => {
      const matchesSearch = 
        cell.grid_id.toLowerCase().includes(sectorSearch.toLowerCase()) ||
        cell.grid_lat.toString().includes(sectorSearch) ||
        cell.grid_lng.toString().includes(sectorSearch);
      const matchesRisk = riskFilter === 'ALL' || cell.risk_class === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [result, sectorSearch, riskFilter]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-background)] gap-3">
        <div className="w-9 h-9 border-3 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
        <div className="text-[var(--color-slate)] font-bold tracking-wider text-xs uppercase animate-pulse">Training Random Forest Risk Model...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)] p-6">
        <div className="max-w-md w-full bg-[var(--color-surface)] border border-rose-500/20 rounded-[var(--radius-panel)] p-6 text-center shadow-md smooth-card">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[16px] text-[var(--color-navy-deep)] mb-2">Model Execution Error</h3>
          <p className="text-[13px] text-[var(--color-slate-muted)] mb-5">{error}</p>
          <button
            onClick={fetchPredictions}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-[12px] font-bold rounded-[var(--radius-control)] shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            Retry Model Training
          </button>
        </div>
      </div>
    );
  }

  const m = result.metrics;
  const isDeployed = !!(activeRiskGrid && activeRiskGrid.length > 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] p-6 md:p-8 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25">
                  <BrainCircuit className="w-3 h-3" />
                  Supervised Machine Learning & XAI
                </span>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider">
                  Random Forest Classifier
                </span>
              </div>
              <h2 className="text-[24px] md:text-[28px] font-black text-[var(--color-navy-deep)] tracking-tight">
                Predictive Crime Risk Classifier
              </h2>
              <p className="text-[13px] text-[var(--color-slate-muted)] font-medium max-w-2xl mt-1">
                Supervised ensemble classification mapping spatial 1 km² sectors into multi-class risk tiers based on historical volume, violence ratios, and temporal night patterns.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={fetchPredictions}
                title="Retrain Model"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-slate)] hover:text-[var(--color-navy-deep)] text-[12px] font-bold rounded-[var(--radius-control)] border border-[var(--color-border)] transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retrain</span>
              </button>

              {onDeployRiskGrid && (
                <button
                  onClick={() => {
                    onDeployRiskGrid(result.grid_cells);
                    if (onGoToMap) onGoToMap();
                  }}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 text-[12px] font-bold rounded-[var(--radius-control)] shadow-md transition-all cursor-pointer",
                    isDeployed
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30"
                      : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-indigo)] hover:opacity-95 text-white"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isDeployed ? 'Risk Grid Active on Map ✓' : 'Deploy Risk Grid to Map'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Model Specification Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-6 border-t border-[var(--color-border)] text-[11px]">
            <div>
              <span className="text-[var(--color-slate-muted)] font-bold uppercase tracking-wider block text-[10px]">Dataset</span>
              <span className="font-bold text-[var(--color-navy-deep)] uppercase">{result.dataset}</span>
            </div>
            <div>
              <span className="text-[var(--color-slate-muted)] font-bold uppercase tracking-wider block text-[10px]">Architecture</span>
              <span className="font-bold text-[var(--color-navy-deep)]">RandomForest (100 Trees)</span>
            </div>
            <div>
              <span className="text-[var(--color-slate-muted)] font-bold uppercase tracking-wider block text-[10px]">Train / Test Split</span>
              <span className="font-bold text-[var(--color-navy-deep)]">{((result.split_ratio || 0.8) * 100).toFixed(0)}% Train / {(((1 - (result.split_ratio || 0.8))) * 100).toFixed(0)}% Validation</span>
            </div>
            <div>
              <span className="text-[var(--color-slate-muted)] font-bold uppercase tracking-wider block text-[10px]">Spatial Scope</span>
              <span className="font-bold text-[var(--color-navy-deep)]">{result.total_cells} 1km² Grid Sectors</span>
            </div>
          </div>
        </div>

        {/* Evaluation Metrics Scorecard */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[var(--color-navy-deep)] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-primary)]" />
              Test-Set Performance Metrics
            </h3>
            <span className="text-[11px] font-semibold text-[var(--color-slate-muted)]">
              Evaluated on {result.test_cells} unseen validation sectors
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Accuracy */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-wider uppercase block mb-1">
                  Accuracy
                </span>
                <div className="text-[26px] font-black text-[var(--color-navy-deep)] tracking-tight">
                  {(m.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stratified Holdout</span>
              </div>
            </div>

            {/* F1-Score */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-wider uppercase block mb-1">
                  Macro F1-Score
                </span>
                <div className="text-[26px] font-black text-[var(--color-primary)] tracking-tight">
                  {(m.f1 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                <span>Harmonic Mean</span>
              </div>
            </div>

            {/* Precision */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-wider uppercase block mb-1">
                  Precision
                </span>
                <div className="text-[26px] font-black text-[var(--color-navy-deep)] tracking-tight">
                  {(m.precision * 100).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 text-[11px] font-medium text-[var(--color-slate-muted)]">
                Low false positives
              </div>
            </div>

            {/* Recall */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-wider uppercase block mb-1">
                  Recall
                </span>
                <div className="text-[26px] font-black text-[var(--color-navy-deep)] tracking-tight">
                  {(m.recall * 100).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 text-[11px] font-medium text-[var(--color-slate-muted)]">
                True positive capture
              </div>
            </div>

            {/* ROC-AUC */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between max-sm:col-span-2">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-wider uppercase block mb-1">
                  Multiclass ROC-AUC
                </span>
                <div className="text-[26px] font-black text-indigo-500 tracking-tight">
                  {m.roc_auc.toFixed(3)}
                </div>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-indigo-400">
                One-vs-Rest (OvR)
              </div>
            </div>
          </div>
        </div>

        {/* Feature Importance & Confusion Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Feature Importance (XAI) Bar Chart */}
          <div className="lg:col-span-7 bg-[var(--color-surface)] p-5 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[15px] font-bold text-[var(--color-navy-deep)]">
                  Feature Importance & Model Explainability (XAI)
                </h3>
                <span className="text-[10px] font-mono font-bold text-[var(--color-slate-muted)] uppercase bg-[var(--color-background)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                  Gini Impurity
                </span>
              </div>
              <p className="text-[12px] text-[var(--color-slate-muted)] mb-5">
                Relative influence of spatial, historical, and offense attributes on predicting high-risk zones.
              </p>

              {/* Horizontal Bar Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                    <XAxis 
                      type="number" 
                      unit="%" 
                      tick={{ fill: 'var(--color-slate-muted)', fontSize: 11 }}
                      domain={[0, 'dataMax + 5']}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-navy-deep)', fontSize: 11, fontWeight: 500 }}
                      width={170}
                    />
                    <RechartsTooltip 
                      formatter={(val: any) => [`${val}%`, 'Importance']}
                      contentStyle={{
                        borderRadius: 'var(--radius-control)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-navy-deep)',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    />
                    <Bar dataKey="importance" radius={[0, 4, 4, 0]} isAnimationActive={true} animationDuration={700} animationEasing="ease-out">
                      {featureChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Explainability Narrative */}
            <div className="mt-4 p-3.5 bg-[var(--color-background)] rounded-[var(--radius-control)] border border-[var(--color-border)] text-[12px] text-[var(--color-slate)] leading-relaxed">
              <span className="font-bold text-[var(--color-primary)] mr-1.5">Model Insight:</span>
              {result.explainability_summary}
            </div>
          </div>

          {/* Right: Confusion Matrix & Class Distribution */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Confusion Matrix Card */}
            <div className="bg-[var(--color-surface)] p-5 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
              <h3 className="text-[15px] font-bold text-[var(--color-navy-deep)] mb-1">
                Validation Confusion Matrix
              </h3>
              <p className="text-[12px] text-[var(--color-slate-muted)] mb-4">
                Comparison of actual vs predicted risk tiers on the test split.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-[12px] border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-[10px] font-bold text-[var(--color-slate-muted)] uppercase">
                        Actual \ Predicted
                      </th>
                      {result.classes.map((cls) => (
                        <th key={cls} className="p-2 font-bold text-[var(--color-navy-deep)] text-[11px]">
                          {cls}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.confusion_matrix.map((row, rIdx) => (
                      <tr key={rIdx} className="border-t border-[var(--color-border)]">
                        <td className="p-2 text-left font-bold text-[var(--color-navy-deep)] text-[11px]">
                          {result.classes[rIdx]}
                        </td>
                        {row.map((count, cIdx) => {
                          const isDiagonal = rIdx === cIdx;
                          return (
                            <td 
                              key={cIdx} 
                              className={clsx(
                                "p-2.5 font-bold rounded text-[12px] transition-colors",
                                isDiagonal 
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold" 
                                  : count > 0 
                                  ? "bg-rose-500/15 text-rose-500" 
                                  : "text-[var(--color-slate-muted)]"
                              )}
                            >
                              {count}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Class Distribution Breakdown */}
            <div className="bg-[var(--color-surface)] p-5 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-navy-deep)] mb-1">
                  Spatial Risk Distribution
                </h3>
                <p className="text-[12px] text-[var(--color-slate-muted)] mb-3">
                  Proportion of the city categorized by vulnerability tier.
                </p>

                <div className="space-y-2.5">
                  {Object.entries(result.class_distribution || {}).map(([tier, count]) => {
                    const total = result.total_cells || 1;
                    const pct = ((count / total) * 100).toFixed(1);
                    const color = RISK_COLORS[tier] || '#3b82f6';
                    return (
                      <div key={tier} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[12px] font-semibold">
                          <span className="flex items-center gap-1.5 text-[var(--color-navy-deep)]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            {tier}
                          </span>
                          <span className="text-[var(--color-slate-muted)] font-mono">
                            {count} sectors ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%`, backgroundColor: color }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Spatial Sector Risk Explorer Table */}
        <div className="bg-[var(--color-surface)] p-5 md:p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--color-navy-deep)]">
                Spatial Sector Risk Explorer
              </h3>
              <p className="text-[12px] text-[var(--color-slate-muted)]">
                Granular 1 km² sector classification and predicted vulnerability index ({filteredSectors.length} of {result.total_cells} sectors shown).
              </p>
            </div>

            {/* Table Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-slate-muted)]" />
                <input
                  type="text"
                  placeholder="Search sector..."
                  value={sectorSearch}
                  onChange={(e) => setSectorSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-control)] text-[12px] text-[var(--color-navy-deep)] placeholder:text-[var(--color-slate-muted)] outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Risk Filter Pills */}
              <div className="flex items-center bg-[var(--color-background)] p-0.5 rounded-lg border border-[var(--color-border)] text-[11px] font-bold">
                {(['ALL', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    className={clsx(
                      "px-2 py-1 rounded transition-all cursor-pointer",
                      riskFilter === r
                        ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-extrabold"
                        : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[380px] custom-scrollbar border border-[var(--color-border)] rounded-[var(--radius-control)]">
            <table className="w-full text-left text-[12px]">
              <thead className="sticky top-0 bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Sector ID</th>
                  <th className="p-3">Centroid (Lat, Lng)</th>
                  <th className="p-3 text-right">Crimes</th>
                  <th className="p-3 text-right">Violent %</th>
                  <th className="p-3 text-right">Night %</th>
                  <th className="p-3 text-right">High-Risk Prob</th>
                  <th className="p-3 text-center">Risk Tier</th>
                  {onLocateSector && <th className="p-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] font-medium">
                {filteredSectors.slice(0, 50).map((cell) => {
                  const riskColor = RISK_COLORS[cell.risk_class] || '#3b82f6';
                  return (
                    <tr key={cell.grid_id} className="hover:bg-[var(--color-surface-soft)] transition-colors">
                      <td className="p-3 font-mono font-bold text-[var(--color-navy-deep)]">
                        {cell.grid_id}
                      </td>
                      <td className="p-3 font-mono text-[var(--color-slate-muted)]">
                        {cell.grid_lat.toFixed(4)}, {cell.grid_lng.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-bold text-[var(--color-navy-deep)]">
                        {cell.total_crimes.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {(cell.violent_ratio * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 text-right font-mono">
                        {(cell.night_ratio * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-500">
                        {(cell.risk_probability * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${riskColor}15`,
                            color: riskColor,
                            borderColor: `${riskColor}30`
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor }} />
                          {cell.risk_class}
                        </span>
                      </td>
                      {onLocateSector && (
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              onLocateSector(cell.grid_lng, cell.grid_lat);
                              if (onGoToMap) onGoToMap();
                            }}
                            title="Locate sector on Map"
                            className="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-colors cursor-pointer"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredSectors.length > 50 && (
            <div className="text-center text-[11px] text-[var(--color-slate-muted)] font-medium mt-2">
              Showing top 50 sectors. Refine search query or filter to inspect others.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
