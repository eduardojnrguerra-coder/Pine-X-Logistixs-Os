export default function ScenarioBadge({ scenario, compact = false }) {
  if (!scenario) return null;

  return (
    <div className={`scenario-badge ${compact ? 'compact' : ''}`}>
      <span className="scenario-badge-label">Presenter Mode</span>
      <strong>{scenario.name}</strong>
    </div>
  );
}
