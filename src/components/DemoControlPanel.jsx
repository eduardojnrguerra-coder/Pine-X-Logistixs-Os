const scenarioLabels = {
  normal: 'Normal operations',
  delays: 'Delivery delays today',
  tracker: 'Tracker offline problem',
  maintenance: 'Maintenance risk week',
  invoices: 'Overdue invoices problem',
  fuel: 'Fuel waste problem',
  complaint: 'Customer complaint scenario',
  leakage: 'Invoice leakage / missed billing',
};

export default function DemoControlPanel({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onReset,
}) {
  const scenario = scenarios[selectedScenario];

  return (
    <div className="demo-control-panel">
      <div className="demo-control-header">
        <div>
          <h3>Demo Control Panel</h3>
          <p>Switch the sales story to match the prospect's pain point.</p>
        </div>
        {onReset && (
          <button type="button" className="action-btn small" onClick={onReset}>
            Reset
          </button>
        )}
      </div>

      <div className="demo-scenario-list">
        {Object.entries(scenarioLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`demo-scenario-button ${selectedScenario === key ? 'active' : ''}`}
            onClick={() => onSelectScenario(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="demo-scenario-details">
        <div>
          <span className="maintenance-detail-label">Talk track</span>
          <p>{scenario.talkTrack}</p>
        </div>
        <div>
          <span className="maintenance-detail-label">Pain point</span>
          <p>{scenario.painPoint}</p>
        </div>
        <div>
          <span className="maintenance-detail-label">Sales angle</span>
          <p>{scenario.salesAngle || scenario.solution}</p>
        </div>
      </div>
    </div>
  );
}
