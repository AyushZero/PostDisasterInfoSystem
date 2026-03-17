import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SEVERITY_COLORS = {
  extreme: { fill: '#B91C1C', stroke: '#7F1D1D', opacity: 0.25 },
  high:    { fill: '#C2410C', stroke: '#7C2D12', opacity: 0.18 },
  moderate:{ fill: '#A16207', stroke: '#713F12', opacity: 0.14 },
  low:     { fill: '#15803D', stroke: '#14532D', opacity: 0.10 },
  safe:    { fill: '#0284C7', stroke: '#0C4A6E', opacity: 0.08 },
};

const FACILITY_LABELS = {
  shelter: 'S',
  hospital: 'H',
  evacuation: 'E',
  missing_persons: 'M',
};

const FACILITY_COLORS = {
  shelter: '#6D28D9',
  hospital: '#B91C1C',
  evacuation: '#B45309',
  missing_persons: '#0E7490',
};

function createFacilityIcon(type) {
  const label = FACILITY_LABELS[type] || '?';
  const color = FACILITY_COLORS[type] || '#525252';
  return L.divIcon({
    className: '',
    html: `<div class="facility-marker facility-marker--${type}" style="background:${color}">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom || 11);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ disaster, facilities, userLocation }) {
  const defaultCenter = disaster
    ? [disaster.latitude, disaster.longitude]
    : userLocation
      ? [userLocation.lat, userLocation.lng]
      : [23.2420, 69.6669];

  const zoneStyle = (feature) => {
    const severity = feature.properties?.severity || 'moderate';
    const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.moderate;
    return {
      fillColor: colors.fill,
      color: colors.stroke,
      weight: 1,
      fillOpacity: colors.opacity,
      opacity: 0.5,
    };
  };

  const onEachZone = (feature, layer) => {
    if (feature.properties) {
      const { label, severity, population_affected } = feature.properties;
      layer.bindTooltip(
        `<strong>${label || severity}</strong>${population_affected ? `<br/>${population_affected.toLocaleString()} affected` : ''}`,
        { sticky: true }
      );
    }
  };

  const zonesGeoJSON = disaster?.zones
    ? {
        type: 'FeatureCollection',
        features: disaster.zones.map((zone) => ({
          type: 'Feature',
          properties: { severity: zone.severity, label: zone.label, population_affected: zone.population_affected },
          geometry: zone.geometry,
        })),
      }
    : null;

  const getCapacityColor = (occ, cap) => {
    const r = occ / cap;
    if (r >= 0.9) return '#B91C1C';
    if (r >= 0.7) return '#B45309';
    return '#15803D';
  };

  return (
    <div className="map-container" id="main-map">
      <MapContainer center={defaultCenter} zoom={11} style={{ width: '100%', height: '100%' }} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapRecenter center={defaultCenter} zoom={11} />

        {zonesGeoJSON && (
          <GeoJSON
            key={JSON.stringify(zonesGeoJSON)}
            data={zonesGeoJSON}
            style={zoneStyle}
            onEachFeature={onEachZone}
          />
        )}

        {facilities?.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={createFacilityIcon(facility.facility_type)}
          >
            <Popup maxWidth={260}>
              <div className="facility-popup">
                <div className="facility-popup__header">
                  <span className={`facility-popup__icon facility-popup__icon--${facility.facility_type}`}></span>
                  <span className="facility-popup__name">{facility.name}</span>
                </div>
                <span className={`facility-popup__type facility-popup__type--${facility.facility_type}`}>
                  {facility.facility_type?.replace('_', ' ')}
                </span>
                {facility.address && <div className="facility-popup__detail">{facility.address}</div>}
                {facility.contact && <div className="facility-popup__detail">{facility.contact}</div>}
                {facility.capacity && (
                  <>
                    <div className="facility-popup__detail">
                      {facility.current_occupancy || 0} / {facility.capacity} occupied
                    </div>
                    <div className="facility-popup__capacity-bar">
                      <div className="facility-popup__capacity-fill" style={{
                        width: `${Math.min(100, ((facility.current_occupancy || 0) / facility.capacity) * 100)}%`,
                        background: getCapacityColor(facility.current_occupancy || 0, facility.capacity),
                      }} />
                    </div>
                  </>
                )}
                <a
                  className="facility-popup__directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={400}
            pathOptions={{ color: '#525252', fillColor: '#737373', fillOpacity: 0.15, weight: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
