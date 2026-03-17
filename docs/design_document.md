# UI/UX Design Document

**Project:** Post-Disaster Information and Alert Platform
**Version:** 1.0

---

## 1. Design Overview

The platform provides a map-centric dashboard to visualize disaster impact zones and emergency resources. The interface prioritizes rapid situational awareness with minimal interaction. Users provide location access and are taken to a dashboard displaying affected zones, alerts, shelters, hospitals, evacuation points, and missing persons centers.

## 2. Design Inspiration

The design is inspired by modern map dashboards such as EV Station Health Map interfaces. The layout emphasizes a central map view with floating information cards and color-coded status indicators. A dark theme with glassmorphism card effects creates a premium, modern feel.

## 3. Core Design Principles

- **Map-first interface** — the map is always the dominant visual element
- **Clear visual hierarchy** — critical info surfaces immediately
- **High-contrast emergency indicators** — severity colors are unmistakable
- **Minimal cognitive load** — reduce choices during emergencies
- **Quick access to emergency resources** — shelters, hospitals are one click away

## 4. User Flow

1. User opens the platform
2. System requests location permission (or user enters manually)
3. Map dashboard loads centered on user location
4. Disaster zones and alerts appear on the map
5. User explores nearby facilities and checks updates

## 5. Dashboard Layout

| Section | Content |
|---------|---------|
| **Top Bar** | Disaster name, status, alert count indicator |
| **Main Area** | Interactive Leaflet.js map with OpenStreetMap tiles |
| **Sidebar** | Alerts panel with severity badges and timestamps |
| **Bottom Panel** | Disaster information card (type, magnitude, region, status) |

## 6. Map Interface

The map displays disaster severity zones using color-coded GeoJSON polygon overlays. Facility markers show shelters, hospitals, evacuation points, and missing persons centers. Users can zoom, pan, and click markers to view additional information in popups.

**Technology:** Leaflet.js with OpenStreetMap tiles (free, no API key required).

## 7. Disaster Information Card

Displays:
- Disaster type (earthquake, flood, cyclone)
- Magnitude / intensity
- Affected region
- Current status (active, monitoring, resolved)
- Latest update timestamp

## 8. Alerts Panel

Shows emergency alerts including:
- Evacuation notices
- Safety warnings
- Weather updates
- Resource availability notices

Each alert displays a severity badge, timestamp, and expandable details.

## 9. Facility Markers

Markers represent emergency services:
- 🏠 Shelters
- 🏥 Hospitals
- 🚪 Evacuation Points
- 👥 Missing Persons Centers

Clicking a marker opens a popup card with facility name, type, contact details, capacity, and a directions link.

## 10. Color System

| Color | Meaning |
|-------|---------|
| `#DC2626` Red | Extreme danger |
| `#EA580C` Orange | High risk |
| `#CA8A04` Yellow | Moderate risk |
| `#16A34A` Green | Safe zone |

## 11. Typography

- **Primary:** Inter (Google Fonts) — clean, highly readable
- **Fallback:** system-ui, sans-serif
- Dashboard text optimized for readability at various sizes

## 12. Responsive Design

| Device | Layout |
|--------|--------|
| **Desktop** | Full dashboard: map + sidebar + bottom panel |
| **Tablet** | Collapsible sidebar |
| **Mobile** | Map-first layout with alerts in bottom sheets |

## 13. Admin Interface

The admin dashboard provides:
- Login with JWT authentication
- Upload disaster datasets (CSV/JSON)
- Create and manage alerts
- Add/edit/delete facility information
- View system statistics

## 14. Accessibility

- High contrast UI for emergency visibility
- Readable text sizes (minimum 14px body)
- Simple keyboard navigation
- Semantic HTML elements
- ARIA labels on interactive elements

## 15. Future Improvements

- Mobile application (React Native)
- Real-time satellite data overlays
- Crowdsourced disaster reporting
- AI-based disaster risk prediction
