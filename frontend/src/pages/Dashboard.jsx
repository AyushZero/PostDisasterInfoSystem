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

        // Realistic irregular zone shapes — not boxes, not concentric
        // Epicenter near Bhuj, zones fan out along fault lines and geography
        setDisaster({
          id: 1,
          name: 'Gujarat Earthquake 2025',
          disaster_type: 'earthquake',
          magnitude: 7.2,
          affected_region: 'Kutch, Gujarat',
          status: 'active',
          description: 'Major earthquake in the Kutch region.',
          latitude: 23.2420,
          longitude: 69.6669,
          updated_at: new Date().toISOString(),
          zones: [
            {
              severity: 'extreme',
              label: 'Epicenter — Bhuj',
              population_affected: 45000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.62, 23.22], [69.64, 23.20], [69.68, 23.19], [69.72, 23.21], [69.73, 23.24], [69.71, 23.27], [69.67, 23.28], [69.63, 23.26], [69.62, 23.22]]],
              },
            },
            {
              severity: 'high',
              label: 'Severe Damage — Anjar corridor',
              population_affected: 78000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.73, 23.21], [69.80, 23.16], [69.92, 23.12], [70.00, 23.14], [70.02, 23.20], [69.95, 23.26], [69.82, 23.28], [69.73, 23.27], [69.73, 23.21]]],
              },
            },
            {
              severity: 'moderate',
              label: 'Moderate — Gandhidham area',
              population_affected: 120000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[70.00, 23.14], [70.08, 23.08], [70.18, 23.06], [70.22, 23.10], [70.20, 23.18], [70.12, 23.22], [70.02, 23.20], [70.00, 23.14]]],
              },
            },
            {
              severity: 'low',
              label: 'Minor Damage — Mandvi coast',
              population_affected: 55000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.30, 23.02], [69.42, 22.96], [69.56, 22.98], [69.60, 23.06], [69.55, 23.14], [69.40, 23.16], [69.32, 23.10], [69.30, 23.02]]],
              },
            },
          ],
        });

        setFacilities([
          { id: 1, name: 'Bhuj Relief Camp', facility_type: 'shelter', latitude: 23.2533, longitude: 69.6692, address: 'Jubilee Ground, Bhuj', contact: '+91-2832-250100', capacity: 500, current_occupancy: 342 },
          { id: 2, name: 'G.K. General Hospital', facility_type: 'hospital', latitude: 23.2420, longitude: 69.6520, address: 'Hospital Road, Bhuj', contact: '+91-2832-220034', capacity: 200, current_occupancy: 187 },
          { id: 3, name: 'Anjar Community Shelter', facility_type: 'shelter', latitude: 23.1140, longitude: 70.0245, address: 'Government School, Anjar', contact: '+91-2836-243200', capacity: 300, current_occupancy: 215 },
          { id: 4, name: 'Gandhidham Civil Hospital', facility_type: 'hospital', latitude: 23.0753, longitude: 70.1337, address: 'Sector 1, Gandhidham', contact: '+91-2836-220678', capacity: 350, current_occupancy: 290 },
          { id: 5, name: 'Evacuation Point A', facility_type: 'evacuation', latitude: 23.2610, longitude: 69.6750, address: 'NH 8A, Bhuj', contact: '+91-2832-250200', capacity: 1000, current_occupancy: 450 },
          { id: 6, name: 'Missing Persons Center', facility_type: 'missing_persons', latitude: 23.2490, longitude: 69.6600, address: 'Collectorate, Bhuj', contact: '+91-2832-250300', capacity: 50, current_occupancy: 12 },
        ]);

        setAlerts([
          { id: 1, title: 'Earthquake: 7.2 Magnitude', message: 'Major earthquake in Kutch region. Move to evacuation points.', severity: 'critical', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, title: 'Evacuation Order — Bhuj', message: 'Mandatory evacuation within 5km of epicenter.', severity: 'critical', created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: 3, title: 'Aftershock Warning', message: 'Strong aftershocks expected. Stay away from buildings.', severity: 'warning', created_at: new Date(Date.now() - 10800000).toISOString() },
          { id: 4, title: 'Relief Distribution', message: 'Supplies at Bhuj Relief Camp and Anjar Shelter.', severity: 'info', created_at: new Date(Date.now() - 14400000).toISOString() },
          { id: 5, title: 'Road Closure — NH8A', message: 'Partially closed between Bhuj and Anjar.', severity: 'warning', created_at: new Date(Date.now() - 18000000).toISOString() },
          { id: 6, title: 'Helpline Active', message: 'Emergency helpline 1070 is operational.', severity: 'info', created_at: new Date(Date.now() - 21600000).toISOString() },
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
