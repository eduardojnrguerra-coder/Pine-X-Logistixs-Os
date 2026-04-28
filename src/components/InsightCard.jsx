export default function InsightCard({ title, body, tone = 'info', meta }) {
  return (
    <div className={`insight-card ${tone}`}>
      <div className="insight-card-top">
        <span className="insight-meta">{meta}</span>
        <span className={`warning-badge ${tone === 'critical' ? 'critical' : tone === 'warning' ? '' : tone === 'success' ? 'tracker' : 'muted'}`}>
          {tone}
        </span>
      </div>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}
