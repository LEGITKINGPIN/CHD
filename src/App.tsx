/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { CrimeRecord, ClusteringResult, Metadata, DatasetInfo } from './types';
import MapWorkspace from './components/MapWorkspace';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import MacroDashboard from './components/MacroDashboard';

export default function App() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState<string[]>(['delhi']);
  const [crimes, setCrimes] = useState<CrimeRecord[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeView, setActiveView] = useState<'map' | 'macro'>('map');
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['ALL']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['ALL']);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('K-MEANS');
  
  // ML Results
  const [clusteringResult, setClusteringResult] = useState<ClusteringResult | null>(null);
  const [isClustering, setIsClustering] = useState(false);

  const selectedDataset = useMemo(() => {
    return datasets.find(d => selectedDatasetKeys.includes(d.key));
  }, [datasets, selectedDatasetKeys]);

  useEffect(() => {
    async function initApp() {
      try {
        const res = await fetch('/api/datasets');
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
        fetch(`/api/crimes?dataset=${keysStr}`),
        fetch(`/api/metadata?dataset=${keysStr}`)
      ]);
      const crimeData = await crimeRes.json();
      const metaData = await metaRes.json();
      
      setCrimes(crimeData.data);
      setMetadata(metaData);
      setSelectedDatasetKeys(datasetKeys);
      
      // Clear all results and incompatible filters
      setClusteringResult(null);
      
      // Just check the first selected dataset for simplicity
      const datasetInfo = datasets.find(d => datasetKeys.includes(d.key)) || datasets[0];
      if (datasetInfo && !datasetInfo.capabilities.supports_district) {
        setSelectedDistricts(['ALL']);
      }
      if (datasetInfo && !datasetInfo.capabilities.supports_crime_type) {
        setSelectedTypes(['ALL']);
      }
    } catch (err) {
      console.error("Failed to load data", err);
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
    return result;
  }, [crimes, selectedTypes, selectedDistricts]);

  const runClustering = async (algorithm: string, params: any) => {
    if (filteredCrimes.length === 0) return;
    setIsClustering(true);
    try {
      const res = await fetch('/api/clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          algorithm, 
          params, 
          filter: selectedTypes, 
          district: selectedDistricts,
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
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-800">
        <div className="text-xl font-medium">Initializing Crime Data Pipeline...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Header activeView={activeView} setActiveView={setActiveView} />
      
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
          districts={(Array.from(new Set(crimes.map(c => c.district))) as string[]).sort()}
          isLoadingDataset={loading}
        />
        <main className="flex-1 relative">
          <MapWorkspace 
            crimes={filteredCrimes} 
            clusteringResult={clusteringResult}
            metadata={metadata}
          />
            {clusteringResult && (
              <MetricsPanel result={clusteringResult} algorithm={selectedAlgorithm} />
            )}
          </main>
        </div>
      ) : (
        <MacroDashboard />
      )}
    </div>
  );
}
