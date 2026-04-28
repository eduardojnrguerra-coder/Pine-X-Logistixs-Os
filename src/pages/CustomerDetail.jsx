import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, MapPin, Phone, Truck } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import MessageThread from '../components/MessageThread';
import DeliveryTimeline from '../components/DeliveryTimeline';
import ProfitabilityScore from '../components/ProfitabilityScore';
import StatusBadge from '../components/StatusBadge';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getCustomerActiveDeliveries,
  getCustomerById,
  getCustomerDisputes,
  getCustomerInvoices,
  getCustomerJobs,
  getCustomerMessages,
  getCustomerQuotes,
  getCustomerServiceHistory,
} from '../data/demoData';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, scenario } = usePresenterMode();
  const customer = data.customers.find((item) => item.id === id) || getCustomerById(id);

  if (!customer) {
    return (
      <div className="page-container">
        <EmptyState title="Customer not found" description="The selected customer record could not be found in the demo data." />
      </div>
    );
  }

  const activeJobs = getCustomerActiveDeliveries(id, data.jobs);
  const jobHistory = getCustomerJobs(id, data.jobs);
  const quotes = getCustomerQuotes(id, data.quotes);
  const invoices = getCustomerInvoices(id, data.invoices);
  const messages = getCustomerMessages(id, data.customerMessages);
  const serviceHistory = getCustomerServiceHistory(id) || {
    complaints: 0,
    disputes: 0,
    averagePaymentDelay: 0,
    routePerformance: 90,
    costToServe: Math.round(customer.totalRevenue * 0.58),
  };
  const disputes = getCustomerDisputes(id);
  const profitEstimate = Math.max(0, customer.totalRevenue - serviceHistory.costToServe);
  const score = Math.max(18, Math.min(96, 100 - serviceHistory.averagePaymentDelay - disputes.length * 8));

  return (
    <div className="page-container customer-detail-page">
      <div className="page-header">
        <div>
          <h1>{customer.companyName}</h1>
          <p>Customer profile, profitability exposure, and service history in one view.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="stats-grid reports-stats-grid">
        <div className="stat-card"><div className="stat-value">{customer.activeJobs}</div><div className="stat-label">Active Jobs</div></div>
        <div className="stat-card"><div className="stat-value">R{customer.outstandingBalance.toLocaleString()}</div><div className="stat-label">Outstanding Balance</div></div>
        <div className="stat-card"><div className="stat-value">R{profitEstimate.toLocaleString()}</div><div className="stat-label">Profit Estimate</div></div>
        <div className="stat-card"><div className="stat-value">{serviceHistory.averagePaymentDelay} days</div><div className="stat-label">Average Payment Delay</div></div>
      </div>

      <div className="reports-layout">
        <div className="reports-main-column">
          <div className="dashboard-card">
            <div className="card-header"><h3>Customer Profile</h3></div>
            <div className="sales-summary-grid">
              <div><span className="maintenance-detail-label">Contact</span><strong>{customer.contactPerson}</strong><p>{customer.email}</p><p>{customer.phone}</p></div>
              <div><span className="maintenance-detail-label">Billing address</span><p>{customer.billingAddress}</p><StatusBadge status={customer.status} /></div>
              <div><span className="maintenance-detail-label">Risk level</span><p>{customer.riskLevel}</p><p>{customer.type}</p></div>
              <div><span className="maintenance-detail-label">Account health</span><ProfitabilityScore score={score} riskLevel={customer.riskLevel} /></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Active Jobs</h3></div>
            <div className="portal-deliveries-grid">
              {activeJobs.map((job) => (
                <div key={job.id} className="portal-delivery-card">
                  <div className="portal-delivery-top">
                    <div>
                      <span className="vehicle-list-card-id">{job.jobNumber}</span>
                      <h3>{job.cargo}</h3>
                      <p>{job.pickupLocation} to {job.dropoffLocation}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <DeliveryTimeline job={job} hasInvoice={Boolean(invoices.find((item) => item.jobId === job.id))} />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Job History</h3></div>
            <div className="table-container">
              <table className="data-table full-width">
                <thead><tr><th>Job</th><th>Route</th><th>Status</th><th>Revenue</th></tr></thead>
                <tbody>
                  {jobHistory.map((job) => (
                    <tr key={job.id}>
                      <td><Link to={`/jobs/${job.id}`} className="driver-link"><Truck size={14} />{job.jobNumber}</Link></td>
                      <td>{job.pickupLocation} to {job.dropoffLocation}</td>
                      <td><StatusBadge status={job.status} /></td>
                      <td>R{job.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Quotes & Invoices</h3></div>
            <div className="customer-finance-grid">
              <div className="invoice-list">
                {quotes.map((quote) => (
                  <div key={quote.id} className="invoice-item">
                    <div className="invoice-info"><span className="invoice-id">{quote.quoteNumber}</span><span className="invoice-client">{quote.cargo}</span></div>
                    <div className="invoice-meta"><span className="invoice-amount">R{quote.total.toLocaleString()}</span><StatusBadge status={quote.status} /></div>
                  </div>
                ))}
              </div>
              <div className="invoice-list">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="invoice-item">
                    <div className="invoice-info"><span className="invoice-id">{invoice.invoiceNumber}</span><span className="invoice-client">{invoice.notes}</span></div>
                    <div className="invoice-meta"><span className="invoice-amount">R{invoice.balance.toLocaleString()}</span><StatusBadge status={invoice.status} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <MessageThread key={id} initialMessages={messages} title="Customer Messages" />
        </div>

        <div className="reports-side-column">
          <div className="dashboard-card">
            <div className="card-header"><h3>Account Health</h3></div>
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Route performance</span><strong>{serviceHistory.routePerformance}%</strong></div>
              <div className="summary-row"><span>Complaints</span><strong>{serviceHistory.complaints}</strong></div>
              <div className="summary-row"><span>Disputes</span><strong>{disputes.length}</strong></div>
              <div className="summary-row"><span>Cost to serve</span><strong>R{serviceHistory.costToServe.toLocaleString()}</strong></div>
            </div>
            <button className="action-btn small primary" onClick={() => navigate('/customer-health')}>Open customer health</button>
          </div>
          <div className="dashboard-card">
            <div className="card-header"><h3>Contact Information</h3></div>
            <div className="portal-benefits-list">
              <span><Phone size={14} /> {customer.phone}</span>
              <span><FileText size={14} /> {customer.email}</span>
              <span><MapPin size={14} /> {customer.billingAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
