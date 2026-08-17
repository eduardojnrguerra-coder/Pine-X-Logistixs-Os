const statusConfig = {
  Draft: { color: '#94a3b8', bg: '#f1f5f9' },
  Quoted: { color: '#8b5cf6', bg: '#ede9fe' },
  Approved: { color: '#3b82f6', bg: '#dbeafe' },
  Scheduled: { color: '#06b6d4', bg: '#cffafe' },
  Dispatched: { color: '#0ea5e9', bg: '#e0f2fe' },
  'On Route': { color: '#f59e0b', bg: '#fef3c7' },
  'At Pickup': { color: '#ec4899', bg: '#fce7f3' },
  Loaded: { color: '#10b981', bg: '#d1fae5' },
  'At Dropoff': { color: '#f97316', bg: '#ffedd5' },
  Delivered: { color: '#22c55e', bg: '#dcfce7' },
  Delayed: { color: '#ef4444', bg: '#fee2e2' },
  Cancelled: { color: '#6b7280', bg: '#e5e7eb' },
  Invoiced: { color: '#6366f1', bg: '#e0e7ff' },
  Paid: { color: '#14b8a6', bg: '#ccfbf1' },
  Open: { color: '#f97316', bg: '#ffedd5' },
  'In Progress': { color: '#8b5cf6', bg: '#ede9fe' },
  Overdue: { color: '#dc2626', bg: '#fee2e2' },
  New: { color: '#2563eb', bg: '#dbeafe' },
  Acknowledged: { color: '#f59e0b', bg: '#fef3c7' },
  Resolved: { color: '#10b981', bg: '#d1fae5' },
  Info: { color: '#0ea5e9', bg: '#e0f2fe' },
  Warning: { color: '#d97706', bg: '#fef3c7' },
  Critical: { color: '#dc2626', bg: '#fee2e2' },
  'Part Paid': { color: '#d97706', bg: '#fef3c7' },
  Sent: { color: '#2563eb', bg: '#dbeafe' },
  Rejected: { color: '#dc2626', bg: '#fee2e2' },
  Expired: { color: '#6b7280', bg: '#e5e7eb' },
  Converted: { color: '#7c3aed', bg: '#ede9fe' },
  Active: { color: '#22c55e', bg: '#dcfce7' },
  Idle: { color: '#f59e0b', bg: '#fef3c7' },
  Maintenance: { color: '#ef4444', bg: '#fee2e2' },
  Offline: { color: '#6b7280', bg: '#e5e7eb' },
  Available: { color: '#22c55e', bg: '#dcfce7' },
  'On Duty': { color: '#3b82f6', bg: '#dbeafe' },
  'Off Duty': { color: '#6b7280', bg: '#e5e7eb' },
  'On Leave': { color: '#8b5cf6', bg: '#ede9fe' },
  'At Risk': { color: '#dc2626', bg: '#fee2e2' },
  'On Hold': { color: '#d97706', bg: '#fef3c7' },
};

export default function StatusBadge({ status, _type }) {
  const config = statusConfig[status] || { color: '#6b7280', bg: '#f3f4f6' };
  
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {status}
    </span>
  );
}
