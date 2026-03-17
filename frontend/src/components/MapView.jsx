import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue in bundled builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Severity zone colors
const SEVERITY_COLORS = {
  extreme: { fill: '#DC2626', stroke: '#991B1B', opacity: 0.3 },
  high: { fill: '#EA580C', stroke: '#9A3412', opacity: 0.25 },
  moderate: { fill: '#CA8A04', stroke: '#854D0E', opacity: 0.2 },
  low: { fill: '#16A34A', stroke: '#166534', opacity: 0.15 },
  safe: { fill: '#0EA5E9', stroke: '#0369A1', opacity: 0.1 },
};

// Facility marker icons
const FACILITY_ICONS = {
  shelter: { emoji: '🏠', color: '#8B5CF6' },
  hospital: { emoji: '🏥', color: '#EF4444' },
  evacuation: { emoji: '🚪', color: '#F59E0B' },
  missing_persons: { emoji: '👥', color: '#06B6D4' },
};

function createFacilityIcon(type) {
  const config = FACILITY_ICONS[type] || { emoji: '📍', color: '#6B7280' };
  return L.divIcon({
    className: '',
    html: `<div class="facility-marker facility-marker--${type}" style="background:${config.color}">${config.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Component to recenter map
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 11);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ disaster, facilities, userLocation }) {
  const defaultCenter = disaster
    ? [disaster.latitude, disaster.longitude]
    : userLocation
      ? [userLocation.lat, userLocation.lng]
      : [23.2420, 69.6669]; // Bhuj, Gujarat (default)

  const zoneStyle = (feature) => {
    const severity = feature.properties?.severity || 'moderate';
    const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.moderate;
    return {
      fillColor: colors.fill,
      color: colors.stroke,
      weight: 2,
      fillOpacity: colors.opacity,
      opacity: 0.7,
    };
  };

  const onEachZone = (feature, layer) => {
    if (feature.properties) {
      const { label, severity, population_affected } = feature.properties;
      layer.bindTooltip(
        `<strong>${label || severity}</strong>${population_affected ? `<br/>Population: ${population_affected.toLocaleString()}` : ''}`,
        { sticky: true, className: 'zone-tooltip' }
      );
    }
  };

  // Convert zones to GeoJSON FeatureCollection
  const zonesGeoJSON = disaster?.zones
    ? {
        type: 'FeatureCollection',
        features: disaster.zones.map((zone) => ({
          type: 'Feature',
          properties: {
            severity: zone.severity,
            label: zone.label,
            population_affected: zone.population_affected,
          },
          geometry: zone.geometry,
        })),
      }
    : null;

  const getCapacityColor = (occupancy, capacity) => {
    const ratio = occupancy / capacity;
    if (ratio >= 0.9) return '#EF4444';
    if (ratio >= 0.7) return '#F59E0B';
    return '#22C55E';
  };

  return (
    <div className="map-container" id="main-map">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={defaultCenter} zoom={11} />

        {/* Severity Zones */}
        {zonesGeoJSON && (
          <GeoJSON
            key={JSON.stringify(zonesGeoJSON)}
            data={zonesGeoJSON}
            style={zoneStyle}
            onEachFeature={onEachZone}
          />
        )}

        {/* Facility Markers */}
        {facilities?.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={createFacilityIcon(facility.facility_type)}
          >
            <Popup maxWidth={300}>
              <div className="facility-popup">
                <div className="facility-popup__header">
                  <span className="facility-popup__icon">
                    {FACILITY_ICONS[facility.facility_type]?.emoji || '📍'}
                  </span>
                  <span className="facility-popup__name">{facility.name}</span>
                </div>
                <span className={`facility-popup__type facility-popup__type--${facility.facility_type}`}>
                  {facility.facility_type?.replace('_', ' ')}
                </span>
                {facility.address && (
                  <div className="facility-popup__detail">📍 {facility.address}</div>
                )}
                {facility.contact && (
                  <div className="facility-popup__detail">📞 {facility.contact}</div>
                )}
                {facility.capacity && (
                  <>
                    <div className="facility-popup__detail">
                      👥 {facility.current_occupancy || 0} / {facility.capacity} occupied
                    </div>
                    <div className="facility-popup__capacity-bar">
                      <div
                        className="facility-popup__capacity-fill"
                        style={{
                          width: `${Math.min(100, ((facility.current_occupancy || 0) / facility.capacity) * 100)}%`,
                          background: getCapacityColor(facility.current_occupancy || 0, facility.capacity),
                        }}
                      />
                    </div>
                  </>
                )}
                <a
                  className="facility-popup__directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🧭 Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location */}
        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={500}
            pathOptions={{
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
