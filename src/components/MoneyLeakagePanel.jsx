const currency = (amount) => `R${Number(amount || 0).toLocaleString()}`;

export default function MoneyLeakagePanel({ items = [], total = 0 }) {
  return (
    <div className="dashboard-card leakage-panel">
      <div className="card-header">
        <div>
          <h3>Money Leakage Report</h3>
          <p className="card-subtitle">Estimated losses currently visible in the operation.</p>
        </div>
        <div className="leakage-total">{currency(total)}</div>
      </div>

      <div className="leakage-grid">
        {items.map((item) => (
          <div key={item.id} className={`leakage-item ${item.severity}`}>
            <div className="leakage-item-top">
              <div>
                <h4>{item.title}</h4>
                <span className="leakage-amount">{currency(item.amount)}</span>
              </div>
              <span className={`warning-badge ${item.severity === 'critical' ? 'critical' : item.severity === 'warning' ? '' : 'tracker'}`}>
                {item.severity}
              </span>
            </div>
            <div className="leakage-copy">
              <p><strong>Reason:</strong> {item.reason}</p>
              <p><strong>Impact:</strong> {item.impact}</p>
              <p><strong>Action:</strong> {item.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
