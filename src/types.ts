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

export interface RiskGridCell {
  grid_id: string;
  grid_lat: number;
  grid_lng: number;
  total_crimes: number;
  violent_ratio: number;
  night_ratio: number;
  weekend_ratio: number;
  risk_class: 'High Risk' | 'Medium Risk' | 'Low Risk' | string;
  risk_probability: number;
}

export interface FeatureRankingItem {
  feature: string;
  importance: number;
}

export interface RiskPredictionResult {
  status: string;
  experiment_id: string;
  dataset: string;
  algorithm: string;
  parameters: {
    n_estimators: number;
    test_size: number;
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
  feature_importances: Record<string, number>;
  feature_ranking: FeatureRankingItem[];
  explainability_summary: string;
  confusion_matrix: number[][];
  classes: string[];
  class_distribution: Record<string, number>;
  total_cells: number;
  test_cells: number;
  train_cells: number;
  split_ratio?: number;
  grid_cells: RiskGridCell[];
  message: string;
}

export interface LiveDispatchIncident {
  id: string;
  timestamp: string;
  time_ago: string;
  primary_type: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  district: string;
  lat: number;
  lng: number;
  assigned_units: string[];
  status: 'DISPATCHED' | 'EN ROUTE' | 'ON SCENE' | 'INVESTIGATING';
  is_new?: boolean;
}

export interface LiveStreamResponse {
  status: string;
  dataset: string;
  timestamp: string;
  active_units: number;
  total_incidents: number;
  critical_count: number;
  high_count: number;
  moderate_count: number;
  incidents: LiveDispatchIncident[];
}

export interface BriefingReportData {
  department: string;
  generated_at: string;
  dataset_name: string;
  total_incidents: number;
  active_clusters_count: number;
  supervised_high_risk_sectors: number;
  critical_alerts_count: number;
  dominant_crime: string;
  peak_deterrence_hour: string;
  top_risk_zones: Array<{
    id: string;
    location: string;
    risk_level: string;
    volume: number;
    violent_ratio: number;
  }>;
  recent_critical_dispatches: LiveDispatchIncident[];
  operational_directives: string[];
}
