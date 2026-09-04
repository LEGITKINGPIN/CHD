import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Map, Source, Layer, Popup, useMap, Marker } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrimeRecord, ClusteringResult, Metadata, TacticalPatrolRoute, PatrolCheckpoint } from '../types';
import * as turf from '@turf/turf';
import { Search, Layers, MapPin, Route, Navigation, Car, ChevronRight, ChevronLeft, X, Compass, ShieldAlert, Play, Pause, RotateCcw, Clock, Flame } from 'lucide-react';
import { clsx } from 'clsx';
import MetricsPanel from './MetricsPanel';

interface MapWorkspaceProps {
  crimes: CrimeRecord[];
  clusteringResult: ClusteringResult | null;
  metadata: Metadata | null;
  customMarker: {lng: number, lat: number, radiusKm: number} | null;
  setCustomMarker: (marker: {lng: number, lat: number, radiusKm: number} | null) => void;
  onNavigateCompare: () => void;
  focusCoordinate?: [number, number] | null;
  theme?: 'light' | 'dark';
  activePatrolRoute?: TacticalPatrolRoute | null;
  onClearPatrolRoute?: () => void;
  onGoToIntel?: () => void;
  children?: React.ReactNode;
}

export default function MapWorkspace({ 
  crimes, 
  clusteringResult, 
  metadata, 
  customMarker, 
  setCustomMarker, 
  onNavigateCompare, 
  focusCoordinate, 
  theme = 'light',
  activePatrolRoute,
  onClearPatrolRoute,
  onGoToIntel,
  children 
}: MapWorkspaceProps) {
  const [hoverInfo, setHoverInfo] = useState<{lng: number, lat: number, props: any, type: string} | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<any>(null);
  const [localClusters, setLocalClusters] = useState<any>(null);
  const [localAlgorithm, setLocalAlgorithm] = useState<'K-MEANS' | 'DBSCAN' | 'HIERARCHICAL'>('K-MEANS');
  const [hoveredClusterId, setHoveredClusterId] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  // 24-Hour Time-Lapse Heatmap Player State
  const [isTimeLapseActive, setIsTimeLapseActive] = useState(false);
  const [currentHour, setCurrentHour] = useState(20); // Default to 8 PM (peak activity)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [windowMode, setWindowMode] = useState<'rolling-3h' | 'exact-hour' | 'cumulative'>('rolling-3h');
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying || !isTimeLapseActive) return;
    const intervalMs = playbackSpeed === 4 ? 350 : playbackSpeed === 2 ? 700 : 1400;
    const timer = setInterval(() => {
      setCurrentHour(prev => (prev + 1) % 24);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, isTimeLapseActive, playbackSpeed]);

  const localClusteringResult = useMemo(() => {
    if (!localClusters || !localClusters.features || localClusters.features.length === 0) return null;
    
    const labels = localClusters.features.map((f: any) => f.properties.cluster !== undefined ? f.properties.cluster : -1);
    const uniqueClusters = new Set(labels.filter((l: number) => l !== -1));
    const numClusters = uniqueClusters.size;
    
    const clusterMap = new globalThis.Map();
    localClusters.features.forEach((f: any) => {
      const cid = f.properties.cluster !== undefined ? f.properties.cluster : -1;
      if (cid !== -1) {
        if (!clusterMap.has(cid)) {
          clusterMap.set(cid, { features: [] });
        }
        clusterMap.get(cid).features.push(f);
      }
    });

    const rankings: any[] = [];
    clusterMap.forEach((data, cid) => {
      const pts = turf.featureCollection(data.features);
      let area = 0.01; // minimal area if not computable
      if (pts.features.length >= 3) {
        try {
          const hull = turf.convex(pts);
          if (hull) area = turf.area(hull) / 1000000;
        } catch (e) {}
      }
      
      const vol = data.features.length;
      const density = area > 0 ? vol / area : 0;
      
      rankings.push({
        cluster_id: cid,
        volume: vol,
        area_sq_km: parseFloat(area.toFixed(3)),
        density_per_km2: density,
        risk_category: density > 100 ? 'Critical Hotspot' : density > 50 ? 'High Risk' : 'Medium Risk'
      });
    });
    rankings.sort((a, b) => b.density_per_km2 - a.density_per_km2);

    return {
      labels,
      centroids: [],
      metrics: {
        numClusters,
        silhouette: null,
        daviesBouldin: null,
        calinskiHarabasz: null,
        numNoise: 0,
        runtimeMs: 0,
      },
      centers: null,
      hotspot_rankings: rankings
    };
  }, [localClusters]);

  const MAP_STYLES = [
    { id: 'voyager', name: 'Voyager Map', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
    { id: 'light', name: 'Light Map', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
    { id: 'dark', name: 'Dark Map', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' }
  ];
  const [currentStyle, setCurrentStyle] = useState(theme === 'dark' ? MAP_STYLES[2].url : MAP_STYLES[0].url);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Synchronize map basemap style with dark/light theme
  useEffect(() => {
    if (theme === 'dark') {
      setCurrentStyle(MAP_STYLES[2].url);
    } else {
      setCurrentStyle(MAP_STYLES[0].url);
    }
  }, [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Active Tactical Patrol Route State
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<PatrolCheckpoint | null>(null);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);

  useEffect(() => {
    if (activePatrolRoute && activePatrolRoute.checkpoints.length > 0) {
      setCurrentCheckpointIndex(0);
      setSelectedCheckpoint(activePatrolRoute.checkpoints[0]);
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.easeTo({
          center: [activePatrolRoute.checkpoints[0].lng, activePatrolRoute.checkpoints[0].lat],
          zoom: 13,
          duration: 1200
        });
      }
    } else {
      setSelectedCheckpoint(null);
    }
  }, [activePatrolRoute]);

  const handleNextCheckpoint = () => {
    if (!activePatrolRoute || activePatrolRoute.checkpoints.length === 0) return;
    const nextIdx = (currentCheckpointIndex + 1) % activePatrolRoute.checkpoints.length;
    setCurrentCheckpointIndex(nextIdx);
    const cp = activePatrolRoute.checkpoints[nextIdx];
    setSelectedCheckpoint(cp);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.easeTo({
        center: [cp.lng, cp.lat],
        zoom: 14,
        duration: 1000
      });
    }
  };

  const patrolRouteGeoJSON = useMemo(() => {
    if (!activePatrolRoute || activePatrolRoute.coordinates.length < 2) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: activePatrolRoute.coordinates
          },
          properties: {
            title: activePatrolRoute.title,
            distance: activePatrolRoute.totalDistanceKm
          }
        }
      ]
    };
  }, [activePatrolRoute]);

  useEffect(() => {
    setLocalClusters(null);
  }, [customMarker?.lng, customMarker?.lat, customMarker?.radiusKm, localAlgorithm]);

  const onMapClick = (e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const layerId = feature.layer.id;

      if (layerId === 'crime-clusters' || layerId === 'cluster-count') {
        const clusterId = feature.id ?? feature.properties.cluster_id;
        const map = mapRef.current.getMap();
        const source = map.getSource('crimes-clusters');

        if (source && clusterId !== undefined) {
          source.getClusterExpansionZoom(
            clusterId,
            (err: any, zoom: number) => {
              if (err) {
                map.easeTo({ center: feature.geometry.coordinates, zoom: map.getZoom() + 2, duration: 500 });
                return;
              }
              map.easeTo({
                center: feature.geometry.coordinates,
                zoom,
                duration: 500
              });
            }
          );
        } else {
          map.easeTo({ center: feature.geometry.coordinates, zoom: map.getZoom() + 2, duration: 500 });
        }
        return;
      }

      const type = layerId.includes('cluster') && layerId !== 'crime-clusters' && layerId !== 'cluster-count' ? 'cluster' : 'crime';
      
      if (type === 'crime' || (type === 'cluster' && feature.properties.clusterId === -1)) {
        // Noise points in clustering also have the original crime properties attached
        setSelectedCrime(feature.properties);
      } else if (type === 'cluster' && feature.properties.primary_type) {
         // Clustered points (individual colored points) have original properties
         setSelectedCrime(feature.properties);
      }
    } else {
      // Clicked on empty map, set or update custom marker
      setCustomMarker({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        radiusKm: customMarker ? customMarker.radiusKm : 1.0 // Preserve radius if already set
      });
    }
  };

  useEffect(() => {
    if (metadata && mapRef.current) {
      const map = mapRef.current.getMap();
      const b = metadata.boundingBox;
      
      // Handle degenerate bounds safely (single point or empty)
      if (b.minLng === b.maxLng && b.minLat === b.maxLat) {
        if (b.minLng !== undefined && !isNaN(b.minLng)) {
          map.flyTo({ center: [b.minLng, b.minLat], zoom: 12 });
        }
      } else if (b.minLng !== undefined && !isNaN(b.minLng)) {
        map.fitBounds(
          [[b.minLng, b.minLat], [b.maxLng, b.maxLat]],
          { padding: 50, duration: 1000 }
        );
      }
    }
  }, [metadata]);

  useEffect(() => {
    if (focusCoordinate && mapRef.current && isMapLoaded) {
      const map = mapRef.current.getMap();
      map.flyTo({ center: focusCoordinate, zoom: 15, duration: 1500 });
      setSearchQuery(`${focusCoordinate[1].toFixed(4)}, ${focusCoordinate[0].toFixed(4)}`);
      setCustomMarker({
        lng: focusCoordinate[0],
        lat: focusCoordinate[1],
        radiusKm: customMarker ? customMarker.radiusKm : 1.0
      });
    }
  }, [focusCoordinate, isMapLoaded]);

  const onInteractiveHover = (e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const layerId = feature.layer.id;
      
      if (layerId === 'crime-clusters' || layerId === 'cluster-count') {
        let lng = feature.geometry.coordinates[0];
        let lat = feature.geometry.coordinates[1];
        setHoverInfo((prev) => {
          if (prev && prev.lng === lng && prev.lat === lat && prev.type === 'native-cluster') return prev;
          return { lng, lat, props: feature.properties, type: 'native-cluster' };
        });
        return;
      }

      const type = layerId.includes('cluster') && layerId !== 'crime-clusters' && layerId !== 'cluster-count' ? 'cluster' : 'crime';
      
      let lng = e.lngLat.lng;
      let lat = e.lngLat.lat;
      
      // Use feature coordinates if available so popup snaps to the feature, reducing continuous coordinate updates
      if (feature.geometry && feature.geometry.type === 'Point') {
        lng = feature.geometry.coordinates[0];
        lat = feature.geometry.coordinates[1];
      } else if (feature.properties && feature.properties.lng && feature.properties.lat) {
        lng = feature.properties.lng;
        lat = feature.properties.lat;
      }

      setHoverInfo((prev) => {
        // Prevent re-render if we are still hovering over the exact same point
        if (prev && prev.lng === lng && prev.lat === lat && prev.type === type) return prev;
        return { lng, lat, props: feature.properties, type };
      });
    } else {
      setHoverInfo((prev) => prev !== null ? null : prev);
    }
  };

  // Precompute 24-hour crime distribution for the time-lapse mini histogram
  const hourlyDistribution = useMemo(() => {
    const counts = new Array(24).fill(0);
    for (const c of crimes) {
      const h = typeof c.hour === 'number' ? c.hour : parseInt(String(c.hour), 10);
      if (!isNaN(h) && h >= 0 && h < 24) {
        counts[h]++;
      }
    }
    const maxCount = Math.max(1, ...counts);
    return { counts, maxCount };
  }, [crimes]);

  // Compute displayed crimes dynamically based on time-lapse window mode
  const { displayedCrimes, dominantCrime, activeWindowHours } = useMemo(() => {
    if (!isTimeLapseActive) {
      return { 
        displayedCrimes: crimes, 
        dominantCrime: null, 
        activeWindowHours: new Set<number>() 
      };
    }

    let activeHours: number[] = [];
    if (windowMode === 'exact-hour') {
      activeHours = [currentHour];
    } else if (windowMode === 'rolling-3h') {
      activeHours = [
        (currentHour - 2 + 24) % 24,
        (currentHour - 1 + 24) % 24,
        currentHour
      ];
    } else {
      // cumulative: from 0 up to currentHour
      activeHours = Array.from({ length: currentHour + 1 }, (_, i) => i);
    }

    const activeSet = new Set(activeHours);
    const filtered = crimes.filter(c => {
      const h = typeof c.hour === 'number' ? c.hour : parseInt(String(c.hour), 10);
      return !isNaN(h) && activeSet.has(h);
    });

    // Find dominant crime type in the active window
    const typeCounts: Record<string, number> = {};
    for (const c of filtered) {
      if (c.primary_type) {
        typeCounts[c.primary_type] = (typeCounts[c.primary_type] || 0) + 1;
      }
    }
    let topType = '';
    let topCount = 0;
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > topCount) {
        topCount = count;
        topType = type;
      }
    }

    return {
      displayedCrimes: filtered,
      dominantCrime: topType || 'None',
      activeWindowHours: activeSet
    };
  }, [crimes, isTimeLapseActive, currentHour, windowMode]);

  // Human-readable active window string
  const timeWindowLabel = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    if (windowMode === 'exact-hour') {
      return `${pad(currentHour)}:00 - ${pad(currentHour)}:59`;
    }
    if (windowMode === 'rolling-3h') {
      const startH = (currentHour - 2 + 24) % 24;
      return `${pad(startH)}:00 - ${pad(currentHour)}:59`;
    }
    return `00:00 - ${pad(currentHour)}:59`;
  }, [windowMode, currentHour]);

  // Generate GeoJSON for raw / time-filtered points
  const crimeGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: displayedCrimes.map(c => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: { ...c }
      }))
    };
  }, [displayedCrimes]);

  // Safety check to ensure clustering labels match the current crimes length
  const isClusteringValid = clusteringResult && clusteringResult.labels.length === crimes.length;

  // Generate GeoJSON for cluster convex hulls
  const clusterHullsGeoJSON = useMemo(() => {
    if (!isClusteringValid) return null;
    
    // Group points by cluster id
    const clusters = new globalThis.Map<number, number[][]>();
    crimes.forEach((c, i) => {
      const label = clusteringResult.labels[i];
      if (label === -1) return; // noise
      if (!clusters.has(label)) clusters.set(label, []);
      clusters.get(label)!.push([c.lng, c.lat]);
    });

    const features: any[] = [];
    clusters.forEach((points, label) => {
      if (points.length >= 3) {
        // Turf needs convex to have >= 3 points
        try {
          const fc = turf.featureCollection(points.map(p => turf.point(p)));
          const hull = turf.convex(fc);
          if (hull) {
            hull.properties = { clusterId: label, count: points.length };
            features.push(hull);
          }
        } catch (e) {
          console.error("Convex hull failed for cluster", label);
        }
      } else if (points.length > 0) {
        // Fallback for small clusters (just buffering a point/line)
        const fc = turf.featureCollection(points.map(p => turf.point(p)));
        const center = turf.center(fc);
        const circle = turf.circle(center, 0.5, { units: 'kilometers' });
        circle.properties = { clusterId: label, count: points.length };
        features.push(circle);
      }
    });

    return { type: 'FeatureCollection', features };
  }, [crimes, clusteringResult]);

  // Generate colored points for clusters
  const clusteredPointsGeoJSON = useMemo(() => {
    if (!isClusteringValid) return null;
    return {
      type: 'FeatureCollection',
      features: crimes.map((c, i) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: { 
          ...c,
          cluster: clusteringResult.labels[i] 
        }
      }))
    };
  }, [crimes, clusteringResult]);

  // Marker features
  const customRadiusGeoJSON = useMemo(() => {
    if (!customMarker) return null;
    try {
      const center = turf.point([customMarker.lng, customMarker.lat]);
      return turf.circle(center, customMarker.radiusKm, { units: 'kilometers', steps: 64 });
    } catch (e) {
      return null;
    }
  }, [customMarker]);

  const crimesInRadiusGeoJSON = useMemo(() => {
    if (!customMarker) return { type: 'FeatureCollection', features: [] };
    const center = turf.point([customMarker.lng, customMarker.lat]);
    const features = [];
    const sourceCrimes = isTimeLapseActive ? displayedCrimes : crimes;
    for (const c of sourceCrimes) {
        const pt = turf.point([c.lng, c.lat], c);
        if (turf.distance(center, pt, { units: 'kilometers' }) <= customMarker.radiusKm) {
            features.push(pt);
        }
    }
    return turf.featureCollection(features);
  }, [customMarker, crimes, isTimeLapseActive, displayedCrimes]);

  const localClusterHullsGeoJSON = useMemo(() => {
    if (!localClusters) return null;
    const clusters = new globalThis.Map<number, number[][]>();
    localClusters.features.forEach((f: any) => {
      const label = f.properties.cluster;
      if (!clusters.has(label)) clusters.set(label, []);
      clusters.get(label)!.push(f.geometry.coordinates);
    });

    const features: any[] = [];
    clusters.forEach((points, label) => {
      if (points.length >= 3) {
        try {
          const fc = turf.featureCollection(points.map(p => turf.point(p)));
          const hull = turf.convex(fc);
          if (hull) {
            hull.properties = { clusterId: `local-${label}`, count: points.length };
            features.push(hull);
          }
        } catch (e) {}
      }
    });

    return { type: 'FeatureCollection', features };
  }, [localClusters]);

  const handleLocalClustering = () => {
    if (crimesInRadiusGeoJSON.features.length < 3) return;
    try {
        let clustered;
        if (localAlgorithm === 'K-MEANS') {
          const k = Math.min(5, Math.max(1, Math.floor(crimesInRadiusGeoJSON.features.length / 10)));
          clustered = turf.clustersKmeans(crimesInRadiusGeoJSON as any, { numberOfClusters: k });
        } else if (localAlgorithm === 'DBSCAN') {
          // DBSCAN with distance in kilometers. 100 meters = 0.1km.
          // Using 0.2km radius, min 3 points for typical urban density.
          clustered = turf.clustersDbscan(crimesInRadiusGeoJSON as any, 0.2, { units: 'kilometers', minPoints: 3 });
        } else if (localAlgorithm === 'HIERARCHICAL') {
          const features = crimesInRadiusGeoJSON.features;
          const k = Math.min(5, Math.max(1, Math.floor(features.length / 10)));
          
          if (features.length > 1500) {
             alert("Too many points for client-side Hierarchical clustering. Please reduce the radius.");
             return;
          }

          const N = features.length;
          const active = new Array(N).fill(true);
          const dists = new Array(N).fill(0).map(() => new Float64Array(N));
          for(let i=0; i<N; i++) {
            for(let j=i+1; j<N; j++) {
              // rough euclidean distance is faster than turf.distance for local clustering
              const dx = features[i].geometry.coordinates[0] - features[j].geometry.coordinates[0];
              const dy = features[i].geometry.coordinates[1] - features[j].geometry.coordinates[1];
              const d = dx*dx + dy*dy;
              dists[i][j] = d;
              dists[j][i] = d;
            }
          }

          const clusterAssignments = features.map((_, i) => [i]);
          let numClusters = N;

          while(numClusters > k) {
            let minDist = Infinity;
            let mergeA = -1, mergeB = -1;
            for(let i=0; i<N; i++) {
              if (!active[i]) continue;
              for(let j=i+1; j<N; j++) {
                if (!active[j]) continue;
                if (dists[i][j] < minDist) {
                  minDist = dists[i][j];
                  mergeA = i;
                  mergeB = j;
                }
              }
            }

            if (mergeA === -1) break;

            active[mergeB] = false;
            for(let i=0; i<N; i++) {
              if (!active[i] || i === mergeA) continue;
              // Complete Linkage (Math.max) creates more compact, spherical clusters than Single Linkage
              const newD = Math.max(dists[mergeA][i], dists[mergeB][i]); 
              dists[mergeA][i] = newD;
              dists[i][mergeA] = newD;
            }
            
            clusterAssignments[mergeA] = clusterAssignments[mergeA].concat(clusterAssignments[mergeB]);
            numClusters--;
          }

          const resultFeatures = JSON.parse(JSON.stringify(features));
          let currentClusterId = 0;
          for(let i=0; i<N; i++) {
            if (active[i]) {
              for(const idx of clusterAssignments[i]) {
                resultFeatures[idx].properties.cluster = currentClusterId;
              }
              currentClusterId++;
            }
          }
          clustered = turf.featureCollection(resultFeatures);
        }
        setLocalClusters(clustered);
    } catch (e) {
        console.error("Local clustering failed", e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if it's coordinates: "lat, lng"
    const coordMatch = searchQuery.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (mapRef.current) {
        mapRef.current.getMap().flyTo({ center: [lng, lat], zoom: 14, duration: 1500 });
      }
      return;
    }

    // Otherwise use Nominatim for geocoding
    try {
      setIsSearching(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (mapRef.current) {
          mapRef.current.getMap().flyTo({ center: [lng, lat], zoom: 14, duration: 1500 });
        }
      } else {
        alert("Location not found. Try searching a city, address, or 'lat, lng'.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const initialViewState = metadata ? {
    longitude: (metadata.boundingBox.minLng + metadata.boundingBox.maxLng) / 2,
    latitude: (metadata.boundingBox.minLat + metadata.boundingBox.maxLat) / 2,
    zoom: 11
  } : {
    longitude: -87.732,
    latitude: 41.833,
    zoom: 10
  };

  return (
    <div className="w-full h-full relative" style={{ width: '100%', height: '100%' }}>
      
      {/* Top Left Controls: Search Bar */}
      <div className="absolute top-4 z-10 w-[calc(100vw-72px)] md:w-80 transition-[left] duration-300 ease-in-out max-md:left-14 md:!left-[calc(var(--sidebar-offset,0px)+16px)]">
        <form onSubmit={handleSearch} className="flex bg-[var(--color-surface)]/85 backdrop-blur-md rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)] overflow-hidden">
          <input 
            type="text" 
            placeholder="Search address or lat, lng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-[13px] outline-none text-[var(--color-navy-deep)] bg-transparent placeholder:text-[var(--color-slate-muted)] font-medium"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-4 bg-transparent text-[var(--color-slate)] hover:text-[var(--color-primary)] border-l border-[var(--color-border)] hover:bg-[var(--color-surface-soft)]/50 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSearching ? (
               <div className="w-4 h-4 border-2 border-[var(--color-slate-muted)] border-t-transparent rounded-full animate-spin"/>
            ) : (
               <Search className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      {/* Bottom Left Controls: Map Layers & 24h Time-Lapse Player Toggle */}
      <div className="absolute bottom-4 z-10 flex flex-col gap-2 transition-[left] duration-300 ease-in-out max-md:left-4 md:!left-[calc(var(--sidebar-offset,0px)+16px)]">
        {/* 24h Time-Lapse Player Launcher */}
        <button 
          onClick={() => {
            setIsTimeLapseActive(prev => {
              const next = !prev;
              if (!next) setIsPlaying(false);
              return next;
            });
          }}
          className={clsx(
            "p-2.5 rounded-full shadow-md border transition-all flex items-center justify-center cursor-pointer relative group",
            isTimeLapseActive 
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-indigo)] text-white border-transparent ring-2 ring-[var(--color-primary)]/30 shadow-[0_0_15px_rgba(79,70,229,0.35)]" 
              : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
          )}
          title={isTimeLapseActive ? "Close 24h Time-Lapse" : "24-Hour Time-Lapse Heatmap Player"}
        >
          <Clock className="w-5 h-5" />
          {isTimeLapseActive && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          )}
        </button>

        {/* Basemap Style Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="bg-[var(--color-surface)] p-2.5 rounded-full shadow-sm border border-[var(--color-border)] text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center cursor-pointer"
            title="Map Style"
          >
            <Layers className="w-5 h-5" />
          </button>
          
          {isLayerMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-40 bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-md border border-[var(--color-border)] overflow-hidden py-1 z-20">
              {MAP_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCurrentStyle(style.url);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors cursor-pointer ${currentStyle === style.url ? 'bg-[var(--color-indigo-soft)] text-[var(--color-primary)] font-semibold' : 'text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)]'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Map
        ref={mapRef}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100%' }}
        maplibreLogo={false}
        initialViewState={initialViewState}
        mapStyle={currentStyle}
        minZoom={3}
        interactiveLayerIds={['crime-points', 'crime-clusters', 'cluster-count', 'clustered-points-circle', 'cluster-hulls-fill']}
        onMouseMove={onInteractiveHover}
        onClick={onMapClick}
        onMouseLeave={() => setHoverInfo(null)}
        onLoad={() => setIsMapLoaded(true)}
      >
        {/* Source for Maplibre clustering (when ML clustering isn't active) */}
        <Source 
          id="crimes-clusters" 
          type="geojson" 
          data={crimeGeoJSON as any}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          {(!isClusteringValid || localClusters || isTimeLapseActive) && (
            <Layer
              id="crime-points"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{
                'circle-radius': 4,
                'circle-color': '#94a3b8',
                'circle-opacity': 0.65,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          )}
              
          {(!isClusteringValid || localClusters || isTimeLapseActive) && (
            <Layer
              id="crime-clusters"
              type="circle"
              filter={['has', 'point_count']}
              paint={{
                'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#64748b', 10,
                  '#475569', 50,
                  '#1e293b'
                ],
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  15, 10,
                  20, 50,
                  25
                ],
                'circle-opacity': 0.85,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }}
            />
          )}

          {(!isClusteringValid || localClusters || isTimeLapseActive) && (
            <Layer
              id="cluster-count"
              type="symbol"
              filter={['has', 'point_count']}
              layout={{
                'text-field': '{point_count_abbreviated}',
                'text-size': 12
              }}
              paint={{
                'text-color': '#ffffff'
              }}
            />
          )}
        </Source>
        
        {/* Source for Dynamic Heatmap */}
        <Source id="crimes-heatmap" type="geojson" data={crimeGeoJSON as any}>
          <Layer
            id="crime-heatmap"
            type="heatmap"
            layout={{
              visibility: showHeatmap ? 'visible' : 'none'
            }}
            paint={{
              'heatmap-weight': 1,
              'heatmap-intensity': 1,
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(0,0,0,0)',
                0.2, '#fca5a5',
                0.5, '#ef4444',
                0.8, '#b91c1c',
                1, '#7f1d1d'
              ],
              'heatmap-radius': 26,
              'heatmap-opacity': 0.5
            }}
          />
        </Source>

        {/* If clustered globally (and local clustering and time-lapse not active), show convex hulls and colored points */}
        {isClusteringValid && !localClusters && !isTimeLapseActive && clusterHullsGeoJSON && (
          <Source id="cluster-hulls" type="geojson" data={clusterHullsGeoJSON as any}>
            <Layer
              id="cluster-hulls-fill"
              type="fill"
              paint={{
                'fill-color': '#3b82f6',
                'fill-opacity': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'clusterId'], hoveredClusterId], 0.3, 0.15]
                  : 0.15
              }}
            />
            <Layer
              id="cluster-hulls-line"
              type="line"
              paint={{
                'line-color': '#2563eb',
                'line-width': hoveredClusterId !== null 
                  ? ['case', ['==', ['get', 'clusterId'], hoveredClusterId], 3, 1] 
                  : 2,
                'line-opacity': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'clusterId'], hoveredClusterId], 1, 0.3]
                  : 0.8,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}

        {isClusteringValid && !localClusters && !isTimeLapseActive && clusteredPointsGeoJSON && (
          <Source id="clustered-points" type="geojson" data={clusteredPointsGeoJSON as any}>
            <Layer
              id="clustered-points-circle"
              type="circle"
              paint={{
                'circle-radius': ['case', ['==', ['get', 'cluster'], -1], 3, 5],
                'circle-color': [
                  'case',
                  ['==', ['get', 'cluster'], -1], '#cbd5e1', // Noise is grey
                  // Cycle through some colors based on cluster id for visibility
                  ['step', ['%', ['get', 'cluster'], 5], 
                    '#ef4444', 1, 
                    '#3b82f6', 2, 
                    '#10b981', 3, 
                    '#f59e0b', 4, 
                    '#8b5cf6'
                  ]
                ],
                'circle-opacity': hoveredClusterId !== null
                  ? ['case', 
                      ['==', ['get', 'cluster'], hoveredClusterId], 1,
                      0.3
                    ]
                  : ['case', ['==', ['get', 'cluster'], -1], 0.4, 0.9],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.lng}
            latitude={hoverInfo.lat}
            closeButton={false}
            closeOnClick={false}
            className="z-50"
            anchor="bottom"
            offset={15}
          >
            <div className="p-3 text-[12px] max-w-[calc(100vw-40px)] md:max-w-[220px] shadow-sm rounded-[var(--radius-panel)] bg-[var(--color-surface)] text-[var(--color-navy-deep)] border border-[var(--color-border)] overflow-hidden">
              {hoverInfo.type === 'native-cluster' ? (
                <>
                  <div className="font-bold text-[13px] border-b pb-1.5 mb-1.5 border-[var(--color-border)]">
                    Crime Cluster
                  </div>
                  <div className="text-[var(--color-slate)]">Total Crimes: <span className="font-semibold text-[var(--color-navy-deep)]">{hoverInfo.props.point_count}</span></div>
                  <div className="text-[10px] text-[var(--color-primary)] mt-2 italic font-medium">Click to zoom in</div>
                </>
              ) : hoverInfo.type === 'crime' ? (
                <>
                  <div className="font-bold text-[13px] border-b pb-1.5 mb-1.5 border-[var(--color-border)]">{hoverInfo.props.primary_type}</div>
                  <div className="text-[var(--color-slate)]">Date: <span className="font-medium text-[var(--color-navy-deep)]">{new Date(hoverInfo.props.date).toLocaleDateString()}</span></div>
                  <div className="text-[var(--color-slate)]">District: <span className="font-medium text-[var(--color-navy-deep)]">{hoverInfo.props.district}</span></div>
                  {hoverInfo.props.arrest && <div className="text-[var(--color-teal)] font-semibold mt-1">Arrest Made</div>}
                  <div className="text-[10px] text-[var(--color-primary)] mt-2 italic font-medium">Click for full details</div>
                </>
              ) : (
                <>
                  <div className="font-bold text-[13px] border-b pb-1.5 mb-1.5 border-[var(--color-border)]">
                    {(hoverInfo.props.clusterId ?? hoverInfo.props.cluster) === -1 ? 'Noise Point' : `Cluster ${hoverInfo.props.clusterId ?? hoverInfo.props.cluster}`}
                  </div>
                  {hoverInfo.props.count && <div className="text-[var(--color-slate)]">Total Crimes: <span className="font-semibold text-[var(--color-navy-deep)]">{hoverInfo.props.count}</span></div>}
                  {hoverInfo.props.primary_type && (
                    <>
                      <div className="text-[var(--color-slate)]">Type: <span className="font-medium text-[var(--color-navy-deep)]">{hoverInfo.props.primary_type}</span></div>
                      <div className="text-[var(--color-slate)]">District: <span className="font-medium text-[var(--color-navy-deep)]">{hoverInfo.props.district}</span></div>
                      <div className="text-[10px] text-[var(--color-primary)] mt-2 italic font-medium">Click for full details</div>
                    </>
                  )}
                </>
              )}
            </div>
          </Popup>
        )}

        {customRadiusGeoJSON && (
          <Source id="custom-radius" type="geojson" data={customRadiusGeoJSON as any}>
            <Layer
              id="custom-radius-fill"
              type="fill"
              paint={{
                'fill-color': '#f43f5e',
                'fill-opacity': 0.1
              }}
            />
            <Layer
              id="custom-radius-line"
              type="line"
              paint={{
                'line-color': '#f43f5e',
                'line-width': 2,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}

        {localClusterHullsGeoJSON && (
          <Source id="local-cluster-hulls" type="geojson" data={localClusterHullsGeoJSON as any}>
            <Layer
              id="local-cluster-hulls-fill"
              type="fill"
              paint={{
                'fill-color': '#eab308',
                'fill-opacity': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'clusterId'], `local-${hoveredClusterId}`], 0.5, 0.1]
                  : 0.3
              }}
            />
            <Layer
              id="local-cluster-hulls-line"
              type="line"
              paint={{
                'line-color': '#ca8a04',
                'line-width': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'clusterId'], `local-${hoveredClusterId}`], 3, 1]
                  : 2,
                'line-opacity': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'clusterId'], `local-${hoveredClusterId}`], 1, 0.3]
                  : 1,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}
        
        {localClusters && (
          <Source id="local-clustered-points" type="geojson" data={localClusters as any}>
            <Layer
              id="local-clustered-points-circle"
              type="circle"
              paint={{
                'circle-radius': 5,
                'circle-color': [
                  'step', ['%', ['get', 'cluster'], 3], 
                  '#eab308', 1, 
                  '#14b8a6', 2, 
                  '#ec4899'
                ],
                'circle-opacity': hoveredClusterId !== null
                  ? ['case', ['==', ['get', 'cluster'], hoveredClusterId], 1, 0.3]
                  : 0.9,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {customMarker && (
          <Marker
            longitude={customMarker.lng}
            latitude={customMarker.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setCustomMarker(null);
            }}
          >
            <div className="text-rose-600 drop-shadow-md cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
            </div>
          </Marker>
        )}

        {/* Tactical Patrol Route Polyline Layers */}
        {patrolRouteGeoJSON && (
          <Source id="patrol-route-source" type="geojson" data={patrolRouteGeoJSON as any}>
            <Layer
              id="patrol-route-glow"
              type="line"
              paint={{
                'line-color': '#06b6d4',
                'line-width': 8,
                'line-opacity': 0.4,
                'line-blur': 4
              }}
            />
            <Layer
              id="patrol-route-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 3.5,
                'line-opacity': 0.95,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* Tactical Checkpoint Numbered Markers */}
        {activePatrolRoute && activePatrolRoute.checkpoints.map((cp) => {
          const isCrit = cp.riskCategory.toLowerCase().includes('critical');
          const isH = cp.riskCategory.toLowerCase().includes('high');
          const isSelected = selectedCheckpoint?.order === cp.order;
          
          return (
            <Marker
              key={`patrol-cp-${cp.order}`}
              longitude={cp.lng}
              latitude={cp.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedCheckpoint(cp);
                setCurrentCheckpointIndex(cp.order - 1);
              }}
            >
              <div className="relative group cursor-pointer">
                {isSelected && (
                  <span className={clsx(
                    "absolute -inset-1.5 rounded-full animate-ping opacity-75",
                    isCrit ? "bg-red-500" : isH ? "bg-amber-500" : "bg-blue-500"
                  )} />
                )}
                <div className={clsx(
                  "relative flex items-center justify-center w-8 h-8 rounded-full font-black text-[12px] text-white shadow-xl border-2 transition-transform duration-200 group-hover:scale-110",
                  isSelected ? "scale-110 ring-2 ring-white" : "",
                  isCrit ? "bg-red-600 border-red-200" :
                  isH ? "bg-amber-500 border-amber-200" :
                  "bg-blue-600 border-blue-200"
                )}>
                  {cp.order}
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Selected Checkpoint Dispatch Popup */}
        {selectedCheckpoint && (
          <Popup
            longitude={selectedCheckpoint.lng}
            latitude={selectedCheckpoint.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedCheckpoint(null)}
            anchor="bottom"
            offset={20}
            className="z-50"
          >
            <div className="p-3.5 text-[12px] max-w-[280px] bg-[var(--color-surface)] text-[var(--color-navy-deep)] rounded-[var(--radius-panel)] border border-[var(--color-border)] shadow-xl">
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-[var(--color-border)]">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-navy-deep)] text-white text-[10px] font-black">
                    {selectedCheckpoint.order}
                  </span>
                  <span className="font-bold text-[13px] text-[var(--color-navy-deep)]">
                    Checkpoint #{selectedCheckpoint.order}
                  </span>
                </div>
                <span className={clsx(
                  "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                  selectedCheckpoint.riskCategory.toLowerCase().includes('critical') 
                    ? "bg-[var(--color-critical)]/15 text-[var(--color-critical)]" 
                    : "bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
                )}>
                  Cluster #{selectedCheckpoint.clusterId}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider">
                    Target Crime Profile
                  </div>
                  <div className="font-semibold text-[13px] text-[var(--color-navy-deep)]">
                    {selectedCheckpoint.dominantCrime}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[var(--color-background)] p-2 rounded border border-[var(--color-border)]">
                  <div>
                    <span className="text-[var(--color-slate-muted)] block text-[10px] uppercase font-bold">Density</span>
                    <span className="font-bold text-[var(--color-navy-deep)]">{selectedCheckpoint.density.toFixed(1)}/km²</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-slate-muted)] block text-[10px] uppercase font-bold">Window</span>
                    <span className="font-semibold text-[var(--color-navy-deep)]">{selectedCheckpoint.peakShift.replace('Shift Window: ', '')}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Car className="w-3 h-3" /> Recommended Unit
                  </div>
                  <div className="font-semibold text-[11px] text-[var(--color-navy-deep)]">
                    {selectedCheckpoint.recommendedUnit}
                  </div>
                </div>

                <div className="text-[11px] text-[var(--color-slate)] bg-[var(--color-surface-soft)] p-2 rounded leading-relaxed border border-[var(--color-border)]">
                  {selectedCheckpoint.tacticalAction}
                </div>
              </div>
            </div>
          </Popup>
        )}

      </Map>

      {/* Floating Tactical Patrol HUD Bar (Adjusts vertically if Time-Lapse is active) */}
      {activePatrolRoute && (
        <div className={clsx(
          "absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 md:gap-3 bg-[var(--color-surface)]/95 backdrop-blur-md px-4 py-2.5 rounded-[var(--radius-panel)] shadow-xl border border-[var(--color-border)] max-w-[calc(100vw-32px)] overflow-x-auto custom-scrollbar transition-all duration-300",
          isTimeLapseActive ? "bottom-[175px] md:bottom-[180px]" : "bottom-5"
        )}>
          <div className="flex items-center gap-2.5 shrink-0 border-r border-[var(--color-border)] pr-3">
            <span className="p-1.5 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-indigo)] text-white rounded-md shadow-sm">
              <Route className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-[var(--color-primary)] tracking-widest uppercase">
                  Tactical Patrol Circuit
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="text-[12px] font-bold text-[var(--color-navy-deep)] whitespace-nowrap">
                {activePatrolRoute.checkpoints.length} Checkpoints • {activePatrolRoute.totalDistanceKm} km tour
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNextCheckpoint}
              title="Focus Next Checkpoint"
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-[11px] font-bold rounded-[var(--radius-control)] shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Next Stop ({currentCheckpointIndex + 1}/{activePatrolRoute.checkpoints.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {onGoToIntel && (
              <button
                onClick={onGoToIntel}
                title="View Full Intel Sheet"
                className="px-3 py-1.5 bg-[var(--color-surface-soft)] hover:bg-[var(--color-border)] text-[var(--color-slate)] hover:text-[var(--color-navy-deep)] text-[11px] font-bold rounded-[var(--radius-control)] border border-[var(--color-border)] transition-colors whitespace-nowrap cursor-pointer"
              >
                Intel Sheet
              </button>
            )}

            {onClearPatrolRoute && (
              <button
                onClick={onClearPatrolRoute}
                title="Clear Active Patrol Route"
                className="p-1.5 text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose)]/10 rounded-[var(--radius-control)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 24-Hour Dynamic Time-Lapse Heatmap Player Bar */}
      {isTimeLapseActive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100vw-32px)] md:w-[700px] bg-[var(--color-surface)]/95 backdrop-blur-md rounded-[var(--radius-panel)] shadow-2xl border border-[var(--color-border)] p-3 md:p-4 flex flex-col gap-2.5 transition-all duration-300">
          {/* Top Row: Active Time, Stats, Window Modes & Exit */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[13px] font-black tracking-tight font-mono">
                  {String(currentHour).padStart(2, '0')}:00
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[var(--color-navy-deep)]">
                    {displayedCrimes.length.toLocaleString()} Incidents
                  </span>
                  <span className="text-[10px] text-[var(--color-slate-muted)] font-medium">
                    ({((displayedCrimes.length / (crimes.length || 1)) * 100).toFixed(0)}%)
                  </span>
                  {dominantCrime && dominantCrime !== 'None' && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--color-rose)]/10 text-[var(--color-rose)] border border-[var(--color-rose)]/20">
                      <Flame className="w-2.5 h-2.5" />
                      {dominantCrime}
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-medium text-[var(--color-slate-muted)]">
                  Window: {timeWindowLabel}
                </div>
              </div>
            </div>

            {/* Window Mode Selector & Close */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-[var(--color-background)] p-0.5 rounded-lg border border-[var(--color-border)] text-[10px] font-bold">
                <button
                  onClick={() => setWindowMode('rolling-3h')}
                  className={clsx(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    windowMode === 'rolling-3h'
                      ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-extrabold"
                      : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                  )}
                  title="3-Hour Rolling Window (e.g. 18:00 - 20:59)"
                >
                  Rolling 3h
                </button>
                <button
                  onClick={() => setWindowMode('exact-hour')}
                  className={clsx(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    windowMode === 'exact-hour'
                      ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-extrabold"
                      : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                  )}
                  title="Exact Single Hour"
                >
                  Exact 1h
                </button>
                <button
                  onClick={() => setWindowMode('cumulative')}
                  className={clsx(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    windowMode === 'cumulative'
                      ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-extrabold"
                      : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                  )}
                  title="Cumulative 00:00 through active hour"
                >
                  Cumulative
                </button>
              </div>

              <button
                onClick={() => {
                  setIsTimeLapseActive(false);
                  setIsPlaying(false);
                }}
                className="p-1.5 text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose)]/10 rounded-md transition-colors cursor-pointer"
                title="Exit Time-Lapse"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle Row: 24-Bar Mini Histogram + Range Scrubber Slider */}
          <div className="flex flex-col gap-1">
            {/* 24-Bar Frequency Histogram */}
            <div className="h-8 flex items-end gap-[2px] md:gap-[3px] w-full px-1">
              {hourlyDistribution.counts.map((count, hour) => {
                const heightPct = Math.max(14, (count / (hourlyDistribution.maxCount || 1)) * 100);
                const isSelected = hour === currentHour;
                const isInWindow = activeWindowHours.has(hour);
                return (
                  <div
                    key={hour}
                    onClick={() => setCurrentHour(hour)}
                    className="flex-1 h-full flex items-end cursor-pointer group relative"
                    title={`Hour ${String(hour).padStart(2, '0')}:00 — ${count} crimes`}
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={clsx(
                        "w-full rounded-t transition-all duration-200",
                        isSelected
                          ? "bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-sm"
                          : isInWindow
                          ? "bg-[var(--color-indigo)]/70 group-hover:bg-[var(--color-primary)]"
                          : "bg-[var(--color-border)] group-hover:bg-[var(--color-slate-muted)]/50"
                      )}
                    />
                  </div>
                );
              })}
            </div>

            {/* Slider Scrubber */}
            <div className="relative flex items-center px-1">
              <input
                type="range"
                min={0}
                max={23}
                step={1}
                value={currentHour}
                onChange={(e) => setCurrentHour(parseInt(e.target.value, 10))}
                className="w-full accent-[var(--color-primary)] h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer focus:outline-none"
              />
            </div>

            {/* Timeline Tick Labels */}
            <div className="flex justify-between items-center text-[9px] font-mono font-semibold text-[var(--color-slate-muted)] px-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Bottom Row: Play/Pause, Step, Reset, Speed Pills, Heatmap Toggle */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--color-border)] flex-wrap">
            {/* Play, Step, Reset Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer",
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentHour(prev => (prev - 1 + 24) % 24)}
                title="Previous Hour"
                className="p-1.5 text-[var(--color-slate)] hover:text-[var(--color-navy-deep)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-control)] border border-[var(--color-border)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentHour(prev => (prev + 1) % 24)}
                title="Next Hour"
                className="p-1.5 text-[var(--color-slate)] hover:text-[var(--color-navy-deep)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-control)] border border-[var(--color-border)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentHour(0);
                }}
                title="Reset to 00:00"
                className="p-1.5 text-[var(--color-slate-muted)] hover:text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-control)] border border-[var(--color-border)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Pills */}
            <div className="flex items-center gap-1 bg-[var(--color-background)] px-1.5 py-0.5 rounded-lg border border-[var(--color-border)]">
              <span className="text-[9px] font-bold text-[var(--color-slate-muted)] uppercase tracking-wider pr-1">Speed</span>
              {([1, 2, 4] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={clsx(
                    "px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                    playbackSpeed === speed
                      ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-black"
                      : "text-[var(--color-slate-muted)] hover:text-[var(--color-slate)]"
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(prev => !prev)}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-control)] text-[10px] font-bold border transition-all cursor-pointer",
                showHeatmap
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/30 font-extrabold"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-slate-muted)] border-[var(--color-border)]"
              )}
              title="Toggle Map Density Heatmap"
            >
              <Flame className={clsx("w-3.5 h-3.5", showHeatmap ? "text-rose-500 fill-rose-500/30" : "")} />
              <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Right Side Panel Stack */}
      <div className="absolute md:top-4 max-md:top-auto right-4 bottom-16 md:bottom-4 z-20 flex flex-col items-end max-md:items-center justify-end md:justify-start gap-4 pointer-events-none max-md:left-4 md:w-80 max-md:max-h-[40vh]">
        
        {/* Top: Metrics Panel (Children / Global) */}
        {children && !localClusteringResult && (
          <div className="pointer-events-auto flex-1 min-h-0 flex flex-col w-full">
            {React.isValidElement(children) ? React.cloneElement(children as any, { onClusterHover: setHoveredClusterId, hoveredClusterId }) : children}
          </div>
        )}

        {/* Local Metrics Panel */}
        {localClusteringResult && (
          <div className="pointer-events-auto flex-1 min-h-0 flex flex-col w-full">
            <MetricsPanel result={localClusteringResult} algorithm={`Local ${localAlgorithm}`} onClusterHover={setHoveredClusterId} hoveredClusterId={hoveredClusterId} />
          </div>
        )}

        {/* Bottom: Area Analysis Panel */}
        {customMarker && (
          <div className="pointer-events-auto shrink-0 bg-[var(--color-surface)]/95 backdrop-blur-md rounded-[var(--radius-panel)] shadow-lg p-4 w-full border border-[var(--color-border)] max-h-full overflow-y-auto custom-scrollbar">
            <div className="font-bold text-[13px] text-[var(--color-navy-deep)] border-b pb-2 mb-3 border-[var(--color-border)] flex justify-between items-center">
              Area Analysis
              <button onClick={() => setCustomMarker(null)} className="text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
          </div>
          <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-[var(--color-slate-muted)] tracking-widest uppercase">RADIUS</span>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  min="0.1" max="50" step="0.1"
                  value={Number(customMarker.radiusKm).toString()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setCustomMarker({...customMarker, radiusKm: val});
                    }
                  }}
                  className="w-14 text-right text-[12px] font-bold text-[var(--color-navy-deep)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-[4px] px-1 py-0.5 focus:outline-none focus:border-[var(--color-primary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[11px] font-bold text-[var(--color-slate-muted)]">km</span>
              </div>
          </div>
          <input 
              type="range" 
              min="0.1" max="10" step="0.1" 
              value={customMarker.radiusKm}
              onChange={(e) => setCustomMarker({...customMarker, radiusKm: parseFloat(e.target.value)})}
              className="w-full mb-4 accent-[var(--color-rose)] h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer"
          />
          <div className="bg-[var(--color-rose)]/10 p-3 rounded-[var(--radius-control)] border border-[var(--color-rose)]/20 flex items-center justify-between mb-3">
              <div className="text-[10px] font-bold text-[var(--color-rose)] uppercase tracking-wider">Incidents</div>
              <div className="text-[18px] font-black text-[var(--color-rose)]">{(crimesInRadiusGeoJSON as any).features.length.toLocaleString()}</div>
          </div>
          {!localClusters && (crimesInRadiusGeoJSON as any).features.length >= 3 && (
            <div className="mb-3 bg-[var(--color-background)] p-3 rounded-[var(--radius-control)] border border-[var(--color-border)]">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] font-bold text-[var(--color-slate-muted)] uppercase tracking-widest">Algorithm</span>
                <select 
                  value={localAlgorithm}
                  onChange={(e) => setLocalAlgorithm(e.target.value as 'K-MEANS' | 'DBSCAN' | 'HIERARCHICAL')}
                  className="text-[11px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] px-1.5 py-0.5 text-[var(--color-navy-deep)] font-semibold outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="K-MEANS">K-Means</option>
                  <option value="DBSCAN">DBSCAN</option>
                  <option value="HIERARCHICAL">Hierarchical</option>
                </select>
              </div>
              <button 
                onClick={handleLocalClustering}
                className="w-full bg-[var(--color-slate)] text-white text-[11px] font-bold py-1.5 rounded-[var(--radius-control)] hover:bg-[var(--color-navy)] transition-colors shadow-sm"
              >
                Cluster Local Hotspots
              </button>
            </div>
          )}
          {localClusters && (
            <button 
              onClick={() => setLocalClusters(null)}
              className="w-full text-[11px] font-bold text-[var(--color-rose)] bg-[var(--color-rose)]/10 py-1.5 rounded-[var(--radius-control)] border border-[var(--color-rose)]/20 mb-3 hover:bg-[var(--color-rose)]/20 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              Stop Local Clustering
            </button>
          )}
          <button 
            onClick={onNavigateCompare}
            disabled={(crimesInRadiusGeoJSON as any).features.length < 5}
            className={`w-full text-white text-[12px] font-bold py-2 rounded-[var(--radius-control)] transition-colors shadow-sm flex items-center justify-center gap-2 ${(crimesInRadiusGeoJSON as any).features.length < 5 ? "bg-[var(--color-slate-muted)] cursor-not-allowed" : "bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90"}`}
            title={(crimesInRadiusGeoJSON as any).features.length < 5 ? "Not enough incidents to compare models (requires at least 5)" : "Compare ML Models"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Compare ML Models
          </button>
          <div className="text-[10px] text-[var(--color-slate-muted)] mt-3 text-center font-medium">Click map pin to remove</div>
        </div>
        )}
      </div>
      
      {/* Crime Details Modal */}
      {selectedCrime && (
        <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-xl max-w-md w-full overflow-hidden flex flex-col border border-[var(--color-border)]">
            <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-background)]">
              <h3 className="text-[14px] font-bold text-[var(--color-navy-deep)] uppercase tracking-wider">Crime Details</h3>
              <button 
                onClick={() => setSelectedCrime(null)}
                className="text-[var(--color-slate-muted)] hover:text-[var(--color-rose)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Incident Type</div>
                  <div className="font-bold text-[var(--color-navy-deep)] text-[18px]">{selectedCrime.primary_type}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Date</div>
                    <div className="text-[13px] font-semibold text-[var(--color-navy-deep)]">{new Date(selectedCrime.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Time</div>
                    <div className="text-[13px] font-semibold text-[var(--color-navy-deep)]">{selectedCrime.hour}:00</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">District</div>
                    <div className="text-[13px] font-semibold text-[var(--color-navy-deep)]">{selectedCrime.district}</div>
                  </div>
                  {selectedCrime.police_station && (
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Police Station</div>
                    <div className="text-[13px] font-semibold text-[var(--color-navy-deep)]">{selectedCrime.police_station}</div>
                  </div>
                  )}
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Status</div>
                    <div className={`text-[13px] font-bold ${selectedCrime.arrest ? "text-[var(--color-teal)]" : "text-[var(--color-rose)]"}`}>
                      {selectedCrime.arrest ? "Arrest Made" : "Pending / No Arrest"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Coordinates</div>
                    <div className="text-[12px] font-mono text-[var(--color-slate)]">{selectedCrime.lat?.toFixed(4)}, {selectedCrime.lng?.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Record ID</div>
                    <div className="flex items-start gap-1.5">
                      <div className="text-[12px] font-mono text-[var(--color-slate)] break-all" title={selectedCrime.id}>{selectedCrime.id || 'N/A'}</div>
                      {selectedCrime.id && (
                        <button 
                          onClick={(e) => {
                            navigator.clipboard.writeText(selectedCrime.id);
                            const btn = e.currentTarget;
                            const originalHtml = btn.innerHTML;
                            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
                          }}
                          title="Copy ID"
                          className="text-[var(--color-slate-muted)] hover:text-[var(--color-primary)] transition-colors p-1 shrink-0 bg-[var(--color-surface)] hover:bg-[var(--color-background)] rounded"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedCrime.description && (
                  <div>
                    <div className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest font-bold mb-1">Description</div>
                    <div className="text-[12px] text-[var(--color-slate)] font-medium bg-[var(--color-background)] p-3 rounded-[var(--radius-control)] border border-[var(--color-border)] leading-relaxed">
                      {selectedCrime.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-background)] flex justify-end">
              <button 
                onClick={() => setSelectedCrime(null)}
                className="px-5 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)] text-[12px] font-bold rounded-[var(--radius-control)] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
