const statusClassMap = {
  Connected: 'success',
  'Demo Mode': 'info',
  Error: 'danger',
  'Not Connected': 'muted',
};

export default function IntegrationStatusBadge({ status }) {
  const className = statusClassMap[status] || 'muted';

  return (
    <span className={`integration-status-badge ${className}`}>
      {status}
    </span>
  );
}
