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
import FleetHudBar from './FleetHudBar';
import FleetTray from './FleetTray';
import LiveEventTicker from './LiveEventTicker';
import ScenarioBadge from './ScenarioBadge';
import VehicleIntelPanel from './VehicleIntelPanel';
import {
  TRACKING_GEOFENCES,
  TRACKING_MAP_POINTS,
  TRACKING_ROUTE_CORRIDORS,
  liveFleetSimulator,
} from '../services/liveFleetSimulator';

const COAST_PATH =
  'M 0 0 L 0 100 L 21 100 C 25 91, 27 84, 31 77 C 36 68, 42 64, 50 59 C 58 54, 63 47, 68 39 C 74 29, 83 18, 92 9 C 96 5, 99 3, 100 2 L 100 0 Z';
const TERRAIN_PATH =
  'M 14 18 C 26 12, 42 16, 53 25 C 65 35, 73 36, 84 31 L 93 43 C 82 49, 76 55, 76 66 C 65 72, 53 74, 41 68 C 28 62, 20 52, 12 42 Z';
const STATUS_FILTERS = ['All', 'On Route', 'Delayed', 'Offline', 'At Site', 'At Yard', 'Maintenance'];
const SPEED_OPTIONS = [0.75, 1, 1.5, 2];

const buildPath = (points) => {
  if (!points || points.length < 2) return '';
  const [first, ...rest] = points;
  const commands = [`M ${first.mapX} ${first.mapY}`];

  rest.forEach((point, index) => {
    const previous = points[index];
    const controlX = previous.mapX + (point.mapX - previous.mapX) * 0.55;
    const controlY = previous.mapY + (point.mapY - previous.mapY) * 0.18;
    commands.push(`Q ${controlX} ${controlY} ${point.mapX} ${point.mapY}`);
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
    };
  });

const getThemePalette = (theme) =>
  theme === 'dark'
    ? {
        landStart: '#07111f',
        landEnd: '#111827',
        waterStart: '#03101a',
        waterEnd: '#0d2a40',
        terrain: 'rgba(30, 41, 59, 0.46)',
        grid: 'rgba(148, 163, 184, 0.13)',
        label: 'rgba(226, 232, 240, 0.68)',
      }
    : {
        landStart: '#ffffff',
        landEnd: '#edf5fb',
        waterStart: '#cfe9ff',
        waterEnd: '#9dcaf7',
        terrain: 'rgba(226, 232, 240, 0.42)',
        grid: 'rgba(100, 116, 139, 0.09)',
        label: 'rgba(71, 85, 105, 0.72)',
      };

