# Crime Hotspot Detection — Production Design System

**Version:** 1.0  
**Status:** Authoritative Frontend Design Specification  
**Scope:** React + Tailwind + MapLibre analytical web application

---

## 1. Purpose

This document is the single source of truth for the visual design of **Crime Hotspot Detection**.

The product is a spatial crime-analysis and decision-support platform. Its visual language must communicate:

- analytical credibility
- geographic intelligence
- operational clarity
- data density without visual clutter
- professional academic/research presentation
- fast comprehension during demonstrations

The application should feel like a **professional GIS/intelligence-analysis platform**, not a generic SaaS dashboard.

### Design principle

> **The map is the primary workspace. The interface exists to help the user understand, interrogate, and act on the data.**

Do not sacrifice map visibility for decorative UI.

---

# 2. Product Design Personality

The interface should be:

- Professional
- Analytical
- Precise
- Calm
- Modern
- Information-dense but organized
- Trustworthy
- Operational
- Map-first

Avoid:

- Excessive gradients
- Excessive rounded cards
- Neon/futuristic styling
- Decorative illustrations
- Excessive animation
- Oversized typography
- Random colors
- Generic startup-dashboard aesthetics
- Visual elements that obscure geographic data

The design should communicate **"spatial intelligence"**, not "consumer app".

---

# 3. Typography

## Primary Typeface

Use **Inter** throughout the application.

Recommended implementation:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Inter should be loaded locally or through the project's existing font strategy rather than introducing multiple unrelated font families.

## Font Weights

| Usage | Weight |
|---|---:|
| Body text | 400 |
| Secondary text | 400 |
| UI labels | 500 |
| Buttons | 500–600 |
| Section headings | 600 |
| Page headings | 700 |
| Metric values | 700 |
| Critical/highlight values | 700 |

Do not use extremely heavy weights unless needed for a major metric.

## Type Scale

| Element | Size | Weight |
|---|---:|---:|
| Page title | 24–28px | 700 |
| Section title | 14–16px | 600 |
| Card title | 13–15px | 600 |
| Body | 13–14px | 400 |
| UI label | 11–12px | 500–600 |
| Caption | 10–11px | 400–500 |
| Metric | 20–28px | 700 |
| Large KPI | 28–36px | 700 |

The application contains many controls and analytical values, so typography should remain compact.

---

# 4. Color System

## Core Colors

```text
Deep Navy       #0F172A
Primary Navy    #17243A
Slate           #475569
Muted Slate     #64748B

White           #FFFFFF
Background      #F8FAFC
Surface         #FFFFFF
Surface Soft    #F1F5F9

Border          #E2E8F0
Border Strong   #CBD5E1
```

## Interactive Colors

```text
Primary Blue    #2563EB
Indigo          #4F46E5
Blue Soft       #EFF6FF
Indigo Soft     #EEF2FF
```

Use blue/indigo primarily for:

- active navigation
- selected controls
- analysis actions
- links
- secondary analytical emphasis

## Risk Colors

```text
Low             #10B981
Medium          #F59E0B
High            #EF4444
Critical        #B91C1C
```

Risk colors must have consistent meanings throughout the application.

### Risk rule

**Red communicates risk, not branding.**

Do not make every primary button red merely because the application concerns crime.

## Semantic Colors

```text
Success         #10B981
Warning         #F59E0B
Error           #DC2626
Information     #2563EB
Neutral         #64748B
```

---

# 5. Color Usage Rules

Use approximately:

- 70–80% neutral surfaces
- 10–15% navy/slate interface elements
- 5–10% interactive/semantic colors

Color should establish hierarchy, not decoration.

### Never

- Assign arbitrary colors to categories
- Change risk colors between pages
- Use red for ordinary navigation
- Use many saturated colors simultaneously
- Use color alone to communicate a critical state

### Accessibility

Important states must combine:

- color
- text
- iconography
- shape or border

For example:

```text
● HIGH
▲ WARNING
✓ VERIFIED
N/A UNDEFINED
```

---

# 6. Spacing System

Use a consistent 4px-based spacing system.

```text
4px   — micro spacing
8px   — tight spacing
12px  — control spacing
16px  — standard spacing
20px  — card spacing
24px  — section spacing
32px  — major separation
40px+ — page-level separation
```

Prefer Tailwind's standard spacing scale.

Avoid arbitrary values unless necessary for map overlays or exact alignment.

---

# 7. Border Radius

The current interface should become slightly more structured and less "SaaS-rounded".

Recommended:

```text
Inputs             6–8px
Buttons            6–8px
Cards              8–10px
Large panels       10–12px
Pills/status       9999px
```

