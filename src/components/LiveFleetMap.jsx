import { useMemo, useState } from 'react';
import { Filter, Maximize2, Minus, Plus, Radar, Truck, X } from 'lucide-react';
import VehicleLivePopup from './VehicleLivePopup';
import VehicleStatusLegend from './VehicleStatusLegend';
import { TRACKING_MAP_POINTS, TRACKING_ROUTE_CORRIDORS } from '../services/liveFleetSimulator';

const COAST_PATH = 'M 0 0 L 0 100 L 24 100 C 29 91, 31 82, 35 74 C 38 67, 42 62, 48 57 C 53 52, 54 48, 58 43 C 62 37, 65 29, 70 22 C 76 13, 84 8, 100 4 L 100 0 Z';
const STATUS_FILTERS = ['All', 'On Route', 'Delayed', 'Offline', 'At Site', 'At Yard'];

const buildPath = (points) => {
  if (points.length < 2) return '';
  const [first, ...rest] = points;
  const commands = [`M ${first.mapX} ${first.mapY}`];

  rest.forEach((point, index) => {
    const prev = points[index];
    const controlX = (prev.mapX + point.mapX) / 2;
    commands.push(`Q ${controlX} ${prev.mapY} ${point.mapX} ${point.mapY}`);
  });

  return commands.join(' ');
};

