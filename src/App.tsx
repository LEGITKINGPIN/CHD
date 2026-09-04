/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { CrimeRecord, ClusteringResult, Metadata, DatasetInfo, TacticalPatrolRoute } from './types';
import dynamic from 'next/dynamic';

const MapWorkspace = dynamic(() => import('./components/MapWorkspace'), { ssr: false });

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import MacroDashboard from './components/MacroDashboard';
import EdaDashboard from './components/EdaDashboard';
import CompareAlgorithms from './components/CompareAlgorithms';
import PatrolIntelligence from './components/PatrolIntelligence';

const API_BASE_URL = '/api';

export default function App() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState<string[]>(['delhi']);
  const [crimes, setCrimes] = useState<CrimeRecord[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeView, setActiveView] = useState<'map' | 'eda' | 'trends' | 'compare' | 'patrol'>('map');
  
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
      />
      
      {activeView === 'map' ? (
        <div className="flex flex-1 overflow-hidden relative">
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
            onGoToIntel={() => setActiveView('patrol')}
          >
            {clusteringResult && (
              <MetricsPanel result={clusteringResult} algorithm={selectedAlgorithm} />
            )}
          </MapWorkspace>
        </main>
        </div>
      ) : activeView === 'trends' ? (
        <MacroDashboard 
          selectedDatasetKeys={selectedDatasetKeys} 
          selectedTypes={selectedTypes} 
          selectedDistricts={selectedDistricts} 
          selectedArrest={selectedArrest}
        />
      ) : activeView === 'eda' ? (
        <EdaDashboard 
          selectedDatasetKeys={selectedDatasetKeys} 
          selectedTypes={selectedTypes} 
          selectedDistricts={selectedDistricts} 
          selectedArrest={selectedArrest}
        />
      ) : activeView === 'compare' ? (
        <CompareAlgorithms 
          selectedDatasetKeys={selectedDatasetKeys} 
          selectedTypes={selectedTypes} 
          selectedDistricts={selectedDistricts}
          selectedArrest={selectedArrest}
          customMarker={customMarker}
          onVisualizeAlgorithm={(algo) => {
            setSelectedAlgorithm(algo);
            setActiveView('map');
            runClustering(algo, algo === 'DBSCAN' ? {eps: 1.0, minPts: 10} : {k: 5}); // Rerun with defaults to visualize
          }}
        />
      ) : activeView === 'patrol' ? (
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
      ) : null}
    </div>
  );
}