Do not use large rounded corners everywhere.

Map controls may use 8px radius.

---

# 8. Borders and Shadows

## Borders

Default:

```text
1px solid #E2E8F0
```

Emphasized:

```text
1px solid #CBD5E1
```

Selected:

```text
1px solid #2563EB
```

## Shadows

Use restrained shadows.

```text
Small control:
0 1px 2px rgba(...)

Floating panel:
0 4px 16px rgba(...)

Major overlay:
0 8px 24px rgba(...)
```

Avoid heavy shadows.

The map should remain visually dominant.

---

# 9. Application Layout

Desktop structure:

```text
┌────────────────────────────────────────────────────────────┐
│ HEADER                                                     │
│ Brand                 Navigation             System Health │
├───────────────────────┬────────────────────────────────────┤
│                       │                                    │
│ SIDEBAR               │                                    │
│                       │                                    │
│ Dataset               │                                    │
│ Summary               │              MAP                   │
│ Filters               │                                    │
│ Clustering            │                                    │
│ Analysis controls     │                                    │
│                       │                                    │
└───────────────────────┴────────────────────────────────────┘
```

The map should occupy the largest visual area.

The sidebar is a control surface, not the main content.

---

# 10. Header

The header should be compact.

## Left

Brand:

**Crime Hotspot Detection**

Subtitle:

**CRIME & RISK INTELLIGENCE**

The shield/location intelligence icon should remain simple and professional.

## Center

Primary navigation:

```text
Map
EDA
Trends
Compare
Patrol Intel
```

Use compact segmented navigation.

Active page:

- white/raised surface
- subtle border
- slight shadow
- primary text

Inactive:

- muted slate
- subtle hover background

## Right

System health indicator.

Example:

```text
● SYSTEM HEALTH: OPTIMAL
```

Use green only when the system is actually healthy.

---

# 11. Sidebar

The sidebar should be visually structured into clear analytical sections.

Recommended order:

1. Dataset Registry
2. Data Summary
3. Map Filters
4. Spatial Clustering
5. Analysis Actions
6. Optional advanced controls

Each section should have:

- compact heading
- small icon
- consistent vertical spacing
- clear control hierarchy

## Sidebar Width

Desktop:

```text
240–280px
```

Do not allow the sidebar to consume excessive horizontal map area.

---

# 12. Dataset Registry

Dataset selection is a primary application control.

Recommended structure:

```text
DATASET REGISTRY

[ Chicago Crime Sample ▼ ]

[ Upload Custom CSV ]

[ Live Socrata API URL       ] [Fetch]
```

The selected dataset should be visually prominent.

Dataset metadata should appear immediately below selection when useful:

```text
Records       4,950
Region        Chicago
Source        Open Data
```

---

# 13. Data Summary Cards

Use compact KPI cards.

Example:

```text
TOTAL RECORDS
4,950
```

and:

```text
ACTIVE REGION
Chicago Crime Sample
```

Cards should prioritize the number first and explanation second.

Do not overload the card with unnecessary decoration.

---

# 14. Filters

Filters should be visually grouped.

Recommended:

```text
CRIME CATEGORY
[ All Categories ▼ ]

DISTRICT
[ All Districts ▼ ]

ARREST STATUS
☐ Arrest Made
☐ Pending / No Arrest
```

Additional filters may include:

- date range
- time range
- risk level

## Filter behavior

Filtering must feel immediate.

Changing a filter must not automatically trigger expensive ML execution.

The UI should clearly distinguish:

**Filtering**

from

**Running Analysis**

---

# 15. Analysis Controls

The primary analysis action should be visually dominant.

Example:

```text
[ Cluster Local Hotspots ]
```

Secondary:

```text
[ Compare ML Models ]
```

Primary analysis buttons should use navy/blue/indigo.

Do not use danger red for ordinary analysis actions.

---

# 16. Map Workspace

The map is the central product surface.

## Requirements

- Maximum practical viewport
- Minimal obstruction
- Clear cluster visualization
- Strong hotspot hierarchy
- Consistent risk semantics
- Readable incident markers
- Professional map controls

Floating controls should not cover important geographic information.

---

# 17. Map Search

Search should be compact and unobtrusive.

Example:

```text
[ Search address or lat, lng...  🔍 ]
```

Position:

**Top-left of map**, below the application header.

Do not make the search bar wider than necessary.

---

# 18. Map Style Control

The map-style selector should be a compact floating control.

Example:

```text
[ ▱ Map Style ]
```

Recommended styles:

