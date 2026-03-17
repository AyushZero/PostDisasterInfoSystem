export default function DisasterInfoCard({ disaster }) {
  if (!disaster) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="bottom-panel" id="disaster-info-panel">
      <div className="disaster-info">
        <div className="disaster-info__item">
          <span className="disaster-info__label">Type</span>
          <span className="disaster-info__value">
            {disaster.disaster_type?.charAt(0).toUpperCase() + disaster.disaster_type?.slice(1)}
          </span>
        </div>

        <div className="disaster-info__divider"></div>

        {disaster.magnitude && (
          <>
            <div className="disaster-info__item">
              <span className="disaster-info__label">Magnitude</span>
              <span className="disaster-info__value disaster-info__value--magnitude">
                {disaster.magnitude}
              </span>
            </div>
            <div className="disaster-info__divider"></div>
          </>
        )}

        <div className="disaster-info__item">
          <span className="disaster-info__label">Region</span>
          <span className="disaster-info__value">{disaster.affected_region}</span>
        </div>

        <div className="disaster-info__divider"></div>

        <div className="disaster-info__item">
          <span className="disaster-info__label">Status</span>
          <span className="disaster-info__value">
            <span className={`status-badge status-badge--${disaster.status}`}>
              <span className="status-badge__dot"></span>
              {disaster.status}
            </span>
          </span>
        </div>

        <div className="disaster-info__divider"></div>

        <div className="disaster-info__item">
          <span className="disaster-info__label">Updated</span>
          <span className="disaster-info__value">
            {disaster.updated_at ? formatDate(disaster.updated_at) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
