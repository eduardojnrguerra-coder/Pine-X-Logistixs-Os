import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Truck, 
  Package, 
  DollarSign,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { getJobById, getCustomerById, getDriverById, getVehicleById, JOBS } from '../data/demoData';
import StatusBadge from '../components/StatusBadge';

const STATUS_TIMELINE = [
  'Draft', 'Quoted', 'Approved', 'Scheduled', 'Dispatched', 'On Route', 
  'At Pickup', 'Loaded', 'At Dropoff', 'Delivered', 'Delayed', 'Cancelled'
];

export default function JobDetail() {
  const { id } = useParams();
  const job = getJobById(id);
  const [jobs, setJobs] = useState(JOBS);
  
  if (!job) {
    return (
      <div className="page-container">
        <div className="page-header">
          <Link to="/jobs" className="back-link">
            <ArrowLeft size={18} />
            Back to Jobs
          </Link>
          <h1>Job Not Found</h1>
          <p>The requested job could not be found.</p>
        </div>
      </div>
    );
  }

  const currentJob = jobs.find((j) => j.id === id) || job;
  const customer = getCustomerById(currentJob.customerId);
  const driver = currentJob.assignedDriverId ? getDriverById(currentJob.assignedDriverId) : null;
  const vehicle = currentJob.assignedVehicleId ? getVehicleById(currentJob.assignedVehicleId) : null;

  const profit = currentJob.price - currentJob.estimatedCost;
  const profitMargin = ((profit / currentJob.price) * 100).toFixed(1);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-ZA', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStatusChange = (newStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
  };

  const getNextStatus = () => {
    const idx = STATUS_TIMELINE.indexOf(currentJob.status);
    if (idx >= 0 && idx < STATUS_TIMELINE.length - 1) {
      return STATUS_TIMELINE[idx + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="job-detail-page">
      <div className="page-header">
        <Link to="/jobs" className="back-link">
          <ArrowLeft size={18} />
          Back to Jobs
        </Link>
        <div className="header-main">
          <h1>Job {currentJob.jobNumber}</h1>
          <StatusBadge status={currentJob.status} />
        </div>
        <div className="header-meta">
          <span className="job-date">{formatDate(currentJob.pickupTime)}</span>
          <span className={`priority-tag ${currentJob.priority.toLowerCase()}`}>
            {currentJob.priority} Priority
          </span>
        </div>
      </div>

      <div className="job-detail-grid">
        <div className="detail-section customer-section">
          <h3>
            <User size={18} />
            Customer
          </h3>
          <div className="customer-info">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{customer?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact</span>
              <span className="info-value">{customer?.contact}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{customer?.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{customer?.email}</span>
            </div>
          </div>
        </div>

        <div className="detail-section route-section">
          <h3>
            <MapPin size={18} />
            Route
          </h3>
          <div className="route-display">
            <div className="route-point pickup">
              <MapPin size={20} />
              <div className="point-info">
                <span className="point-label">Pickup</span>
                <span className="point-location">{currentJob.pickupLocation}</span>
                <span className="point-time">{formatDate(currentJob.pickupTime)}</span>
              </div>
            </div>
            <div className="route-line"></div>
            <div className="route-point dropoff">
              <MapPin size={20} />
              <div className="point-info">
                <span className="point-label">Drop-off</span>
                <span className="point-location">{currentJob.dropoffLocation}</span>
                <span className="point-time">{formatDate(currentJob.deliveryDeadline)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section cargo-section">
          <h3>
            <Package size={18} />
            Cargo
          </h3>
          <div className="cargo-info">
            <div className="info-row">
              <span className="info-label">Description</span>
              <span className="info-value">{currentJob.cargo}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Quantity</span>
              <span className="info-value">{currentJob.quantity}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Vehicle Type</span>
              <span className="info-value">{currentJob.vehicleTypeRequired}</span>
            </div>
          </div>
        </div>

        <div className="detail-section assignment-section">
          <h3>
            <Truck size={18} />
            Assignment
          </h3>
          <div className="assignment-info">
            {driver ? (
              <div className="assigned-item">
                <User size={18} />
                <div className="assigned-info">
                  <span className="assigned-label">Driver</span>
                  <span className="assigned-name">{driver.name}</span>
                </div>
              </div>
            ) : (
              <div className="unassigned">
                <AlertTriangle size={18} />
                <span>No driver assigned</span>
              </div>
            )}
            {vehicle ? (
              <div className="assigned-item">
                <Truck size={18} />
                <div className="assigned-info">
                  <span className="assigned-label">Vehicle</span>
                  <span className="assigned-name">{vehicle.registration}</span>
                  <span className="assigned-detail">{vehicle.type}</span>
                </div>
              </div>
            ) : (
              <div className="unassigned">
                <AlertTriangle size={18} />
                <span>No vehicle assigned</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section pricing-section">
          <h3>
            <DollarSign size={18} />
            Pricing
          </h3>
          <div className="pricing-info">
            <div className="pricing-row">
              <span className="pricing-label">Price</span>
              <span className="pricing-value">R{currentJob.price.toLocaleString()}</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-label">Est. Cost</span>
              <span className="pricing-value cost">R{currentJob.estimatedCost.toLocaleString()}</span>
            </div>
            <div className="pricing-row total">
              <span className="pricing-label">Profit</span>
              <span className={`pricing-value profit ${profit > 0 ? 'positive' : 'negative'}`}>
                R{profit.toLocaleString()} ({profitMargin}%)
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section status-section">
          <h3>
            <Clock size={18} />
            Status Timeline
          </h3>
          <div className="status-timeline">
            {STATUS_TIMELINE.map((status, idx) => {
              const isCompleted = STATUS_TIMELINE.indexOf(currentJob.status) > idx;
              const isCurrent = currentJob.status === status;
              return (
                <div
                  key={status}
                  className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="step-indicator">
                    {isCompleted ? <CheckCircle size={16} /> : isCurrent ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                  </div>
                  <span className="step-label">{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="detail-section notes-section">
          <h3>
            <FileText size={18} />
            Notes
          </h3>
          <div className="notes-content">
            {currentJob.notes || 'No notes added'}
          </div>
        </div>
      </div>

      <div className="job-detail-actions">
        {nextStatus && nextStatus !== 'Cancelled' && (
          <button 
            className="primary-button"
            onClick={() => handleStatusChange(nextStatus)}
          >
            <PlayCircle size={18} />
            Move to {nextStatus}
          </button>
        )}
        {currentJob.status !== 'Cancelled' && (
          <button 
            className="secondary-button danger"
            onClick={() => handleStatusChange('Cancelled')}
          >
            <XCircle size={18} />
            Cancel Job
          </button>
        )}
      </div>
    </div>
  );
}