/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { CrimeRecord, ClusteringResult, Metadata, DatasetInfo, TacticalPatrolRoute, RiskGridCell, LiveDispatchIncident, RiskPredictionResult } from './types';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';

const MapWorkspace = dynamic(() => import('./components/MapWorkspace'), { ssr: false });

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import MacroDashboard from './components/MacroDashboard';
import EdaDashboard from './components/EdaDashboard';
import CompareAlgorithms from './components/CompareAlgorithms';
import PatrolIntelligence from './components/PatrolIntelligence';
import RiskDashboard from './components/RiskDashboard';
import LiveAlertToast from './components/LiveAlertToast';
import ExecutiveBriefingModal from './components/ExecutiveBriefingModal';

const API_BASE_URL = '/api';

export default function App() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState<string[]>(['delhi']);
  const [crimes, setCrimes] = useState<CrimeRecord[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeView, setActiveView] = useState<'map' | 'eda' | 'trends' | 'compare' | 'patrol' | 'risk'>('map');
  
  // Custom Area Marker
  const [customMarker, setCustomMarker] = useState<{lng: number, lat: number, radiusKm: number} | null>(null);
  
  // Map Focus
  const [focusCoordinate, setFocusCoordinate] = useState<[number, number] | null>(null);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['ALL']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['ALL']);
  const [selectedArrest, setSelectedArrest] = useState<string[]>(['ALL']);
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

  // Tactical Patrol Route
  const [activePatrolRoute, setActivePatrolRoute] = useState<TacticalPatrolRoute | null>(null);

  // Supervised Risk Grid
  const [activeRiskGrid, setActiveRiskGrid] = useState<RiskGridCell[] | null>(null);

  const handleDeployPatrolRoute = (route: TacticalPatrolRoute) => {
    setActivePatrolRoute(route);
    setActiveView('map');
    if (route.coordinates.length > 0) {
      setFocusCoordinate(route.coordinates[0]);
    }
  };

  const handleClearPatrolRoute = () => {
    setActivePatrolRoute(null);
  };

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

  // Option C: Live CAD Dispatch & Real-Time Intelligence
  const [isLiveDispatchOpen, setIsLiveDispatchOpen] = useState(false);
  const [liveIncidents, setLiveIncidents] = useState<LiveDispatchIncident[]>([]);
  const [activeUnits, setActiveUnits] = useState(42);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(15); // Default 15s streaming
  const [nextSyncCountdown, setNextSyncCountdown] = useState<number>(15);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeLiveAlert, setActiveLiveAlert] = useState<LiveDispatchIncident | null>(null);
  const [trackedIncident, setTrackedIncident] = useState<LiveDispatchIncident | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isSyncingSocrata, setIsSyncingSocrata] = useState(false);
  const [cachedRiskPrediction, setCachedRiskPrediction] = useState<RiskPredictionResult | null>(null);
  const knownIncidentIdsRef = React.useRef<Set<string>>(new Set());

  const playAlertChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const fetchLiveStream = async () => {
    setIsLoadingLive(true);
    try {
      const currentDatasetKey = selectedDatasetKeys[0] || 'chicago';
      const res = await fetch(`${API_BASE_URL}/live/stream?dataset=${currentDatasetKey}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.incidents) {
        setLiveIncidents(data.incidents);
        setActiveUnits(data.active_units || 42);

        // Detect new critical/high incoming alerts
        const newlyReceived = data.incidents.filter((inc: LiveDispatchIncident) => 
          !knownIncidentIdsRef.current.has(inc.id) && (inc.severity === 'CRITICAL' || inc.severity === 'HIGH')
        );

        if (newlyReceived.length > 0) {
          setActiveLiveAlert(newlyReceived[0]);
          if (soundEnabled) {
            playAlertChime();
          }
        }

        data.incidents.forEach((inc: LiveDispatchIncident) => knownIncidentIdsRef.current.add(inc.id));
      }
    } catch (err) {
      console.error("Failed to fetch live stream", err);
    } finally {
      setIsLoadingLive(false);
      setNextSyncCountdown(refreshInterval || 15);
    }
  };

  // Initial fetch on dataset change
  useEffect(() => {
    fetchLiveStream();
  }, [selectedDatasetKeys]);

  // Polling ticker effect
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const timer = setInterval(() => {
      setNextSyncCountdown(prev => {
        if (prev <= 1) {
          fetchLiveStream();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, selectedDatasetKeys, soundEnabled]);

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

  const handleLocateLiveIncident = (incident: LiveDispatchIncident) => {
    setTrackedIncident(incident);
    setActiveView('map');
    setFocusCoordinate([incident.lng, incident.lat]);
  };

  const handleClearTrackedIncident = () => {
    setTrackedIncident(null);
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
      setActivePatrolRoute(null);
      
      // Reset filters when switching datasets to avoid applying districts/types that don't exist
      setSelectedTypes(['ALL']);
      setSelectedDistricts(['ALL']);
      setSelectedArrest(['ALL']);
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
    return result;
  }, [crimes, selectedTypes, selectedDistricts, selectedArrest]);

  // Clear clustering result when filters change, as the underlying data is different
  useEffect(() => {
    setClusteringResult(null);
  }, [selectedTypes, selectedDistricts, selectedArrest]);

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
                  activePatrolRoute={activePatrolRoute}
                  onClearPatrolRoute={handleClearPatrolRoute}
                  activeRiskGrid={activeRiskGrid}
                  onClearRiskGrid={handleClearRiskGrid}
                  onGoToIntel={() => setActiveView('patrol')}
                  isLiveDispatchOpen={isLiveDispatchOpen}
                  onToggleLiveDispatch={() => setIsLiveDispatchOpen(prev => !prev)}
                  liveIncidents={liveIncidents}
                  activeUnits={activeUnits}
                  isLoadingLive={isLoadingLive}
                  onRefreshLive={fetchLiveStream}
                  refreshInterval={refreshInterval}
                  onSetRefreshInterval={setRefreshInterval}
                  nextSyncCountdown={nextSyncCountdown}
                  onLocateLiveIncident={handleLocateLiveIncident}
                  trackedIncident={trackedIncident}
                  onClearTrackedIncident={handleClearTrackedIncident}
                  onSyncSocrata={handleSyncSocrata}
                  isSyncingSocrata={isSyncingSocrata}
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
          ) : activeView === 'patrol' ? (
            <motion.div
              key="view-patrol"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <PatrolIntelligence 
                clusteringResult={clusteringResult} 
                algorithm={selectedAlgorithm} 
                onLocateHotspot={(lng, lat) => {
                  setFocusCoordinate([lng, lat]);
                  setActiveView('map');
                }}
                onGoToMap={() => setActiveView('map')}
                onDeployPatrolRoute={handleDeployPatrolRoute}
                activePatrolRoute={activePatrolRoute}
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

      {/* Live Alert Toast for incoming critical incidents */}
      <LiveAlertToast
        alert={activeLiveAlert}
        onDismiss={() => setActiveLiveAlert(null)}
        onLocate={(incident) => {
          handleLocateLiveIncident(incident);
          setActiveLiveAlert(null);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* Executive Briefing Dossier Modal (Print/PDF) */}
      <ExecutiveBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        datasetName={selectedDataset?.display_name || 'Chicago Crime Sample'}
        totalCrimes={crimes.length}
        clusteringResult={clusteringResult}
        algorithm={selectedAlgorithm}
        riskPrediction={cachedRiskPrediction}
        recentDispatches={liveIncidents}
      />
    </div>
  );
}
