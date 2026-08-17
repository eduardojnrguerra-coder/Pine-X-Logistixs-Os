import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, trend, icon: Icon, color }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span className={`stat-change ${trend}`}>
            <TrendIcon size={12} />
            {change}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}