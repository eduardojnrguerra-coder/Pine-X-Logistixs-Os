import { Truck } from 'lucide-react';

export default function FleetTray({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  compact = false,
}) {
  return (
    <div className={`fleet-tray ${compact ? 'compact' : ''}`}>
      <div className="fleet-tray-header">
        <div>
          <span>Fleet tray</span>
          <strong>{vehicles.length} vehicles</strong>
        </div>
        <Truck size={16} />
      </div>
      <div className="fleet-tray-list">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.vehicleId}
            type="button"
            className={`fleet-tray-item ${selectedVehicleId === vehicle.vehicleId ? 'selected' : ''}`}
            onClick={() => onSelectVehicle?.(vehicle)}
          >
            <span className="fleet-tray-status" style={{ backgroundColor: vehicle.statusColor }} />
            <span className="fleet-tray-main">
              <strong>{vehicle.registration}</strong>
              <small>{`${vehicle.driverName} - ${vehicle.customerName}`}</small>
            </span>
            <span className="fleet-tray-meta">
              <strong>{vehicle.status}</strong>
              <small>{vehicle.eta}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
