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
  Target,
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
  'M 0 78 C 10 74, 20 69, 31 67 C 44 65, 53 70, 62 69 C 73 67, 82 71, 91 79 C 96 84, 99 90, 100 100 L 0 100 Z';
const TERRAIN_PATH =
  'M 9 12 C 23 6, 42 9, 54 18 C 68 28, 78 28, 92 24 L 96 48 C 83 53, 78 60, 77 70 C 65 75, 52 75, 42 69 C 29 62, 18 50, 9 35 Z';
const STATUS_FILTERS = ['All', 'On Route', 'Delayed', 'Offline', 'At Site', 'At Yard', 'Maintenance'];
const SPEED_OPTIONS = [0.75, 1, 1.5, 2];
const DISPLAY_MODES = {
  COMPACT: 'compact',
  FULL_PAGE: 'fullPage',
  FULLSCREEN: 'fullscreen',
};
const MAP_LAYER_OPTIONS = [
  { key: 'routes', label: 'Routes' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'depots', label: 'Depots' },
  { key: 'geofences', label: 'Geofences' },
  { key: 'risk', label: 'Traffic/Risk' },
];
const DEFAULT_MAP_LAYERS = {
  routes: true,
  alerts: true,
  depots: true,
  geofences: true,
  risk: true,
};
const COMPACT_PREVIEW_LAYERS = {
  routes: true,
  alerts: false,
  depots: false,
  geofences: false,
  risk: false,
};
const ROAD_LABELS = [
  { label: 'N2', x: 21, y: 31 },
  { label: 'R43', x: 67, y: 61 },
  { label: 'R44', x: 32, y: 64 },
  { label: 'R316', x: 77, y: 48 },
  { label: 'R320', x: 57, y: 43 },
  { label: 'Main Corridor', x: 36, y: 35 },
  { label: 'Coastal Route', x: 28, y: 58 },
  { label: 'High Risk Delay Zone', x: 69, y: 51, tone: 'risk' },
];
const HIDDEN_MAP_POINT_ALIASES = new Set(['HFC Site', 'Onrus Site']);
const KEY_FULLSCREEN_POINT_LABELS = new Set(['Cape Town Depot', 'Hermanus Yard', 'Caledon Hub', 'Gansbaai Site', 'Fuel Stop']);
const CRITICAL_VEHICLE_STATUSES = new Set(['Delayed', 'Offline', 'Maintenance']);

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
  if (name.includes('Fuel')) return 'fuel';
  if (name.includes('Maintenance')) return 'maintenance';
  if (name.includes('Hub')) return 'hub';
  if (name.includes('Depot') || name.includes('Yard')) return 'depot';
  if (name.includes('Site')) return 'site';
  return 'town';
};

const isOperationalPin = (pinType) => ['depot', 'site', 'maintenance', 'fuel', 'hub'].includes(pinType);

const getRouteProgressSegments = (route, vehicle) => {
  if (!vehicle || vehicle.routeId !== route.id) return null;
  const currentIndex = Math.max(0, Math.min(vehicle.routeIndex || 0, route.points.length - 2));
  const livePoint = {
    name: 'Live position',
    mapX: vehicle.mapX,
    mapY: vehicle.mapY,
  };
  const completedPoints = [...route.points.slice(0, currentIndex + 1), livePoint];
  const pendingPoints = [livePoint, ...route.points.slice(currentIndex + 1)];

  return {
    completedPath: buildPath(completedPoints),
    pendingPath: buildPath(pendingPoints),
  };
};

