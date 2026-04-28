import { useState } from 'react';
import { ChevronRight, User, Truck, MapPin } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { JOBS, getCustomerById, getDriverById, getVehicleById, DRIVERS, VEHICLES } from '../data/demoData';

const DISPATCH_COLUMNS = [
  { key: 'unassigned', title: 'Unassigned', statuses: ['Draft', 'Quoted', 'Approved'] },
  { key: 'scheduled', title: 'Scheduled', statuses: ['Scheduled'] },
  { key: 'dispatched', title: 'Dispatched', statuses: ['Dispatched', 'At Pickup', 'Loaded'] },
  { key: 'onroute', title: 'On Route', statuses: ['On Route', 'At Dropoff'] },
  { key: 'delivered', title: 'Delivered', statuses: ['Delivered'] },
  { key: 'delayed', title: 'Delayed', statuses: ['Delayed', 'Cancelled'] },
];

export default function Dispatch() {
  const [jobs, setJobs] = useState(JOBS);
  const [selectedColumn, setSelectedColumn] = useState('unassigned');

  const getColumnJobs = (columnKey) => {
    const column = DISPATCH_COLUMNS.find((c) => c.key === columnKey);
    if (!column) return [];
    return jobs.filter((job) => column.statuses.includes(job.status));
  };

  const getAvailableDrivers = () => {
    return DRIVERS.filter((d) => d.status === 'Available');
  };

  const getAvailableVehicles = () => {
    return VEHICLES.filter((v) => v.status === 'Idle' || v.status === 'Active');
  };

  const handleAssignDriver = (jobId, driverId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, assignedDriverId: driverId } : job
      )
    );
  };

  const handleAssignVehicle = (jobId, vehicleId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, assignedVehicleId: vehicleId } : job
      )
    );
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const moveToNextStatus = (job) => {
    const statusFlow = {
      Draft: 'Quoted',
      Quoted: 'Approved',
      Approved: 'Scheduled',
      Scheduled: 'Dispatched',
      Dispatched: 'At Pickup',
      'At Pickup': 'Loaded',
      Loaded: 'On Route',
      'On Route': 'At Dropoff',
      'At Dropoff': 'Delivered',
      Delivered: 'Delivered',
      Delayed: 'Delayed',
      Cancelled: 'Cancelled',
    };
    const nextStatus = statusFlow[job.status];
    if (nextStatus) {
      handleStatusChange(job.id, nextStatus);
    }
  };

  return (
    <div className="dispatch-page">
      <div className="page-header">
        <h1>Dispatch</h1>
        <p>Manage and track deliveries</p>
      </div>

      <div className="dispatch-panels">
        <div className="dispatch-panel drivers-panel">
          <h3>
            <User size={18} />
            Available Drivers
          </h3>
          <div className="panel-list">
            {getAvailableDrivers().map((driver) => (
              <div key={driver.id} className="panel-item driver-item">
                <div className="panel-item-info">
                  <span className="item-name">{driver.name}</span>
                  <span className="item-detail">{driver.licenceCode}</span>
                </div>
                <span className="item-rate">{driver.onTimeRate}% on-time</span>
              </div>
            ))}
            {getAvailableDrivers().length === 0 && (
              <div className="panel-empty">No drivers available</div>
            )}
          </div>
        </div>

        <div className="dispatch-panel vehicles-panel">
          <h3>
            <Truck size={18} />
            Available Vehicles
          </h3>
          <div className="panel-list">
            {getAvailableVehicles().map((vehicle) => (
              <div key={vehicle.id} className="panel-item vehicle-item">
                <div className="panel-item-info">
                  <span className="item-name">{vehicle.registration}</span>
                  <span className="item-detail">{vehicle.type}</span>
                </div>
                <span className={`vehicle-status ${vehicle.status.toLowerCase()}`}>
                  {vehicle.status}
                </span>
              </div>
            ))}
            {getAvailableVehicles().length === 0 && (
              <div className="panel-empty">No vehicles available</div>
            )}
          </div>
        </div>
      </div>

      <div className="dispatch-board">
        <div className="dispatch-columns">
          {DISPATCH_COLUMNS.map((column) => (
            <div
              key={column.key}
              className={`dispatch-column ${selectedColumn === column.key ? 'selected' : ''}`}
              onClick={() => setSelectedColumn(column.key)}
            >
              <div className="column-header">
                <h3>{column.title}</h3>
                <span className="column-count">
                  {getColumnJobs(column.key).length}
                </span>
              </div>
              <div className="column-jobs">
                {getColumnJobs(column.key).map((job) => {
                  const customer = getCustomerById(job.customerId);
                  const driver = job.assignedDriverId
                    ? getDriverById(job.assignedDriverId)
                    : null;
                  const vehicle = job.assignedVehicleId
                    ? getVehicleById(job.assignedVehicleId)
                    : null;

                  return (
                    <div key={job.id} className="dispatch-job-card">
                      <div className="job-header">
                        <span className="job-number">{job.jobNumber}</span>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="job-customer">{customer?.name}</div>
                      <div className="job-route">
                        <MapPin size={12} />
                        <span>{job.pickupLocation}</span>
                        <span>→</span>
                        <MapPin size={12} />
                        <span>{job.dropoffLocation}</span>
                      </div>
                      <div className="job-price">R{job.price.toLocaleString()}</div>

                      {!driver && !vehicle && column.key === 'unassigned' && (
                        <div className="job-assign">
                          <select
                            placeholder="Assign driver..."
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignDriver(job.id, e.target.value);
                              }
                            }}
                          >
                            <option value="">Select driver...</option>
                            {getAvailableDrivers().map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                          <select
                            placeholder="Assign vehicle..."
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignVehicle(job.id, e.target.value);
                              }
                            }}
                          >
                            <option value="">Select vehicle...</option>
                            {getAvailableVehicles().map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.registration}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {driver && (
                        <div className="job-driver">
                          <User size={12} />
                          {driver.name}
                        </div>
                      )}
                      {vehicle && (
                        <div className="job-vehicle">
                          <Truck size={12} />
                          {vehicle.registration}
                        </div>
                      )}

                      <div className="job-actions">
                        <button
                          className="action-btn next"
                          onClick={() => moveToNextStatus(job)}
                          disabled={
                            job.status === 'Delivered' ||
                            job.status === 'Cancelled'
                          }
                        >
                          <ChevronRight size={16} />
                          {job.status === 'Delivered'
                            ? 'Completed'
                            : 'Next'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {getColumnJobs(column.key).length === 0 && (
                  <div className="column-empty">No jobs</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}