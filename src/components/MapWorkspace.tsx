import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Map, Source, Layer, Popup, useMap, Marker } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrimeRecord, ClusteringResult, Metadata } from '../types';
import * as turf from '@turf/turf';
import { Search, Layers, MapPin } from 'lucide-react';
import MetricsPanel from './MetricsPanel';

interface MapWorkspaceProps {
  crimes: CrimeRecord[];
  clusteringResult: ClusteringResult | null;
  metadata: Metadata | null;
  customMarker: {lng: number, lat: number, radiusKm: number} | null;
  setCustomMarker: (marker: {lng: number, lat: number, radiusKm: number} | null) => void;
  onNavigateCompare: () => void;
  focusCoordinate?: [number, number] | null;
  children?: React.ReactNode;
}

export default function MapWorkspace({ crimes, clusteringResult, metadata, customMarker, setCustomMarker, onNavigateCompare, focusCoordinate, children }: MapWorkspaceProps) {
  const [hoverInfo, setHoverInfo] = useState<{lng: number, lat: number, props: any, type: string} | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<any>(null);
  const [localClusters, setLocalClusters] = useState<any>(null);
  const [localAlgorithm, setLocalAlgorithm] = useState<'K-MEANS' | 'DBSCAN' | 'HIERARCHICAL'>('K-MEANS');
  const [hoveredClusterId, setHoveredClusterId] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

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
  const [currentStyle, setCurrentStyle] = useState(MAP_STYLES[0].url);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  // Generate GeoJSON for raw points
  const crimeGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: crimes.map(c => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: { ...c }
      }))
    };
  }, [crimes]);

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
    for (const c of crimes) {
        const pt = turf.point([c.lng, c.lat], c);
        if (turf.distance(center, pt, { units: 'kilometers' }) <= customMarker.radiusKm) {
            features.push(pt);
        }
    }
    return turf.featureCollection(features);
  }, [crimes, customMarker]);

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

      {/* Bottom Left Controls: Map Layers */}
      <div className="absolute bottom-4 z-10 transition-[left] duration-300 ease-in-out max-md:left-4 md:!left-[calc(var(--sidebar-offset,0px)+16px)]">
        <div className="relative">
          <button 
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="bg-[var(--color-surface)] p-2.5 rounded-full shadow-sm border border-[var(--color-border)] text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center"
            title="Map Style"
          >
            <Layers className="w-5 h-5" />
          </button>
          
          {isLayerMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-40 bg-[var(--color-surface)] rounded-[var(--radius-panel)] shadow-md border border-[var(--color-border)] overflow-hidden py-1">
              {MAP_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCurrentStyle(style.url);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors ${currentStyle === style.url ? 'bg-[var(--color-indigo-soft)] text-[var(--color-primary)] font-semibold' : 'text-[var(--color-slate)] hover:bg-[var(--color-surface-soft)]'}`}
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
          {(!isClusteringValid || localClusters) && (
            <Layer
              id="crime-points"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{
                'circle-radius': 4,
                'circle-color': '#94a3b8',
                'circle-opacity': 0.6,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          )}
              
          {(!isClusteringValid || localClusters) && (
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

          {(!isClusteringValid || localClusters) && (
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
        
        {/* Source for Heatmap (always on) */}
        <Source id="crimes-heatmap" type="geojson" data={crimeGeoJSON as any}>
          <Layer
            id="crime-heatmap"
            type="heatmap"
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
              'heatmap-radius': 25,
              'heatmap-opacity': 0.4
            }}
          />
        </Source>

        {/* If clustered globally (and local clustering not active), show convex hulls and colored points */}
        {isClusteringValid && !localClusters && clusterHullsGeoJSON && (
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

        {isClusteringValid && !localClusters && clusteredPointsGeoJSON && (
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

        {/* The popup is removed from here. The marker stays. */}
      </Map>

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
