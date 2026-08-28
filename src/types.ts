export interface CrimeRecord {
  id: string;
  lat: number;
  lng: number;
  primary_type: string;
  date: string;
  hour: number;
  district: string;
  description: string;
  arrest: boolean;
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
