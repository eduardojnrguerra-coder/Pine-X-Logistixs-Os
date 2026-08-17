import { useState, useMemo } from 'react';
import { Plus, Search, MapPin, FileCheck, FileX, Send, Clock } from 'lucide-react';
import { QUOTES, CUSTOMERS, getCustomerById, VEHICLE_TYPES, QUOTE_STATUSES, LOCATIONS } from '../data/demoData';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function Quotes() {
  const [quotes, setQuotes] = useState(QUOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [newQuote, setNewQuote] = useState({
    customerId: '',
    pickupLocation: '',
    dropoffLocation: '',
    cargo: '',
    quantity: '',
    vehicleTypeRequired: '',
    price: '',
    notes: '',
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  const filteredQuotes = quotes.filter((quote) => {
    const customer = getCustomerById(quote.customerId);
    const matchesSearch =
      searchTerm === '' ||
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuote = (e) => {
    e.preventDefault();
    const quoteNumber = `QT-${String(quotes.length + 1).padStart(4, '0')}`;
    const price = Number(newQuote.price);
    const vat = price * 0.15;
    const quote = {
      id: `Q${String(quotes.length + 1).padStart(3, '0')}`,
      quoteNumber,
      ...newQuote,
      quantity: newQuote.quantity || '1 ton',
      vehicleTypeRequired: newQuote.vehicleTypeRequired || 'Semi-Bulk',
      price,
      vat,
      total: price + vat,
      validUntil: thirtyDaysLater,
      status: 'Draft',
      createdAt: today,
    };
    setQuotes([...quotes, quote]);
    setShowCreateForm(false);
    setNewQuote({
      customerId: '',
      pickupLocation: '',
      dropoffLocation: '',
      cargo: '',
      quantity: '',
      vehicleTypeRequired: '',
      price: '',
      notes: '',
    });
  };

  const handleStatusChange = (quoteId, newStatus) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
  };

  const handleConvertToJob = (quoteId) => {
    handleStatusChange(quoteId, 'Converted');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quotes</h1>
        <p>Quote management</p>
      </div>

      <div className="page-actions">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search quotes..."
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
            {QUOTE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={18} />
          <span>{showCreateForm ? 'Cancel' : 'Create Quote'}</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="create-job-form">
          <h3>Create New Quote</h3>
          <form onSubmit={handleCreateQuote}>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={newQuote.customerId}
                  onChange={(e) => setNewQuote({ ...newQuote, customerId: e.target.value })}
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
                <select
                  value={newQuote.pickupLocation}
                  onChange={(e) => setNewQuote({ ...newQuote, pickupLocation: e.target.value })}
                  required
                >
                  <option value="">Select location...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Drop-off Location</label>
                <select
                  value={newQuote.dropoffLocation}
                  onChange={(e) => setNewQuote({ ...newQuote, dropoffLocation: e.target.value })}
                  required
                >
                  <option value="">Select location...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={newQuote.cargo}
                  onChange={(e) => setNewQuote({ ...newQuote, cargo: e.target.value })}
                  placeholder="Enter cargo description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="text"
                  value={newQuote.quantity}
                  onChange={(e) => setNewQuote({ ...newQuote, quantity: e.target.value })}
                  placeholder="e.g. 5 tons"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  value={newQuote.vehicleTypeRequired}
                  onChange={(e) => setNewQuote({ ...newQuote, vehicleTypeRequired: e.target.value })}
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
                <label>Price (R)</label>
                <input
                  type="number"
                  value={newQuote.price}
                  onChange={(e) => setNewQuote({ ...newQuote, price: e.target.value })}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={newQuote.notes}
                  onChange={(e) => setNewQuote({ ...newQuote, notes: e.target.value })}
                  placeholder="Add any notes..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                <Plus size={18} />
                Create Quote
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
                <th>Quote #</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Total</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => {
                const customer = getCustomerById(quote.customerId);
                const expired = isExpired(quote.validUntil);
                return (
                  <tr key={quote.id}>
                    <td className="quote-id">{quote.quoteNumber}</td>
                    <td>{customer?.name}</td>
                    <td className="route-cell">
                      <div className="route-info">
                        <MapPin size={12} />
                        <span>{quote.pickupLocation}</span>
                        <span className="route-arrow">→</span>
                        <MapPin size={12} />
                        <span>{quote.dropoffLocation}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cargo-cell">
                        <span>{quote.cargo}</span>
                        <span className="cargo-qty">{quote.quantity}</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <span className="total-price">R{quote.total.toLocaleString()}</span>
                      <span className="vat-included">R{quote.vat.toLocaleString()} VAT</span>
                    </td>
                    <td className={`date-cell ${expired ? 'expired' : ''}`}>
                      {formatDate(quote.validUntil)}
                      {expired && <span className="expired-badge">Expired</span>}
                    </td>
                    <td>
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="actions-cell">
                      {quote.status === 'Draft' && (
                        <button
                          className="action-btn small"
                          onClick={() => handleStatusChange(quote.id, 'Sent')}
                        >
                          <Send size={14} />
                          Send
                        </button>
                      )}
                      {quote.status === 'Sent' && (
                        <>
                          <button
                            className="action-btn small success"
                            onClick={() => handleStatusChange(quote.id, 'Accepted')}
                          >
                            <FileCheck size={14} />
                          </button>
                          <button
                            className="action-btn small danger"
                            onClick={() => handleStatusChange(quote.id, 'Rejected')}
                          >
                            <FileX size={14} />
                          </button>
                        </>
                      )}
                      {quote.status === 'Accepted' && (
                        <button
                          className="action-btn small primary"
                          onClick={() => handleConvertToJob(quote.id)}
                        >
                          <Clock size={14} />
                          Convert
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredQuotes.length === 0 && (
            <EmptyState
              title="No quotes found"
              description="Try adjusting your search or filter criteria."
            />
          )}
        </div>
      </div>
    </div>
  );
}