export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">🔔 Emergency Alerts</h2>
        </div>
        <div className="sidebar__content">
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__text">No active alerts</div>
          </div>
        </div>
      </aside>
    );
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">
          🔔 Emergency Alerts
          <span className="alert-count__number" style={{ marginLeft: '8px' }}>
            {alerts.length}
          </span>
        </h2>
      </div>
      <div className="sidebar__content">
        {alerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`alert-item alert-item--${alert.severity}`}
            id={`alert-${alert.id || index}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="alert-item__header">
              <span className="alert-item__title">{alert.title}</span>
              <span className="alert-item__severity">{alert.severity}</span>
            </div>
            <p className="alert-item__message">{alert.message}</p>
            <span className="alert-item__time">{formatTime(alert.created_at)}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
