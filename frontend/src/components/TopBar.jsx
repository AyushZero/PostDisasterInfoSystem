import { useState, useEffect } from 'react';

export default function TopBar({ disaster, alertCount }) {
  const statusClass = disaster
    ? `status-badge--${disaster.status}`
    : 'status-badge--active';

  return (
    <header className="top-bar">
      <div className="top-bar__logo">
        <span className="top-bar__logo-icon">🚨</span>
        <span className="top-bar__title">DisasterAlert</span>
      </div>

      {disaster && (
        <div className="top-bar__disaster-name">
          {disaster.name}
          <span className={`status-badge ${statusClass}`}>
            <span className="status-badge__dot"></span>
            {disaster.status}
          </span>
        </div>
      )}

      <div className="top-bar__right">
        {alertCount > 0 && (
          <div className="alert-count" id="alert-count-badge">
            <span>🔔</span>
            <span>Alerts</span>
            <span className="alert-count__number">{alertCount}</span>
          </div>
        )}
        <a href="/admin" className="btn btn--secondary btn--sm" id="admin-link">
          ⚙️ Admin
        </a>
      </div>
    </header>
  );
}
