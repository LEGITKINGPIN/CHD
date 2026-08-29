import React, { useState, useEffect } from 'react';
import { Metadata, DatasetInfo } from '../types';
import { Crosshair, Activity, SlidersHorizontal, Database, Map, Upload, DownloadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';

interface SidebarProps {
  datasets: DatasetInfo[];
  selectedDatasetKeys: string[];
  onDatasetChange: (keys: string[]) => void;
  metadata: Metadata | null;
  selectedTypes: string[];
  setSelectedTypes: (v: string[]) => void;
  selectedAlgorithm: string;
  setSelectedAlgorithm: (v: string) => void;
  onRunClustering: (alg: string, params: any) => void;
  onResetClustering?: () => void;
  isClustering: boolean;
  hasClusteringResult?: boolean;
  crimeTypes: string[];
  selectedDistricts: string[];
  setSelectedDistricts: (v: string[]) => void;
  selectedArrest: string[];
  setSelectedArrest: (v: string[]) => void;
  districts: string[];
  isLoadingDataset: boolean;
  onUpload?: (file: File) => void;
  onLiveFetch?: (url: string, limit: number) => void;
}

export default function Sidebar({
  datasets,
  selectedDatasetKeys,
  onDatasetChange,
  metadata,
  selectedTypes,
  setSelectedTypes,
  selectedAlgorithm,
  setSelectedAlgorithm,
  onRunClustering,
  onResetClustering,
  isClustering,
  hasClusteringResult,
  crimeTypes,
  selectedDistricts,
  setSelectedDistricts,
  selectedArrest,
  setSelectedArrest,
  districts,
  isLoadingDataset,
  onUpload,
  onLiveFetch
}: SidebarProps) {
  const [k, setK] = useState<number>(5);
  const [eps, setEps] = useState<number>(0.5);
  const [minPts, setMinPts] = useState<number>(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(310);
  const [isResizing, setIsResizing] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Expose the current sidebar offset as a CSS variable for the rest of the app to use
  useEffect(() => {
    // Only apply the offset if we're not on mobile (mobile uses an overlay that covers the whole screen)
    const isMobile = window.innerWidth < 768;
    const offset = isMobile ? 0 : (isDesktopCollapsed ? 0 : sidebarWidth);
    document.documentElement.style.setProperty('--sidebar-offset', `${offset}px`);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const off = mobile ? 0 : (isDesktopCollapsed ? 0 : sidebarWidth);
      document.documentElement.style.setProperty('--sidebar-offset', `${off}px`);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktopCollapsed, isOpen, sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(280, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Just use the first selected dataset for capabilities check for now
  const selectedDataset = datasets.find(d => selectedDatasetKeys.includes(d.key));
  const caps = selectedDataset?.capabilities;

  const handleRun = () => {
    let params: any = {};
    if (selectedAlgorithm === 'K-MEANS' || selectedAlgorithm === 'HIERARCHICAL') {
      params = { k };
    } else if (selectedAlgorithm === 'DBSCAN') {
      params = { eps, minPts };
    }
    onRunClustering(selectedAlgorithm, params);
  };

  return (
    <>
    {/* Mobile Toggle */}
    <button 
      className="md:hidden absolute top-4 left-4 z-50 bg-[var(--color-surface)] p-2 rounded-[var(--radius-control)] shadow-sm border border-[var(--color-border)] transition-transform hover:bg-[var(--color-surface-soft)]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <SlidersHorizontal className="w-5 h-5 text-[var(--color-slate)]" />
    </button>
    
    <aside 
      className={`absolute h-full z-40 shrink-0 transition-[width] duration-300 ease-in-out ${isResizing ? 'select-none transition-none' : ''}`}
      style={{ width: isDesktopCollapsed ? '0px' : (typeof window !== 'undefined' && window.innerWidth < 768 ? (isOpen ? 'min(320px, 85vw)' : '0px') : `${sidebarWidth}px`) }}
    >
      <div 
        className={`absolute top-0 bottom-0 left-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-full transition-transform duration-300 ease-in-out shadow-sm ${isOpen ? 'translate-x-0' : 'max-md:-translate-x-full'} ${isDesktopCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'}`}
        style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 'min(320px, 85vw)' : `${sidebarWidth}px` }}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
      {/* 1. DATASET REGISTRY */}
      <div className="p-4 border-b border-[var(--color-border)] mt-12 md:mt-0 bg-[var(--color-background)]">
        <h2 className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />
          Dataset Registry
        </h2>
        <select
          value={selectedDatasetKeys[0] || datasets[0]?.key || ''}
          onChange={(e) => onDatasetChange([e.target.value])}
          disabled={isLoadingDataset || datasets.length === 0}
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[13px] rounded-[var(--radius-control)] px-3 py-2 md:py-2 text-[var(--color-navy-deep)] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none bg-no-repeat disabled:bg-[var(--color-background)] disabled:text-[var(--color-slate-muted)] min-h-[44px]"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2364748B\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em', paddingRight: '2.5rem' }}
        >
          {datasets.map(d => (
            <option key={d.key} value={d.key}>{d.display_name}</option>
          ))}
        </select>
        {isLoadingDataset && (
          <div className="mt-2 text-[11px] text-[var(--color-primary)] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></span>
            Loading dataset...
          </div>
        )}
        
        <div className="mt-3 space-y-2 border-t border-[var(--color-border)] pt-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0] && onUpload) {
                onUpload(e.target.files[0]);
              }
            }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 text-[12px] font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-slate)] py-2 md:py-1.5 rounded-[var(--radius-control)] shadow-sm hover:bg-[var(--color-background)] transition-colors min-h-[44px] md:min-h-0"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Custom CSV
          </button>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Live Socrata API URL" 
              className="flex-1 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-control)] px-2 py-1.5 text-[var(--color-navy-deep)] focus:outline-none focus:border-[var(--color-primary)]"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
            <button 
              onClick={() => {
                if (liveUrl && onLiveFetch) onLiveFetch(liveUrl, 2000);
              }}
              className="flex items-center gap-1 text-[12px] font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-slate)] px-2 py-2 md:py-1.5 rounded-[var(--radius-control)] hover:bg-[var(--color-background)] transition-colors min-h-[44px] md:min-h-0"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              Fetch
            </button>
          </div>
        </div>
      </div>

      {/* 2. DATA SUMMARY */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <h2 className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
          <Map className="w-3.5 h-3.5" />
          Data Summary
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-background)] p-2.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-slate-muted)] mb-0.5 font-semibold">Total Records</div>
            <div className="text-[16px] font-bold text-[var(--color-navy-deep)]">
              {isLoadingDataset ? "..." : metadata?.totalCrimes?.toLocaleString() ?? 0}
            </div>
          </div>
          <div className="bg-[var(--color-background)] p-2.5 rounded-[var(--radius-control)] border border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-slate-muted)] mb-0.5 font-semibold">Active Region</div>
            <div className="text-[12px] font-semibold text-[var(--color-navy-deep)] line-clamp-2 leading-tight mt-1">
              {datasets.filter(d => selectedDatasetKeys.includes(d.key)).map(d => d.display_name).join(", ") || '...'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAP FILTERS */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <h2 className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Map Filters
        </h2>
        <div className="space-y-4">
          <div className={caps?.supports_crime_type ? '' : 'opacity-50'}>
            <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">CRIME CATEGORY</label>
            <MultiSelectDropdown
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...crimeTypes.map(t => ({ value: t, label: t }))
              ]}
              selectedValues={selectedTypes}
              onChange={setSelectedTypes}
              disabled={!caps?.supports_crime_type}
              placeholder="All Categories"
            />
          </div>
          
          <div className={caps?.supports_district ? '' : 'opacity-50'}>
            <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">DISTRICT</label>
            <MultiSelectDropdown
              options={[
                { value: 'ALL', label: 'All Districts' },
                ...districts.filter(d => d !== 'UNKNOWN').map(d => ({ value: d, label: d }))
              ]}
              selectedValues={selectedDistricts}
              onChange={setSelectedDistricts}
              disabled={!caps?.supports_district}
              placeholder="All Districts"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-2 uppercase">ARREST STATUS</label>
            <div className="flex flex-row gap-4">
              <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-navy-deep)] cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[var(--color-primary)] rounded-[4px] border-[var(--color-border-strong)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
                  checked={selectedArrest.includes('Arrest Made')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedArrest(['Arrest Made']);
                    else setSelectedArrest(['ALL']);
                  }}
                />
                Arrest Made
              </label>
              <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-navy-deep)] cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[var(--color-primary)] rounded-[4px] border-[var(--color-border-strong)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
                  checked={selectedArrest.includes('Pending/No Arrest')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedArrest(['Pending/No Arrest']);
                    else setSelectedArrest(['ALL']);
                  }}
                />
                No Arrest
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SPATIAL CLUSTERING */}
      <div className="p-4 flex-1 bg-[var(--color-surface)]">
        <h2 className="text-[11px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          Spatial Clustering
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">ALGORITHM</label>
            <div className="flex bg-[var(--color-surface-soft)] p-[3px] rounded-[var(--radius-control)] border border-[var(--color-border)]">
              <button
                className={`flex-1 text-[11px] py-2 md:py-1.5 rounded-md font-semibold transition-all ${selectedAlgorithm === 'K-MEANS' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-primary)] border border-[var(--color-border)]' : 'text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] border border-transparent'} min-h-[44px] md:min-h-0`}
                onClick={() => setSelectedAlgorithm('K-MEANS')}
              >
                K-Means
              </button>
              <button
                className={`flex-1 text-[11px] py-2 md:py-1.5 rounded-md font-semibold transition-all ${selectedAlgorithm === 'DBSCAN' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-primary)] border border-[var(--color-border)]' : 'text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] border border-transparent'} min-h-[44px] md:min-h-0`}
                onClick={() => setSelectedAlgorithm('DBSCAN')}
              >
                DBSCAN
              </button>
              <button
                className={`flex-1 text-[11px] py-2 md:py-1.5 rounded-md font-semibold transition-all ${selectedAlgorithm === 'HIERARCHICAL' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-primary)] border border-[var(--color-border)]' : 'text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] border border-transparent'} min-h-[44px] md:min-h-0`}
                onClick={() => setSelectedAlgorithm('HIERARCHICAL')}
              >
                Hierarchical
              </button>
            </div>
          </div>

          <div className="pt-1">
            {(selectedAlgorithm === 'K-MEANS' || selectedAlgorithm === 'HIERARCHICAL') && (
              <div>
                <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">NUMBER OF CLUSTERS (k)</label>
                <input 
                  type="number" min="2" max="20" 
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-navy-deep)] rounded-[var(--radius-control)] px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)]"
                  value={k} onChange={e => setK(parseInt(e.target.value))} 
                />
              </div>
            )}
            {selectedAlgorithm === 'DBSCAN' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">RADIUS (eps)</label>
                  <input 
                    type="number" step="0.01" min="0.01" max="10" 
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-navy-deep)] rounded-[var(--radius-control)] px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)]"
                    value={eps} onChange={e => setEps(parseFloat(e.target.value))} 
                  />
                  <p className="text-[10px] text-[var(--color-slate-muted)] mt-1">Note: eps is in CRS units.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-slate-muted)] mb-1.5 uppercase">MIN SAMPLES (minPts)</label>
                  <input 
                    type="number" min="3" max="50" 
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-navy-deep)] rounded-[var(--radius-control)] px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)]"
                    value={minPts} onChange={e => setMinPts(parseInt(e.target.value))} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. ANALYSIS ACTIONS */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="space-y-2">
          <button
            onClick={handleRun}
            disabled={isClustering || isLoadingDataset}
            className="w-full bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90 text-white font-semibold py-3 md:py-2.5 rounded-[var(--radius-control)] text-[13px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[44px]"
          >
            {isClustering ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                Cluster Local Hotspots
              </>
            )}
          </button>
          {hasClusteringResult && onResetClustering && (
            <button
              onClick={onResetClustering}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] text-[var(--color-slate)] font-semibold py-2 rounded-[var(--radius-control)] text-[13px] flex items-center justify-center gap-2 transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>
      </div>
      </div>
      </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className={`hidden md:flex absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full items-center justify-center z-50 shadow-sm cursor-pointer hover:bg-[var(--color-surface-soft)] transition-colors ${isDesktopCollapsed ? 'opacity-100 right-0 translate-x-full' : 'opacity-100'}`}
        >
          {isDesktopCollapsed ? <ChevronRight className="w-4 h-4 text-[var(--color-slate)]" /> : <ChevronLeft className="w-4 h-4 text-[var(--color-slate)]" />}
        </button>

      {/* Resize Handle */}
      {!isDesktopCollapsed && (
        <div 
          className="hidden md:block absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[var(--color-primary)]/20 active:bg-[var(--color-primary)]/30 z-50 group"
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-border-strong)] rounded-full group-hover:bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
    </aside>
    {isOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
