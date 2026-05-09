import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Crosshair,
  Flag,
  Gauge,
  History,
  Phone,
  Route,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const formatCurrency = (value = 0) => `R${Number(value || 0).toLocaleString()}`;
const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--';

const getSuggestedAction = (vehicle) => {
  if (vehicle.suggestedAction) return vehicle.suggestedAction;
  if (vehicle.status === 'Offline') return 'Recover tracker visibility and confirm position with driver.';
  if (vehicle.status === 'Delayed') return 'Call driver, update ETA, and notify the customer before escalation.';
  if (vehicle.fuelLevel <= 25) return 'Check fuel plan before the next route segment.';
  if (vehicle.maintenanceWarning) return 'Review workshop timing before assigning another job.';
  return 'Continue monitoring. No immediate intervention required.';
};

export default function VehicleIntelPanel({
  vehicle,
  compact = false,
  onCenter,
  onFollow,
  onCall,
}) {
  const navigate = useNavigate();
  const [callState, setCallState] = useState(false);
  const [routeReplay, setRouteReplay] = useState(false);
  const [incidentMarked, setIncidentMarked] = useState(false);

  const driverStatus = vehicle?.driverStatus || (vehicle?.speed > 0 ? 'On duty' : 'Standing by');
  const delayRisk = vehicle?.scheduleState || 'On time';
  const suggestedAction = useMemo(() => (vehicle ? getSuggestedAction(vehicle) : ''), [vehicle]);

  if (!vehicle) {
    return (
      <div className="vehicle-intel-panel empty">
        <ShieldCheck size={18} />
        <span>Select a vehicle to inspect live operations.</span>
      </div>
    );
  }

  const handleCall = () => {
    setCallState(true);
    onCall?.(vehicle);
    window.setTimeout(() => setCallState(false), 1800);
  };

  const intelSections = [
    {
      title: 'Live',
      items: [
        ['ETA', vehicle.eta],
        ['Speed', `${Math.round(vehicle.speed)} km/h`],
        ['Risk', delayRisk],
        ['Next stop', vehicle.nextStop],
      ],
    },
    {
      title: 'Job',
      items: [
        ['Job', vehicle.currentJobNumber],
        ['Customer', vehicle.customerName],
        ['Cargo', vehicle.cargo],
        ['Value', formatCurrency(vehicle.openInvoiceValue)],
      ],
    },
    {
      title: 'Vehicle',
      items: [
        ['Driver', vehicle.driverName],
        ['Driver status', driverStatus],
        ['Phone', vehicle.driverPhone],
        ['Fuel', `${Math.round(vehicle.fuelLevel)}%`],
        ['Odometer', `${Math.round(vehicle.odometer).toLocaleString()} km`],
      ],
    },
    {
      title: 'Risk',
      items: [
        ['Tracker', vehicle.provider],
        ['Device', vehicle.trackerDeviceId],
        ['Ignition', vehicle.ignitionStatus],
        ['Last sync', formatTime(vehicle.lastSeen)],
      ],
    },
  ];
  const visibleSections = compact ? intelSections.slice(0, 2) : intelSections;

  return (
    <div className={`vehicle-intel-panel ${compact ? 'compact' : ''}`}>
      <div className="vehicle-intel-header">
        <div>
          <span className="vehicle-intel-eyebrow">Selected asset intelligence</span>
          <h3>{vehicle.vehicleName}</h3>
          <p>{`${vehicle.registration} - ${vehicle.routeName || 'Active route'}`}</p>
        </div>
        <span className={`vehicle-intel-status status-${vehicle.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {vehicle.status}
        </span>
      </div>

      <div className="vehicle-intel-strip">
        <div><Gauge size={14} /><strong>{Math.round(vehicle.speed)}</strong><span>km/h</span></div>
        <div><Route size={14} /><strong>{vehicle.routeProgress}%</strong><span>route</span></div>
        <div><AlertTriangle size={14} /><strong>{delayRisk}</strong><span>risk</span></div>
      </div>

      <div className="vehicle-intel-progress">
        <span style={{ width: `${vehicle.routeProgress}%` }} />
      </div>

      <div className="vehicle-intel-sections">
        {visibleSections.map((section) => (
          <div key={section.title} className="vehicle-intel-section">
            <h4>{section.title}</h4>
            <div className="vehicle-intel-grid">
              {section.items.map(([label, value]) => (
                <div key={`${section.title}-${label}`} className="vehicle-intel-item">
                  <span>{label}</span>
                  <strong>{value || '--'}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="vehicle-intel-alerts">
        {vehicle.delayReason && <div className="vehicle-intel-alert danger"><AlertTriangle size={14} /><span>{vehicle.delayReason}</span></div>}
        {vehicle.maintenanceWarning && <div className="vehicle-intel-alert warning"><Truck size={14} /><span>{vehicle.maintenanceWarning}</span></div>}
        {vehicle.complianceWarning && <div className="vehicle-intel-alert neutral"><ShieldCheck size={14} /><span>{vehicle.complianceWarning}</span></div>}
        <div className="vehicle-intel-alert action"><Flag size={14} /><span>{suggestedAction}</span></div>
      </div>

      <div className="vehicle-intel-actions">
        <button type="button" className="action-btn small" onClick={() => navigate(`/vehicles/${vehicle.vehicleId}`)}>
          Open vehicle page
        </button>
        <button
          type="button"
          className="action-btn small"
          disabled={!vehicle.currentJobId}
          onClick={() => vehicle.currentJobId && navigate(`/jobs/${vehicle.currentJobId}`)}
        >
          View job
        </button>
        <button type="button" className={`action-btn small ${callState ? 'primary' : ''}`} onClick={handleCall}>
          <Phone size={14} />
          <span>{callState ? 'Driver alerted' : 'Call driver'}</span>
        </button>
        <button type="button" className="action-btn small primary" onClick={() => onCenter?.(vehicle)}>
          <Crosshair size={14} />
          <span>Center</span>
        </button>
        <button type="button" className="action-btn small" onClick={() => onFollow?.(vehicle)}>
          <Route size={14} />
          <span>Follow</span>
        </button>
        <button type="button" className={`action-btn small ${routeReplay ? 'primary' : ''}`} onClick={() => setRouteReplay((value) => !value)}>
          <History size={14} />
          <span>{routeReplay ? 'Route replaying' : 'Replay route'}</span>
        </button>
        <button type="button" className={`action-btn small ${incidentMarked ? 'primary' : ''}`} onClick={() => setIncidentMarked(true)}>
          <Flag size={14} />
          <span>{incidentMarked ? 'Incident marked' : 'Mark incident'}</span>
        </button>
      </div>
    </div>
  );
}
