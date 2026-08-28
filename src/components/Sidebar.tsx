import React, { useState } from 'react';
import { Metadata, DatasetInfo } from '../types';
import { Crosshair, Activity, SlidersHorizontal, Database, Map } from 'lucide-react';
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
  districts: string[];
  isLoadingDataset: boolean;
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
  districts,
  isLoadingDataset
}: SidebarProps) {
  const [k, setK] = useState<number>(5);
  const [eps, setEps] = useState<number>(0.5);
  const [minPts, setMinPts] = useState<number>(10);
  const [isOpen, setIsOpen] = useState(false);

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
      className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-slate-200"
      onClick={() => setIsOpen(!isOpen)}
    >
      <SlidersHorizontal className="w-5 h-5 text-slate-700" />
    </button>
    
    <aside className={`absolute md:relative w-80 bg-white border-r border-slate-200 flex flex-col h-full z-40 shadow-sm shrink-0 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      
      <div className="p-5 border-b border-slate-100 mt-12 md:mt-0 bg-slate-50">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          Dataset Registry
        </h2>
        <MultiSelectDropdown
          options={datasets.map(d => ({ value: d.key, label: d.display_name }))}
          selectedValues={selectedDatasetKeys}
          onChange={(keys) => onDatasetChange(keys.length ? keys : [datasets[0].key])}
          disabled={isLoadingDataset}
          placeholder="Select Datasets"
        />
        {isLoadingDataset && (
          <div className="mt-2 text-xs text-blue-600 font-medium">Loading dataset...</div>
        )}
      </div>

      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Map className="w-4 h-4 text-slate-500" />
          Data Summary
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Total Records</div>
            <div className="text-lg font-semibold text-slate-900">
              {isLoadingDataset ? "..." : metadata?.totalCrimes?.toLocaleString() ?? 0}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Active Region</div>
            <div className="text-sm font-semibold text-slate-900 line-clamp-2">
              {datasets.filter(d => selectedDatasetKeys.includes(d.key)).map(d => d.display_name).join(", ") || '...'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          Map Filters
        </h2>
        <div className="space-y-4">
          <div className={caps?.supports_crime_type ? '' : 'opacity-50'}>
            <label className="block text-xs font-semibold text-slate-600 mb-2">CRIME CATEGORY</label>
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
            <label className="block text-xs font-semibold text-slate-600 mb-2">DISTRICT</label>
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
        </div>
      </div>

      <div className="p-5 flex-1 pb-8">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          Spatial Clustering
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">ALGORITHM</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                className={`flex-1 text-[10px] py-2 rounded-md font-medium transition-colors ${selectedAlgorithm === 'K-MEANS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setSelectedAlgorithm('K-MEANS')}
              >
                K-Means
              </button>
              <button
                className={`flex-1 text-[10px] py-2 rounded-md font-medium transition-colors ${selectedAlgorithm === 'DBSCAN' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setSelectedAlgorithm('DBSCAN')}
              >
                DBSCAN
              </button>
              <button
                className={`flex-1 text-[10px] py-2 rounded-md font-medium transition-colors ${selectedAlgorithm === 'HIERARCHICAL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setSelectedAlgorithm('HIERARCHICAL')}
              >
                Hierarchical
              </button>
            </div>
          </div>

          <div className="pt-2">
            {(selectedAlgorithm === 'K-MEANS' || selectedAlgorithm === 'HIERARCHICAL') && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2">NUMBER OF CLUSTERS (k)</label>
                <input 
                  type="number" min="2" max="20" 
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                  value={k} onChange={e => setK(parseInt(e.target.value))} 
                />
              </div>
            )}
            {selectedAlgorithm === 'DBSCAN' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">RADIUS (eps)</label>
                  <input 
                    type="number" step="0.01" min="0.01" max="10" 
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                    value={eps} onChange={e => setEps(parseFloat(e.target.value))} 
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Note: eps is in CRS units (e.g. degrees for WGS84, km for projected).</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">MIN SAMPLES (minPts)</label>
                  <input 
                    type="number" min="3" max="50" 
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                    value={minPts} onChange={e => setMinPts(parseInt(e.target.value))} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleRun}
              disabled={isClustering || isLoadingDataset}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClustering ? (
                <>Processing...</>
              ) : (
                <>
                  <Crosshair className="w-4 h-4" />
                  Detect Hotspots
                </>
              )}
            </button>
            {hasClusteringResult && onResetClustering && (
              <button
                onClick={onResetClustering}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
    {isOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