- Light
- Streets
- Satellite
- Dark

The default should favor analytical readability.

---

# 19. Heatmap

Heatmaps must not obscure the base map.

Recommended visual behavior:

- low-opacity outer glow
- stronger opacity near density maxima
- smooth transitions
- restrained saturation

Heatmap intensity should communicate density, not simply decorate the map.

---

# 20. Cluster Visualization

Cluster visualization should distinguish:

1. Individual incidents
2. Cluster membership
3. Cluster boundary
4. Cluster risk
5. Selected cluster

## Incident points

Small circles with:

- thin contrasting outline
- sufficient opacity
- hover enlargement

## Selected incident

Use a stronger border/ring.

## Cluster boundary

Use:

- subtle translucent fill
- clear boundary stroke
- enough transparency to see underlying incidents

Do not completely fill the cluster with opaque color.

---

# 21. Cluster Colors

If categorical cluster colors are necessary, use a controlled palette.

Do not generate random colors.

The visual meaning should remain stable during a session.

For risk-oriented views, risk colors should take priority over arbitrary cluster colors.

---

# 22. Hotspot Ranking

Hotspot rankings should visually emphasize:

- rank
- priority
- incident count
- intensity/density
- dominant crime
- temporal peak

Example:

```text
#1  HIGH PRIORITY
     489 incidents

     Theft
     Friday
     18:00–20:00

     Density
     182 incidents/km²
```

Use strong hierarchy rather than large decorative icons.

---

# 23. Map Popups

Popups should feel like analytical information panels.

Recommended:

```text
CLUSTER 01
────────────────
Risk             HIGH
Incidents        489
Dominant Crime   Theft
Peak Day         Friday
Peak Hour        18:00–20:00
Density          182/km²

[ View Patrol Intel ]
```

Popups should not contain excessive text.

---

# 24. Area Analysis Panel

The existing area-analysis concept should remain a floating analytical tool.

Recommended hierarchy:

```text
AREA ANALYSIS

RADIUS
5.5 km

[ slider ]

INCIDENTS
1,459

LOCAL CLUSTERING ACTIVE

[ Compare ML Models ]
```

Use cards only where they help distinguish important values.

---

# 25. EDA Dashboard

EDA should look like an analytical report, not a collection of colorful widgets.

Primary sections:

```text
Overview KPIs

Crime Type Distribution
District Distribution

Temporal Summary
Data Quality
```

Charts should use the same typography and neutral palette.

Avoid rainbow charts.

---

# 26. Chart Design

Use restrained chart colors.

Preferred:

- primary blue
- indigo
- slate
- semantic risk colors where applicable

Charts should have:

- clear titles
- concise axis labels
- readable tooltips
- minimal gridlines
- no unnecessary 3D effects
- no decorative gradients

---

# 27. Trends Dashboard

Trend charts should prioritize temporal interpretation.

Views may include:

- hourly distribution
- weekly distribution
- monthly distribution

Peak values may be highlighted using semantic emphasis.

Avoid implying future prediction when displaying historical trends.

Use terminology:

**Historical Trends**

**Historical Descriptive Analysis**

rather than unsupported predictive terminology.

---

# 28. Algorithm Comparison

Comparison should prioritize analytical clarity.

Recommended table:

| Algorithm | Silhouette | Davies-Bouldin | Calinski-Harabasz | Runtime |
|---|---:|---:|---:|---:|
| K-Means | value | value | value | value |
| DBSCAN | value | value | value | value |
| Hierarchical | value | value | value | value |

Undefined metrics must display:

```text
N/A
```

Optional tooltip:

```text
Metric undefined because fewer than two valid clusters were produced.
```

Never display fabricated zero values for undefined metrics.

---

# 29. Patrol Intelligence

Patrol Intelligence should look like decision support.

Example:

```text
PATROL PRIORITY #1

HIGH RISK

Dominant Crime
Theft

Peak Day
Friday

Peak Window
18:00–20:00

Incident Density
182 / km²

Historical Insight
This hotspot is primarily associated with Theft
and shows its highest historical activity on Friday
evenings.

[ VIEW ON MAP ]
```

The language must remain descriptive.

Do not claim:

- guaranteed future crime
- causal relationships
- guaranteed patrol outcomes
- predictive certainty

---

# 30. Terminology Rules

Preferred:

- Historical Risk Analysis
- Historical Trends
- Spatial Clustering
- Hotspot Ranking
- Decision Support
- Historical Insight
- Crime Distribution
- Density
- Cluster

Avoid unsupported claims such as:

