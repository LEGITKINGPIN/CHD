import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Map, Source, Layer, Popup, useMap, Marker } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrimeRecord, ClusteringResult, Metadata } from '../types';
import * as turf from '@turf/turf';
import { Search, Layers, MapPin } from 'lucide-react';

interface MapWorkspaceProps {
  crimes: CrimeRecord[];
  clusteringResult: ClusteringResult | null;
  metadata: Metadata | null;
  customMarker: {lng: number, lat: number, radiusKm: number} | null;
  setCustomMarker: (marker: {lng: number, lat: number, radiusKm: number} | null) => void;
  onNavigateCompare: () => void;
  focusCoordinate?: [number, number] | null;
}

export default function MapWorkspace({ crimes, clusteringResult, metadata, customMarker, setCustomMarker, onNavigateCompare, focusCoordinate }: MapWorkspaceProps) {
  const [hoverInfo, setHoverInfo] = useState<{lng: number, lat: number, props: any, type: string} | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<any>(null);
  const [localClusters, setLocalClusters] = useState<any>(null);
  const [localAlgorithm, setLocalAlgorithm] = useState<'K-MEANS' | 'DBSCAN' | 'HIERARCHICAL'>('K-MEANS');
  const mapRef = useRef<any>(null);

  const MAP_STYLES = [
    { id: 'light', name: 'Light Map', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
    { id: 'dark', name: 'Dark Map', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    { id: 'voyager', name: 'Voyager Map', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' }
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

      if (layerId === 'crime-clusters') {
        const clusterId = feature.properties.cluster_id;
        const map = mapRef.current.getMap();
        const source = map.getSource('crimes-clusters');

        source.getClusterExpansionZoom(
          clusterId,
          (err: any, zoom: number) => {
            if (err) return;
            map.easeTo({
              center: feature.geometry.coordinates,
              zoom,
              duration: 500
            });
          }
        );
        return;
      }

      const type = layerId.includes('cluster') && layerId !== 'crime-clusters' ? 'cluster' : 'crime';
      
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
    if (focusCoordinate && mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({ center: focusCoordinate, zoom: 14, duration: 1500 });
    }
  }, [focusCoordinate]);

  const onInteractiveHover = (e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const layerId = feature.layer.id;
      
      if (layerId === 'crime-clusters') {
        let lng = feature.geometry.coordinates[0];
        let lat = feature.geometry.coordinates[1];
        setHoverInfo((prev) => {
          if (prev && prev.lng === lng && prev.lat === lat && prev.type === 'native-cluster') return prev;
          return { lng, lat, props: feature.properties, type: 'native-cluster' };
        });
        return;
      }

      const type = layerId.includes('cluster') && layerId !== 'crime-clusters' ? 'cluster' : 'crime';
      
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
          clustered = turf.clustersKmeans(crimesInRadiusGeoJSON, { numberOfClusters: k });
        } else if (localAlgorithm === 'DBSCAN') {
          // DBSCAN with distance in kilometers. 100 meters = 0.1km.
          // Using 0.2km radius, min 3 points for typical urban density.
          clustered = turf.clustersDbscan(crimesInRadiusGeoJSON, 0.2, { units: 'kilometers', minPoints: 3 });
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
      <div className="absolute top-4 left-4 z-10 w-80">
        <form onSubmit={handleSearch} className="flex bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <input 
            type="text" 
            placeholder="Search address or lat, lng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-700"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-4 bg-slate-50 text-slate-600 hover:text-slate-900 border-l border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSearching ? (
               <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/>
            ) : (
               <Search className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      {/* Top Right Controls: Map Layers */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button 
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="bg-white p-2.5 rounded-lg shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            <span className="text-sm font-semibold">Map Style</span>
          </button>
          
          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden py-1">
              {MAP_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCurrentStyle(style.url);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${currentStyle === style.url ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
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
        mapLibreLogo={false}
        initialViewState={initialViewState}
        mapStyle={currentStyle}
        interactiveLayerIds={['crime-points', 'crime-clusters', 'clustered-points-circle', 'cluster-hulls-fill']}
        onMouseMove={onInteractiveHover}
        onClick={onMapClick}
        onMouseLeave={() => setHoverInfo(null)}
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
          {!isClusteringValid && (
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
              
          {!isClusteringValid && (
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

          {!isClusteringValid && (
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

        {/* If clustered, show convex hulls and colored points */}
        {isClusteringValid && clusterHullsGeoJSON && (
          <Source id="cluster-hulls" type="geojson" data={clusterHullsGeoJSON as any}>
            <Layer
              id="cluster-hulls-fill"
              type="fill"
              paint={{
                'fill-color': '#3b82f6',
                'fill-opacity': 0.15
              }}
            />
            <Layer
              id="cluster-hulls-line"
              type="line"
              paint={{
                'line-color': '#2563eb',
                'line-width': 2,
                'line-opacity': 0.8,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}

        {isClusteringValid && clusteredPointsGeoJSON && (
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
                'circle-opacity': ['case', ['==', ['get', 'cluster'], -1], 0.4, 0.9],
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
            <div className="p-2 text-sm max-w-[200px] shadow-sm">
              {hoverInfo.type === 'native-cluster' ? (
                <>
                  <div className="font-bold text-slate-900 border-b pb-1 mb-1 border-slate-200">
                    Crime Cluster
                  </div>
                  <div className="text-slate-600">Total Crimes: {hoverInfo.props.point_count}</div>
                  <div className="text-xs text-blue-600 mt-2 italic">Click to zoom in</div>
                </>
              ) : hoverInfo.type === 'crime' ? (
                <>
                  <div className="font-bold text-slate-900 border-b pb-1 mb-1 border-slate-200">{hoverInfo.props.primary_type}</div>
                  <div className="text-slate-600">Date: {new Date(hoverInfo.props.date).toLocaleDateString()}</div>
                  <div className="text-slate-600">District: {hoverInfo.props.district}</div>
                  {hoverInfo.props.arrest && <div className="text-green-600 font-semibold mt-1">Arrest Made</div>}
                  <div className="text-xs text-blue-600 mt-2 italic">Click for full details</div>
                </>
              ) : (
                <>
                  <div className="font-bold text-slate-900 border-b pb-1 mb-1 border-slate-200">
                    {hoverInfo.props.clusterId === -1 ? 'Noise Point' : `Cluster ${hoverInfo.props.clusterId}`}
                  </div>
                  {hoverInfo.props.count && <div className="text-slate-600">Total Crimes: {hoverInfo.props.count}</div>}
                  {hoverInfo.props.primary_type && (
                    <>
                      <div className="text-slate-600">Type: {hoverInfo.props.primary_type}</div>
                      <div className="text-slate-600">District: {hoverInfo.props.district}</div>
                      <div className="text-xs text-blue-600 mt-2 italic">Click for full details</div>
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
                'fill-opacity': 0.3
              }}
            />
            <Layer
              id="local-cluster-hulls-line"
              type="line"
              paint={{
                'line-color': '#ca8a04',
                'line-width': 2,
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
                'circle-opacity': 0.9,
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

      {/* Area Analysis Panel (Moved to bottom right, off the map pin) */}
      {customMarker && (
        <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-4 w-72 border border-slate-200">
          <div className="font-bold text-slate-900 border-b pb-2 mb-3 border-slate-200 flex justify-between items-center">
              Area Analysis
              <button onClick={() => setCustomMarker(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
          </div>
          <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-slate-500 tracking-wider">RADIUS</span>
              <span className="text-sm font-bold text-slate-800">{customMarker.radiusKm.toFixed(1)} km</span>
          </div>
          <input 
              type="range" 
              min="0.1" max="10" step="0.1" 
              value={customMarker.radiusKm}
              onChange={(e) => setCustomMarker({...customMarker, radiusKm: parseFloat(e.target.value)})}
              className="w-full mb-4 accent-rose-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="bg-rose-50/80 p-3 rounded-lg border border-rose-100 flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">Incidents</div>
              <div className="text-xl font-black text-rose-700">{(crimesInRadiusGeoJSON as any).features.length.toLocaleString()}</div>
          </div>
          {!localClusters && (crimesInRadiusGeoJSON as any).features.length >= 3 && (
            <div className="mb-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Algorithm</span>
                <select 
                  value={localAlgorithm}
                  onChange={(e) => setLocalAlgorithm(e.target.value as 'K-MEANS' | 'DBSCAN' | 'HIERARCHICAL')}
                  className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium outline-none"
                >
                  <option value="K-MEANS">K-Means</option>
                  <option value="DBSCAN">DBSCAN</option>
                  <option value="HIERARCHICAL">Hierarchical</option>
                </select>
              </div>
              <button 
                onClick={handleLocalClustering}
                className="w-full bg-slate-800 text-white text-xs font-semibold py-1.5 rounded-md hover:bg-slate-700 transition-colors shadow-sm"
              >
                Cluster Local Hotspots
              </button>
            </div>
          )}
          {localClusters && (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 p-2 rounded text-center border border-emerald-100 mb-2">
              Local clustering active
            </div>
          )}
          <button 
            onClick={onNavigateCompare}
            disabled={(crimesInRadiusGeoJSON as any).features.length < 5}
            className={`w-full text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${(crimesInRadiusGeoJSON as any).features.length < 5 ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            title={(crimesInRadiusGeoJSON as any).features.length < 5 ? "Not enough incidents to compare models (requires at least 5)" : "Compare ML Models"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Compare ML Models
          </button>
          <div className="text-[10px] text-slate-400 mt-3 text-center italic">Click map pin to remove</div>
        </div>
      )}
      
      {/* Crime Details Modal */}
      {selectedCrime && (
        <div className="absolute inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Crime Details</h3>
              <button 
                onClick={() => setSelectedCrime(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Incident Type</div>
                  <div className="font-medium text-slate-900 text-lg">{selectedCrime.primary_type}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date</div>
                    <div className="text-slate-800">{new Date(selectedCrime.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Time</div>
                    <div className="text-slate-800">{selectedCrime.hour}:00</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">District</div>
                    <div className="text-slate-800">{selectedCrime.district}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</div>
                    <div className={selectedCrime.arrest ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                      {selectedCrime.arrest ? "Arrest Made" : "Pending/No Arrest"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Coordinates</div>
                    <div className="text-slate-800 font-mono text-sm">{selectedCrime.lat?.toFixed(4)}, {selectedCrime.lng?.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Record ID</div>
                    <div className="text-slate-800 font-mono text-sm truncate" title={selectedCrime.id}>{selectedCrime.id || 'N/A'}</div>
                  </div>
                </div>
                
                {selectedCrime.description && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Description</div>
                    <div className="text-slate-800 bg-slate-50 p-3 rounded-md mt-1 border border-slate-100">
                      {selectedCrime.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedCrime(null)}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
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
