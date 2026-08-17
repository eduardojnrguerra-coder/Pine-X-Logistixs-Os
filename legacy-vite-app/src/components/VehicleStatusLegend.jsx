const LEGEND_ITEMS = [
  { status: 'On Route', color: '#22c55e' },
  { status: 'At Site', color: '#2563eb' },
  { status: 'At Yard', color: '#7c3aed' },
  { status: 'Delayed', color: '#ef4444' },
  { status: 'Maintenance', color: '#f97316' },
  { status: 'Offline', color: '#94a3b8' },
  { status: 'Delivered', color: '#334155' },
];

export default function VehicleStatusLegend() {
  return (
    <div className="vehicle-status-legend">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.status} className="vehicle-status-legend-item">
          <span
            className="vehicle-status-legend-dot"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.status}</span>
        </div>
      ))}
    </div>
  );
}
