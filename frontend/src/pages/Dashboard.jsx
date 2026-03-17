import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import MapView from '../components/MapView';
import AlertsPanel from '../components/AlertsPanel';
import DisasterInfoCard from '../components/DisasterInfoCard';
import LocationPrompt from '../components/LocationPrompt';
import { getDisasters, getDisaster, getFacilities, getAlerts } from '../lib/api';

export default function Dashboard() {
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [disaster, setDisaster] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLocationSet = (location) => {
    setUserLocation(location);
    setShowLocationPrompt(false);
  };

  const handleSkipLocation = () => {
    setShowLocationPrompt(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const disastersRes = await getDisasters();
        const disasters = disastersRes.data;
        if (disasters.length > 0) {
          const detailRes = await getDisaster(disasters[0].id);
          setDisaster(detailRes.data);
        }
        const facilitiesRes = await getFacilities();
        setFacilities(facilitiesRes.data);
        const alertsRes = await getAlerts();
        setAlerts(alertsRes.data);
      } catch (err) {
        console.error('Backend unavailable, loading demo data');

        // Chennai earthquake — epicenter Kanchipuram, zones along geography
        setDisaster({
          id: 1,
          name: 'Chennai Earthquake 2025',
          disaster_type: 'earthquake',
          magnitude: 6.8,
          affected_region: 'Kanchipuram, Tamil Nadu',
          status: 'active',
          description: '6.8 magnitude earthquake near Kanchipuram, 70km SW of Chennai.',
          latitude: 12.8342,
          longitude: 79.7036,
          updated_at: new Date().toISOString(),
          zones: [
            {
              severity: 'extreme',
              label: 'Epicenter — Kanchipuram',
              population_affected: 38000,
              geometry: { type: 'Polygon', coordinates: [[[79.66,12.81],[79.68,12.79],[79.72,12.78],[79.75,12.80],[79.76,12.84],[79.74,12.87],[79.70,12.88],[79.67,12.86],[79.66,12.81]]] },
            },
            {
              severity: 'high',
              label: 'Severe — Sriperumbudur corridor',
              population_affected: 95000,
              geometry: { type: 'Polygon', coordinates: [[[79.74,12.87],[79.78,12.85],[79.88,12.90],[79.95,12.95],[79.92,12.98],[79.84,12.96],[79.76,12.92],[79.74,12.87]]] },
            },
            {
              severity: 'moderate',
              label: 'Moderate — South Chennai',
              population_affected: 210000,
              geometry: { type: 'Polygon', coordinates: [[[79.92,12.98],[79.98,12.93],[80.06,12.94],[80.10,12.98],[80.08,13.04],[80.02,13.06],[79.95,13.02],[79.92,12.98]]] },
            },
            {
              severity: 'low',
              label: 'Minor — North Chennai',
              population_affected: 450000,
              geometry: { type: 'Polygon', coordinates: [[[80.08,13.04],[80.14,13.00],[80.22,13.02],[80.28,13.08],[80.26,13.14],[80.18,13.16],[80.10,13.12],[80.08,13.04]]] },
            },
            {
              severity: 'low',
              label: 'Minor — Vellore direction',
              population_affected: 60000,
              geometry: { type: 'Polygon', coordinates: [[[79.58,12.86],[79.66,12.81],[79.67,12.86],[79.64,12.94],[79.56,12.96],[79.52,12.92],[79.54,12.88],[79.58,12.86]]] },
            },
          ],
        });

        setFacilities([
          { id: 1, name: 'Kanchipuram Relief Camp', facility_type: 'shelter', latitude: 12.8385, longitude: 79.7000, address: 'Govt School, Kanchipuram', contact: '+91-44-2722-3100', capacity: 600, current_occupancy: 412 },
          { id: 2, name: 'Kanchipuram Govt Hospital', facility_type: 'hospital', latitude: 12.8310, longitude: 79.7120, address: 'Gandhi Road, Kanchipuram', contact: '+91-44-2722-2034', capacity: 300, current_occupancy: 267 },
          { id: 3, name: 'Sriperumbudur Shelter', facility_type: 'shelter', latitude: 12.9585, longitude: 79.9410, address: 'Town Hall, Sriperumbudur', contact: '+91-44-2716-3200', capacity: 400, current_occupancy: 285 },
          { id: 4, name: 'Chromepet Govt Hospital', facility_type: 'hospital', latitude: 12.9516, longitude: 80.1413, address: 'GST Road, Chromepet', contact: '+91-44-2265-0678', capacity: 500, current_occupancy: 380 },
          { id: 5, name: 'Tambaram Evacuation Center', facility_type: 'evacuation', latitude: 12.9249, longitude: 80.1000, address: 'Railway Rd, Tambaram', contact: '+91-44-2223-9200', capacity: 1200, current_occupancy: 560 },
          { id: 6, name: 'Missing Persons — Kanchipuram', facility_type: 'missing_persons', latitude: 12.8360, longitude: 79.7060, address: 'Collectorate, Kanchipuram', contact: '+91-44-2722-5000', capacity: 40, current_occupancy: 18 },
        ]);

        setAlerts([
          { id: 1, title: 'Earthquake: 6.8 Magnitude — Kanchipuram', message: 'Evacuate affected zones immediately.', severity: 'critical', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, title: 'Evacuation Order — Kanchipuram', message: 'Mandatory evacuation within 10km of epicenter.', severity: 'critical', created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: 3, title: 'Aftershock Warning', message: 'Aftershocks expected in next 72 hours.', severity: 'warning', created_at: new Date(Date.now() - 10800000).toISOString() },
          { id: 4, title: 'Metro / MRTS Suspended', message: 'Chennai Metro suspended for inspections.', severity: 'warning', created_at: new Date(Date.now() - 14400000).toISOString() },
          { id: 5, title: 'Relief Distribution', message: 'Supplies at Kanchipuram, Sriperumbudur, Tambaram.', severity: 'info', created_at: new Date(Date.now() - 18000000).toISOString() },
          { id: 6, title: 'Helpline 1070 Active', message: 'Report missing persons or request assistance.', severity: 'info', created_at: new Date(Date.now() - 21600000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0A0A0A' }}>
        <div className="spinner"><div className="spinner__circle"></div></div>
      </div>
    );
  }

  return (
    <>
      {showLocationPrompt && (
        <LocationPrompt onLocationSet={handleLocationSet} onSkip={handleSkipLocation} />
      )}
      <div className="dashboard" id="main-dashboard">
        <TopBar disaster={disaster} alertCount={alerts.length} />
        <div className="map-area">
          <MapView disaster={disaster} facilities={facilities} userLocation={userLocation} />
        </div>
        <AlertsPanel alerts={alerts} />
        <DisasterInfoCard disaster={disaster} />
      </div>
    </>
  );
}
