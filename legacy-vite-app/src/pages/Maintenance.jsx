import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import MaintenanceCard from '../components/MaintenanceCard';
import VehicleHealthScore from '../components/VehicleHealthScore';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getAlertsByVehicleId,
  getCriticalAlerts,
  getFleetHealthSummary,
  getMaintenanceCostThisMonth,
  getOpenMaintenanceByVehicleId,
  getOverdueMaintenance,
  getVehicleById,
  getVehiclesNeedingAttention,
} from '../data/demoData';

export default function Maintenance() {
  const navigate = useNavigate();
  const { data, scenario } = usePresenterMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [completedMaintenanceIds, setCompletedMaintenanceIds] = useState([]);
  const [alertStatusOverrides, setAlertStatusOverrides] = useState({});

  const maintenanceItems = data.maintenance.map((item) =>
    completedMaintenanceIds.includes(item.id)
      ? { ...item, status: 'Completed', completedDate: new Date().toISOString().slice(0, 10) }
      : item
  );
  const alertsState = data.alerts.map((alert) =>
    alertStatusOverrides[alert.id] ? { ...alert, status: alertStatusOverrides[alert.id] } : alert
  );

  const healthSummary = useMemo(
    () => getFleetHealthSummary(data.vehicles, maintenanceItems, alertsState),
    [alertsState, data.vehicles, maintenanceItems]
  );
  const openMaintenance = maintenanceItems.filter((item) => item.status !== 'Completed');
  const overdueMaintenance = getOverdueMaintenance(maintenanceItems);
  const maintenanceCostThisMonth = getMaintenanceCostThisMonth(maintenanceItems);
  const criticalAlerts = getCriticalAlerts(alertsState);
  const vehiclesNeedingAttention = getVehiclesNeedingAttention(data.vehicles, maintenanceItems, alertsState);
  const filteredMaintenance = openMaintenance.filter((item) => {
    const vehicle = getVehicleById(item.vehicleId);
    const query = searchTerm.toLowerCase();
    return (
      searchTerm === '' ||
      item.title.toLowerCase().includes(query) ||
      vehicle?.registration.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container maintenance-page">
      <div className="page-header">
        <div>
          <h1>Maintenance & Alerts</h1>
          <p>Workshop pressure, compliance exposure, and fleet risk in one operational screen.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="stats-grid maintenance-stats-grid">
        <div className="stat-card"><div className="stat-value">{openMaintenance.length}</div><div className="stat-label">Open Maintenance</div></div>
        <div className="stat-card"><div className="stat-value">{overdueMaintenance.length}</div><div className="stat-label">Overdue Work Orders</div></div>
        <div className="stat-card"><div className="stat-value">{healthSummary.vehiclesInWorkshop}</div><div className="stat-label">Vehicles in Workshop</div></div>
        <div className="stat-card"><div className="stat-value">R{healthSummary.estimatedDowntimeCost.toLocaleString()}</div><div className="stat-label">Estimated Downtime Cost</div></div>
        <div className="stat-card"><div className="stat-value">R{maintenanceCostThisMonth.toLocaleString()}</div><div className="stat-label">Cost This Month</div></div>
      </div>

      <div className="maintenance-summary-grid">
        <div className="dashboard-card">
          <div className="card-header"><h3>Fleet Health Summary</h3></div>
          <div className="maintenance-summary-list">
            <div className="summary-row"><span>Average fleet health</span><strong>{healthSummary.averageScore}/100</strong></div>
            <div className="summary-row"><span>Critical alerts</span><strong>{healthSummary.criticalAlerts}</strong></div>
            <div className="summary-row"><span>Tracker offline warnings</span><strong>{healthSummary.trackerOfflineWarnings}</strong></div>
            <div className="summary-row"><span>Licence expiring soon</span><strong>{healthSummary.licenceExpiringSoon}</strong></div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header"><h3>Priority Focus</h3></div>
          <div className="maintenance-focus-list">
            <div className="focus-pill critical"><span>{criticalAlerts.length}</span><small>Critical alerts</small></div>
            <div className="focus-pill warning"><span>{overdueMaintenance.length}</span><small>Overdue</small></div>
            <div className="focus-pill info"><span>{vehiclesNeedingAttention.length}</span><small>Vehicles at risk</small></div>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search maintenance..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <button className="primary-button" onClick={() => navigate('/vehicles')}>
          <Plus size={18} />
          Open fleet
        </button>
      </div>

      <div className="maintenance-layout">
        <div className="maintenance-main-column">
          <div className="dashboard-card">
            <div className="card-header"><h3>Maintenance Records</h3></div>
            <div className="maintenance-card-grid">
              {filteredMaintenance.map((item) => (
                <MaintenanceCard
                  key={item.id}
                  maintenance={item}
                  vehicle={getVehicleById(item.vehicleId)}
                  onComplete={() => setCompletedMaintenanceIds((prev) => [...new Set([...prev, item.id])])}
                  onOpenVehicle={() => navigate(`/vehicles/${item.vehicleId}`)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="maintenance-side-column">
          <div className="dashboard-card">
            <div className="card-header"><h3>Alerts Panel</h3></div>
            <div className="alerts-stack">
              {alertsState.slice(0, 8).map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  vehicle={getVehicleById(alert.vehicleId)}
                  onAcknowledge={() => setAlertStatusOverrides((prev) => ({ ...prev, [alert.id]: 'Acknowledged' }))}
                  onResolve={() => setAlertStatusOverrides((prev) => ({ ...prev, [alert.id]: 'Resolved' }))}
                />
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Vehicle Health Scores</h3></div>
            <div className="health-score-list">
              {vehiclesNeedingAttention.slice(0, 5).map((item) => (
                <div key={item.vehicle.id} className="health-score-list-item">
                  <div className="health-score-list-header">
                    <div>
                      <strong>{item.vehicle.registration}</strong>
                      <p>{item.vehicle.name}</p>
                    </div>
                    <button className="action-btn small" onClick={() => navigate(`/vehicles/${item.vehicle.id}`)}>
                      Open vehicle
                    </button>
                  </div>
                  <VehicleHealthScore health={item} />
                  <div className="health-score-metrics">
                    <span>{getOpenMaintenanceByVehicleId(item.vehicle.id, maintenanceItems).length} open tasks</span>
                    <span>{getAlertsByVehicleId(item.vehicle.id, alertsState).length} live alerts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
