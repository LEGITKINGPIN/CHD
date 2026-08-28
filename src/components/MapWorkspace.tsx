import React, { useMemo, useState } from 'react';
import { Map, Source, Layer, Popup, useMap } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrimeRecord, ClusteringResult, Metadata } from '../types';
import * as turf from '@turf/turf';
import { useEffect, useRef } from 'react';

interface MapWorkspaceProps {
  crimes: CrimeRecord[];
  clusteringResult: ClusteringResult | null;
  metadata: Metadata | null;
}

export default function MapWorkspace({ crimes, clusteringResult, metadata }: MapWorkspaceProps) {
  const [hoverInfo, setHoverInfo] = useState<{lng: number, lat: number, props: any, type: string} | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<any>(null);
  const mapRef = useRef<any>(null);

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

  // Generate GeoJSON for cluster convex hulls
  const clusterHullsGeoJSON = useMemo(() => {
    if (!clusteringResult || clusteringResult.labels.length !== crimes.length) return null;
    
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
    if (!clusteringResult || clusteringResult.labels.length !== crimes.length) return null;
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

  // Use a minimal, clean basemap 
  const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

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
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100%' }}
        mapLibreLogo={false}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLE}
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
          {!clusteringResult && (
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
              
          {!clusteringResult && (
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

          {!clusteringResult && (
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
        {clusteringResult && clusterHullsGeoJSON && (
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

        {clusteringResult && clusteredPointsGeoJSON && (
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
      </Map>
      
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