- Crime will occur here
- Guaranteed prediction
- Future crime certainty
- AI knows where crime will happen
- Crime prevention guaranteed

---

# 31. Buttons

## Primary

Use navy/blue/indigo.

```text
[ Run Analysis ]
```

## Secondary

White/surface with border.

```text
[ Reset Filters ]
```

## Destructive

Only for actual destructive actions.

```text
[ Delete Dataset ]
```

Do not use red for ordinary actions.

## Button states

Every button must have:

- default
- hover
- active
- focus
- disabled
- loading

---

# 32. Inputs

Inputs should use:

```text
White background
1px #E2E8F0 border
6–8px radius
Compact height
```

Focus:

```text
blue/indigo border
subtle focus ring
```

Placeholder:

```text
#94A3B8
```

Do not use very dark placeholder text.

---

# 33. Dropdowns

Dropdowns should have:

- consistent height
- clear selected value
- keyboard accessibility
- visible focus state
- sufficient click target

Selected option should use a subtle blue/indigo background.

---

# 34. Status Indicators

Use compact status badges.

Examples:

```text
● SYSTEM HEALTH: OPTIMAL
● ANALYSIS COMPLETE
● PROCESSING
⚠ WARNING
✕ ERROR
```

Status should never rely on color alone.

---

# 35. Loading States

Never leave the application visually frozen.

Use skeletons for:

- KPI cards
- charts
- tables
- analytical panels

For ML execution:

```text
Running spatial analysis…

Clustering 4,950 records
```

If an operation takes noticeable time, communicate:

- what is happening
- that the application is still responsive
- approximate stage when available

Avoid fake progress percentages.

---

# 36. Empty States

Good empty state:

```text
NO CLUSTERS AVAILABLE

Run a spatial clustering analysis
to identify crime hotspots.

[ Run Analysis ]
```

Bad:

```text
Nothing here.
```

Empty states should explain the next action.

---

# 37. Error States

Errors should be actionable.

Example:

```text
DATASET COULD NOT BE LOADED

The selected CSV could not be parsed.

Check the file format and required
coordinate fields.

[ Try Again ]
```

Do not expose raw Python stack traces to users.

---

# 38. N/A and Undefined States

When a mathematical metric is undefined:

```text
N/A
```

Tooltip:

```text
Undefined for this clustering result because
fewer than two valid clusters are available.
```

Never substitute:

```text
0.0
```

for mathematical undefinedness.

---

# 39. Icons

Use one consistent icon library already present in the project.

Icons should generally be:

- 14–18px in controls
- 16–20px in section headers
- simple line icons

Avoid mixing multiple unrelated icon styles.

Icons should support text, not replace important labels.

---

# 40. Animation

Animation must communicate state.

Recommended:

- 120–200ms hover transitions
- 200–300ms panel transitions
- subtle map overlay transitions

Avoid:

- bouncing cards
- excessive scaling
- continuous decorative animations
- distracting map effects

Respect reduced-motion preferences.

---

# 41. Responsive Design

## Desktop

Use:

```text
Header
Sidebar + Map
```

The map remains dominant.

## Tablet

Sidebar becomes narrower.

Map remains primary.

## Mobile

The map remains the primary workspace.

Controls should move into:

- drawer
- bottom sheet
- compact floating controls

Recommended mobile structure:

```text
┌──────────────────────┐
│ Header               │
├──────────────────────┤
│                      │
│                      │
│        MAP           │
│                      │
│                      │
│                      │
├──────────────────────┤
│ Filters / Analysis   │
└──────────────────────┘
```

Never simply shrink the desktop sidebar until it becomes unusable.

---

# 42. Mobile Navigation

The five analytical views should remain accessible.

If horizontal navigation becomes too wide:

- use a compact navigation menu
- allow horizontal scrolling
- or use a mobile navigation drawer

Do not hide important functionality without a discoverable route.

---

# 43. Accessibility

Minimum requirements:

- WCAG-conscious contrast
- keyboard navigation
- visible focus indicators
- semantic buttons
- accessible labels
- tooltips for unfamiliar icons
- screen-reader-friendly controls
- color-independent status communication
- adequate touch targets

Do not remove focus outlines without replacing them with an equivalent visible state.

---

# 44. Performance-Oriented Design Rules

Visual polish must not compromise the existing architecture.

Do not:

- trigger ML requests from visual state changes
- repeatedly parse large datasets in React
- create unnecessary map layers
- recreate expensive chart data on every render
- animate thousands of markers
- introduce large UI libraries solely for styling

Preserve:

- MapLibre
- React
- Tailwind
- FastAPI
- asynchronous ML execution
- shared analysis state
- filter/ML decoupling

