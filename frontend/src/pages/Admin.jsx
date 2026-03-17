import { useState, useEffect } from 'react';
import {
  adminLogin, createAlert, createFacility, deleteAlert, deleteFacility,
  getAlerts, getFacilities, uploadFacilities, uploadAlerts,
} from '../lib/api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const [facilities, setFacilities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const [facilityForm, setFacilityForm] = useState({
    name: '', facility_type: 'shelter', latitude: '', longitude: '',
    address: '', contact: '', capacity: '',
  });
  const [alertForm, setAlertForm] = useState({
    title: '', message: '', severity: 'info',
  });

  const DEMO_FACILITIES = [
    { id: 1, name: 'Bhuj Relief Camp', facility_type: 'shelter', latitude: 23.2533, longitude: 69.6692, address: 'Jubilee Ground, Bhuj', contact: '+91-2832-250100', capacity: 500, current_occupancy: 342 },
    { id: 2, name: 'G.K. General Hospital', facility_type: 'hospital', latitude: 23.2420, longitude: 69.6520, address: 'Hospital Road, Bhuj', contact: '+91-2832-220034', capacity: 200, current_occupancy: 187 },
    { id: 3, name: 'Anjar Community Shelter', facility_type: 'shelter', latitude: 23.1140, longitude: 70.0245, address: 'Government School, Anjar', contact: '+91-2836-243200', capacity: 300, current_occupancy: 215 },
    { id: 4, name: 'Gandhidham Civil Hospital', facility_type: 'hospital', latitude: 23.0753, longitude: 70.1337, address: 'Sector 1, Gandhidham', contact: '+91-2836-220678', capacity: 350, current_occupancy: 290 },
    { id: 5, name: 'Evacuation Point A', facility_type: 'evacuation', latitude: 23.2610, longitude: 69.6750, address: 'NH 8A, Bhuj', contact: '+91-2832-250200', capacity: 1000, current_occupancy: 450 },
    { id: 6, name: 'Missing Persons Center', facility_type: 'missing_persons', latitude: 23.2490, longitude: 69.6600, address: 'Collectorate, Bhuj', contact: '+91-2832-250300', capacity: 50, current_occupancy: 12 },
  ];
  const DEMO_ALERTS = [
    { id: 1, title: 'Earthquake: 7.2 Magnitude', message: 'Major earthquake in Kutch region.', severity: 'critical', created_at: new Date().toISOString() },
    { id: 2, title: 'Evacuation Order — Bhuj', message: 'Mandatory evacuation within 5km.', severity: 'critical', created_at: new Date().toISOString() },
    { id: 3, title: 'Aftershock Warning', message: 'Aftershocks expected in 48 hours.', severity: 'warning', created_at: new Date().toISOString() },
    { id: 4, title: 'Relief Distribution', message: 'Supplies at Bhuj Relief Camp.', severity: 'info', created_at: new Date().toISOString() },
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin({ username, password });
      const newToken = res.data.access_token;
      localStorage.setItem('admin_token', newToken);
      setToken(newToken);
      setIsLoggedIn(true);
      setDemoMode(false);
      showToast('Logged in');
    } catch (err) {
      if (username === 'admin' && password === 'admin123') {
        setIsLoggedIn(true);
        setDemoMode(true);
        setFacilities(DEMO_FACILITIES);
        setAlerts(DEMO_ALERTS);
        showToast('Demo mode — backend unavailable');
      } else {
        setLoginError('Invalid credentials. Demo: admin / admin123');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsLoggedIn(false);
    setDemoMode(false);
  };

  useEffect(() => {
    if (isLoggedIn && !demoMode) fetchData();
  }, [isLoggedIn, demoMode]);

  const fetchData = async () => {
    try {
      const [facRes, alertRes] = await Promise.all([getFacilities(), getAlerts({ active_only: false })]);
      setFacilities(facRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  const handleCreateFacility = async (e) => {
    e.preventDefault();
    if (demoMode) {
      const newF = { ...facilityForm, id: Date.now(), latitude: parseFloat(facilityForm.latitude), longitude: parseFloat(facilityForm.longitude), capacity: facilityForm.capacity ? parseInt(facilityForm.capacity) : null, current_occupancy: 0 };
      setFacilities([...facilities, newF]);
      setFacilityForm({ name: '', facility_type: 'shelter', latitude: '', longitude: '', address: '', contact: '', capacity: '' });
      showToast('Facility added (demo)');
      return;
    }
    try {
      await createFacility({ ...facilityForm, latitude: parseFloat(facilityForm.latitude), longitude: parseFloat(facilityForm.longitude), capacity: facilityForm.capacity ? parseInt(facilityForm.capacity) : null });
      showToast('Facility created');
      setFacilityForm({ name: '', facility_type: 'shelter', latitude: '', longitude: '', address: '', contact: '', capacity: '' });
      fetchData();
    } catch (err) { showToast('Failed', 'error'); }
  };

  const handleDeleteFacility = async (id) => {
    if (demoMode) { setFacilities(facilities.filter(f => f.id !== id)); showToast('Deleted (demo)'); return; }
    try { await deleteFacility(id); showToast('Deleted'); fetchData(); } catch (err) { showToast('Failed', 'error'); }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (demoMode) {
      setAlerts([...alerts, { ...alertForm, id: Date.now(), created_at: new Date().toISOString() }]);
      setAlertForm({ title: '', message: '', severity: 'info' });
      showToast('Alert added (demo)');
      return;
    }
    try { await createAlert(alertForm); showToast('Alert created'); setAlertForm({ title: '', message: '', severity: 'info' }); fetchData(); } catch (err) { showToast('Failed', 'error'); }
  };

  const handleDeleteAlert = async (id) => {
    if (demoMode) { setAlerts(alerts.filter(a => a.id !== id)); showToast('Deleted (demo)'); return; }
    try { await deleteAlert(id); showToast('Deleted'); fetchData(); } catch (err) { showToast('Failed', 'error'); }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (demoMode) { showToast('Upload not available in demo mode', 'error'); e.target.value = ''; return; }
    try {
      if (type === 'facilities') { const res = await uploadFacilities(file); showToast(`${res.data.records_created} uploaded`); }
      else { const res = await uploadAlerts(file); showToast(`${res.data.records_created} uploaded`); }
      fetchData();
    } catch (err) { showToast('Upload failed', 'error'); }
    e.target.value = '';
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="admin-layout">
        <div className="admin-header">
          <div className="admin-header__title">Admin</div>
          <a href="/" className="btn btn--secondary btn--sm">Back</a>
        </div>
        <div className="admin-content">
          <div className="login-container">
            <form className="login-card" onSubmit={handleLogin}>
              <div className="login-card__icon">&mdash;</div>
              <h1 className="login-card__title">Sign In</h1>
              <p className="login-card__subtitle">Manage disaster data, alerts, and facilities</p>
              {loginError && (
                <p style={{ color: 'var(--color-extreme)', textAlign: 'center', marginBottom: '12px', fontSize: '12px' }}>
                  {loginError}
                </p>
              )}
              <div className="form-group">
                <label htmlFor="admin-username">Username</label>
                <input id="admin-username" type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input id="admin-password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn--primary btn--block" id="admin-login-btn">Sign In</button>
            </form>
          </div>
        </div>
        {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
      </div>
    );
  }

  // Dashboard
  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div className="admin-header__title">
          Admin
          {demoMode && <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo</span>}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <a href="/" className="btn btn--secondary btn--sm">Dashboard</a>
          <button className="btn btn--danger btn--sm" onClick={handleLogout} id="admin-logout-btn">Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2px', padding: '6px 24px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        {['overview', 'facilities', 'alerts', 'upload'].map((tab) => (
          <button
            key={tab}
            className={`btn btn--sm ${activeTab === tab ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setActiveTab(tab)}
            id={`tab-${tab}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card__title">Facilities</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '6px' }}>{facilities.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {facilities.filter(f => f.facility_type === 'shelter').length} shelters /
                {facilities.filter(f => f.facility_type === 'hospital').length} hospitals /
                {facilities.filter(f => f.facility_type === 'evacuation').length} evacuation
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card__title">Alerts</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '6px' }}>{alerts.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {alerts.filter(a => a.severity === 'critical').length} critical /
                {alerts.filter(a => a.severity === 'warning').length} warning /
                {alerts.filter(a => a.severity === 'info').length} info
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card__title">Add Facility</div>
              <form onSubmit={handleCreateFacility}>
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-input" value={facilityForm.name} onChange={(e) => setFacilityForm({...facilityForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-select" value={facilityForm.facility_type} onChange={(e) => setFacilityForm({...facilityForm, facility_type: e.target.value})}>
                    <option value="shelter">Shelter</option>
                    <option value="hospital">Hospital</option>
                    <option value="evacuation">Evacuation</option>
                    <option value="missing_persons">Missing Persons</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group"><label>Latitude</label><input className="form-input" value={facilityForm.latitude} onChange={(e) => setFacilityForm({...facilityForm, latitude: e.target.value})} required /></div>
                  <div className="form-group"><label>Longitude</label><input className="form-input" value={facilityForm.longitude} onChange={(e) => setFacilityForm({...facilityForm, longitude: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label>Address</label><input className="form-input" value={facilityForm.address} onChange={(e) => setFacilityForm({...facilityForm, address: e.target.value})} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group"><label>Contact</label><input className="form-input" value={facilityForm.contact} onChange={(e) => setFacilityForm({...facilityForm, contact: e.target.value})} /></div>
                  <div className="form-group"><label>Capacity</label><input className="form-input" type="number" value={facilityForm.capacity} onChange={(e) => setFacilityForm({...facilityForm, capacity: e.target.value})} /></div>
                </div>
                <button type="submit" className="btn btn--primary btn--block" id="create-facility-btn">Add Facility</button>
              </form>
            </div>
            <div className="admin-card">
              <div className="admin-card__title">Facilities ({facilities.length})</div>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Type</th><th>Capacity</th><th></th></tr></thead>
                <tbody>
                  {facilities.map((f) => (
                    <tr key={f.id}>
                      <td>{f.name}</td>
                      <td><span className={`facility-popup__type facility-popup__type--${f.facility_type}`}>{f.facility_type?.replace('_', ' ')}</span></td>
                      <td>{f.current_occupancy || 0}/{f.capacity || '—'}</td>
                      <td><button className="btn btn--danger btn--sm" onClick={() => handleDeleteFacility(f.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card__title">Create Alert</div>
              <form onSubmit={handleCreateAlert}>
                <div className="form-group"><label>Title</label><input className="form-input" value={alertForm.title} onChange={(e) => setAlertForm({...alertForm, title: e.target.value})} required /></div>
                <div className="form-group"><label>Message</label><textarea className="form-textarea" value={alertForm.message} onChange={(e) => setAlertForm({...alertForm, message: e.target.value})} required /></div>
                <div className="form-group">
                  <label>Severity</label>
                  <select className="form-select" value={alertForm.severity} onChange={(e) => setAlertForm({...alertForm, severity: e.target.value})}>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
                <button type="submit" className="btn btn--primary btn--block" id="create-alert-btn">Create Alert</button>
              </form>
            </div>
            <div className="admin-card">
              <div className="admin-card__title">Alerts ({alerts.length})</div>
              <table className="data-table">
                <thead><tr><th>Title</th><th>Severity</th><th></th></tr></thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.id}>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</td>
                      <td>
                        <span style={{
                          background: a.severity === 'critical' ? 'var(--color-extreme)' : a.severity === 'warning' ? 'var(--color-moderate)' : 'var(--color-safe)',
                          color: 'white', padding: '1px 6px', borderRadius: '2px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                        }}>{a.severity}</span>
                      </td>
                      <td><button className="btn btn--danger btn--sm" onClick={() => handleDeleteAlert(a.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card__title">Upload Facilities</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '12px' }}>
                CSV with columns: name, facility_type, latitude, longitude, address, contact, capacity
              </p>
              <label className="file-upload" htmlFor="upload-facilities">
                <div className="file-upload__icon">+</div>
                <div className="file-upload__text">Select CSV or JSON</div>
                <input type="file" id="upload-facilities" accept=".csv,.json" onChange={(e) => handleFileUpload(e, 'facilities')} />
              </label>
            </div>
            <div className="admin-card">
              <div className="admin-card__title">Upload Alerts</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '12px' }}>
                JSON array with: title, message, severity
              </p>
              <label className="file-upload" htmlFor="upload-alerts">
                <div className="file-upload__icon">+</div>
                <div className="file-upload__text">Select JSON</div>
                <input type="file" id="upload-alerts" accept=".json" onChange={(e) => handleFileUpload(e, 'alerts')} />
              </label>
            </div>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
