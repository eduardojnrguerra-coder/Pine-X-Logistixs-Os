import { AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';

const healthConfig = {
  healthy: {
    icon: ShieldCheck,
    label: 'Healthy',
    className: 'healthy',
  },
  watch: {
    icon: AlertTriangle,
    label: 'Watch',
    className: 'watch',
  },
  critical: {
    icon: Wrench,
    label: 'Critical',
    className: 'critical',
  },
};

export default function VehicleHealthScore({
  health,
  compact = false,
  showGuidance = true,
}) {
  const config = healthConfig[health.status] || healthConfig.watch;
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`vehicle-health-score compact ${config.className}`}>
        <div className="health-score-pill">
          <Icon size={14} />
          <span>{health.score}</span>
        </div>
        <span className="health-status-text">{health.label || config.label}</span>
      </div>
    );
  }

  return (
    <div className={`vehicle-health-score ${config.className}`}>
      <div className="health-score-header">
        <div className="health-score-circle">
          <span>{health.score}</span>
        </div>
        <div className="health-score-copy">
          <div className="health-score-title">
            <Icon size={16} />
            <span>{health.label || config.label}</span>
          </div>
          <p>{health.explanation}</p>
        </div>
      </div>

      {showGuidance && (
        <div className="health-score-guidance">
          <span className="health-guidance-label">Recommended action</span>
          <span>{health.recommendedAction}</span>
        </div>
      )}
    </div>
  );
}
