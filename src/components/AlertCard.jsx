import { BellRing, CalendarDays, Truck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AlertCard({
  alert,
  vehicle,
  onAcknowledge,
  onResolve,
}) {
  return (
    <div className={`alert-card-item ${alert.severity.toLowerCase()}`}>
      <div className="alert-card-top">
        <div>
          <div className="alert-card-vehicle">
            <Truck size={14} />
            <span>{vehicle?.registration || 'Unknown vehicle'}</span>
            <span className="maintenance-vehicle-name">{vehicle?.name}</span>
          </div>
          <h4>{alert.title}</h4>
        </div>
        <div className="maintenance-card-badges">
          <StatusBadge status={alert.severity} />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <div className="alert-card-type">
        <BellRing size={14} />
        <span>{alert.type}</span>
      </div>

      <p className="alert-card-message">{alert.message}</p>

      <div className="alert-card-footer">
        <span className="maintenance-meta-item">
          <CalendarDays size={14} />
          {new Date(alert.createdAt).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
        <div className="maintenance-card-actions">
          <button
            className="action-btn small"
            onClick={onAcknowledge}
            disabled={alert.status !== 'New'}
          >
            Acknowledge
          </button>
          <button
            className="action-btn small success"
            onClick={onResolve}
            disabled={alert.status === 'Resolved'}
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}
