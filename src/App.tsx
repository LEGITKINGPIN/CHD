/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { CrimeRecord, ClusteringResult, Metadata, DatasetInfo, RiskGridCell, RiskPredictionResult } from './types';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';

const MapWorkspace = dynamic(() => import('./components/MapWorkspace'), { ssr: false });

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import MacroDashboard from './components/MacroDashboard';
import EdaDashboard from './components/EdaDashboard';
import CompareAlgorithms from './components/CompareAlgorithms';
import RiskDashboard from './components/RiskDashboard';

import ExecutiveBriefingModal from './components/ExecutiveBriefingModal';

const API_BASE_URL = '/api';

export default function App() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState<string[]>(['delhi']);
  const [crimes, setCrimes] = useState<CrimeRecord[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeView, setActiveView] = useState<'map' | 'eda' | 'trends' | 'compare' | 'risk'>('map');
  
  // Custom Area Marker
  const [customMarker, setCustomMarker] = useState<{lng: number, lat: number, radiusKm: number} | null>(null);
  
  // Map Focus
  const [focusCoordinate, setFocusCoordinate] = useState<[number, number] | null>(null);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['ALL']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['ALL']);
  const [selectedArrest, setSelectedArrest] = useState<string[]>(['ALL']);
  
  // Temporal Filters
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const availableYears = useMemo(() => {
    const yrs = new Set<number>();
    for (const c of crimes) {
      if (!c.date || c.date === 'UNKNOWN') continue;
      const d = new Date(c.date);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        if (y > 1990 && y < 2100) yrs.add(y);
      } else {
        const match = c.date.match(/\b(19\d\d|20\d\d)\b/);
        if (match) {
          const y = parseInt(match[1], 10);
          if (y > 1990 && y < 2100) yrs.add(y);
        }
      }
    }
    return Array.from(yrs).sort((a, b) => b - a);
  }, [crimes]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('K-MEANS');

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('chd-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('chd-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  // ML Results
  const [clusteringResult, setClusteringResult] = useState<ClusteringResult | null>(null);
  const [isClustering, setIsClustering] = useState(false);

  // Supervised Risk Grid
  const [activeRiskGrid, setActiveRiskGrid] = useState<RiskGridCell[] | null>(null);

  const handleDeployRiskGrid = (cells: RiskGridCell[]) => {
    setActiveRiskGrid(cells);
    setActiveView('map');
    if (cells.length > 0) {
      setFocusCoordinate([cells[0].grid_lng, cells[0].grid_lat]);
    }
  };

  const handleClearRiskGrid = () => {
    setActiveRiskGrid(null);
  };

  // End Risk Model Handlers
  
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isSyncingSocrata, setIsSyncingSocrata] = useState(false);
  const [cachedRiskPrediction, setCachedRiskPrediction] = useState<RiskPredictionResult | null>(null);

  const handleSyncSocrata = async () => {
    setIsSyncingSocrata(true);
    try {
      await handleLiveFetch("https://data.cityofchicago.org/resource/ijzp-q8t2.json", 2000);
      alert("Successfully ingested live data from Chicago Police Open Data Portal!");
    } catch (err: any) {
      alert(`Socrata sync failed: ${err.message}`);
    } finally {
      setIsSyncingSocrata(false);
    }
  };

  const selectedDataset = useMemo(() => {
    return datasets.find(d => selectedDatasetKeys.includes(d.key));
  }, [datasets, selectedDatasetKeys]);

  useEffect(() => {
    async function initApp() {
      try {
        const res = await fetch(`${API_BASE_URL}/datasets`);
        const dsets: DatasetInfo[] = await res.json();
        setDatasets(dsets);
        if (dsets.length > 0) {
          fetchData([dsets[0].key]);
        }
      } catch (err) {
        console.error("Failed to load datasets", err);
        setLoading(false);
      }
    }
    initApp();
  }, []);

  const fetchData = async (datasetKeys: string[]) => {
    setLoading(true);
    try {
      const keysStr = datasetKeys.join(',');
      const [crimeRes, metaRes] = await Promise.all([
        fetch(`${API_BASE_URL}/crimes?dataset=${keysStr}`),
        fetch(`${API_BASE_URL}/metadata?dataset=${keysStr}`)
      ]);
      const crimeData = await crimeRes.json();
      const metaData = await metaRes.json();
      
      setCrimes(crimeData.data);
      setMetadata(metaData);
      setSelectedDatasetKeys(datasetKeys);
      
      // Clear all results and incompatible filters
      setClusteringResult(null);
      
      // Reset filters when switching datasets to avoid applying districts/types that don't exist
      setSelectedTypes(['ALL']);
      setSelectedDistricts(['ALL']);
      setSelectedArrest(['ALL']);
      setSelectedYears([]);
      setSelectedMonths([]);
      setDateFrom('');
      setDateTo('');
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      
      // Refresh datasets
      const dsetsRes = await fetch('/api/datasets');
      const dsets = await dsetsRes.json();
      setDatasets(dsets);
      
      // Load the new dataset
      await fetchData([data.dataset_key]);
      alert("Dataset uploaded successfully!");
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveFetch = async (url: string, limit: number) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("limit", limit.toString());
      
      const res = await fetch(`${API_BASE_URL}/fetch-live`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Fetch failed");
      
      // Refresh datasets
      const dsetsRes = await fetch('/api/datasets');
      const dsets = await dsetsRes.json();
      setDatasets(dsets);
      
      // Load the new dataset
      await fetchData([data.dataset_key]);
      alert("Live data fetched successfully!");
    } catch (err: any) {
      alert(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrimes = useMemo(() => {
    let result = crimes;
    if (!selectedTypes.includes('ALL') && selectedTypes.length > 0) {
      result = result.filter(c => selectedTypes.includes(c.primary_type));
    }
    if (!selectedDistricts.includes('ALL') && selectedDistricts.length > 0) {
      result = result.filter(c => selectedDistricts.includes(c.district));
    }
    if (!selectedArrest.includes('ALL') && selectedArrest.length > 0) {
      result = result.filter(c => {
        if (selectedArrest.includes('Arrest Made') && c.arrest) return true;
        if (selectedArrest.includes('Pending/No Arrest') && !c.arrest) return true;
        return false;
      });
    }

    if (selectedYears.length > 0 || selectedMonths.length > 0 || dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
      // To inclusive: add one day
      const to = dateTo ? new Date(dateTo).getTime() + 86400000 : Infinity;
      
      result = result.filter(c => {
        if (!c.date || c.date === 'UNKNOWN') return false;
        
        let cYear = 0;
        let cMonth = 0;
        let cTime = 0;
        
        // Parse date reliably
        const d = new Date(c.date);
        if (!isNaN(d.getTime())) {
          cYear = d.getFullYear();
          cMonth = d.getMonth() + 1;
          cTime = d.getTime();
        } else {
          // Fallback parsing YYYY-MM-DD or MM/DD/YYYY
          const isoMatch = c.date.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (isoMatch) {
            cYear = parseInt(isoMatch[1], 10);
            cMonth = parseInt(isoMatch[2], 10);
            cTime = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`).getTime();
          } else {
            const usMatch = c.date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (usMatch) {
              cYear = parseInt(usMatch[3], 10);
              cMonth = parseInt(usMatch[1], 10);
              cTime = new Date(`${usMatch[3]}-${usMatch[1]}-${usMatch[2]}`).getTime();
            }
          }
        }
        
        if (cYear === 0) return false;
        
        if (selectedYears.length > 0 && !selectedYears.includes(cYear)) return false;
        if (selectedMonths.length > 0 && !selectedMonths.includes(cMonth)) return false;
        if (cTime < from || cTime >= to) return false;
        
        return true;
      });
    }

    return result;
  }, [crimes, selectedTypes, selectedDistricts, selectedArrest, selectedYears, selectedMonths, dateFrom, dateTo]);

  // Clear clustering result when filters change, as the underlying data is different
  useEffect(() => {
    setClusteringResult(null);
  }, [selectedTypes, selectedDistricts, selectedArrest, selectedYears, selectedMonths, dateFrom, dateTo]);

  const runClustering = async (algorithm: string, params: any) => {
    if (filteredCrimes.length === 0) return;
    setIsClustering(true);
    try {
      const res = await fetch(`${API_BASE_URL}/clusters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          algorithm, 
          params, 
          filter: selectedTypes, 
          district: selectedDistricts,
          arrest: selectedArrest,
          dataset: selectedDatasetKeys.join(',')
        })
      });
      const data = await res.json();
      if (data.detail) { // FastAPI returns errors in 'detail'
        console.error("Clustering API Error:", data.detail);
        alert(`Clustering failed: ${data.detail}`);
        setClusteringResult(null);
      } else {
        setClusteringResult(data);
      }
    } catch (err) {
      console.error("Clustering failed", err);
    } finally {
      setIsClustering(false);
    }
  };

  if (loading && datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          <div className="text-[14px] font-bold tracking-widest uppercase text-[var(--color-slate)]">Initializing Spatial Intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-background)]">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenBriefing={() => setIsBriefingModalOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeView === 'map' ? (
            <motion.div 
              key="view-map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 overflow-hidden relative w-full h-full"
            >
              <Sidebar 
                datasets={datasets}
                selectedDatasetKeys={selectedDatasetKeys}
                onDatasetChange={fetchData}
                metadata={metadata} 
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedAlgorithm={selectedAlgorithm}
                setSelectedAlgorithm={setSelectedAlgorithm}
                onRunClustering={runClustering}
                onResetClustering={() => setClusteringResult(null)}
                isClustering={isClustering}
                hasClusteringResult={clusteringResult !== null}
                crimeTypes={Array.from(new Set(crimes.map(c => c.primary_type)))}
                selectedDistricts={selectedDistricts}
                setSelectedDistricts={setSelectedDistricts}
                selectedArrest={selectedArrest}
                setSelectedArrest={setSelectedArrest}
                districts={(Array.from(new Set(crimes.map(c => c.district))) as string[]).sort()}
                isLoadingDataset={loading}
                onUpload={handleUpload}
                onLiveFetch={handleLiveFetch}
                availableYears={availableYears}
                selectedYears={selectedYears}
                setSelectedYears={setSelectedYears}
                selectedMonths={selectedMonths}
                setSelectedMonths={setSelectedMonths}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                onResetTemporalFilters={() => {
                  setSelectedYears([]);
                  setSelectedMonths([]);
                  setDateFrom('');
                  setDateTo('');
                }}
              />
              <main className="flex-1 relative">
                <MapWorkspace 
                  crimes={filteredCrimes} 
                  clusteringResult={clusteringResult}
                  metadata={metadata}
                  customMarker={customMarker}
                  setCustomMarker={setCustomMarker}
                  onNavigateCompare={() => setActiveView('compare')}
                  focusCoordinate={focusCoordinate}
                  theme={theme}
                  activeRiskGrid={activeRiskGrid}
                  onClearRiskGrid={handleClearRiskGrid}
                >
                  {clusteringResult && (
                    <MetricsPanel result={clusteringResult} algorithm={selectedAlgorithm} />
                  )}
                </MapWorkspace>
              </main>
            </motion.div>
          ) : activeView === 'trends' ? (
            <motion.div
              key="view-trends"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <MacroDashboard 
                selectedDatasetKeys={selectedDatasetKeys} 
                selectedTypes={selectedTypes} 
                selectedDistricts={selectedDistricts} 
                selectedArrest={selectedArrest}
              />
            </motion.div>
          ) : activeView === 'eda' ? (
            <motion.div
              key="view-eda"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <EdaDashboard 
                selectedDatasetKeys={selectedDatasetKeys} 
                selectedTypes={selectedTypes} 
                selectedDistricts={selectedDistricts} 
                selectedArrest={selectedArrest}
              />
            </motion.div>
          ) : activeView === 'compare' ? (
            <motion.div
              key="view-compare"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <CompareAlgorithms 
                selectedDatasetKeys={selectedDatasetKeys} 
                selectedTypes={selectedTypes} 
                selectedDistricts={selectedDistricts} 
                selectedArrest={selectedArrest}
                customMarker={customMarker}
                onVisualizeAlgorithm={(algo) => {
                  setSelectedAlgorithm(algo);
                  setActiveView('map');
                  runClustering(algo, algo === 'DBSCAN' ? {eps: 1.0, minPts: 10} : {k: 5});
                }}
              />
            </motion.div>
          ) : activeView === 'risk' ? (
            <motion.div
              key="view-risk"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <RiskDashboard
                selectedDatasetKeys={selectedDatasetKeys}
                onDeployRiskGrid={handleDeployRiskGrid}
                onLocateSector={(lng, lat) => {
                  setFocusCoordinate([lng, lat]);
                  setActiveView('map');
                }}
                onGoToMap={() => setActiveView('map')}
                activeRiskGrid={activeRiskGrid}
                onPredictionsLoaded={(res) => setCachedRiskPrediction(res)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Executive Briefing Dossier Modal (Print/PDF) */}
      <ExecutiveBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        datasetName={selectedDataset?.display_name || 'Chicago Crime Sample'}
        totalCrimes={crimes.length}
        clusteringResult={clusteringResult}
        algorithm={selectedAlgorithm}
        riskPrediction={cachedRiskPrediction}
      />
    </div>
  );
}
