import { useState } from 'react';

export default function LocationPrompt({ onLocationSet, onSkip }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSet({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoading(false);
      },
      () => {
        setError('Location access denied. Enter manually.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Enter valid coordinates');
      return;
    }
    onLocationSet({ lat: latNum, lng: lngNum });
  };

  return (
    <div className="modal-overlay" id="location-prompt">
      <div className="modal">
        <div className="modal__icon">&mdash;</div>
        <h2 className="modal__title">Location</h2>
        <p className="modal__description">
          Allow location access to see disaster data near you, or enter coordinates.
        </p>

        {error && (
          <p style={{ color: 'var(--color-extreme)', fontSize: 'var(--font-size-xs)', textAlign: 'center', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <div className="modal__actions">
          <button className="btn btn--primary btn--block" onClick={requestGeolocation} disabled={loading} id="allow-location-btn">
            {loading ? 'Locating...' : 'Allow Location Access'}
          </button>

          <div className="modal__divider">or</div>

          <form onSubmit={handleManualSubmit}>
            <div className="modal__input-group">
              <input type="text" className="modal__input" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} id="manual-lat-input" />
              <input type="text" className="modal__input" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} id="manual-lng-input" />
            </div>
            <button type="submit" className="btn btn--secondary btn--block" style={{ marginTop: '8px' }} id="manual-location-btn">
              Set Location
            </button>
          </form>

          <button className="btn btn--secondary btn--block" onClick={onSkip} style={{ marginTop: '4px' }} id="skip-location-btn">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
