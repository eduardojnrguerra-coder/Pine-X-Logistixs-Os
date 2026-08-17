import { useState } from 'react';
import { Plus, Search, Phone, Mail } from 'lucide-react';
import { DRIVERS, getVehicleById, DRIVER_STATUSES } from '../data/demoData';
import EmptyState from '../components/EmptyState';

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDrivers = DRIVERS.filter((driver) => {
    const vehicle = getVehicleById(driver.assignedVehicleId);
    const matchesSearch =
      searchTerm === '' ||
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      vehicle?.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Drivers</h1>
        <p>Driver management</p>
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {DRIVER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button">
          <Plus size={18} />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="drivers-grid">
        {filteredDrivers.map((driver) => {
          const vehicle = getVehicleById(driver.assignedVehicleId);
          return (
            <div key={driver.id} className="driver-card">
              <div className="driver-avatar">
                <span>{driver.name.split(' ').map((n) => n[0]).join('')}</span>
              </div>
              <div className="driver-info">
                <h4>{driver.name}</h4>
                <span className="driver-id">ID: {driver.id}</span>
              </div>
              <div className="driver-details">
                <span className={`driver-status ${driver.status === 'On Duty' || driver.status === 'Available' ? 'on-duty' : 'off-duty'}`}>
                  {driver.status}
                </span>
                {vehicle && (
                  <span className="driver-vehicle">{vehicle.registration}</span>
                )}
              </div>
              <div className="driver-stats">
                <div className="driver-stat">
                  <span className="stat-value">{driver.onTimeRate}%</span>
                  <span className="stat-label">on-time</span>
                </div>
                <div className="driver-stat">
                  <span className="stat-value">{driver.completedJobs}</span>
                  <span className="stat-label">jobs</span>
                </div>
                <div className="driver-stat">
                  <span className="stat-value warning">{driver.delayCount}</span>
                  <span className="stat-label">delays</span>
                </div>
              </div>
              <div className="driver-contact">
                <a href={`tel:${driver.phone}`} className="contact-btn">
                  <Phone size={16} />
                </a>
                <a href={`sms:${driver.phone}`} className="contact-btn">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      {filteredDrivers.length === 0 && (
        <EmptyState
          title="No drivers found"
          description="Try adjusting your search or filter criteria."
        />
      )}
    </div>
  );
}