const getPinType = (name) => {
  if (name.includes('Depot') || name.includes('Yard')) return 'depot';
  if (name.includes('Site')) return 'site';
  return 'town';
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
    <div className={`tactical-map-stage ${fullscreen ? 'fullscreen' : ''} ${compact ? 'compact' : ''} ${mapTheme}`}>
      <div className="tactical-scanline" />
      <div className="tactical-radar-sweep" />
      <div
        className={`live-fleet-map-canvas tactical-map-canvas ${fullscreen ? 'fullscreen' : ''} ${mapTheme}`}
        style={{ transform: `translate(${panOffset.x}%, ${panOffset.y}%) scale(${zoomLevel})` }}
      >
        <svg viewBox="0 0 100 100" className={`live-fleet-map-svg tactical-map-svg ${mapTheme}`} aria-label="Live tactical fleet map">
          <defs>
            <linearGradient id={`tacticalLand-${mapTheme}`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={palette.landStart} />
              <stop offset="100%" stopColor={palette.landEnd} />
            </linearGradient>
            <linearGradient id={`tacticalWater-${mapTheme}`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={palette.waterStart} />
              <stop offset="100%" stopColor={palette.waterEnd} />
            </linearGradient>
            <pattern id={`tacticalGrid-${mapTheme}`} width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke={palette.grid} strokeWidth="0.25" />
            </pattern>
            <filter id="corridorGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="rgba(56, 189, 248, 0.42)" />
            </filter>
            <filter id="activeCorridorGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="rgba(34, 197, 94, 0.72)" />
            </filter>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill={`url(#tacticalLand-${mapTheme})`} />
          <rect x="0" y="0" width="100" height="100" fill={`url(#tacticalGrid-${mapTheme})`} />
          <path d={COAST_PATH} fill={`url(#tacticalWater-${mapTheme})`} opacity="0.96" />
          <path d={TERRAIN_PATH} fill={palette.terrain} opacity="0.72" />

          <g className="tactical-road-network">
            <path d="M 8 22 C 19 27, 31 33, 44 36 C 51 38, 57 39, 63 38" />
            <path d="M 63 38 C 63 46, 62 54, 62 62" />
            <path d="M 62 62 C 55 60, 48 57, 44 52 C 40 55, 36 57, 35 58" />
            <path d="M 62 62 C 68 61, 75 64, 82 74" />
            <path d="M 61 38 C 70 42, 74 51, 75 61" />
            <path d="M 10 25 C 16 28, 22 30, 29 34" />
          </g>

          {TRACKING_GEOFENCES.map((zone) => (
            <g key={zone.id} className={`tactical-geofence type-${zone.type} severity-${zone.severity}`}>
              <circle cx={zone.mapX} cy={zone.mapY} r={zone.radius} />
              {!compact && (
                <text x={zone.mapX} y={zone.mapY - zone.radius - 1.1} className="tactical-geofence-label">
                  {zone.label}
                </text>
              )}
            </g>
          ))}

          {TRACKING_ROUTE_CORRIDORS.map((route) => {
            const active = selectedVehicle?.routeId === route.id;
            return (
              <g key={route.id} className={`route-corridor ${active ? 'active' : 'inactive'}`} filter={active ? 'url(#activeCorridorGlow)' : 'url(#corridorGlow)'}>
                <path d={buildPath(route.points)} className={`fleet-route-line tactical-route ${showTraffic ? 'traffic-on' : ''}`} />
                <path d={buildPath(route.points)} className="tactical-route-core" />
                {getDirectionMarkers(route.points, active).map((marker) => (
                  <polygon
                    key={marker.key}
                    points="-0.65,-0.42 0.7,0 -0.65,0.42"
                    className={`fleet-route-arrow ${active ? 'active' : ''}`}
                    transform={`translate(${marker.mapX} ${marker.mapY}) rotate(${marker.heading})`}
                  />
                ))}
                {!compact && (
                  <text x={route.labelX} y={route.labelY} className="route-road-label">
                    {route.roadLabel}
                  </text>
                )}
              </g>
            );
          })}

          {Object.entries(TRACKING_MAP_POINTS).map(([name, point]) => {
            const pinType = getPinType(name);
            const showLabel = !compact && !['HFC Site', 'Onrus Site'].includes(name);
            return (
              <g key={name} className={`tactical-map-pin pin-${pinType}`}>
                <circle cx={point.mapX} cy={point.mapY} r={pinType === 'town' ? 0.55 : 0.8} />
                {showLabel && (
                  <text
                    x={point.labelX || point.mapX + 1}
                    y={point.labelY || point.mapY - 1}
                    className="route-node-label tactical-place-label"
                    style={{ fill: palette.label }}
                  >
                    {name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {vehicles.map((vehicle, index) => {
          const isSelected = selectedVehicleId === vehicle.vehicleId;
          const isHovered = hoveredVehicleId === vehicle.vehicleId;
          const showLabel = isSelected || isHovered || fullscreen || (!compact && index % 3 === 0);

          return (
            <div key={`${vehicle.vehicleId}-layer`} className="fleet-trail-layer">
              <svg viewBox="0 0 100 100" className="fleet-trail-svg" aria-hidden="true">
                <polyline
                  points={(vehicle.movementTrail || []).map((point) => `${point.mapX},${point.mapY}`).join(' ')}
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
                className={`fleet-marker tactical-vehicle-marker ${isSelected ? 'selected' : ''} ${compact ? 'compact' : ''} ${
                  vehicle.status === 'On Route' ? 'live' : ''
                } ${vehicle.status === 'Delayed' ? 'delayed' : ''} ${vehicle.status === 'Offline' ? 'offline' : ''} ${
                  vehicle.status === 'At Site' ? 'at-site' : ''
                }`}
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
                <span className={`fleet-marker-label tactical-marker-label ${showLabel ? 'visible' : ''}`}>
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
  scenario,
  scenarioKey = 'normal',
}) {
  const [showTraffic, setShowTraffic] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(compact ? 1 : 1.04);
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredVehicleId, setHoveredVehicleId] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [followSelected, setFollowSelected] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState('');
  const [mapTheme, setMapTheme] = useState('dark');
  const [speedMultiplier, setSpeedMultiplier] = useState(() => liveFleetSimulator.getSpeedMultiplier());

  const displayedVehicles = useMemo(() => {
    const filteredByStatus = statusFilter === 'All' ? vehicles : vehicles.filter((vehicle) => vehicle.status === statusFilter);
    return compact ? filteredByStatus.slice(0, 7) : filteredByStatus;
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
      x: (50 - vehicle.mapX) * 0.18,
      y: (50 - vehicle.mapY) * 0.18,
    });
    setToast(`${vehicle.vehicleName} centered`);
  };

  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(compact ? 1 : 1.04);
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
    setToast(`Demo speed ${nextValue}x`);
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
      if (event.key === 'Escape') setFullscreenOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenOpen]);

  const toggleFollowSelected = (vehicle = selectedVehicle) => {
    setFollowSelected((value) => {
      const nextValue = !value;
      if (nextValue && vehicle) centerVehicle(vehicle);
      return nextValue;
    });
  };

  const toggleTheme = () => {
    setMapTheme((value) => (value === 'light' ? 'dark' : 'light'));
  };

  const openFullscreen = () => {
    if (selectedVehicle) centerVehicle(selectedVehicle);
    setFullscreenOpen(true);
  };

  const controls = (
    <div className={`live-fleet-map-toolbar tactical-map-toolbar ${compact ? 'compact-toolbar' : ''}`}>
      <div className="live-fleet-map-controls">
        {!compact && (
          <>
            <button type="button" className="map-control-button" title="Zoom out" onClick={() => setZoomLevel((value) => Math.max(0.94, value - 0.06))}>
              <Minus size={16} />
            </button>
            <button type="button" className="map-control-button" title="Zoom in" onClick={() => setZoomLevel((value) => Math.min(1.22, value + 0.06))}>
              <Plus size={16} />
            </button>
          </>
        )}
        <button type="button" className={`map-control-button ${showTraffic ? 'active' : ''}`} title="Toggle route risk overlay" onClick={() => setShowTraffic((value) => !value)}>
          <Radar size={16} />
          <span>Risk</span>
        </button>
        <button type="button" className={`map-control-button ${followSelected ? 'active' : ''}`} title="Follow selected vehicle" onClick={() => toggleFollowSelected()}>
          <LocateFixed size={16} />
          <span>Follow</span>
        </button>
        <button type="button" className="map-control-button" title="Toggle map theme" onClick={toggleTheme}>
          {mapTheme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
          <span>{mapTheme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
        {!compact && (
          <button type="button" className="map-control-button" title="Reset map view" onClick={resetView}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
        <button type="button" className="map-control-button" title="Open fullscreen command map" onClick={openFullscreen}>
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
      <div className={`live-fleet-map-card tactical-command-map ${compact ? 'compact' : 'full'} map-theme-${mapTheme}`}>
        <div className="live-fleet-map-header tactical-map-header">
          <div>
            <h3>{title}</h3>
            <p>{compact ? 'Live fleet snapshot.' : 'Mission board for active fleet movement, route risk, and tracker visibility.'}</p>
          </div>
          <div className="live-fleet-map-header-meta">
            <span className="live-badge">LIVE</span>
            <span className="live-timestamp">
              {selectedVehicle
                ? new Date(selectedVehicle.lastUpdated || selectedVehicle.lastSeen).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {shouldShowToolbar && controls}

        <FleetHudBar vehicles={displayedVehicles} compact={compact} lastSync={selectedVehicle?.lastUpdated || selectedVehicle?.lastSeen} />

        <div className="map-notification-badges tactical-alert-badges">
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

        {compact && <LiveEventTicker vehicles={displayedVehicles} scenarioKey={scenarioKey} compact maxItems={2} />}

        {showInlinePopup && selectedVehicle && (
          <div className={`live-fleet-map-popup ${compact ? 'compact' : ''}`}>
            <VehicleIntelPanel
              vehicle={selectedVehicle}
              compact
              onCenter={centerVehicle}
              onFollow={() => toggleFollowSelected(selectedVehicle)}
              onCall={(vehicle) => setToast(`Calling ${vehicle.driverName}`)}
            />
          </div>
        )}

        {toast && <div className="map-action-toast">{toast}</div>}
      </div>

      {fullscreenOpen && (
        <div className="map-fullscreen-overlay tactical-fullscreen-overlay">
          <div className="map-fullscreen-shell tactical-fullscreen-shell">
            <div className="map-fullscreen-topbar tactical-fullscreen-topbar">
              <div className="tactical-fullscreen-title">
                <span>Command map</span>
                <h2>Fleet Control Room</h2>
              </div>
              <FleetHudBar vehicles={displayedVehicles} lastSync={selectedVehicle?.lastUpdated || selectedVehicle?.lastSeen} />
              <div className="map-fullscreen-topbar-actions">
                {scenario && <ScenarioBadge scenario={scenario} />}
                <button type="button" className={`map-control-button ${showTraffic ? 'active' : ''}`} onClick={() => setShowTraffic((value) => !value)}>
                  <Radar size={16} />
                  <span>Risk</span>
                </button>
                <button type="button" className={`map-control-button ${followSelected ? 'active' : ''}`} onClick={() => toggleFollowSelected()}>
                  <LocateFixed size={16} />
                  <span>Follow</span>
                </button>
                <button type="button" className="map-control-button" onClick={toggleTheme}>
                  {mapTheme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
                  <span>{mapTheme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
                <button type="button" className="map-control-button" onClick={resetView}>
                  <RotateCcw size={16} />
                  <span>Reset</span>
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

            <div className="map-fullscreen-layout tactical-fullscreen-layout">
              <aside className="map-fullscreen-list tactical-fullscreen-list">
                <FleetTray vehicles={displayedVehicles} selectedVehicleId={selectedVehicle?.vehicleId} onSelectVehicle={handleSelectVehicle} />
              </aside>

              <main className="map-fullscreen-map tactical-fullscreen-map">
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
                <LiveEventTicker vehicles={displayedVehicles} scenarioKey={scenarioKey} maxItems={5} />
              </main>

              <aside className="map-fullscreen-side tactical-fullscreen-side">
                <VehicleIntelPanel
                  vehicle={selectedVehicle}
                  onCenter={centerVehicle}
                  onFollow={() => toggleFollowSelected(selectedVehicle)}
                  onCall={(vehicle) => setToast(`Calling ${vehicle.driverName}`)}
                />
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
