import { useMemo, useState } from 'react';
import { BellRing, Download, FileText, PlusCircle, Truck } from 'lucide-react';
import MessageThread from '../components/MessageThread';
import DeliveryTimeline from '../components/DeliveryTimeline';
import PineXLogo from '../components/PineXLogo';
import StatusBadge from '../components/StatusBadge';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  CUSTOMER_DISPUTES,
  CUSTOMER_PORTAL_DOCUMENTS,
  getCustomerActiveDeliveries,
  getCustomerById,
  getCustomerInvoices,
  getCustomerMessages,
  getCustomerPortalDocuments,
  getCustomerQuotes,
  getDriverById,
  getVehicleById,
} from '../data/demoData';

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function CustomerPortal() {
  const { data, scenario } = usePresenterMode();
  const [selectedCustomerId, setSelectedCustomerId] = useState(data.customers[0]?.id || '');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [visiblePodJobId, setVisiblePodJobId] = useState('');
  const [addedMessages, setAddedMessages] = useState([]);
  const [documents, setDocuments] = useState(CUSTOMER_PORTAL_DOCUMENTS);
  const [disputes, setDisputes] = useState(CUSTOMER_DISPUTES);
  const [invoiceStatusOverrides, setInvoiceStatusOverrides] = useState({});
  const [quoteStatusOverrides, setQuoteStatusOverrides] = useState({});
  const [requestForm, setRequestForm] = useState({ pickupLocation: '', dropoffLocation: '', cargo: '', notes: '' });
  const [uploadType, setUploadType] = useState('Delivery Instructions');
  const [uploadMessage, setUploadMessage] = useState('');
  const [disputeForm, setDisputeForm] = useState({ jobId: '', reason: '', description: '', evidenceName: '' });

  const customer = data.customers.find((item) => item.id === selectedCustomerId) || getCustomerById(selectedCustomerId);
  const activeDeliveries = useMemo(() => getCustomerActiveDeliveries(selectedCustomerId, data.jobs), [data.jobs, selectedCustomerId]);
  const invoices = useMemo(
    () =>
      getCustomerInvoices(
        selectedCustomerId,
        data.invoices.map((invoice) =>
          invoiceStatusOverrides[invoice.id]
            ? { ...invoice, ...invoiceStatusOverrides[invoice.id] }
            : invoice
        )
      ),
    [data.invoices, invoiceStatusOverrides, selectedCustomerId]
  );
  const messages = useMemo(
    () => getCustomerMessages(selectedCustomerId, [...data.customerMessages, ...addedMessages]),
    [addedMessages, data.customerMessages, selectedCustomerId]
  );
  const documentsForCustomer = useMemo(() => getCustomerPortalDocuments(selectedCustomerId, documents), [documents, selectedCustomerId]);
  const quotes = useMemo(
    () =>
      getCustomerQuotes(
        selectedCustomerId,
        data.quotes.map((quote) =>
          quoteStatusOverrides[quote.id] ? { ...quote, ...quoteStatusOverrides[quote.id] } : quote
        )
      ),
    [data.quotes, quoteStatusOverrides, selectedCustomerId]
  );
  const customerDisputes = disputes.filter((item) => item.customerId === selectedCustomerId);

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    setRequestSubmitted(true);
    setShowRequestForm(false);
    setRequestForm({ pickupLocation: '', dropoffLocation: '', cargo: '', notes: '' });
  };

  const handleDocumentUpload = () => {
    setDocuments((prev) => [
      {
        id: `DOC-UP-${prev.length + 1}`,
        customerId: selectedCustomerId,
        jobId: activeDeliveries[0]?.id || null,
        type: uploadType,
        fileName: `${uploadType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        status: 'Available',
      },
      ...prev,
    ]);
    setUploadMessage(`${uploadType} uploaded successfully in demo mode.`);
  };

  const handleDisputeSubmit = (event) => {
    event.preventDefault();
    setDisputes((prev) => [
      {
        id: `DSP-LOCAL-${prev.length + 1}`,
        customerId: selectedCustomerId,
        jobId: disputeForm.jobId,
        reason: disputeForm.reason,
        description: disputeForm.description,
        evidenceName: disputeForm.evidenceName,
        status: 'Open',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setDisputeForm({ jobId: '', reason: '', description: '', evidenceName: '' });
  };

  return (
    <div className="page-container customer-portal-page">
      <div className="page-header">
        <div className="branded-page-title">
          <PineXLogo className="page-logo-badge" subtitle="Customer Portal" />
          <div>
            <h1>Customer Portal</h1>
            <p>Self-service delivery visibility, dispute handling, quote actions, and invoice follow-through.</p>
          </div>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="portal-shell">
        <div className="portal-sidebar-card">
          <span className="maintenance-detail-label">Viewing portal for</span>
          <select value={selectedCustomerId} onChange={(event) => setSelectedCustomerId(event.target.value)} className="filter-select">
            {data.customers.map((item) => <option key={item.id} value={item.id}>{item.companyName}</option>)}
          </select>
          <div className="portal-customer-summary">
            <h3>{customer?.companyName}</h3>
            <p>{customer?.contactPerson}</p>
            <p>{customer?.email}</p>
            <p>{customer?.phone}</p>
          </div>
          <button className="primary-button" onClick={() => setShowRequestForm((prev) => !prev)}>
            <PlusCircle size={16} />
            <span>{showRequestForm ? 'Close request form' : 'Request new delivery'}</span>
          </button>
          {requestSubmitted && <div className="portal-success-banner">Your delivery request was captured and sent to operations.</div>}
        </div>

        <div className="portal-main-column">
          {showRequestForm && (
            <div className="dashboard-card">
              <div className="card-header"><h3>Request a new delivery</h3></div>
              <form className="form-grid" onSubmit={handleRequestSubmit}>
                <div className="form-group"><label>Pickup location</label><input type="text" value={requestForm.pickupLocation} onChange={(event) => setRequestForm({ ...requestForm, pickupLocation: event.target.value })} required /></div>
                <div className="form-group"><label>Drop-off location</label><input type="text" value={requestForm.dropoffLocation} onChange={(event) => setRequestForm({ ...requestForm, dropoffLocation: event.target.value })} required /></div>
                <div className="form-group"><label>Cargo</label><input type="text" value={requestForm.cargo} onChange={(event) => setRequestForm({ ...requestForm, cargo: event.target.value })} required /></div>
                <div className="form-group full-width"><label>Notes</label><textarea value={requestForm.notes} onChange={(event) => setRequestForm({ ...requestForm, notes: event.target.value })} /></div>
                <div className="form-actions"><button type="submit" className="primary-button">Submit delivery request</button></div>
              </form>
            </div>
          )}

          <div className="dashboard-card">
            <div className="card-header"><h3>Active Deliveries</h3></div>
            <div className="portal-deliveries-grid">
              {activeDeliveries.map((job) => {
                const driver = getDriverById(job.assignedDriverId);
                const vehicle = getVehicleById(job.assignedVehicleId);
                const linkedInvoice = invoices.find((invoice) => invoice.jobId === job.id);
                return (
                  <div key={job.id} className="portal-delivery-card">
                    <div className="portal-delivery-top">
                      <div>
                        <span className="vehicle-list-card-id">{job.jobNumber}</span>
                        <h3>{job.cargo}</h3>
                        <p>{job.pickupLocation} to {job.dropoffLocation}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="portal-delivery-meta">
                      <span><strong>ETA:</strong> {formatDateTime(job.deliveryDeadline)}</span>
                      <span><strong>Driver:</strong> {driver?.name || 'Assigning'}</span>
                      <span><strong>Vehicle:</strong> {vehicle?.registration || 'Assigning'}</span>
                    </div>
                    <DeliveryTimeline job={job} hasInvoice={Boolean(linkedInvoice)} />
                    <div className="portal-delivery-actions">
                      <button className="action-btn small" onClick={() => setVisiblePodJobId((prev) => (prev === job.id ? '' : job.id))}>
                        View proof of delivery
                      </button>
                    </div>
                    {visiblePodJobId === job.id && (
                      <div className="pod-placeholder">
                        POD placeholder visible. Download action is available in the documents panel.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Documents & PODs</h3></div>
            <div className="sales-summary-grid">
              <div>
                <span className="maintenance-detail-label">Upload document mock</span>
                <select value={uploadType} onChange={(event) => setUploadType(event.target.value)} className="filter-select">
                  <option>Delivery Instructions</option>
                  <option>Purchase Order</option>
                  <option>Site Access Document</option>
                  <option>Signed Delivery Note</option>
                </select>
                <button className="action-btn small primary" onClick={handleDocumentUpload}>Upload document</button>
                {uploadMessage && <p>{uploadMessage}</p>}
              </div>
              <div className="invoice-list">
                {documentsForCustomer.map((doc) => (
                  <div key={doc.id} className="invoice-item">
                    <div className="invoice-info">
                      <span className="invoice-id">{doc.type}</span>
                      <span className="invoice-client">{doc.fileName}</span>
                    </div>
                    <div className="invoice-meta">
                      <StatusBadge status={doc.status} />
                      <button className="action-btn small" onClick={() => setUploadMessage(`${doc.fileName} downloaded in demo mode.`)}>
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Invoice Payment Tracking & Quotes</h3></div>
            <div className="customer-finance-grid">
              <div className="invoice-list">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="invoice-item">
                    <div className="invoice-info">
                      <span className="invoice-id">{invoice.invoiceNumber}</span>
                      <span className="invoice-client">{invoice.status}</span>
                    </div>
                    <div className="invoice-meta">
                      <span className="invoice-amount">R{invoice.balance.toLocaleString()}</span>
                      <button
                        className="action-btn small"
                        onClick={() =>
                          setInvoiceStatusOverrides((prev) => ({
                            ...prev,
                            [invoice.id]: {
                              status: 'Part Paid',
                              notes: `${invoice.notes} Payment sent confirmation recorded.`,
                            },
                          }))
                        }
                      >
                        Mark payment sent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="invoice-list">
                {quotes.map((quote) => (
                  <div key={quote.id} className="invoice-item">
                    <div className="invoice-info">
                      <span className="invoice-id">{quote.quoteNumber}</span>
                      <span className="invoice-client">{quote.cargo}</span>
                    </div>
                    <div className="invoice-meta">
                      <span className="invoice-amount">R{quote.total.toLocaleString()}</span>
                      <div className="sync-log-actions">
                        <button className="action-btn small primary" onClick={() => setQuoteStatusOverrides((prev) => ({ ...prev, [quote.id]: { status: 'Accepted' } }))}>
                          Approve
                        </button>
                        <button className="action-btn small" onClick={() => setQuoteStatusOverrides((prev) => ({ ...prev, [quote.id]: { status: 'Rejected' } }))}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h3>Disputes</h3></div>
            <form className="form-grid" onSubmit={handleDisputeSubmit}>
              <div className="form-group">
                <label>Job</label>
                <select value={disputeForm.jobId} onChange={(event) => setDisputeForm({ ...disputeForm, jobId: event.target.value })} required>
                  <option value="">Select job</option>
                  {activeDeliveries.map((job) => <option key={job.id} value={job.id}>{job.jobNumber}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Reason</label><input type="text" value={disputeForm.reason} onChange={(event) => setDisputeForm({ ...disputeForm, reason: event.target.value })} required /></div>
              <div className="form-group"><label>Upload evidence mock</label><input type="text" value={disputeForm.evidenceName} onChange={(event) => setDisputeForm({ ...disputeForm, evidenceName: event.target.value })} placeholder="photo.jpg" /></div>
              <div className="form-group full-width"><label>Description</label><textarea value={disputeForm.description} onChange={(event) => setDisputeForm({ ...disputeForm, description: event.target.value })} required /></div>
              <div className="form-actions"><button type="submit" className="primary-button">Submit dispute</button></div>
            </form>
            <div className="invoice-list">
              {customerDisputes.map((dispute) => (
                <div key={dispute.id} className="invoice-item">
                  <div className="invoice-info">
                    <span className="invoice-id">{dispute.reason}</span>
                    <span className="invoice-client">{dispute.description}</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-amount">{dispute.evidenceName || 'No file'}</span>
                    <StatusBadge status={dispute.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MessageThread
            key={selectedCustomerId}
            threadId="portal-thread"
            title="Message Operations"
            initialMessages={messages}
            sendLabel="Send to operations"
            composerAuthor={customer?.contactPerson || 'Customer'}
            composerType="customer"
            placeholder="Ask for an ETA update, invoice copy, or delivery note..."
            onMessagesChange={(nextThread) =>
              setAddedMessages((prev) => [
                ...prev.filter((item) => item.customerId !== selectedCustomerId),
                ...nextThread
                  .filter((item) => String(item.id).startsWith('LOCAL-'))
                  .map((item) => ({ ...item, customerId: selectedCustomerId })),
              ])
            }
          />
        </div>

        <div className="portal-side-column">
          <div className="dashboard-card">
            <div className="card-header"><h3>Portal Highlights</h3></div>
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Active deliveries</span><strong>{activeDeliveries.length}</strong></div>
              <div className="summary-row"><span>Open invoices</span><strong>{invoices.filter((invoice) => invoice.status !== 'Paid').length}</strong></div>
              <div className="summary-row"><span>Outstanding balance</span><strong>R{(customer?.outstandingBalance || 0).toLocaleString()}</strong></div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header"><h3>Portal Benefits</h3></div>
            <div className="portal-benefits-list">
              <span><Truck size={14} /> Live delivery visibility</span>
              <span><BellRing size={14} /> Direct dispute and message flow</span>
              <span><FileText size={14} /> Invoice, quote, and POD actions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
