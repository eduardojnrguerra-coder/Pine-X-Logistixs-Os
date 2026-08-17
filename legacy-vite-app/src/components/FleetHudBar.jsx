import { Activity, AlertTriangle, Clock3, Gauge, Radio, Truck } from 'lucide-react';

const averageSpeed = (vehicles) => {
  const moving = vehicles.filter((vehicle) => vehicle.speed > 0);
  if (moving.length === 0) return 0;
  return Math.round(moving.reduce((sum, vehicle) => sum + vehicle.speed, 0) / moving.length);
};

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--';

export default function FleetHudBar({ vehicles = [], compact = false, lastSync }) {
  const metrics = [
    {
      label: 'Active jobs',
      value: vehicles.filter((vehicle) => vehicle.currentJobId && vehicle.status !== 'Delivered').length,
      icon: Activity,
      tone: 'info',
    },
    {
      label: 'Moving',
      value: vehicles.filter((vehicle) => vehicle.status === 'On Route').length,
      icon: Truck,
      tone: 'success',
    },
    {
      label: 'Delayed',
      value: vehicles.filter((vehicle) => vehicle.status === 'Delayed').length,
      icon: AlertTriangle,
      tone: 'danger',
    },
    {
      label: 'Offline',
      value: vehicles.filter((vehicle) => vehicle.status === 'Offline').length,
      icon: Radio,
      tone: 'neutral',
    },
    {
      label: 'Avg speed',
      value: `${averageSpeed(vehicles)} km/h`,
      icon: Gauge,
      tone: 'warning',
    },
    {
      label: 'ETA risk',
      value: vehicles.filter((vehicle) => ['Delayed', 'At risk'].includes(vehicle.scheduleState)).length,
      icon: Clock3,
      tone: 'danger',
    },
  ];

  return (
    <div className={`fleet-hud-bar ${compact ? 'compact' : ''}`}>
      {metrics.slice(0, compact ? 4 : metrics.length).map((metric) => (
        <div key={metric.label} className={`fleet-hud-metric tone-${metric.tone}`}>
          <metric.icon size={compact ? 13 : 15} />
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </div>
      ))}
      {!compact && (
        <div className="fleet-hud-sync">
          <span>Last sync</span>
          <strong>{formatTime(lastSync || vehicles[0]?.lastUpdated || vehicles[0]?.lastSeen)}</strong>
        </div>
      )}
    </div>
  );
}
