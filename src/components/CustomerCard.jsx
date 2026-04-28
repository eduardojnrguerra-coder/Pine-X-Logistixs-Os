import { Link } from 'react-router-dom';
import { ArrowRight, CircleDollarSign, Truck, TriangleAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

const riskClassMap = {
  Low: 'muted',
  Medium: '',
  High: 'critical',
  Critical: 'critical',
};

export default function CustomerCard({ customer, latestDelivery }) {
  return (
    <div className="customer-card">
      <div className="customer-card-top">
        <div>
          <div className="vehicle-list-card-id">{customer.type}</div>
          <h3>{customer.companyName}</h3>
          <p>{customer.contactPerson}</p>
        </div>
        <StatusBadge status={customer.status} />
      </div>

      <div className="customer-card-metrics">
        <div>
          <span className="maintenance-detail-label">Active jobs</span>
          <strong>{customer.activeJobs}</strong>
        </div>
        <div>
          <span className="maintenance-detail-label">Completed jobs</span>
          <strong>{customer.completedJobs}</strong>
        </div>
        <div>
          <span className="maintenance-detail-label">Outstanding</span>
          <strong>R{customer.outstandingBalance.toLocaleString()}</strong>
        </div>
        <div>
          <span className="maintenance-detail-label">Revenue</span>
          <strong>R{customer.totalRevenue.toLocaleString()}</strong>
        </div>
      </div>

      <div className="customer-card-details">
        <span className={`warning-badge ${riskClassMap[customer.riskLevel]}`}>
          <TriangleAlert size={14} />
          {customer.riskLevel} risk
        </span>
        <span className="maintenance-meta-item">
          <Truck size={14} />
          Latest delivery: {latestDelivery?.jobNumber || 'No recent delivery'}
        </span>
        <span className="maintenance-meta-item">
          <CircleDollarSign size={14} />
          Balance R{customer.outstandingBalance.toLocaleString()}
        </span>
      </div>

      <div className="customer-card-footer">
        <p>{customer.notes}</p>
        <Link to={`/customers/${customer.id}`} className="action-btn small primary customer-card-link">
          View details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
