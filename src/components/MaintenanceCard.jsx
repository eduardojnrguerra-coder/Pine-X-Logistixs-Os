import { CalendarDays, CircleDollarSign, Gauge, MapPin, Truck, Wrench } from 'lucide-react';
import StatusBadge from './StatusBadge';

const priorityClassMap = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
  Urgent: 'urgent',
};

export default function MaintenanceCard({
  maintenance,
  vehicle,
  onComplete,
  onOpenVehicle,
}) {
  return (
    <div className="maintenance-card">
      <div className="maintenance-card-header">
        <div>
          <div className="maintenance-vehicle-line">
            <Truck size={15} />
            <span>{vehicle?.registration || 'Unknown vehicle'}</span>
            <span className="maintenance-vehicle-name">{vehicle?.name}</span>
          </div>
          <h3>{maintenance.title}</h3>
          <p>{maintenance.description}</p>
        </div>
        <div className="maintenance-card-badges">
          <StatusBadge status={maintenance.status} />
          <span className={`priority-badge ${priorityClassMap[maintenance.priority] || 'medium'}`}>
            {maintenance.priority}
          </span>
        </div>
      </div>

      <div className="maintenance-card-meta">
        <span className="maintenance-meta-item">
          <Wrench size={14} />
          {maintenance.type}
        </span>
        <span className="maintenance-meta-item">
          <CalendarDays size={14} />
          Due {new Date(maintenance.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
        </span>
        <span className="maintenance-meta-item">
          <CircleDollarSign size={14} />
          {maintenance.cost ? `R${maintenance.cost.toLocaleString()}` : 'Cost pending'}
        </span>
        <span className="maintenance-meta-item">
          <Gauge size={14} />
          {maintenance.odometer.toLocaleString()} km
        </span>
        <span className="maintenance-meta-item">
          <MapPin size={14} />
          {maintenance.assignedWorkshop}
        </span>
      </div>

      <div className="maintenance-card-details">
        <div>
          <span className="maintenance-detail-label">Downtime</span>
          <span>{maintenance.downtimeDays} day{maintenance.downtimeDays === 1 ? '' : 's'}</span>
        </div>
        <div>
          <span className="maintenance-detail-label">Reported</span>
          <span>{new Date(maintenance.reportedDate).toLocaleDateString('en-ZA')}</span>
        </div>
        <div>
          <span className="maintenance-detail-label">Notes</span>
          <span>{maintenance.notes || 'No workshop notes captured.'}</span>
        </div>
      </div>

      <div className="maintenance-card-actions">
        <button className="action-btn small" onClick={onOpenVehicle}>
          Open vehicle
        </button>
        <button
          className="action-btn small success"
          onClick={onComplete}
          disabled={maintenance.status === 'Completed'}
        >
          Mark completed
        </button>
      </div>
    </div>
  );
}
