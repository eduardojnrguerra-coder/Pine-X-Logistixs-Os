import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Gauge, MapPin, Search, ShieldAlert, User, Wrench } from 'lucide-react';
import IntegrationStatusBadge from '../components/IntegrationStatusBadge';
import StatusBadge from '../components/StatusBadge';
import VehicleHealthScore from '../components/VehicleHealthScore';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getAlertsByVehicleId,
  getCriticalAlerts,
  getDriverById,
  getOpenMaintenanceByVehicleId,
  getVehicleHealthScore,
} from '../data/demoData';

export default function Vehicles() {
  const navigate = useNavigate();
  const { data, scenario } = usePresenterMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const enrichedVehicles = useMemo(
    () =>
      data.vehicles.map((vehicle) => {
        const driver = getDriverById(vehicle.driverId);
        const liveVehicle = data.liveVehicles.find((item) => item.vehicleId === vehicle.id);
        const health = getVehicleHealthScore(vehicle.id, data.maintenance, data.alerts, data.vehicles);
        const openMaintenance = getOpenMaintenanceByVehicleId(vehicle.id, data.maintenance);
        const unresolvedAlerts = getAlertsByVehicleId(vehicle.id, data.alerts).filter(
          (alert) => alert.status !== 'Resolved'
        );
        const criticalAlerts = getCriticalAlerts(unresolvedAlerts);
        const trackerStatus = liveVehicle?.status === 'Offline' ? 'Offline' : 'Online';

        return {
          ...vehicle,
          driver,
          liveVehicle,
          health,
          openMaintenance,
          unresolvedAlerts,
          criticalAlerts,
          trackerStatus,
        };
      }),
    [data.alerts, data.liveVehicles, data.maintenance, data.vehicles]
  );

  const filteredVehicles = enrichedVehicles.filter((vehicle) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      vehicle.registration.toLowerCase().includes(query) ||
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.currentLocation.toLowerCase().includes(query) ||
      vehicle.driver?.name.toLowerCase().includes(query);
    const matchesStatus = statusFilter === '' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Vehicles</h1>
          <p>Fleet view with live tracker status, maintenance risk, and direct drill-down into each unit.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="filter-select">
            <option value="">All statuses</option>
            {[...new Set(data.vehicles.map((vehicle) => vehicle.status))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="vehicle-cards-grid">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-list-card">
            <div className="vehicle-list-card-top">
              <div>
                <div className="vehicle-list-card-id">{vehicle.registration}</div>
                <h3>{vehicle.name}</h3>
                <p>{vehicle.type}</p>
              </div>
              <StatusBadge status={vehicle.liveVehicle?.status || vehicle.status} />
            </div>

            <VehicleHealthScore health={vehicle.health} />

            <div className="vehicle-list-card-meta">
              <div>
                <span className="maintenance-detail-label">Driver</span>
                {vehicle.driver ? (
                  <Link to="/drivers" className="driver-link">
                    <User size={14} />
                    {vehicle.driver.name}
                  </Link>
                ) : (
                  <span className="unassigned">Unassigned</span>
                )}
              </div>
              <div>
                <span className="maintenance-detail-label">Current location</span>
                <span className="maintenance-meta-item">
                  <MapPin size={14} />
                  {vehicle.liveVehicle?.nextStop || vehicle.currentLocation}
                </span>
              </div>
              <div>
                <span className="maintenance-detail-label">Open maintenance</span>
                <span className="maintenance-meta-item">
                  <Wrench size={14} />
                  {vehicle.openMaintenance.length} active items
                </span>
              </div>
              <div>
                <span className="maintenance-detail-label">Service due</span>
                <span className="maintenance-meta-item">
                  <Gauge size={14} />
                  {vehicle.serviceDueKm.toLocaleString()} km remaining
                </span>
              </div>
              <div>
                <span className="maintenance-detail-label">Provider status</span>
                <IntegrationStatusBadge status={vehicle.trackerStatus === 'Offline' ? 'Error' : 'Connected'} />
              </div>
            </div>

            <div className="vehicle-warning-stack horizontal">
              <span className={`warning-badge tracker ${vehicle.trackerStatus === 'Offline' ? '' : 'muted'}`}>
                <ShieldAlert size={14} />
                Tracker {vehicle.trackerStatus}
              </span>
              <span className={`warning-badge ${vehicle.serviceDueKm < 5000 ? '' : 'muted'}`}>
                <Wrench size={14} />
                {vehicle.serviceDueKm < 5000 ? 'Service due soon' : 'Service healthy'}
              </span>
              <span className={`warning-badge critical ${vehicle.criticalAlerts.length > 0 ? '' : 'muted'}`}>
                <AlertTriangle size={14} />
                {vehicle.criticalAlerts.length} critical alerts
              </span>
            </div>

            <div className="vehicle-list-card-footer">
              <div className="vehicle-risk-copy">
                <strong>{vehicle.liveVehicle?.routeProgress || 0}%</strong>
                <span>route progress</span>
              </div>
              <button className="action-btn small primary" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                Open vehicle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
