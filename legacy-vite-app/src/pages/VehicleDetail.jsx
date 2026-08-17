import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Fuel, MapPinned, Truck } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LiveFleetMap from '../components/LiveFleetMap';
import StatusBadge from '../components/StatusBadge';
import VehicleHealthScore from '../components/VehicleHealthScore';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getAlertsByVehicleId,
  getCustomerById,
  getDriverById,
  getJobById,
  getMaintenanceByVehicleId,
  getVehicleComplianceById,
  getVehicleHealthScore,
} from '../data/demoData';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, scenario } = usePresenterMode();

  const vehicle = data.vehicles.find((item) => item.id === id);
  const liveVehicle = data.liveVehicles.find((item) => item.vehicleId === id);
  const maintenanceItems = useMemo(() => getMaintenanceByVehicleId(id, data.maintenance), [data.maintenance, id]);
  const alerts = useMemo(() => getAlertsByVehicleId(id, data.alerts), [data.alerts, id]);

  if (!vehicle) {
    return (
      <div className="page-container">
        <EmptyState title="Vehicle not found" description="The selected vehicle does not exist in the presenter dataset." />
      </div>
    );
  }

  const driver = getDriverById(vehicle.driverId);
  const job = getJobById(vehicle.currentJobId);
  const customer = job ? getCustomerById(job.customerId) : null;
  const compliance = getVehicleComplianceById(id);
  const health = getVehicleHealthScore(id, data.maintenance, data.alerts, data.vehicles);
  const completedMaintenance = maintenanceItems.filter((item) => item.status === 'Completed');
  const openMaintenance = maintenanceItems.filter((item) => item.status !== 'Completed');
  const maintenanceCost = maintenanceItems.reduce((sum, item) => sum + (item.cost || 0), 0);
  const jobHistory = data.jobs.filter((item) => item.assignedVehicleId === id).slice(0, 5);
  const fuelEfficiency = Math.max(2.8, Number((32 - vehicle.fuelLevel / 5 - vehicle.serviceDueKm / 5000).toFixed(1)));
  const costPerKm = Number(((maintenanceCost + (job?.estimatedCost || 0)) / Math.max(1, vehicle.odometer)).toFixed(2));
  const idleTime = liveVehicle?.idleMinutes || 6;
  const fuelWasteEstimate = Math.round(idleTime * 210);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{vehicle.name}</h1>
          <p>{vehicle.registration} · {scenario.name}</p>
        </div>
        <StatusBadge status={liveVehicle?.status || vehicle.status} />
      </div>

      <div className="stats-grid reports-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{liveVehicle?.speed || 0} km/h</div>
          <div className="stat-label">Current Speed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{vehicle.fuelLevel}%</div>
          <div className="stat-label">Fuel Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round(liveVehicle?.routeProgress || 0)}%</div>
          <div className="stat-label">Route Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">Faults & Alerts</div>
        </div>
      </div>

      <div className="reports-layout">
        <div className="reports-main-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Vehicle Overview</h3>
            </div>
            <div className="vehicle-live-grid">
              <div className="vehicle-live-detail"><span>Type</span><strong>{vehicle.type}</strong></div>
              <div className="vehicle-live-detail"><span>Current driver</span><strong>{driver?.name || 'Unassigned'}</strong></div>
              <div className="vehicle-live-detail"><span>Current job</span><strong>{job?.jobNumber || 'No active job'}</strong></div>
              <div className="vehicle-live-detail"><span>Current location</span><strong>{liveVehicle?.nextStop || vehicle.currentLocation}</strong></div>
              <div className="vehicle-live-detail"><span>Tracker provider</span><strong>{liveVehicle?.provider || vehicle.trackerProvider}</strong></div>
              <div className="vehicle-live-detail"><span>Tracker device ID</span><strong>{liveVehicle?.trackerDeviceId || vehicle.trackerDeviceId}</strong></div>
              <div className="vehicle-live-detail"><span>Last seen</span><strong>{liveVehicle?.lastSeen ? new Date(liveVehicle.lastSeen).toLocaleTimeString('en-ZA') : '--'}</strong></div>
              <div className="vehicle-live-detail"><span>Odometer</span><strong>{vehicle.odometer.toLocaleString()} km</strong></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Live Tracking Panel</h3>
            </div>
            <LiveFleetMap
              vehicles={liveVehicle ? [liveVehicle] : []}
              selectedVehicleId={liveVehicle?.vehicleId}
              title="Vehicle Route Preview"
              onSelectVehicle={() => {}}
            />
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Maintenance History</h3>
            </div>
            <div className="sales-summary-grid">
              <div>
                <span className="maintenance-detail-label">Open maintenance items</span>
                <strong>{openMaintenance.length}</strong>
              </div>
              <div>
                <span className="maintenance-detail-label">Completed maintenance</span>
                <strong>{completedMaintenance.length}</strong>
              </div>
              <div>
                <span className="maintenance-detail-label">Downtime days</span>
                <strong>{maintenanceItems.reduce((sum, item) => sum + item.downtimeDays, 0)}</strong>
              </div>
              <div>
                <span className="maintenance-detail-label">Maintenance cost</span>
                <strong>R{maintenanceCost.toLocaleString()}</strong>
              </div>
            </div>
            <div className="invoice-list">
              {maintenanceItems.map((item) => (
                <div key={item.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{item.title}</span>
                    <span className="invoice-client">{item.assignedWorkshop}</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">{item.type}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Job History</h3>
            </div>
            <div className="invoice-list">
              {jobHistory.map((historyJob) => (
                <div key={historyJob.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{historyJob.jobNumber}</span>
                    <span className="invoice-client">{historyJob.pickupLocation} to {historyJob.dropoffLocation}</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">R{historyJob.price.toLocaleString()}</span>
                    <StatusBadge status={historyJob.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reports-side-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Health & Compliance</h3>
            </div>
            <VehicleHealthScore health={health} />
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Licence expiry</span><strong>{vehicle.licenceExpiry}</strong></div>
              <div className="summary-row"><span>Roadworthy</span><strong>{compliance?.roadworthyDate || '--'}</strong></div>
              <div className="summary-row"><span>Insurance expiry</span><strong>{compliance?.insuranceExpiry || '--'}</strong></div>
              <div className="summary-row"><span>Permit expiry</span><strong>{compliance?.permitExpiry || '--'}</strong></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Faults and Alerts</h3>
            </div>
            <div className="invoice-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{alert.title}</span>
                    <span className="invoice-client">{alert.message}</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">{alert.type}</span>
                    <span className={`invoice-due ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Fuel and Efficiency</h3>
            </div>
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Fuel efficiency</span><strong>{fuelEfficiency} L/100km</strong></div>
              <div className="summary-row"><span>Idle time</span><strong>{idleTime} min</strong></div>
              <div className="summary-row"><span>Cost per km</span><strong>R{costPerKm}</strong></div>
              <div className="summary-row"><span>Fuel waste estimate</span><strong>R{fuelWasteEstimate.toLocaleString()}</strong></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Job Assignment</h3>
            </div>
            <div className="portal-benefits-list">
              <span><Truck size={14} /> {job?.jobNumber || 'No active job'}</span>
              <span><MapPinned size={14} /> {job ? `${job.pickupLocation} to ${job.dropoffLocation}` : 'No assigned route'}</span>
              <span><AlertTriangle size={14} /> {job?.cargo || 'No assigned cargo'}</span>
              <span><Fuel size={14} /> Linked customer: {customer?.companyName || 'None'}</span>
            </div>
            <button className="action-btn small primary" onClick={() => navigate(job ? `/jobs/${job.id}` : '/jobs')}>
              Open job
            </button>
            <button className="action-btn small" onClick={() => navigate('/maintenance')}>
              Open maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
