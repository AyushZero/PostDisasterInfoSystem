export default function DisasterInfoCard({ disaster }) {
  if (!disaster) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const typeIcons = {
    earthquake: '🌍',
    flood: '🌊',
    cyclone: '🌀',
    tsunami: '🌊',
    wildfire: '🔥',
    default: '⚠️',
  };

  const icon = typeIcons[disaster.disaster_type] || typeIcons.default;

  return (
    <div className="bottom-panel" id="disaster-info-panel">
      <div className="disaster-info">
        <div className="disaster-info__item">
          <span className="disaster-info__label">Disaster Type</span>
          <span className="disaster-info__value">
            {icon} {disaster.disaster_type?.charAt(0).toUpperCase() + disaster.disaster_type?.slice(1)}
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
          <span className="disaster-info__label">Affected Region</span>
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
          <span className="disaster-info__label">Last Updated</span>
          <span className="disaster-info__value">
            {disaster.updated_at ? formatDate(disaster.updated_at) : 'N/A'}
          </span>
        </div>

        {disaster.description && (
          <>
            <div className="disaster-info__divider"></div>
            <div className="disaster-info__item" style={{ minWidth: '200px' }}>
              <span className="disaster-info__label">Description</span>
              <span className="disaster-info__value" style={{
                whiteSpace: 'normal',
                fontSize: 'var(--font-size-xs)',
                lineHeight: '1.4',
                color: 'var(--text-secondary)',
              }}>
                {disaster.description}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
