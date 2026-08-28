# Dataset Generation Methodology

## Overview
SpatialIntell currently relies on a synthetically generated dataset that simulates crime incidents within a bounded geographic region (based on Chicago's geographic bounds). 

Because the data is synthetic, any spatial or temporal patterns "discovered" by the machine learning models must be understood in the context of the patterns that were *intentionally introduced* during the data generation phase.

## Spatial Assumptions
- **City Bounds:** Simulated crimes are constrained to `[41.644, -87.940]` to `[42.023, -87.524]`.
- **Hotspots:** 10 distinct spatial hotspots are randomly seeded within these bounds.
- **Density:** 70% of generated crimes occur within the 10 hotspots (using a normal distribution around the hotspot center). The remaining 30% are uniformly distributed across the city bounds as spatial noise.

## Temporal Assumptions
To allow for meaningful temporal analysis and risk scoring, specific temporal biases were introduced using rejection sampling:
- **Seasonality:** Crimes are 30% more likely to occur during summer months (June, July, August).
- **Day of Week:** Crimes are 20% more likely to occur on weekends (Saturday, Sunday).
- **Time of Day:** Crimes are 20% more likely to occur during nighttime hours (20:00 to 04:00).

## Crime Categories
Crime types are randomly assigned based on a predefined probability distribution, roughly mimicking common urban crime distributions:
- THEFT (25%)
- BATTERY (20%)
- CRIMINAL DAMAGE (15%)
- NARCOTICS (10%)
- ASSAULT (10%)
- BURGLARY (10%)
- ROBBERY (5%)
- MOTOR VEHICLE THEFT (5%)

## Research Implications
The machine learning models (Clustering, Random Forest) will naturally identify these injected patterns (e.g., detecting high density at night). 
**Important:** When discussing SpatialIntell's experimental findings, these patterns must be explicitly acknowledged as *synthetic constructs* designed to validate the system's analytical capabilities, rather than true empirical findings about real-world crime.