---

# 45. Data Visualization Integrity

Visualization must represent the underlying data faithfully.

Never:

- fabricate values
- visually exaggerate differences
- imply causation from correlation
- label historical data as future prediction
- hide undefined metrics
- use misleading axes

For maps:

- preserve geographic accuracy
- maintain correct coordinate interpretation
- use appropriate projections for analytical calculations
- distinguish visualization geometry from native clustering output

---

# 46. Research Presentation Mode

The UI should be suitable for a college project demonstration and academic evaluation.

The application should make it easy to demonstrate:

1. Dataset selection
2. Data quality
3. Crime distribution
4. Historical trends
5. Spatial clustering
6. Algorithm comparison
7. Hotspot ranking
8. Patrol intelligence

The interface should look credible in screenshots and live demonstrations.

---

# 47. Visual Hierarchy

Every screen should follow this hierarchy:

```text
1. Primary analytical result
2. Supporting metrics
3. Controls
4. Secondary information
5. Metadata
```

Do not give equal visual weight to every element.

---

# 48. Do / Don't

## DO

- Use Inter consistently
- Keep the palette restrained
- Use navy/blue for primary interaction
- Use red primarily for risk
- Keep the map dominant
- Use compact analytical cards
- Maintain consistent spacing
- Use clear section headings
- Preserve geographic visualization clarity
- Show N/A for undefined metrics
- Make mobile controls usable

## DON'T

- Use multiple font families
- Use rainbow dashboards
- Use excessive rounded cards
- Use gradients everywhere
- Make every element colorful
- Hide the map behind panels
- Claim historical analysis is guaranteed prediction
- Use fake numbers
- Use 0 for undefined metrics
- Add decorative UI that increases rendering cost

---

# 49. Design Tokens

Frontend implementations should centralize recurring values.

Suggested CSS variables:

```css
:root {
  --color-navy: #17243A;
  --color-navy-deep: #0F172A;

  --color-slate: #475569;
  --color-slate-muted: #64748B;

  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-soft: #F1F5F9;

  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  --color-primary: #2563EB;
  --color-indigo: #4F46E5;

  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-critical: #B91C1C;

  --radius-control: 8px;
  --radius-card: 10px;
  --radius-panel: 12px;
}
```

If Tailwind configuration already provides equivalent tokens, reuse them instead of duplicating the system.

---

# 50. Implementation Rules for AI/Coding Agents

Before changing frontend code:

1. Read this entire `design.md`.
2. Audit the existing component before modifying it.
3. Reuse existing components where possible.
4. Reuse existing dependencies where possible.
5. Do not replace the application architecture merely to achieve visual changes.
6. Do not introduce arbitrary colors, fonts, spacing, shadows, or radii.
7. Preserve all API contracts.
8. Preserve GIS calculations.
9. Preserve ML behavior.
10. Preserve filter/analysis decoupling.
11. Preserve the map-first hierarchy.
12. Verify responsive behavior after major UI changes.
13. Run the frontend build after implementation.
14. Fix TypeScript errors before declaring completion.

---

# 51. Visual QA Checklist

Before considering a UI change complete:

### Typography
- [ ] Inter is used consistently
- [ ] Heading hierarchy is clear
- [ ] Small text remains readable

### Color
- [ ] Palette follows design tokens
- [ ] Risk colors are semantically consistent
- [ ] No arbitrary saturated colors

### Layout
- [ ] Map remains dominant
- [ ] Sidebar is compact
- [ ] Floating controls do not obstruct important map areas

### Components
- [ ] Buttons have all states
- [ ] Inputs have focus states
- [ ] Cards share consistent spacing
- [ ] N/A states are handled correctly

### Data Visualization
- [ ] Charts use restrained colors
- [ ] Metrics are not misleading
- [ ] Undefined values are not fabricated

### Responsive
- [ ] Desktop works
- [ ] Tablet works
- [ ] Mobile works
- [ ] Map remains usable on mobile

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color is not the only state indicator

### Engineering
- [ ] No unnecessary dependencies
- [ ] No unnecessary re-renders
- [ ] No accidental ML calls
- [ ] `npm run build` succeeds

---

# 52. Final Design Direction

**Crime Hotspot Detection should look like a serious spatial analytics product.**

The visual formula is:

> **Inter + restrained navy/slate interface + blue/indigo interaction + semantic risk colors + compact analytical components + map-first layout + disciplined data visualization.**

The goal is not to make the interface flashy.

The goal is to make the system look **credible, intelligent, precise, and immediately understandable**.
