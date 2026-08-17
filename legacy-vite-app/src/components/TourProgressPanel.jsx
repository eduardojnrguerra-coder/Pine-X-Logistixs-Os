export default function TourProgressPanel({
  analytics,
  onResume,
  onReplay,
  onDismiss,
}) {
  return (
    <div className="dashboard-card tour-progress-panel">
      <div className="card-header">
        <h3>Guided Tour Progress</h3>
      </div>
      <div className="maintenance-summary-list">
        <div className="summary-row">
          <span>Completion</span>
          <strong>{analytics.completionPercentage}%</strong>
        </div>
        <div className="summary-row">
          <span>Last completed step</span>
          <strong>{analytics.lastCompletedStep || 0}</strong>
        </div>
        <div className="summary-row">
          <span>Tours finished</span>
          <strong>{analytics.finished}</strong>
        </div>
      </div>
      <div className="sales-cta-actions compact">
        {analytics.resumeStep !== null && (
          <button type="button" className="action-btn small primary" onClick={onResume}>
            Resume Tour
          </button>
        )}
        <button type="button" className="action-btn small" onClick={onReplay}>
          Replay Tour
        </button>
        <button type="button" className="action-btn small" onClick={onDismiss}>
          Dismiss Tour
        </button>
      </div>
    </div>
  );
}
