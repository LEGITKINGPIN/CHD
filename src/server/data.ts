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

// Bounding box for the synthetic city (roughly Chicago for realism)
const CITY_BOUNDS = {
  minLat: 41.644,
  maxLat: 42.023,
  minLng: -87.940,
  maxLng: -87.524
};

const CRIME_TYPES = [
  { type: "THEFT", weight: 0.25 },
  { type: "BATTERY", weight: 0.2 },
  { type: "CRIMINAL DAMAGE", weight: 0.15 },
  { type: "NARCOTICS", weight: 0.1 },
  { type: "ASSAULT", weight: 0.1 },
  { type: "BURGLARY", weight: 0.1 },
  { type: "ROBBERY", weight: 0.05 },
  { type: "MOTOR VEHICLE THEFT", weight: 0.05 }
];

function getRandomCrimeType() {
  const r = Math.random();
  let cumulative = 0;
  for (const c of CRIME_TYPES) {
    cumulative += c.weight;
    if (r <= cumulative) return c.type;
  }
  return CRIME_TYPES[0].type;
}

// Helper to generate hotspots to make clustering algorithms actually find clusters
function generateHotspots(count: number) {
  const hotspots = [];
  for (let i = 0; i < count; i++) {
    hotspots.push({
      lat: CITY_BOUNDS.minLat + Math.random() * (CITY_BOUNDS.maxLat - CITY_BOUNDS.minLat),
      lng: CITY_BOUNDS.minLng + Math.random() * (CITY_BOUNDS.maxLng - CITY_BOUNDS.minLng),
      radius: 0.01 + Math.random() * 0.04, // Roughly 1-4km in deg
      intensity: 0.3 + Math.random() * 0.7 // Percentage of crimes centered here
    });
  }
  return hotspots;
}

// Generate realistic synthetic data (Gaussian distribution around hotspots, plus uniform noise)
export function generateCrimeData(count: number): CrimeRecord[] {
  const hotspots = generateHotspots(10);
  const data: CrimeRecord[] = [];

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // 1 year of data

  for (let i = 0; i < count; i++) {
    let lat, lng;
    if (Math.random() < 0.7) {
      // 70% chance to be in a hotspot
      const hs = hotspots[Math.floor(Math.random() * hotspots.length)];
      // Simple random gaussian-ish distribution
      const u = Math.random() + Math.random() + Math.random() - 1.5;
      const v = Math.random() + Math.random() + Math.random() - 1.5;
      lat = hs.lat + (u * hs.radius);
      lng = hs.lng + (v * hs.radius);
    } else {
      // Uniform random
      lat = CITY_BOUNDS.minLat + Math.random() * (CITY_BOUNDS.maxLat - CITY_BOUNDS.minLat);
      lng = CITY_BOUNDS.minLng + Math.random() * (CITY_BOUNDS.maxLng - CITY_BOUNDS.minLng);
    }

    const d = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
    
    data.push({
      id: `C${i.toString().padStart(6, '0')}`,
      lat,
      lng,
      primary_type: getRandomCrimeType(),
      date: d.toISOString(),
      hour: d.getHours(),
      district: `D-${Math.floor(Math.random() * 25) + 1}`,
      description: "Synthetic Generated Record",
      arrest: Math.random() < 0.25 // 25% arrest rate
    });
  }
  
  return data;
}
