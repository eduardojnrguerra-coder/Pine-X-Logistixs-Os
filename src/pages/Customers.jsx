import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import CustomerCard from '../components/CustomerCard';
import {
  CUSTOMERS,
  CUSTOMER_RISK_LEVELS,
  CUSTOMER_STATUSES,
  getCustomerLatestDelivery,
} from '../data/demoData';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const filteredCustomers = useMemo(
    () =>
      CUSTOMERS.filter((customer) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          searchTerm === '' ||
          customer.companyName.toLowerCase().includes(query) ||
          customer.contactPerson.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query);
        const matchesStatus = statusFilter === '' || customer.status === statusFilter;
        const matchesRisk = riskFilter === '' || customer.riskLevel === riskFilter;
        return matchesSearch && matchesStatus && matchesRisk;
      }),
    [riskFilter, searchTerm, statusFilter]
  );

  return (
    <div className="page-container customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <p>Internal customer management with delivery activity, revenue exposure, and relationship risk visibility.</p>
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="filter-select">
            <option value="">All statuses</option>
            {CUSTOMER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} className="filter-select">
            <option value="">All risk levels</option>
            {CUSTOMER_RISK_LEVELS.map((riskLevel) => (
              <option key={riskLevel} value={riskLevel}>
                {riskLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="customer-card-grid">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            latestDelivery={getCustomerLatestDelivery(customer.id)}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <EmptyState
          title="No customers found"
          description="Adjust the search or risk filters to see more customer accounts."
        />
      )}
    </div>
  );
}