function MapCanvas({
  vehicles,
  selectedVehicleId,
  displayMode,
  zoomLevel,
  showTraffic,
  panOffset,
  hoveredVehicleId,
  mapTheme,
  visibleLayers,
  focusMode = false,
  onHoverVehicle,
  onSelectVehicle,
}) {
  const compact = displayMode === DISPLAY_MODES.COMPACT;
  const fullscreen = displayMode === DISPLAY_MODES.FULLSCREEN;
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
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className={`live-fleet-map-svg tactical-map-svg ${mapTheme}`}
          aria-label="Live tactical fleet map"
        >
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
              <feDropShadow dx="0" dy="0" stdDeviation="0.7" floodColor="rgba(56, 189, 248, 0.24)" />
            </filter>
            <filter id="activeCorridorGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.1" floodColor="rgba(34, 197, 94, 0.48)" />
            </filter>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill={`url(#tacticalLand-${mapTheme})`} />
          <rect x="0" y="0" width="100" height="100" fill={`url(#tacticalGrid-${mapTheme})`} />
          <path d={COAST_PATH} fill={`url(#tacticalWater-${mapTheme})`} opacity="0.96" />
          <path d={TERRAIN_PATH} fill={palette.terrain} opacity="0.72" />

          {visibleLayers.routes && (
            <g className="tactical-road-network">
              <path d="M 6 18 C 18 24, 29 32, 43 35 C 50 37, 55 34, 61 31" />
              <path d="M 61 31 C 63 42, 65 52, 62 66" />
              <path d="M 62 66 C 54 69, 48 73, 42 76" />
              <path d="M 62 66 C 70 65, 78 68, 91 84" />
              <path d="M 57 31 C 66 39, 73 48, 91 84" />
              <path d="M 31 39 C 24 48, 20 58, 23 68" />
            </g>
          )}

          {visibleLayers.geofences &&
            TRACKING_GEOFENCES.filter((zone) => {
              if (focusMode) return zone.severity === 'danger';
              return visibleLayers.risk || !['risk', 'signal'].includes(zone.type);
            }).map((zone) => (
              <g key={zone.id} className={`tactical-geofence type-${zone.type} severity-${zone.severity}`}>
                <circle cx={zone.mapX} cy={zone.mapY} r={zone.radius} />
                {!compact && !focusMode && (
                  <text x={zone.mapX} y={zone.mapY - zone.radius - 1.1} className="tactical-geofence-label">
                    {zone.label}
                  </text>
                )}
              </g>
            ))}

          {visibleLayers.routes &&
            TRACKING_ROUTE_CORRIDORS.filter((route) => !focusMode || selectedVehicle?.routeId === route.id).map((route) => {
              const active = selectedVehicle?.routeId === route.id;
              const segments = getRouteProgressSegments(route, selectedVehicle);
              const showRouteLabels = !compact && (!fullscreen || active);
              const showRouteDetails = !compact && (!fullscreen || active) && !focusMode;
              return (
                <g key={route.id} className={`route-corridor ${active ? 'active' : 'inactive'}`} filter={active ? 'url(#activeCorridorGlow)' : 'url(#corridorGlow)'}>
                  <path d={buildPath(route.points)} className={`fleet-route-line tactical-route ${showTraffic && visibleLayers.risk ? 'traffic-on' : ''}`} />
                  <path d={buildPath(route.points)} className="tactical-route-core" />
                  {!compact && active && segments?.pendingPath && <path d={segments.pendingPath} className="selected-route-pending" />}
                  {!compact && active && segments?.completedPath && <path d={segments.completedPath} className="selected-route-completed" />}
                  {showRouteDetails &&
                    getDirectionMarkers(route.points, active).map((marker) => (
                      <g key={marker.key} transform={`translate(${marker.mapX} ${marker.mapY}) rotate(${marker.heading})`}>
                        <polygon points="-0.65,-0.42 0.7,0 -0.65,0.42" className={`fleet-route-arrow ${active ? 'active' : ''}`} />
                        <circle cx="-1.55" cy="0" r="0.28" className={`fleet-route-direction-dot ${active ? 'active' : ''}`} />
                      </g>
                    ))}
                  {showRouteLabels && (
                    <>
                      <text x={route.labelX} y={route.labelY} className="route-road-label">
                        {route.roadLabel}
                      </text>
                      {!fullscreen && <text x={route.labelX} y={route.labelY + 2.2} className="route-corridor-label">
                        {route.corridorLabel}
                      </text>}
                    </>
                  )}
                </g>
              );
            })}

          {visibleLayers.routes &&
            !compact &&
            ROAD_LABELS.filter((label) => visibleLayers.risk || label.tone !== 'risk')
              .filter((label) => !focusMode && (!fullscreen || ['N2', 'R43', 'R44', 'R316'].includes(label.label)))
              .slice(0, fullscreen ? 4 : ROAD_LABELS.length)
              .map((label) => (
              <text key={label.label} x={label.x} y={label.y} className={`road-context-label ${label.tone === 'risk' ? 'risk' : ''}`}>
                {label.label}
              </text>
            ))}

          {Object.entries(TRACKING_MAP_POINTS).map(([name, point]) => {
            if (HIDDEN_MAP_POINT_ALIASES.has(name)) return null;
            const pinType = getPinType(name);
            if (isOperationalPin(pinType) && !visibleLayers.depots) return null;
            const showLabel =
              !compact &&
              !focusMode &&
              (fullscreen ? KEY_FULLSCREEN_POINT_LABELS.has(name) : visibleLayers.depots || !isOperationalPin(pinType));
            return (
              <g key={name} className={`tactical-map-pin pin-${pinType}`}>
                <circle cx={point.mapX} cy={point.mapY} r={pinType === 'town' ? 0.55 : 0.95} />
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

        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.vehicleId;
          const isHovered = hoveredVehicleId === vehicle.vehicleId;
          const isCritical = CRITICAL_VEHICLE_STATUSES.has(vehicle.status) || vehicle.liveAlerts?.length > 0;
          const showLabel = isSelected || isHovered || (!compact && !focusMode && isCritical);

          return (
            <div key={`${vehicle.vehicleId}-layer`} className="fleet-trail-layer">
              <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                className="fleet-trail-svg"
                aria-hidden="true"
              >
                <polyline
                  points={(vehicle.movementTrail || []).map((point) => `${point.mapX},${point.mapY}`).join(' ')}
                  className={`fleet-trail-line ${vehicle.status === 'Offline' ? 'offline' : ''}`}
                />
              </svg>
              {visibleLayers.alerts &&
                vehicle.liveAlerts?.slice(0, compact ? 1 : 2).map((alert, alertIndex) => (
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
  compact: compactProp = false,
  displayMode: requestedDisplayMode,
  title = 'Live Fleet Map',
  showInlinePopup = true,
  scenario,
  scenarioKey = 'normal',
}) {
  // LiveFleetMap has three intentionally separate display modes:
  // compact = dashboard preview, fullPage = /tracking, fullscreen = overlay.
  const displayMode = requestedDisplayMode || (compactProp ? DISPLAY_MODES.COMPACT : DISPLAY_MODES.FULL_PAGE);
  const isCompactMode = displayMode === DISPLAY_MODES.COMPACT;
  const isFullPageMode = displayMode === DISPLAY_MODES.FULL_PAGE;
  const [showTraffic, setShowTraffic] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(isCompactMode ? 1 : 1.04);
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredVehicleId, setHoveredVehicleId] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [followSelected, setFollowSelected] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState('');
  const [mapTheme, setMapTheme] = useState('dark');
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_MAP_LAYERS);
  const [focusMode, setFocusMode] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(() => liveFleetSimulator.getSpeedMultiplier());

  const displayedVehicles = useMemo(() => {
    const filteredByStatus = statusFilter === 'All' ? vehicles : vehicles.filter((vehicle) => vehicle.status === statusFilter);
    return isCompactMode ? filteredByStatus.slice(0, 6) : filteredByStatus;
  }, [isCompactMode, statusFilter, vehicles]);

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

  const inlineMapTheme = isCompactMode && !fullscreenOpen ? 'light' : mapTheme;
  const inlineMapLayers = isCompactMode ? COMPACT_PREVIEW_LAYERS : visibleLayers;
  const shouldShowToolbar = isFullPageMode;
  const focusMapLayers = focusMode
    ? {
        routes: true,
        alerts: true,
        depots: false,
        geofences: false,
        risk: false,
      }
    : visibleLayers;
  const fullscreenMapVehicles = focusMode && selectedVehicle ? [selectedVehicle] : displayedVehicles;

  const centerVehicle = (vehicle) => {
    if (!vehicle) return;
    const panLimit = fullscreenOpen ? 4.5 : Math.max(0, (zoomLevel - 1) * 48);
    const clampPan = (value) => Math.max(-panLimit, Math.min(panLimit, value));
    setPanOffset({
      x: clampPan((50 - vehicle.mapX) * 0.18),
      y: clampPan((50 - vehicle.mapY) * 0.18),
    });
    setToast(`${vehicle.vehicleName} centered`);
  };

  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(isCompactMode ? 1 : 1.04);
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

  const toggleLayer = (layerKey) => {
    setVisibleLayers((current) => {
      const nextLayers = {
        ...current,
        [layerKey]: !current[layerKey],
      };
      if (layerKey === 'risk') {
        setShowTraffic(nextLayers.risk);
      }
      setToast(`${MAP_LAYER_OPTIONS.find((option) => option.key === layerKey)?.label || 'Layer'} ${nextLayers[layerKey] ? 'shown' : 'hidden'}`);
      return nextLayers;
    });
  };

  const openFullscreen = () => {
    if (isCompactMode) setMapTheme('dark');
    if (selectedVehicle) centerVehicle(selectedVehicle);
    setFullscreenOpen(true);
  };

  const layerControls = (
    <div className={`map-layer-toggles ${isCompactMode && !fullscreenOpen ? 'compact' : ''}`}>
      {MAP_LAYER_OPTIONS.map((layer) => (
        <button
          key={layer.key}
          type="button"
          className={`map-layer-toggle ${visibleLayers[layer.key] ? 'active' : ''}`}
          onClick={() => toggleLayer(layer.key)}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );

  const compactPreviewControls = isCompactMode && (
    <div className="compact-map-preview-controls">
      <span className="live-badge">LIVE</span>
      <button type="button" className="map-control-button compact-fullscreen-button" title="Open fullscreen command map" onClick={openFullscreen}>
        <Maximize2 size={15} />
        <span>Fullscreen</span>
      </button>
    </div>
  );

  const controls = (
    <div className={`live-fleet-map-toolbar tactical-map-toolbar ${isCompactMode ? 'compact-toolbar' : ''}`}>
      <div className="live-fleet-map-controls">
        {isFullPageMode && (
          <>
            <button type="button" className="map-control-button" title="Zoom out" onClick={() => setZoomLevel((value) => Math.max(0.94, value - 0.06))}>
              <Minus size={16} />
            </button>
            <button type="button" className="map-control-button" title="Zoom in" onClick={() => setZoomLevel((value) => Math.min(1.22, value + 0.06))}>
              <Plus size={16} />
            </button>
          </>
        )}
        <button type="button" className={`map-control-button ${showTraffic && visibleLayers.risk ? 'active' : ''}`} title="Toggle route risk overlay" onClick={() => toggleLayer('risk')}>
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
        {isFullPageMode && (
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
        <label className={`map-filter-select ${isCompactMode ? 'compact-filter' : ''}`}>
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
      <div className={`live-fleet-map-card tactical-command-map mode-${displayMode} ${isCompactMode ? 'compact preview' : 'full'} map-theme-${inlineMapTheme}`}>
        {isFullPageMode && <div className="live-fleet-map-header tactical-map-header">
          <div>
            <h3>{title}</h3>
            <p>Mission board for active fleet movement, route risk, and tracker visibility.</p>
          </div>
          <div className="live-fleet-map-header-meta">
            <span className="live-badge">LIVE</span>
            <span className="live-timestamp">
              {selectedVehicle
                ? new Date(selectedVehicle.lastUpdated || selectedVehicle.lastSeen).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>}

        {shouldShowToolbar && controls}
        {isFullPageMode && layerControls}

        {isFullPageMode && <FleetHudBar vehicles={displayedVehicles} compact={false} lastSync={selectedVehicle?.lastUpdated || selectedVehicle?.lastSeen} />}

        {isFullPageMode && <div className="map-notification-badges tactical-alert-badges">
          {alertBadges.map((badge) => (
            <span key={badge.label} className={`map-notification-badge tone-${badge.tone}`}>
              {badge.label}
            </span>
          ))}
        </div>}

        <MapCanvas
          vehicles={displayedVehicles}
          selectedVehicleId={selectedVehicle?.vehicleId}
          displayMode={displayMode}
          zoomLevel={zoomLevel}
          showTraffic={isFullPageMode && showTraffic}
          panOffset={panOffset}
          hoveredVehicleId={hoveredVehicleId}
          mapTheme={inlineMapTheme}
          visibleLayers={inlineMapLayers}
          onHoverVehicle={setHoveredVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

        {compactPreviewControls}

        {isFullPageMode && showInlinePopup && selectedVehicle && (
          <div className="live-fleet-map-popup">
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
        <div className={`map-fullscreen-overlay tactical-fullscreen-overlay mode-fullscreen ${focusMode ? 'focus-mode' : ''}`}>
          <div className="map-fullscreen-shell tactical-fullscreen-shell">
            <div className="map-fullscreen-topbar tactical-fullscreen-topbar">
              <div className="tactical-fullscreen-left">
                <div className="tactical-fullscreen-title">
                  <span>Command map</span>
                  <h2>Fleet Control Room</h2>
                </div>
                {!focusMode && <div className="map-fullscreen-layer-bar">{layerControls}</div>}
              </div>

              <div className="tactical-fullscreen-center">
                <FleetHudBar vehicles={displayedVehicles} compact lastSync={selectedVehicle?.lastUpdated || selectedVehicle?.lastSeen} />
              </div>

              <div className="map-fullscreen-topbar-actions tactical-fullscreen-actions">
                {scenario && <ScenarioBadge scenario={scenario} />}
                <button type="button" className={`map-control-button ${focusMode ? 'active' : ''}`} title="Toggle focus mode" onClick={() => setFocusMode((value) => !value)}>
                  <Target size={16} />
                  <span>Focus</span>
                </button>
                <button type="button" className="map-control-button map-zoom-control" title="Zoom out" onClick={() => setZoomLevel((value) => Math.max(0.94, value - 0.06))}>
                  <Minus size={16} />
                </button>
                <button type="button" className="map-control-button map-zoom-control" title="Zoom in" onClick={() => setZoomLevel((value) => Math.min(1.24, value + 0.06))}>
                  <Plus size={16} />
                </button>
                {!focusMode && <button type="button" className={`map-control-button ${showTraffic && visibleLayers.risk ? 'active' : ''}`} onClick={() => toggleLayer('risk')}>
                  <Radar size={16} />
                  <span>Risk</span>
                </button>}
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
              {!focusMode && <aside className="map-fullscreen-list tactical-fullscreen-list">
                <FleetTray vehicles={displayedVehicles} selectedVehicleId={selectedVehicle?.vehicleId} onSelectVehicle={handleSelectVehicle} />
              </aside>}

              <main className="map-fullscreen-map tactical-fullscreen-map">
                <MapCanvas
                  vehicles={fullscreenMapVehicles}
                  selectedVehicleId={selectedVehicle?.vehicleId}
                  displayMode={DISPLAY_MODES.FULLSCREEN}
                  zoomLevel={Math.max(1.04, zoomLevel)}
                  showTraffic={!focusMode && showTraffic}
                  panOffset={panOffset}
                  hoveredVehicleId={hoveredVehicleId}
                  mapTheme={mapTheme}
                  visibleLayers={focusMapLayers}
                  focusMode={focusMode}
                  onHoverVehicle={setHoveredVehicleId}
                  onSelectVehicle={handleSelectVehicle}
                />
                {!focusMode && <LiveEventTicker vehicles={displayedVehicles} scenarioKey={scenarioKey} maxItems={4} />}
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
