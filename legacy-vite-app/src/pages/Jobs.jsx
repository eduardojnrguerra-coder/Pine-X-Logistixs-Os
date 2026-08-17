import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { JOBS, CUSTOMERS, getCustomerById, VEHICLE_TYPES, JOB_STATUSES, PRIORITIES } from '../data/demoData';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function Jobs() {
  const [jobs, setJobs] = useState(JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newJob, setNewJob] = useState({
    customerId: '',
    pickupLocation: '',
    dropoffLocation: '',
    cargo: '',
    quantity: '',
    vehicleTypeRequired: '',
    pickupTime: '',
    deliveryDeadline: '',
    priority: 'Medium',
    price: '',
    notes: '',
  });

  const filteredJobs = jobs.filter((job) => {
    const customer = getCustomerById(job.customerId);
    const matchesSearch =
      searchTerm === '' ||
      job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || job.status === statusFilter;
    const matchesPriority = priorityFilter === '' || job.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    const jobNumber = `PX${String(jobs.length + 1).padStart(4, '0')}`;
    const newJobObj = {
      id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
      jobNumber,
      ...newJob,
      quantity: newJob.quantity || '1 ton',
      assignedVehicleId: null,
      assignedDriverId: null,
      status: 'Draft',
      estimatedCost: Math.round(newJob.price * 0.7),
    };
    setJobs([...jobs, newJobObj]);
    setShowCreateForm(false);
    setNewJob({
      customerId: '',
      pickupLocation: '',
      dropoffLocation: '',
      cargo: '',
      quantity: '',
      vehicleTypeRequired: '',
      pickupTime: '',
      deliveryDeadline: '',
      priority: 'Medium',
      price: '',
      notes: '',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Jobs</h1>
        <p>Job management</p>
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search jobs..."
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
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={18} />
          <span>{showCreateForm ? 'Cancel' : 'Create Job'}</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="create-job-form">
          <h3>Create New Job</h3>
          <form onSubmit={handleCreateJob}>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={newJob.customerId}
                  onChange={(e) => setNewJob({ ...newJob, customerId: e.target.value })}
                  required
                >
                  <option value="">Select customer...</option>
                  {CUSTOMERS.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  value={newJob.pickupLocation}
                  onChange={(e) => setNewJob({ ...newJob, pickupLocation: e.target.value })}
                  placeholder="Enter pickup location"
                  required
                />
              </div>
              <div className="form-group">
                <label>Drop-off Location</label>
                <input
                  type="text"
                  value={newJob.dropoffLocation}
                  onChange={(e) => setNewJob({ ...newJob, dropoffLocation: e.target.value })}
                  placeholder="Enter drop-off location"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={newJob.cargo}
                  onChange={(e) => setNewJob({ ...newJob, cargo: e.target.value })}
                  placeholder="Enter cargo description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="text"
                  value={newJob.quantity}
                  onChange={(e) => setNewJob({ ...newJob, quantity: e.target.value })}
                  placeholder="e.g. 5 tons"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type Required</label>
                <select
                  value={newJob.vehicleTypeRequired}
                  onChange={(e) => setNewJob({ ...newJob, vehicleTypeRequired: e.target.value })}
                >
                  <option value="">Select type...</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Pickup Date/Time</label>
                <input
                  type="datetime-local"
                  value={newJob.pickupTime}
                  onChange={(e) => setNewJob({ ...newJob, pickupTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Delivery Deadline</label>
                <input
                  type="datetime-local"
                  value={newJob.deliveryDeadline}
                  onChange={(e) => setNewJob({ ...newJob, deliveryDeadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newJob.priority}
                  onChange={(e) => setNewJob({ ...newJob, priority: e.target.value })}
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (R)</label>
                <input
                  type="number"
                  value={newJob.price}
                  onChange={(e) => setNewJob({ ...newJob, price: Number(e.target.value) })}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                  placeholder="Add any notes..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                <Plus size={18} />
                Create Job
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="page-card">
        <div className="table-container">
          <table className="data-table full-width">
            <thead>
              <tr>
                <th>Job #</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => {
                const customer = getCustomerById(job.customerId);
                return (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} className="job-id-link">
                        {job.jobNumber}
                      </Link>
                    </td>
                    <td>{customer?.name}</td>
                    <td className="route-cell">
                      <div className="route-info">
                        <MapPin size={12} />
                        <span>{job.pickupLocation}</span>
                        <span className="route-arrow">→</span>
                        <MapPin size={12} />
                        <span>{job.dropoffLocation}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cargo-cell">
                        <span>{job.cargo}</span>
                        <span className="cargo-qty">{job.quantity}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <span className={`priority-badge ${job.priority.toLowerCase()}`}>
                        {job.priority}
                      </span>
                    </td>
                    <td className="price-cell">R{job.price.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredJobs.length === 0 && (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your search or filter criteria."
            />
          )}
        </div>
      </div>
    </div>
  );
}