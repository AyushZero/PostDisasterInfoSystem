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
  const [error, setError] = useState(null);

  const handleLocationSet = (location) => {
    setUserLocation(location);
    setShowLocationPrompt(false);
  };

  const handleSkipLocation = () => {
    setShowLocationPrompt(false);
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all disasters and pick the first active one
        const disastersRes = await getDisasters();
        const disasters = disastersRes.data;

        if (disasters.length > 0) {
          // Get detailed data for the first disaster (with zones)
          const detailRes = await getDisaster(disasters[0].id);
          setDisaster(detailRes.data);
        }

        // Get facilities
        const facilitiesRes = await getFacilities();
        setFacilities(facilitiesRes.data);

        // Get alerts
        const alertsRes = await getAlerts();
        setAlerts(alertsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Unable to connect to backend. Showing demo data.');

        // Fallback demo data for when backend is not running
        setDisaster({
          id: 1,
          name: 'Gujarat Earthquake 2025',
          disaster_type: 'earthquake',
          magnitude: 7.2,
          affected_region: 'Gujarat, India',
          status: 'active',
          description: 'A major earthquake struck the Kutch region of Gujarat.',
          latitude: 23.2420,
          longitude: 69.6669,
          updated_at: new Date().toISOString(),
          zones: [
            {
              severity: 'extreme',
              label: 'Epicenter Zone - Bhuj',
              population_affected: 45000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.60, 23.20], [69.75, 23.20], [69.75, 23.30], [69.60, 23.30], [69.60, 23.20]]],
              },
            },
            {
              severity: 'high',
              label: 'High Risk - Anjar Region',
              population_affected: 78000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.50, 23.10], [69.85, 23.10], [69.85, 23.35], [69.50, 23.35], [69.50, 23.10]]],
              },
            },
            {
              severity: 'moderate',
              label: 'Moderate Risk - Gandhidham',
              population_affected: 120000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.35, 23.00], [70.00, 23.00], [70.00, 23.45], [69.35, 23.45], [69.35, 23.00]]],
              },
            },
            {
              severity: 'low',
              label: 'Low Risk - Outer Region',
              population_affected: 250000,
              geometry: {
                type: 'Polygon',
                coordinates: [[[69.15, 22.80], [70.20, 22.80], [70.20, 23.60], [69.15, 23.60], [69.15, 22.80]]],
              },
            },
          ],
        });

        setFacilities([
          { id: 1, name: 'Bhuj Relief Camp', facility_type: 'shelter', latitude: 23.2533, longitude: 69.6692, address: 'Near Jubilee Ground, Bhuj', contact: '+91-2832-250100', capacity: 500, current_occupancy: 342 },
          { id: 2, name: 'G.K. General Hospital', facility_type: 'hospital', latitude: 23.2420, longitude: 69.6520, address: 'Hospital Road, Bhuj', contact: '+91-2832-220034', capacity: 200, current_occupancy: 187 },
          { id: 3, name: 'Anjar Community Shelter', facility_type: 'shelter', latitude: 23.1140, longitude: 70.0245, address: 'Government School, Anjar', contact: '+91-2836-243200', capacity: 300, current_occupancy: 215 },
          { id: 4, name: 'Gandhidham Civil Hospital', facility_type: 'hospital', latitude: 23.0753, longitude: 70.1337, address: 'Sector 1, Gandhidham', contact: '+91-2836-220678', capacity: 350, current_occupancy: 290 },
          { id: 5, name: 'Bhuj Evacuation Point A', facility_type: 'evacuation', latitude: 23.2610, longitude: 69.6750, address: 'NH 8A, Bhuj Outskirts', contact: '+91-2832-250200', capacity: 1000, current_occupancy: 450 },
          { id: 6, name: 'Missing Persons Center', facility_type: 'missing_persons', latitude: 23.2490, longitude: 69.6600, address: 'District Collectorate, Bhuj', contact: '+91-2832-250300', capacity: 50, current_occupancy: 12 },
        ]);

        setAlerts([
          { id: 1, title: 'EARTHQUAKE ALERT: 7.2 Magnitude', message: 'A major earthquake of magnitude 7.2 has struck the Kutch region. Move to evacuation points immediately.', severity: 'critical', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, title: 'Evacuation Order - Bhuj City', message: 'Mandatory evacuation ordered for all residents within 5km of the epicenter.', severity: 'critical', created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: 3, title: 'Aftershock Warning', message: 'Strong aftershocks expected in the next 48 hours. Stay away from damaged buildings.', severity: 'warning', created_at: new Date(Date.now() - 10800000).toISOString() },
          { id: 4, title: 'Relief Supplies Distribution', message: 'Food, water, and medical supplies at Bhuj Relief Camp and Anjar Shelter.', severity: 'info', created_at: new Date(Date.now() - 14400000).toISOString() },
          { id: 5, title: 'Road Closures - NH8A', message: 'NH 8A partially closed between Bhuj and Anjar. Use alternative routes.', severity: 'warning', created_at: new Date(Date.now() - 18000000).toISOString() },
          { id: 6, title: 'Emergency Helpline Active', message: 'Disaster helpline active at 1070. Report missing persons or request assistance.', severity: 'info', created_at: new Date(Date.now() - 21600000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner">
          <div className="spinner__circle"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLocationPrompt && (
        <LocationPrompt
          onLocationSet={handleLocationSet}
          onSkip={handleSkipLocation}
        />
      )}

      <div className="dashboard" id="main-dashboard">
        <TopBar disaster={disaster} alertCount={alerts.length} />

        <div className="map-area">
          <MapView
            disaster={disaster}
            facilities={facilities}
            userLocation={userLocation}
          />
        </div>

        <AlertsPanel alerts={alerts} />

        <DisasterInfoCard disaster={disaster} />
      </div>
    </>
  );
}