function MapCanvas({
  vehicles,
  selectedVehicleId,
  compact,
  zoomLevel,
  showTraffic,
  hoveredVehicleId,
  onHoverVehicle,
  onSelectVehicle,
}) {
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) || null;

  return (
    <div className="live-fleet-map-stage">
      <div className="live-fleet-map-canvas" style={{ transform: `scale(${zoomLevel})` }}>
        <svg viewBox="0 0 100 100" className={`live-fleet-map-svg ${showTraffic ? 'traffic-on' : ''}`} aria-label="Live fleet map">
          <defs>
            <linearGradient id="oceanGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
            <linearGradient id="landGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fbff" />
            </linearGradient>
            <pattern id="mapGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.3" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="url(#landGradient)" rx="8" />
          <rect x="0" y="0" width="100" height="100" fill="url(#mapGrid)" rx="8" />
          <path d={COAST_PATH} fill="url(#oceanGradient)" opacity="0.9" />

          <path d="M 11 22 C 19 25, 24 26, 31 28 C 37 29, 43 35, 50 42 C 55 48, 58 52, 58 54" className="primary-road" />
          <path d="M 58 54 C 55 56, 54 57, 53 58" className="local-road" />
          <path d="M 58 54 C 55 58, 52 60, 50 61" className="local-road" />
          <path d="M 58 54 C 54 49, 49 47, 44 46" className="primary-road" />
          <path d="M 44 46 C 41 48, 39 49, 37 50" className="local-road" />
          <path d="M 58 54 C 64 58, 71 63, 77 67" className="primary-road" />
          <path d="M 58 54 C 63 47, 69 40, 73 36" className="primary-road" />

          {TRACKING_ROUTE_CORRIDORS.map((route) => (
            <path key={route.id} d={buildPath(route.points)} className={`fleet-route-line ${showTraffic ? 'traffic-on' : ''}`} />
          ))}

          {selectedVehicle && (
            <path
              d={buildPath(selectedVehicle.routePoints)}
              className="fleet-route-line active-route"
            />
          )}

          {Object.entries(TRACKING_MAP_POINTS).map(([name, point]) => (
            !['Workshop', 'Yard'].includes(name) && (
              <g key={name}>
                <circle cx={point.mapX} cy={point.mapY} r="0.55" className="route-node-dot" />
                <text x={point.labelX || point.mapX + 1} y={point.labelY || point.mapY - 1} className={`route-node-label ${compact ? 'compact' : ''}`}>
                  {name}
                </text>
              </g>
            )
          ))}
        </svg>

        {vehicles.map((vehicle, index) => {
          const isSelected = selectedVehicleId === vehicle.vehicleId;
          const isHovered = hoveredVehicleId === vehicle.vehicleId;
          const showLabel = isSelected || isHovered || (!compact && index % 2 === 0);

          return (
            <button
              key={vehicle.vehicleId}
              type="button"
              className={`fleet-marker ${isSelected ? 'selected' : ''} ${compact ? 'compact' : ''}`}
              style={{
                left: `${vehicle.mapX}%`,
                top: `${vehicle.mapY}%`,
                ['--marker-color']: vehicle.statusColor || '#22c55e',
              }}
              onMouseEnter={() => onHoverVehicle(vehicle.vehicleId)}
              onMouseLeave={() => onHoverVehicle(null)}
              onClick={() => onSelectVehicle?.(vehicle)}
            >
              <span className="fleet-marker-ring" />
              <span className="fleet-marker-icon" style={{ transform: `rotate(${vehicle.heading}deg)` }}>
                <Truck size={compact ? 11 : 13} />
              </span>
              <span className={`fleet-marker-label ${showLabel ? 'visible' : ''}`}>
                <strong>{vehicle.vehicleName}</strong>
                <small>{vehicle.status}</small>
                <em>{vehicle.eta}</em>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function LiveFleetMap({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  compact = false,
  title = 'Live Fleet Map',
  showCompactToolbar = false,
}) {
  const [showTraffic, setShowTraffic] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showPopup, setShowPopup] = useState(true);
  const [hoveredVehicleId, setHoveredVehicleId] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const displayedVehicles = useMemo(() => {
    const filteredByStatus = statusFilter === 'All' ? vehicles : vehicles.filter((vehicle) => vehicle.status === statusFilter);
    return compact ? filteredByStatus.slice(0, 6) : filteredByStatus;
  }, [compact, statusFilter, vehicles]);

  const selectedVehicle =
    displayedVehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ||
    vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ||
    displayedVehicles[0] ||
    null;

  const handleSelectVehicle = (vehicle) => {
    setShowPopup(true);
    onSelectVehicle?.(vehicle);
  };

  const shouldShowToolbar = !compact || showCompactToolbar;
  const compactSelectLabel = statusFilter === 'All' ? 'All Vehicles' : statusFilter;

  return (
    <>
      <div className={`live-fleet-map-card ${compact ? 'compact' : ''}`}>
        <div className="live-fleet-map-header">
          <div>
            <h3>{title}</h3>
            <p>{compact ? 'Compact live fleet snapshot.' : 'Western Cape live fleet visibility with cleaner route geometry.'}</p>
          </div>
          <div className="live-fleet-map-header-meta">
            <span className="live-badge">LIVE</span>
            <span className="live-timestamp">
              Updated {selectedVehicle ? new Date(selectedVehicle.lastUpdated || selectedVehicle.lastSeen).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {shouldShowToolbar && (
          <div className={`live-fleet-map-toolbar ${compact ? 'compact-toolbar' : ''}`}>
            <div className="live-fleet-map-controls">
              {!compact && <button type="button" className="map-control-button" onClick={() => setZoomLevel((value) => Math.max(0.94, value - 0.06))}><Minus size={16} /></button>}
              {!compact && <button type="button" className="map-control-button" onClick={() => setZoomLevel((value) => Math.min(1.18, value + 0.06))}><Plus size={16} /></button>}
              <button type="button" className={`map-control-button ${showTraffic ? 'active' : ''}`} onClick={() => setShowTraffic((value) => !value)}>
                <Radar size={16} />
                <span>Traffic</span>
              </button>
              {!compact && (
                <button type="button" className="map-control-button" onClick={() => setShowPopup((value) => !value)}>
                  <Filter size={16} />
                  <span>{showPopup ? 'Hide detail' : 'Show detail'}</span>
                </button>
              )}
              <button type="button" className="map-control-button" onClick={() => setFullscreenOpen(true)}>
                <Maximize2 size={16} />
                <span>Fullscreen</span>
              </button>
            </div>
            <label className={`map-filter-select ${compact ? 'compact-filter' : ''}`}>
              <Filter size={16} />
              {compact && <span className="map-filter-label">{compactSelectLabel}</span>}
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {STATUS_FILTERS.map((option) => (
                  <option key={option} value={option}>
                    {option === 'All' ? 'All Vehicles' : option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <MapCanvas
          vehicles={displayedVehicles}
          selectedVehicleId={selectedVehicle?.vehicleId}
          compact={compact}
          zoomLevel={zoomLevel}
          showTraffic={showTraffic}
          hoveredVehicleId={hoveredVehicleId}
          onHoverVehicle={setHoveredVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

        {showPopup && selectedVehicle && (
          <div className={`live-fleet-map-popup ${compact ? 'compact' : ''}`}>
            <VehicleLivePopup vehicle={selectedVehicle} compact={compact} />
          </div>
        )}

        {!compact && <VehicleStatusLegend />}
      </div>

      {fullscreenOpen && (
        <div className="map-fullscreen-overlay">
          <div className="map-fullscreen-shell">
            <div className="map-fullscreen-topbar">
              <div>
                <h2>Fleet Control Room</h2>
                <p>Large moving map, fleet list, and live vehicle detail in one fullscreen view.</p>
              </div>
              <button type="button" className="primary-button" onClick={() => setFullscreenOpen(false)}>
                <X size={16} />
                <span>Close Fullscreen</span>
              </button>
            </div>

            <div className="map-fullscreen-layout">
              <div className="map-fullscreen-map">
                <MapCanvas
                  vehicles={displayedVehicles}
                  selectedVehicleId={selectedVehicle?.vehicleId}
                  compact={false}
                  zoomLevel={1.08}
                  showTraffic={showTraffic}
                  hoveredVehicleId={hoveredVehicleId}
                  onHoverVehicle={setHoveredVehicleId}
                  onSelectVehicle={handleSelectVehicle}
                />
              </div>

              <div className="map-fullscreen-side">
                <div className="page-card tracking-list-card tracking-vehicle-list-card">
                  <div className="card-header">
                    <h3>Vehicle list</h3>
                    <span className="vehicle-count">{displayedVehicles.length} vehicles</span>
                  </div>
                  <div className="vehicle-list enhanced">
                    {displayedVehicles.map((vehicle) => (
                      <button
                        key={vehicle.vehicleId}
                        type="button"
                        className={`vehicle-item enhanced ${selectedVehicle?.vehicleId === vehicle.vehicleId ? 'selected' : ''}`}
                        onClick={() => handleSelectVehicle(vehicle)}
                      >
                        <div className="vehicle-status-indicator"><span className="status-dot" style={{ backgroundColor: vehicle.statusColor }} /></div>
                        <div className="vehicle-info">
                          <span className="vehicle-reg">{vehicle.registration}</span>
                          <span className="vehicle-driver">{vehicle.driverName} - {vehicle.customerName}</span>
                        </div>
                        <div className="vehicle-data">
                          <span className="status-text">{vehicle.status}</span>
                          <span className="vehicle-speed">{vehicle.eta}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedVehicle && (
                  <div className="page-card route-history-card">
                    <div className="card-header"><h3>Selected vehicle details</h3></div>
                    <VehicleLivePopup vehicle={selectedVehicle} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
