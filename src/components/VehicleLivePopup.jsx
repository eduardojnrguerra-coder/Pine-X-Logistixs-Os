import { AlertTriangle, BatteryMedium, Fuel, Gauge, MapPinned, Radio, Truck } from 'lucide-react';

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--';

export default function VehicleLivePopup({ vehicle, compact = false, onClose }) {
  if (!vehicle) return null;

  return (
    <div className={`vehicle-live-popup ${compact ? 'compact' : ''}`}>
      <div className="vehicle-live-popup-header">
        <div>
          <span className="vehicle-live-popup-eyebrow">Live vehicle detail</span>
          <h3>{vehicle.vehicleName}</h3>
          <p>
            {vehicle.registration} · {vehicle.driverName}
          </p>
        </div>
        {onClose && (
          <button type="button" className="ghost-button small" onClick={onClose}>
            Close
          </button>
        )}
      </div>

      <div className="vehicle-live-badges">
        {vehicle.insights?.map((insight) => (
          <span key={insight.label} className={`vehicle-insight-badge ${insight.tone}`}>
            {insight.label}
          </span>
        ))}
      </div>

      <div className="vehicle-live-topline">
        <div className="vehicle-live-topline-item"><Gauge size={16} /><span>{Math.round(vehicle.speed)} km/h</span></div>
        <div className="vehicle-live-topline-item"><Fuel size={16} /><span>{Math.round(vehicle.fuelLevel)}% fuel</span></div>
        <div className="vehicle-live-topline-item"><Radio size={16} /><span>{vehicle.provider}</span></div>
      </div>

      <div className="vehicle-live-grid">
        <div className="vehicle-live-detail"><span>Current job</span><strong>{vehicle.currentJobNumber}</strong></div>
        <div className="vehicle-live-detail"><span>Customer</span><strong>{vehicle.customerName}</strong></div>
        <div className="vehicle-live-detail"><span>Pickup</span><strong>{vehicle.pickupLocation}</strong></div>
        <div className="vehicle-live-detail"><span>Drop-off</span><strong>{vehicle.dropoffLocation}</strong></div>
        <div className="vehicle-live-detail"><span>Status</span><strong>{vehicle.status}</strong></div>
        <div className="vehicle-live-detail"><span>Operational insight</span><strong>{vehicle.scheduleState}</strong></div>
        <div className="vehicle-live-detail"><span>ETA</span><strong>{vehicle.eta}</strong></div>
        <div className="vehicle-live-detail"><span>Next stop</span><strong>{vehicle.nextStop}</strong></div>
        <div className="vehicle-live-detail"><span>Progress</span><strong>{vehicle.routeProgress}%</strong></div>
        <div className="vehicle-live-detail"><span>Driver phone</span><strong>{vehicle.driverPhone}</strong></div>
        <div className="vehicle-live-detail"><span>Cargo</span><strong>{vehicle.cargo}</strong></div>
        <div className="vehicle-live-detail"><span>Tracker device</span><strong>{vehicle.trackerDeviceId}</strong></div>
        <div className="vehicle-live-detail"><span>Last updated</span><strong>{formatDateTime(vehicle.lastSeen)}</strong></div>
        <div className="vehicle-live-detail"><span>Fuel level</span><strong>{Math.round(vehicle.fuelLevel)}%</strong></div>
        <div className="vehicle-live-detail"><span>Route progress</span><strong>{vehicle.routeProgress}% complete</strong></div>
      </div>

      <div className="vehicle-live-callouts">
        {vehicle.delayReason && <div className="vehicle-live-callout warning"><AlertTriangle size={16} /><span>{vehicle.delayReason}</span></div>}
        {vehicle.maintenanceWarning && <div className="vehicle-live-callout maintenance"><Truck size={16} /><span>{vehicle.maintenanceWarning}</span></div>}
        {vehicle.trackerAlert && <div className="vehicle-live-callout neutral"><BatteryMedium size={16} /><span>{vehicle.trackerAlert}</span></div>}
      </div>

      <div className="vehicle-live-footer">
        <div className="vehicle-live-footer-item"><MapPinned size={14} /><span>{vehicle.latestStop}</span></div>
        <div className="vehicle-live-footer-item">
          <span>Route progress</span>
          <div className="vehicle-live-progress"><span style={{ width: `${vehicle.routeProgress}%` }} /></div>
        </div>
      </div>
    </div>
  );
}
