import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BatteryMedium,
  Fuel,
  Gauge,
  MapPinned,
  Phone,
  Radio,
  Truck,
} from 'lucide-react';

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--';

export default function VehicleLivePopup({
  vehicle,
  compact = false,
  onClose,
  onCenter,
  onCall,
}) {
  const navigate = useNavigate();
  const [callState, setCallState] = useState(false);

  const actionState = useMemo(() => ({
    canOpenJob: Boolean(vehicle?.currentJobId),
    canCallDriver: Boolean(vehicle?.driverPhone),
  }), [vehicle?.currentJobId, vehicle?.driverPhone]);

  if (!vehicle) return null;

  const handleCall = () => {
    setCallState(true);
    onCall?.(vehicle);
    window.setTimeout(() => setCallState(false), 1800);
  };

  return (
    <div className={`vehicle-live-popup ${compact ? 'compact' : ''}`}>
      <div className="vehicle-live-popup-header">
        <div>
          <span className="vehicle-live-popup-eyebrow">Live vehicle detail</span>
          <h3>{vehicle.vehicleName}</h3>
          <p>{`${vehicle.registration} · ${vehicle.driverName}`}</p>
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
        <div className="vehicle-live-detail"><span>Vehicle</span><strong>{vehicle.vehicleName}</strong></div>
        <div className="vehicle-live-detail"><span>Registration</span><strong>{vehicle.registration}</strong></div>
        <div className="vehicle-live-detail"><span>Driver</span><strong>{vehicle.driverName}</strong></div>
        <div className="vehicle-live-detail"><span>Driver phone</span><strong>{vehicle.driverPhone}</strong></div>
        <div className="vehicle-live-detail"><span>Current speed</span><strong>{Math.round(vehicle.speed)} km/h</strong></div>
        <div className="vehicle-live-detail"><span>Status</span><strong>{vehicle.status}</strong></div>
        <div className="vehicle-live-detail"><span>ETA</span><strong>{vehicle.eta}</strong></div>
        <div className="vehicle-live-detail"><span>Customer</span><strong>{vehicle.customerName}</strong></div>
        <div className="vehicle-live-detail"><span>Job number</span><strong>{vehicle.currentJobNumber}</strong></div>
        <div className="vehicle-live-detail"><span>Pickup</span><strong>{vehicle.pickupLocation}</strong></div>
        <div className="vehicle-live-detail"><span>Drop-off</span><strong>{vehicle.dropoffLocation}</strong></div>
        <div className="vehicle-live-detail"><span>Cargo</span><strong>{vehicle.cargo}</strong></div>
        <div className="vehicle-live-detail"><span>Route progress</span><strong>{vehicle.routeProgress}% complete</strong></div>
        <div className="vehicle-live-detail"><span>Fuel level</span><strong>{Math.round(vehicle.fuelLevel)}%</strong></div>
        <div className="vehicle-live-detail"><span>Tracker provider</span><strong>{vehicle.provider}</strong></div>
        <div className="vehicle-live-detail"><span>Tracker device</span><strong>{vehicle.trackerDeviceId}</strong></div>
        <div className="vehicle-live-detail"><span>Last updated</span><strong>{formatDateTime(vehicle.lastSeen)}</strong></div>
        <div className="vehicle-live-detail"><span>Operational insight</span><strong>{vehicle.scheduleState}</strong></div>
        <div className="vehicle-live-detail"><span>Next stop</span><strong>{vehicle.nextStop}</strong></div>
      </div>

      <div className="vehicle-live-callouts">
        {vehicle.delayReason && <div className="vehicle-live-callout warning"><AlertTriangle size={16} /><span>{vehicle.delayReason}</span></div>}
        {vehicle.maintenanceWarning && <div className="vehicle-live-callout maintenance"><Truck size={16} /><span>{vehicle.maintenanceWarning}</span></div>}
        {vehicle.trackerAlert && <div className="vehicle-live-callout neutral"><BatteryMedium size={16} /><span>{vehicle.trackerAlert}</span></div>}
      </div>

      <div className="vehicle-live-actions">
        <button type="button" className="action-btn small" onClick={() => navigate(`/vehicles/${vehicle.vehicleId}`)}>
          Open vehicle page
        </button>
        <button
          type="button"
          className="action-btn small"
          onClick={() => vehicle.currentJobId && navigate(`/jobs/${vehicle.currentJobId}`)}
          disabled={!actionState.canOpenJob}
        >
          View job
        </button>
        <button
          type="button"
          className={`action-btn small ${callState ? 'primary' : ''}`}
          onClick={handleCall}
          disabled={!actionState.canCallDriver}
        >
          <Phone size={14} />
          <span>{callState ? 'Driver alerted' : 'Call driver'}</span>
        </button>
        <button type="button" className="action-btn small primary" onClick={() => onCenter?.(vehicle)}>
          Center on vehicle
        </button>
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
