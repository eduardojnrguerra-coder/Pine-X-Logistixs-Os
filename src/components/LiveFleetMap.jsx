import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  LocateFixed,
  Maximize2,
  Minus,
  MoonStar,
  Plus,
  Radar,
  RotateCcw,
  SunMedium,
  Truck,
  X,
} from 'lucide-react';
import VehicleLivePopup from './VehicleLivePopup';
import VehicleStatusLegend from './VehicleStatusLegend';
import {
  TRACKING_MAP_POINTS,
  TRACKING_RISK_ZONES,
  TRACKING_ROUTE_CORRIDORS,
  liveFleetSimulator,
} from '../services/liveFleetSimulator';

const COAST_PATH =
  'M 0 0 L 0 100 L 20 100 C 24 92, 28 86, 32 79 C 36 72, 40 68, 46 62 C 51 56, 55 50, 60 43 C 66 35, 73 26, 81 17 C 88 10, 94 5, 100 3 L 100 0 Z';
const STATUS_FILTERS = ['All', 'On Route', 'Delayed', 'Offline', 'At Site', 'At Yard'];
const SPEED_OPTIONS = [0.75, 1, 1.5, 2];

const buildPath = (points) => {
  if (!points || points.length < 2) return '';
  const [first, ...rest] = points;
  const commands = [`M ${first.mapX} ${first.mapY}`];

  rest.forEach((point, index) => {
    const previous = points[index];
    const controlX = (previous.mapX + point.mapX) / 2;
    commands.push(`Q ${controlX} ${previous.mapY} ${point.mapX} ${point.mapY}`);
  });

  return commands.join(' ');
};

const getDirectionMarkers = (points, active = false) =>
  (points || []).slice(0, -1).map((point, index) => {
    const nextPoint = points[index + 1];
    const mapX = point.mapX + (nextPoint.mapX - point.mapX) * 0.58;
    const mapY = point.mapY + (nextPoint.mapY - point.mapY) * 0.58;
    const heading = (Math.atan2(nextPoint.mapY - point.mapY, nextPoint.mapX - point.mapX) * 180) / Math.PI;

    return {
      key: `${active ? 'active' : 'route'}-${index}-${point.name}-${nextPoint.name}`,
      mapX,
      mapY,
      heading,
      active,
    };
  });

const getThemePalette = (theme) =>
  theme === 'dark'
    ? {
        landStart: '#091325',
        landEnd: '#12243c',
        oceanStart: '#071119',
        oceanEnd: '#10314d',
        gridStroke: 'rgba(148, 163, 184, 0.12)',
        labelColor: 'rgba(226, 232, 240, 0.72)',
      }
    : {
        landStart: '#ffffff',
        landEnd: '#edf5fb',
        oceanStart: '#cfe9ff',
        oceanEnd: '#9dcaf7',
        gridStroke: 'rgba(148, 163, 184, 0.08)',
        labelColor: 'rgba(71, 85, 105, 0.72)',
      };

