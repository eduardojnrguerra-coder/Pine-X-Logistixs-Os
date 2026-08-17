import { Link } from 'react-router-dom';
import { MapPin, Clock, Truck, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getCustomerById, getDriverById, getVehicleById } from '../data/demoData';

export default function JobCard({ job, compact = false }) {
  const customer = getCustomerById(job.customerId);
  const driver = job.assignedDriverId ? getDriverById(job.assignedDriverId) : null;
  const vehicle = job.assignedVehicleId ? getVehicleById(job.assignedVehicleId) : null;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  };
  
  const profit = job.price - job.estimatedCost;
  
  if (compact) {
    return (
      <Link to={`/jobs/${job.id}`} className="job-card-compact">
        <div className="job-card-compact-header">
          <span className="job-number">{job.jobNumber}</span>
          <StatusBadge status={job.status} />
        </div>
        <div className="job-card-compact-customer">{customer?.name}</div>
        <div className="job-card-compact-route">
          <MapPin size={12} />
          <span>{job.pickupLocation}</span>
          <span className="arrow">→</span>
          <MapPin size={12} />
          <span>{job.dropoffLocation}</span>
        </div>
      </Link>
    );
  }
  
  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <span className="job-number">{job.jobNumber}</span>
        <StatusBadge status={job.status} />
      </div>
      
      <div className="job-card-customer">{customer?.name}</div>
      
      <div className="job-card-route">
        <div className="route-point">
          <MapPin size={14} />
          <span>{job.pickupLocation}</span>
        </div>
        <div className="route-arrow">↓</div>
        <div className="route-point">
          <MapPin size={14} />
          <span>{job.dropoffLocation}</span>
        </div>
      </div>
      
      <div className="job-card-details">
        <div className="detail-row">
          <span className="detail-label">Cargo</span>
          <span className="detail-value">{job.cargo}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Quantity</span>
          <span className="detail-value">{job.quantity}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Price</span>
          <span className="detail-value price">R{job.price.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Profit</span>
          <span className={`detail-value profit ${profit > 0 ? 'positive' : 'negative'}`}>
            R{profit.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="job-card-assignments">
        {driver && (
          <div className="assignment">
            <User size={14} />
            <span>{driver.name}</span>
          </div>
        )}
        {vehicle && (
          <div className="assignment">
            <Truck size={14} />
            <span>{vehicle.registration}</span>
          </div>
        )}
      </div>
      
      <div className="job-card-footer">
        <div className="time-info">
          <Clock size={14} />
          <span>{formatDate(job.pickupTime)} - {formatDate(job.deliveryDeadline)}</span>
        </div>
        <span className={`priority-tag ${job.priority.toLowerCase()}`}>
          {job.priority}
        </span>
      </div>
    </Link>
  );
}