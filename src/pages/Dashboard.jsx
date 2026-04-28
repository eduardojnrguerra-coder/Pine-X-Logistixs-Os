import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CircleDollarSign,
  MessageSquare,
  ShieldAlert,
  Truck,
  Wrench,
} from 'lucide-react';
import LiveFleetMap from '../components/LiveFleetMap';
import VehicleHealthScore from '../components/VehicleHealthScore';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getCustomerById,
  getCustomersWithOverdueInvoices,
  getFleetHealthSummary,
  getRecentCustomerMessages,
  getVehiclesNeedingAttention,
} from '../data/demoData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, metrics, scenario } = usePresenterMode();
  const [selectedVehicleId, setSelectedVehicleId] = useState(data.liveVehicles[0]?.vehicleId || null);

  const fleetHealth = useMemo(
    () => getFleetHealthSummary(data.vehicles, data.maintenance, data.alerts),
    [data.alerts, data.maintenance, data.vehicles]
  );
  const vehiclesNeedingAttention = useMemo(
    () => getVehiclesNeedingAttention(data.vehicles, data.maintenance, data.alerts),
    [data.alerts, data.maintenance, data.vehicles]
  );
  const recentCustomerMessages = useMemo(
    () => getRecentCustomerMessages(data.customerMessages),
    [data.customerMessages]
  );
  const overdueCustomers = useMemo(
    () => getCustomersWithOverdueInvoices(data.customers, data.invoices),
    [data.customers, data.invoices]
  );
  const activeJobs = data.jobs.filter((job) =>
    ['On Route', 'At Pickup', 'Loaded', 'At Dropoff', 'Dispatched', 'Delayed'].includes(job.status)
  );

  const stats = [
    {
      label: 'Active Deliveries',
      value: metrics.activeDeliveries,
      icon: Truck,
      color: '#2563eb',
      onClick: () => navigate('/dispatch'),
    },
    {
      label: 'Offline Trackers',
      value: metrics.offlineTrackers,
      icon: ShieldAlert,
      color: '#64748b',
      onClick: () => navigate('/tracking'),
    },
    {
      label: 'Open Maintenance',
      value: metrics.openMaintenance,
      icon: Wrench,
      color: '#f97316',
      onClick: () => navigate('/maintenance'),
    },
    {
      label: 'Overdue Invoices',
      value: `R${metrics.overdueInvoices.toLocaleString()}`,
      icon: CircleDollarSign,
      color: '#f59e0b',
      onClick: () => navigate('/reports'),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Connected operations view for jobs, fleet health, finance risk, and customer pressure.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card" onClick={stat.onClick} style={{ cursor: 'pointer' }}>
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="reports-layout">
        <div className="reports-main-column">
          <div className="dashboard-card live-tracking-map-card">
            <div className="card-header">
              <h3>Live Fleet Preview</h3>
            </div>
            <LiveFleetMap
              vehicles={data.liveVehicles.slice(0, 6)}
              selectedVehicleId={selectedVehicleId}
              compact
              onSelectVehicle={(vehicle) => setSelectedVehicleId(vehicle.vehicleId)}
              title="Live Fleet Preview"
            />
            <div className="compact-map-actions">
              <button className="action-btn small" onClick={() => navigate('/tracking')}>
                Open full tracking
              </button>
              <button className="action-btn small primary" onClick={() => selectedVehicleId && navigate(`/vehicles/${selectedVehicleId}`)}>
                Open selected vehicle
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Owner Insights</h3>
            </div>
            <div className="sales-storyline">
              {data.ownerInsights.map((insight) => (
                <div key={insight} className="sales-storyline-row">
                  <AlertTriangle size={16} />
                  <p>{insight}</p>
                </div>
              ))}
              {data.ownerInsights.length === 0 && (
                <div className="sales-storyline-row">
                  <ShieldAlert size={16} />
                  <p>The day is stable, but Pine X is still replacing calls, guesswork, and manual coordination.</p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Active Customer Deliveries</h3>
            </div>
            <div className="table-container">
              <table className="data-table full-width">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Route</th>
                  </tr>
                </thead>
                <tbody>
                  {activeJobs.slice(0, 6).map((job) => (
                    <tr key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} style={{ cursor: 'pointer' }}>
                      <td className="job-id">{job.jobNumber}</td>
                      <td>{getCustomerById(job.customerId)?.companyName}</td>
                      <td>{job.status}</td>
                      <td>{job.pickupLocation} to {job.dropoffLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="reports-side-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Fleet Health Summary</h3>
            </div>
            <div className="maintenance-summary-list">
              <div className="summary-row">
                <span>Average fleet health</span>
                <strong>{fleetHealth.averageScore}/100</strong>
              </div>
              <div className="summary-row">
                <span>Critical alerts</span>
                <strong>{fleetHealth.criticalAlerts}</strong>
              </div>
              <div className="summary-row">
                <span>Licence expiring soon</span>
                <strong>{fleetHealth.licenceExpiringSoon}</strong>
              </div>
              <div className="summary-row">
                <span>Tracker warnings</span>
                <strong>{fleetHealth.trackerOfflineWarnings}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Vehicles Needing Attention</h3>
            </div>
            <div className="health-score-list">
              {vehiclesNeedingAttention.slice(0, 4).map((item) => (
                <div key={item.vehicle.id} className="health-score-list-item">
                  <div className="health-score-list-header">
                    <div>
                      <strong>{item.vehicle.registration}</strong>
                      <p>{item.vehicle.name}</p>
                    </div>
                    <button className="action-btn small" onClick={() => navigate(`/vehicles/${item.vehicle.id}`)}>
                      Open
                    </button>
                  </div>
                  <VehicleHealthScore health={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Customers With Overdue Invoices</h3>
            </div>
            <div className="invoice-list">
              {overdueCustomers.slice(0, 4).map((item) => (
                <div key={item.customer.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{item.customer.companyName}</span>
                    <span className="invoice-client">{item.count} overdue invoice(s)</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">R{item.overdue.toLocaleString()}</span>
                    <span className="invoice-due overdue">Overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Customer Messages</h3>
            </div>
            <div className="invoice-list">
              {recentCustomerMessages.slice(0, 4).map((message) => (
                <div key={message.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{getCustomerById(message.customerId)?.companyName}</span>
                    <span className="invoice-client">{message.content}</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">{message.author}</span>
                    <span className="invoice-due sent">
                      <MessageSquare size={12} />
                    </span>
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
