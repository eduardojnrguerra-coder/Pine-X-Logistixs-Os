import { useState, useMemo } from 'react';
import { Plus, Search, DollarSign, FileCheck, AlertTriangle, CreditCard } from 'lucide-react';
import { INVOICES, JOBS, getCustomerById, getJobById, INVOICE_STATUSES } from '../data/demoData';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function Invoices() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);
  const deliveredJobs = useMemo(() => JOBS.filter((j) => j.status === 'Delivered'), []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Paid' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const customer = getCustomerById(invoice.customerId);
    const job = invoice.jobId ? getJobById(invoice.jobId) : null;
    const matchesSearch =
      searchTerm === '' ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job && job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const job = deliveredJobs.find((j) => j.id === selectedJob);
    if (!job) return;

    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(4, '0')}`;
    const price = job.price;
    const vat = price * 0.15;
    
    const invoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceNumber,
      customerId: job.customerId,
      jobId: selectedJob,
      issueDate: today,
      dueDate: thirtyDaysLater,
      subtotal: price,
      vat,
      total: price + vat,
      paidAmount: 0,
      balance: price + vat,
      status: 'Draft',
      notes: `Invoice for ${job.jobNumber}`,
    };
    setInvoices([...invoices, invoice]);
    setShowCreateForm('');
    setSelectedJob('');
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    );
  };

  const handleRecordPayment = (invoiceId) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    const amount = Number(paymentAmount);
    const newPaidAmount = invoice.paidAmount + amount;
    const newBalance = invoice.total - newPaidAmount;
    
    let newStatus = invoice.status;
    if (newPaidAmount >= invoice.total) {
      newStatus = 'Paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'Part Paid';
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, paidAmount: newPaidAmount, balance: Math.max(0, newBalance), status: newStatus }
          : inv
      )
    );
    setShowPaymentModal('');
    setPaymentAmount('');
  };

  const pendingInvoices = invoices.filter((inv) => inv.status !== 'Paid' && inv.status !== 'Cancelled');
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueInvoices = pendingInvoices.filter((inv) => isOverdue(inv.dueDate, inv.status));
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoices</h1>
        <p>Invoice management</p>
      </div>

      <div className="finance-summary-bar">
        <div className="summary-item">
          <DollarSign size={20} />
          <div className="summary-info">
            <span className="summary-value">R{totalOutstanding.toLocaleString()}</span>
            <span className="summary-label">Outstanding</span>
          </div>
        </div>
        <div className="summary-item overdue">
          <AlertTriangle size={20} />
          <div className="summary-info">
            <span className="summary-value">R{totalOverdue.toLocaleString()}</span>
            <span className="summary-label">Overdue</span>
          </div>
        </div>
        <div className="summary-item">
          <FileCheck size={20} />
          <div className="summary-info">
            <span className="summary-value">
              R{invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString()}
            </span>
            <span className="summary-label">Paid MTD</span>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search invoices..."
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
            {INVOICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button" onClick={() => setShowCreateForm('job')}>
          <Plus size={18} />
          <span>Create from Job</span>
        </button>
      </div>

      {showCreateForm === 'job' && (
        <div className="create-job-form">
          <h3>Create Invoice from Job</h3>
          <form onSubmit={handleCreateInvoice}>
            <div className="form-grid">
              <div className="form-group">
                <label>Select Delivered Job</label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                >
                  <option value="">Select job...</option>
                  {deliveredJobs.map((job) => {
                    const customer = getCustomerById(job.customerId);
                    return (
                      <option key={job.id} value={job.id}>
                        {job.jobNumber} - {customer?.name} - R{job.price.toLocaleString()}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                <Plus size={18} />
                Create Invoice
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowCreateForm('')}>
                Cancel
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
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Job</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const customer = getCustomerById(invoice.customerId);
                const job = invoice.jobId ? getJobById(invoice.jobId) : null;
                const overdue = isOverdue(invoice.dueDate, invoice.status);
                return (
                  <tr key={invoice.id} className={overdue ? 'overdue-row' : ''}>
                    <td className="invoice-id">{invoice.invoiceNumber}</td>
                    <td>{customer?.name}</td>
                    <td className="job-cell">{job?.jobNumber || '-'}</td>
                    <td className="date-cell">{formatDate(invoice.issueDate)}</td>
                    <td className={`date-cell ${overdue ? 'overdue' : ''}`}>
                      {formatDate(invoice.dueDate)}
                      {overdue && <span className="overdue-badge">OVERDUE</span>}
                    </td>
                    <td className="price-cell">R{invoice.total.toLocaleString()}</td>
                    <td className="price-cell paid">R{invoice.paidAmount.toLocaleString()}</td>
                    <td className={`price-cell ${invoice.balance > 0 ? 'balance' : 'balance-paid'}`}>
                      R{invoice.balance.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge
                        status={overdue && invoice.status !== 'Part Paid' ? 'Overdue' : invoice.status}
                      />
                    </td>
                    <td className="actions-cell">
                      {invoice.status === 'Draft' && (
                        <button
                          className="action-btn small"
                          onClick={() => handleStatusChange(invoice.id, 'Sent')}
                        >
                          Send
                        </button>
                      )}
                      {invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && (
                        <button
                          className="action-btn small success"
                          onClick={() => setShowPaymentModal(invoice.id)}
                        >
                          <CreditCard size={14} />
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <EmptyState
              title="No invoices found"
              description="Try adjusting your search or filter criteria."
            />
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="pod-modal">
          <div className="pod-content">
            <h3>Record Payment</h3>
            <div className="pod-section">
              <label>Invoice</label>
              <p>{invoices.find((inv) => inv.id === showPaymentModal)?.invoiceNumber}</p>
            </div>
            <div className="pod-section">
              <label>Outstanding Balance</label>
              <p className="amount">
                R{invoices.find((inv) => inv.id === showPaymentModal)?.balance.toLocaleString()}
              </p>
            </div>
            <div className="pod-section">
              <label>Payment Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="pod-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowPaymentModal('');
                  setPaymentAmount('');
                }}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={() => handleRecordPayment(showPaymentModal)}
                disabled={!paymentAmount || Number(paymentAmount) <= 0}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}