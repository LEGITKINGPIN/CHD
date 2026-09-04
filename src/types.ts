export interface CrimeRecord {
  id: string;
  lat: number;
  lng: number;
  primary_type: string;
  date: string;
  hour: number;
  district: string;
  police_station?: string | null;
  description: string;
  arrest: boolean;
}

export interface HotspotRanking {
  cluster_id: number;
  volume: number;
  area_sq_km: number;
  density_per_km2: number;
  intensity_score: number;
  risk_category: string;
  dominant_crime?: string;
  peak_hour?: string | number;
  peak_day?: string;
  insight?: string;
}

export interface ClusteringResult {
  labels: number[];
  centroids: number[][];
  metrics: {
    silhouette: number | null;
    daviesBouldin: number | null;
    calinskiHarabasz: number | null;
    numClusters: number;
    numNoise: number;
    runtimeMs: number;
  };
  hotspot_rankings?: HotspotRanking[];
}

export interface PatrolCheckpoint {
  order: number;
  clusterId: number;
  lat: number;
  lng: number;
  riskCategory: string;
  density: number;
  volume: number;
  dominantCrime: string;
  recommendedUnit: string;
  peakShift: string;
  tacticalAction: string;
}

export interface TacticalPatrolRoute {
  id: string;
  title: string;
  strategy: 'risk-first' | 'shortest-path';
  checkpoints: PatrolCheckpoint[];
  coordinates: [number, number][]; // [lng, lat] format for MapLibre GeoJSON
  totalDistanceKm: number;
  estimatedDurationMins: number;
  generatedAt: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Metadata {
  totalCrimes: number;
  dateRange: DateRange;
  boundingBox: BoundingBox;
}

export interface DatasetCapabilities {
  supports_district: boolean;
  supports_time: boolean;
  supports_date: boolean;
  supports_crime_type: boolean;
  supports_risk_prediction: boolean;
}

export interface DatasetInfo {
  key: string;
  display_name: string;
  capabilities: DatasetCapabilities;
}