function MapCanvas({
  vehicles,
  selectedVehicleId,
  compact,
  fullscreen,
  zoomLevel,
  showTraffic,
  panOffset,
  hoveredVehicleId,
  mapTheme,
  onHoverVehicle,
  onSelectVehicle,
}) {
  const selectedVehicle = vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) || null;
  const palette = getThemePalette(mapTheme);

  return (
    <div className={`live-fleet-map-stage ${fullscreen ? 'fullscreen' : ''} ${mapTheme}`}>
      <div
        className={`live-fleet-map-canvas ${fullscreen ? 'fullscreen' : ''} ${mapTheme}`}
        style={{ transform: `translate(${panOffset.x}%, ${panOffset.y}%) scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 100 100"
          className={`live-fleet-map-svg ${showTraffic ? 'traffic-on' : ''} ${mapTheme}`}
          aria-label="Live fleet map"
        >
          <defs>
            <linearGradient id={`oceanGradient-${mapTheme}`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={palette.oceanStart} />
              <stop offset="100%" stopColor={palette.oceanEnd} />
            </linearGradient>
            <linearGradient id={`landGradient-${mapTheme}`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={palette.landStart} />
              <stop offset="100%" stopColor={palette.landEnd} />
            </linearGradient>
            <filter id="routeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.4" stdDeviation="1.1" floodColor="rgba(15, 23, 42, 0.26)" />
            </filter>
            <pattern id={`mapGrid-${mapTheme}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke={palette.gridStroke} strokeWidth="0.28" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill={`url(#landGradient-${mapTheme})`} rx="8" />
          <rect x="0" y="0" width="100" height="100" fill={`url(#mapGrid-${mapTheme})`} rx="8" />
          <path d={COAST_PATH} fill={`url(#oceanGradient-${mapTheme})`} opacity={mapTheme === 'dark' ? 0.96 : 0.92} />
          <path d="M 7 19 C 14 22, 18 23, 25 25 C 31 26, 38 30, 47 38 C 53 44, 57 48, 60 53" className="primary-road" />
          <path d="M 17 18 C 20 16, 24 15, 29 15 C 37 15, 46 17, 52 20" className="background-road" />
          <path d="M 59 54 C 54 57, 52 59, 50 61" className="local-road" />
          <path d="M 59 54 C 54 49, 49 47, 43 46" className="primary-road" />
          <path d="M 43 46 C 39 48, 36 50, 34 53" className="local-road" />
          <path d="M 59 54 C 65 58, 71 63, 78 67" className="primary-road" />
          <path d="M 59 54 C 64 46, 69 39, 75 34" className="primary-road" />
          <path d="M 49 61 C 45 56, 42 53, 38 51 C 34 49, 31 49, 28 50" className="background-road" />

          {TRACKING_RISK_ZONES.map((zone) => (
            <g key={zone.id} className={`fleet-risk-zone severity-${zone.severity}`}>
              <circle cx={zone.mapX} cy={zone.mapY} r={zone.radius} />
              <text x={zone.mapX} y={zone.mapY - zone.radius - 1.2} className="risk-zone-label">
                {zone.label}
              </text>
            </g>
          ))}

          {TRACKING_ROUTE_CORRIDORS.map((route) => (
            <g key={route.id} filter="url(#routeShadow)">
              <path d={buildPath(route.points)} className={`fleet-route-line ${showTraffic ? 'traffic-on' : ''}`} />
              {getDirectionMarkers(route.points).map((marker) => (
                <polygon
                  key={marker.key}
                  points="-0.65,-0.42 0.7,0 -0.65,0.42"
                  className="fleet-route-arrow"
                  transform={`translate(${marker.mapX} ${marker.mapY}) rotate(${marker.heading})`}
                />
              ))}
            </g>
          ))}

          {selectedVehicle && (
            <g filter="url(#routeShadow)">
              <path d={buildPath(selectedVehicle.routePoints)} className="fleet-route-line active-route" />
              {getDirectionMarkers(selectedVehicle.routePoints, true).map((marker) => (
                <polygon
                  key={marker.key}
                  points="-0.7,-0.46 0.82,0 -0.7,0.46"
                  className="fleet-route-arrow active"
                  transform={`translate(${marker.mapX} ${marker.mapY}) rotate(${marker.heading})`}
                />
              ))}
            </g>
          )}

          {Object.entries(TRACKING_MAP_POINTS).map(([name, point]) =>
            ['Workshop', 'Yard'].includes(name) ? null : (
              <g key={name}>
                <circle cx={point.mapX} cy={point.mapY} r="0.5" className="route-node-dot" />
                <text
                  x={point.labelX || point.mapX + 1}
                  y={point.labelY || point.mapY - 1}
                  className={`route-node-label ${compact ? 'compact' : ''}`}
                  style={{ fill: palette.labelColor }}
                >
                  {name}
                </text>
              </g>
            )
          )}
        </svg>

        {vehicles.map((vehicle, index) => {
          const isSelected = selectedVehicleId === vehicle.vehicleId;
          const isHovered = hoveredVehicleId === vehicle.vehicleId;
          const showLabel = isSelected || isHovered || (!compact && index % 3 === 0);

          return (
            <div key={`${vehicle.vehicleId}-trail`} className="fleet-trail-layer">
              <svg viewBox="0 0 100 100" className="fleet-trail-svg" aria-hidden="true">
                <polyline
                  points={(vehicle.movementTrail || [])
                    .map((point) => `${point.mapX},${point.mapY}`)
                    .join(' ')}
                  className={`fleet-trail-line ${vehicle.status === 'Offline' ? 'offline' : ''}`}
                />
              </svg>
              {vehicle.liveAlerts?.slice(0, compact ? 1 : 2).map((alert, alertIndex) => (
                <div
                  key={`${vehicle.vehicleId}-${alert.label}-${alertIndex}`}
                  className={`map-alert-pill tone-${alert.tone || 'warning'}`}
                  style={{
                    left: `${vehicle.mapX + 1.8}%`,
                    top: `${vehicle.mapY - 5.8 - alertIndex * 4.4}%`,
                  }}
                >
                  {alert.label}
                </div>
              ))}
              <button
                type="button"
                className={`fleet-marker ${isSelected ? 'selected' : ''} ${compact ? 'compact' : ''} ${
                  vehicle.status === 'On Route' ? 'live' : ''
                } ${vehicle.status === 'Delayed' ? 'delayed' : ''} ${vehicle.status === 'Offline' ? 'offline' : ''}`}
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
                <span className="fleet-marker-glow" />
                <span className="fleet-marker-icon" style={{ transform: `rotate(${vehicle.heading}deg)` }}>
                  <Truck size={compact ? 11 : 13} />
                </span>
                {isSelected && <span className="fleet-speed-chip">{Math.round(vehicle.speed)} km/h</span>}
                <span className={`fleet-marker-label ${showLabel ? 'visible' : ''}`}>
                  <strong>{vehicle.vehicleName}</strong>
                  <small>{vehicle.status}</small>
                  <em>{vehicle.eta}</em>
                </span>
              </button>
            </div>
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
  showInlinePopup = true,
}) {
  const [showTraffic, setShowTraffic] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredVehicleId, setHoveredVehicleId] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [followSelected, setFollowSelected] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState('');
  const [mapTheme, setMapTheme] = useState('light');
  const [speedMultiplier, setSpeedMultiplier] = useState(() => liveFleetSimulator.getSpeedMultiplier());

  const displayedVehicles = useMemo(() => {
    const filteredByStatus = statusFilter === 'All' ? vehicles : vehicles.filter((vehicle) => vehicle.status === statusFilter);
    return compact ? filteredByStatus.slice(0, 6) : filteredByStatus;
  }, [compact, statusFilter, vehicles]);

  const selectedVehicle =
    displayedVehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ||
    vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ||
    displayedVehicles[0] ||
    null;

  const alertBadges = useMemo(() => {
    const delayed = displayedVehicles.filter((vehicle) => vehicle.status === 'Delayed').length;
    const offline = displayedVehicles.filter((vehicle) => vehicle.status === 'Offline').length;
    const lowFuel = displayedVehicles.filter((vehicle) => vehicle.fuelLevel <= 25).length;

    return [
      delayed ? { label: `${delayed} delay risk`, tone: 'danger' } : null,
      offline ? { label: `${offline} tracker lost`, tone: 'neutral' } : null,
      lowFuel ? { label: `${lowFuel} low fuel`, tone: 'warning' } : null,
    ].filter(Boolean);
  }, [displayedVehicles]);

  const shouldShowToolbar = !compact || showCompactToolbar;

  const centerVehicle = (vehicle) => {
    if (!vehicle) return;
    setPanOffset({
      x: (50 - vehicle.mapX) * 0.22,
      y: (50 - vehicle.mapY) * 0.22,
    });
    setToast(`${vehicle.vehicleName} centered on map`);
  };

  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(compact ? 1 : 1.02);
    setFollowSelected(false);
    setToast('Map view reset');
  };

  const handleSelectVehicle = (vehicle) => {
    onSelectVehicle?.(vehicle);
    if (followSelected || fullscreenOpen) {
      centerVehicle(vehicle);
    }
  };

  const handleSpeedMultiplierChange = (event) => {
    const nextValue = Number(event.target.value);
    setSpeedMultiplier(nextValue);
    liveFleetSimulator.setSpeedMultiplier(nextValue);
    setToast(`Demo speed set to ${nextValue}x`);
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (!fullscreenOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFullscreenOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenOpen]);

  const toggleFollowSelected = () => {
    setFollowSelected((value) => {
      const nextValue = !value;
      if (nextValue && selectedVehicle) {
        centerVehicle(selectedVehicle);
      }
      return nextValue;
    });
  };

  const toggleTheme = () => {
    setMapTheme((value) => (value === 'light' ? 'dark' : 'light'));
  };

  const openFullscreen = () => {
    if (selectedVehicle) {
      centerVehicle(selectedVehicle);
    }
    setFullscreenOpen(true);
  };

  const toolbar = (
    <div className={`live-fleet-map-toolbar ${compact ? 'compact-toolbar' : ''}`}>
      <div className="live-fleet-map-controls">
        {!compact && (
          <>
            <button type="button" className="map-control-button" onClick={() => setZoomLevel((value) => Math.max(0.94, value - 0.06))}>
              <Minus size={16} />
            </button>
            <button type="button" className="map-control-button" onClick={() => setZoomLevel((value) => Math.min(1.18, value + 0.06))}>
              <Plus size={16} />
            </button>
          </>
        )}
        <button type="button" className={`map-control-button ${showTraffic ? 'active' : ''}`} onClick={() => setShowTraffic((value) => !value)}>
          <Radar size={16} />
          <span>Traffic</span>
        </button>
        <button type="button" className={`map-control-button ${followSelected ? 'active' : ''}`} onClick={toggleFollowSelected}>
          <LocateFixed size={16} />
          <span>Follow</span>
        </button>
        <button type="button" className="map-control-button" onClick={toggleTheme}>
          {mapTheme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
          <span>{mapTheme === 'light' ? 'Dark map' : 'Light map'}</span>
        </button>
        {!compact && (
          <button type="button" className="map-control-button" onClick={resetView}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
        <button type="button" className="map-control-button" onClick={openFullscreen}>
          <Maximize2 size={16} />
          <span>Fullscreen</span>
        </button>
      </div>
      <div className="live-fleet-map-toolbar-right">
        <label className={`map-filter-select ${compact ? 'compact-filter' : ''}`}>
          <Filter size={16} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_FILTERS.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All Vehicles' : option}
              </option>
            ))}
          </select>
        </label>
        <label className="map-filter-select speed-select">
          <span>Speed</span>
          <select value={speedMultiplier} onChange={handleSpeedMultiplierChange}>
            {SPEED_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <div className={`live-fleet-map-card ${compact ? 'compact' : 'full'} map-theme-${mapTheme}`}>
        <div className="live-fleet-map-header">
          <div>
            <h3>{title}</h3>
            <p>{compact ? 'Compact live fleet snapshot.' : 'Western Cape fleet control view with route, traffic, and exception awareness.'}</p>
          </div>
          <div className="live-fleet-map-header-meta">
            <span className="live-badge">LIVE</span>
            <span className="live-timestamp">
              Updated{' '}
              {selectedVehicle
                ? new Date(selectedVehicle.lastUpdated || selectedVehicle.lastSeen).toLocaleTimeString('en-ZA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {shouldShowToolbar && toolbar}

        <div className="map-notification-badges">
          {alertBadges.map((badge) => (
            <span key={badge.label} className={`map-notification-badge tone-${badge.tone}`}>
              {badge.label}
            </span>
          ))}
        </div>

        <MapCanvas
          vehicles={displayedVehicles}
          selectedVehicleId={selectedVehicle?.vehicleId}
          compact={compact}
          fullscreen={false}
          zoomLevel={zoomLevel}
          showTraffic={showTraffic}
          panOffset={panOffset}
          hoveredVehicleId={hoveredVehicleId}
          mapTheme={mapTheme}
          onHoverVehicle={setHoveredVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

        {showInlinePopup && selectedVehicle && (
          <div className={`live-fleet-map-popup ${compact ? 'compact' : ''}`}>
            <VehicleLivePopup
              vehicle={selectedVehicle}
              compact={compact}
              onCenter={centerVehicle}
              onCall={(vehicle) => setToast(`Calling ${vehicle.driverName}...`)}
            />
          </div>
        )}

        {!compact && <VehicleStatusLegend />}

        {toast && <div className="map-action-toast">{toast}</div>}
      </div>

      {fullscreenOpen && (
        <div className="map-fullscreen-overlay">
          <div className="map-fullscreen-shell">
            <div className="map-fullscreen-topbar">
              <div>
                <h2>Fleet Control Room</h2>
                <p>Full-screen tracking view with fleet tray, live controls, and selected vehicle operations.</p>
              </div>
              <div className="map-fullscreen-topbar-actions">
                <button type="button" className={`map-control-button ${showTraffic ? 'active' : ''}`} onClick={() => setShowTraffic((value) => !value)}>
                  <Radar size={16} />
                  <span>Traffic</span>
                </button>
                <button type="button" className={`map-control-button ${followSelected ? 'active' : ''}`} onClick={toggleFollowSelected}>
                  <LocateFixed size={16} />
                  <span>Follow selected</span>
                </button>
                <button type="button" className="map-control-button" onClick={toggleTheme}>
                  {mapTheme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
                  <span>{mapTheme === 'light' ? 'Dark map' : 'Light map'}</span>
                </button>
                <button type="button" className="map-control-button" onClick={resetView}>
                  <RotateCcw size={16} />
                  <span>Reset view</span>
                </button>
                <label className="map-filter-select speed-select">
                  <span>Speed</span>
                  <select value={speedMultiplier} onChange={handleSpeedMultiplierChange}>
                    {SPEED_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}x
                      </option>
                    ))}
                  </select>
                </label>
                <label className="map-filter-select fullscreen-filter">
                  <Filter size={16} />
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    {STATUS_FILTERS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'All' ? 'All Vehicles' : option}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="primary-button" onClick={() => setFullscreenOpen(false)}>
                  <X size={16} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div className="map-fullscreen-layout">
              <div className="map-fullscreen-list">
                <div className="map-side-panel-header">
                  <h3>Fleet tray</h3>
                  <span>{displayedVehicles.length} vehicles</span>
                </div>
                <div className="vehicle-list enhanced">
                  {displayedVehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicleId}
                      type="button"
                      className={`vehicle-item enhanced ${selectedVehicle?.vehicleId === vehicle.vehicleId ? 'selected' : ''}`}
                      onClick={() => handleSelectVehicle(vehicle)}
                    >
                      <div className="vehicle-status-indicator">
                        <span className="status-dot" style={{ backgroundColor: vehicle.statusColor }} />
                      </div>
                      <div className="vehicle-info">
                        <span className="vehicle-reg">{vehicle.registration}</span>
                        <span className="vehicle-driver">{`${vehicle.driverName} - ${vehicle.customerName}`}</span>
                      </div>
                      <div className="vehicle-data">
                        <span className="status-text">{vehicle.status}</span>
                        <span className="vehicle-speed">{vehicle.eta}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="map-fullscreen-map">
                <div className="map-notification-badges fullscreen">
                  {alertBadges.map((badge) => (
                    <span key={`${badge.label}-fullscreen`} className={`map-notification-badge tone-${badge.tone}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
                <MapCanvas
                  vehicles={displayedVehicles}
                  selectedVehicleId={selectedVehicle?.vehicleId}
                  compact={false}
                  fullscreen
                  zoomLevel={1.1}
                  showTraffic={showTraffic}
                  panOffset={panOffset}
                  hoveredVehicleId={hoveredVehicleId}
                  mapTheme={mapTheme}
                  onHoverVehicle={setHoveredVehicleId}
                  onSelectVehicle={handleSelectVehicle}
                />
              </div>

              <div className="map-fullscreen-side">
                {selectedVehicle && (
                  <VehicleLivePopup
                    vehicle={selectedVehicle}
                    onCenter={centerVehicle}
                    onCall={(vehicle) => setToast(`Calling ${vehicle.driverName}...`)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
