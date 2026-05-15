import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import {
  ExternalLink,
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
  depots: true,
  geofences: false,
  risk: false,
};
const MAP_CENTER = [-34.4187, 19.2345];
const MAP_BOUNDS = [
  [-34.78, 18.34],
  [-33.78, 19.72],
];
const CRITICAL_VEHICLE_STATUSES = new Set(['Delayed', 'Offline', 'Maintenance']);

const getLatLng = (item) => [item.latitude, item.longitude];
const hasLatLng = (item) => Number.isFinite(item?.latitude) && Number.isFinite(item?.longitude);
const getStatusSlug = (status = '') => status.toLowerCase().replace(/\s+/g, '-');
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const isOperationalPoint = (name) =>
  ['Depot', 'Yard', 'Site', 'Maintenance', 'Fuel', 'Hub'].some((term) => name.includes(term));

const getMapZoom = (displayMode) => {
  if (displayMode === DISPLAY_MODES.COMPACT) return 9;
  if (displayMode === DISPLAY_MODES.FULLSCREEN) return 10;
  return 10;
};

const getVehicleBounds = (vehicles) => {
  const latLngs = vehicles.filter(hasLatLng).map(getLatLng);
  return latLngs.length > 0 ? L.latLngBounds(latLngs) : L.latLngBounds(MAP_BOUNDS);
};

const getRouteCoordinates = (route) => route.points.filter(hasLatLng).map(getLatLng);

const getRouteProgressSegments = (route, vehicle) => {
  if (!vehicle || vehicle.routeId !== route.id || !hasLatLng(vehicle)) {
    return null;
  }

  const currentIndex = Math.max(0, Math.min(vehicle.routeIndex || 0, route.points.length - 2));
  const vehiclePoint = getLatLng(vehicle);
  const completed = [...route.points.slice(0, currentIndex + 1).filter(hasLatLng).map(getLatLng), vehiclePoint];
  const remaining = [vehiclePoint, ...route.points.slice(currentIndex + 1).filter(hasLatLng).map(getLatLng)];

  return { completed, remaining };
};

const getZoneStyle = (zone, mapTheme) => {
  const danger = zone.severity === 'danger';
  const warning = zone.severity === 'warning';
  const color = danger ? '#ef4444' : warning ? '#f59e0b' : '#2563eb';
  const fillOpacity = mapTheme === 'dark' ? 0.07 : 0.05;

  return {
    color,
    fillColor: color,
    fillOpacity: danger ? fillOpacity + 0.03 : fillOpacity,
    opacity: danger ? 0.42 : 0.28,
    weight: danger ? 1.4 : 1,
    dashArray: danger ? '7 7' : '5 7',
  };
};

const getRouteStyle = ({ active, delayed, displayMode }) => {
  if (active) {
    return {
      color: delayed ? '#f97316' : '#0ea5e9',
      weight: displayMode === DISPLAY_MODES.COMPACT ? 4 : 5,
      opacity: 0.78,
      lineCap: 'round',
      lineJoin: 'round',
    };
  }

  return {
    color: '#2563eb',
    weight: displayMode === DISPLAY_MODES.COMPACT ? 2.2 : 3,
    opacity: displayMode === DISPLAY_MODES.COMPACT ? 0.18 : 0.22,
    lineCap: 'round',
    lineJoin: 'round',
  };
};

const createTruckIcon = ({ vehicle, isSelected, isHovered, compact, fullscreen, focusMode, showAlerts }) => {
  const isCritical = CRITICAL_VEHICLE_STATUSES.has(vehicle.status);
  const showLabel = isSelected || isHovered;
  const statusSlug = getStatusSlug(vehicle.status);
  const labelHtml = showLabel
    ? `<span class="leaflet-truck-label visible">
        <strong>${escapeHtml(vehicle.vehicleName)}</strong>
        <small>${escapeHtml(vehicle.status)}</small>
        <em>${escapeHtml(vehicle.eta)}</em>
      </span>`
    : '';
  const alertHtml =
    showAlerts && !compact && !focusMode && (isSelected || isCritical) && vehicle.liveAlerts?.length
      ? `<span class="leaflet-truck-alert">${escapeHtml(vehicle.liveAlerts[0].label)}</span>`
      : '';

  return L.divIcon({
    className: 'leaflet-fleet-divicon',
    html: `
      <div
        class="leaflet-truck-marker status-${statusSlug} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isCritical ? 'critical' : ''} ${compact ? 'compact' : ''} ${fullscreen ? 'fullscreen' : ''}"
        style="--marker-color:${vehicle.statusColor || '#22c55e'}"
      >
        <span class="leaflet-truck-pulse"></span>
        <span class="leaflet-truck-core" style="transform: rotate(${Number(vehicle.heading || 0).toFixed(1)}deg)">
          <span class="leaflet-truck-cab"></span>
          <span class="leaflet-truck-body"></span>
        </span>
        ${isSelected ? `<span class="leaflet-speed-chip">${Math.round(vehicle.speed || 0)} km/h</span>` : ''}
        ${alertHtml}
        ${labelHtml}
      </div>
    `,
    iconSize: isSelected ? [120, 70] : [compact ? 42 : 54, compact ? 42 : 54],
    iconAnchor: isSelected ? [24, 24] : [21, 21],
  });
};

function LeafletMapController({
  vehicles,
  selectedVehicle,
  followSelected,
  centerRequest,
  resetRequest,
  zoomCommand,
  displayMode,
}) {
  const map = useMap();
  const vehiclesRef = useRef(vehicles);
  const vehicleSignature = vehicles.map((vehicle) => vehicle.vehicleId).join('|');
  const selectedLatitude = selectedVehicle?.latitude;
  const selectedLongitude = selectedVehicle?.longitude;

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();
      const bounds = getVehicleBounds(vehiclesRef.current);
      map.fitBounds(bounds, {
        padding: displayMode === DISPLAY_MODES.COMPACT ? [22, 22] : [46, 46],
        maxZoom: getMapZoom(displayMode),
      });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [displayMode, map, resetRequest, vehicleSignature]);

  useEffect(() => {
    if (!zoomCommand?.id) return;
    const currentZoom = map.getZoom();
    map.setZoom(zoomCommand.direction === 'in' ? currentZoom + 1 : currentZoom - 1);
  }, [map, zoomCommand]);

  useEffect(() => {
    if (!centerRequest?.id) return;
    const targetVehicle = vehiclesRef.current.find((vehicle) => vehicle.vehicleId === centerRequest.vehicleId);
    if (!targetVehicle || !hasLatLng(targetVehicle)) return;
    map.setView(getLatLng(targetVehicle), Math.max(map.getZoom(), 12), { animate: true });
  }, [centerRequest, map]);

  useEffect(() => {
    if (!followSelected || !Number.isFinite(selectedLatitude) || !Number.isFinite(selectedLongitude)) return;
    map.panTo([selectedLatitude, selectedLongitude], { animate: true, duration: 0.55 });
  }, [followSelected, map, selectedLatitude, selectedLongitude]);

  return null;
}

function RealFleetMapCanvas({
  vehicles,
  selectedVehicleId,
  displayMode,
  showTraffic,
  hoveredVehicleId,
  mapTheme,
  visibleLayers,
  focusMode = false,
  followSelected,
  centerRequest,
  resetRequest,
  zoomCommand,
  onHoverVehicle,
  onSelectVehicle,
}) {
  const compact = displayMode === DISPLAY_MODES.COMPACT;
  const fullscreen = displayMode === DISPLAY_MODES.FULLSCREEN;
  const selectedVehicle = vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) || null;
  const selectedRoute = selectedVehicle
    ? TRACKING_ROUTE_CORRIDORS.find((route) => route.id === selectedVehicle.routeId)
    : null;

  const mapVehicles = vehicles.filter(hasLatLng);
  const activeSegments = selectedRoute ? getRouteProgressSegments(selectedRoute, selectedVehicle) : null;

  return (
    <div className={`real-fleet-map-stage mode-${displayMode} theme-${mapTheme}`}>
      <MapContainer
        center={MAP_CENTER}
        zoom={getMapZoom(displayMode)}
        minZoom={8}
        maxZoom={15}
        zoomControl={false}
        scrollWheelZoom={!compact || fullscreen}
        className="real-fleet-leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LeafletMapController
          vehicles={mapVehicles}
          selectedVehicle={selectedVehicle}
          followSelected={followSelected}
          centerRequest={centerRequest}
          resetRequest={resetRequest}
          zoomCommand={zoomCommand}
          displayMode={displayMode}
        />

        {visibleLayers.routes &&
          TRACKING_ROUTE_CORRIDORS.filter((route) => !focusMode || route.id === selectedRoute?.id).map((route) => {
            const active = route.id === selectedRoute?.id;
            const routeVehicle = vehicles.find((vehicle) => vehicle.routeId === route.id);
            const delayed = selectedVehicle?.routeId === route.id && selectedVehicle?.status === 'Delayed';
            const coordinates = getRouteCoordinates(route);

            if (coordinates.length < 2) return null;

            return (
              <Polyline
                key={route.id}
                positions={coordinates}
                pathOptions={getRouteStyle({
                  active,
                  delayed: delayed || routeVehicle?.status === 'Delayed',
                  displayMode,
                })}
              />
            );
          })}

        {visibleLayers.routes && activeSegments?.completed?.length > 1 && (
          <Polyline
            positions={activeSegments.completed}
            pathOptions={{
              color: selectedVehicle?.status === 'Delayed' ? '#fb923c' : '#22c55e',
              weight: compact ? 4 : 6,
              opacity: 0.86,
              dashArray: '9 7',
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {visibleLayers.routes && activeSegments?.remaining?.length > 1 && (
          <Polyline
            positions={activeSegments.remaining}
            pathOptions={{
              color: selectedVehicle?.status === 'Delayed' ? '#ef4444' : '#0284c7',
              weight: compact ? 3 : 5,
              opacity: compact ? 0.42 : 0.62,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {visibleLayers.geofences &&
          TRACKING_GEOFENCES.filter((zone) => {
            if (!hasLatLng(zone)) return false;
            if (focusMode) return zone.severity === 'danger';
            return showTraffic || !['risk', 'signal'].includes(zone.type);
          }).map((zone) => (
            <Circle
              key={zone.id}
              center={getLatLng(zone)}
              radius={zone.radiusMeters || 1000}
              pathOptions={getZoneStyle(zone, mapTheme)}
            >
              {!compact && <Tooltip direction="top">{zone.label}</Tooltip>}
            </Circle>
          ))}

        {visibleLayers.depots &&
          Object.entries(TRACKING_MAP_POINTS)
            .filter(([name, point]) => isOperationalPoint(name) && hasLatLng(point))
            .map(([name, point]) => (
              <CircleMarker
                key={name}
                center={getLatLng(point)}
                radius={name.includes('Depot') || name.includes('Yard') ? 6 : 4}
                pathOptions={{
                  color: name.includes('Maintenance') ? '#f97316' : name.includes('Fuel') ? '#eab308' : '#0ea5e9',
                  fillColor: name.includes('Maintenance') ? '#f97316' : name.includes('Fuel') ? '#eab308' : '#0ea5e9',
                  fillOpacity: compact ? 0.55 : 0.72,
                  opacity: compact ? 0.42 : 0.7,
                  weight: 1,
                }}
              >
                {!compact && <Tooltip direction="top">{name}</Tooltip>}
              </CircleMarker>
            ))}

        {mapVehicles.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.vehicleId;
          const isHovered = hoveredVehicleId === vehicle.vehicleId;

          return (
            <Marker
              key={vehicle.vehicleId}
              position={getLatLng(vehicle)}
              icon={createTruckIcon({
                vehicle,
                isSelected,
                isHovered,
                compact,
                fullscreen,
                focusMode,
                showAlerts: visibleLayers.alerts,
              })}
              zIndexOffset={isSelected ? 1000 : CRITICAL_VEHICLE_STATUSES.has(vehicle.status) ? 650 : 400}
              eventHandlers={{
                click: () => onSelectVehicle?.(vehicle),
                mouseover: () => onHoverVehicle(vehicle.vehicleId),
                mouseout: () => onHoverVehicle(null),
              }}
            />
          );
        })}
      </MapContainer>
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
  const navigate = useNavigate();
  const displayMode = requestedDisplayMode || (compactProp ? DISPLAY_MODES.COMPACT : DISPLAY_MODES.FULL_PAGE);
  const isCompactMode = displayMode === DISPLAY_MODES.COMPACT;
  const isFullPageMode = displayMode === DISPLAY_MODES.FULL_PAGE;
  const [showTraffic, setShowTraffic] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredVehicleId, setHoveredVehicleId] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [followSelected, setFollowSelected] = useState(false);
  const [toast, setToast] = useState('');
  const [mapTheme, setMapTheme] = useState('light');
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_MAP_LAYERS);
  const [focusMode, setFocusMode] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(() => liveFleetSimulator.getSpeedMultiplier());
  const [centerRequest, setCenterRequest] = useState({ id: 0, vehicleId: null });
  const [resetRequest, setResetRequest] = useState(0);
  const [zoomCommand, setZoomCommand] = useState({ id: 0, direction: 'in' });

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
  const focusMapLayers = focusMode
    ? {
        routes: true,
        alerts: true,
        depots: false,
        geofences: true,
        risk: true,
      }
    : visibleLayers;
  const fullscreenMapVehicles = focusMode && selectedVehicle
    ? [
        selectedVehicle,
        ...displayedVehicles.filter(
          (vehicle) =>
            vehicle.vehicleId !== selectedVehicle.vehicleId &&
            (CRITICAL_VEHICLE_STATUSES.has(vehicle.status) || vehicle.liveAlerts?.length > 0)
        ),
      ]
    : displayedVehicles;

  const centerVehicle = (vehicle) => {
    if (!vehicle) return;
    setCenterRequest({ id: Date.now(), vehicleId: vehicle.vehicleId });
    setToast(`${vehicle.vehicleName} centered`);
  };

  const resetView = () => {
    setResetRequest((value) => value + 1);
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

  const triggerZoom = (direction) => {
    setZoomCommand({ id: Date.now(), direction });
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
    <div className="compact-map-preview-controls real-map-preview-controls">
      <span className="live-badge">LIVE</span>
      <button type="button" className="map-control-button compact-fullscreen-button" title="Open full tracking page" onClick={() => navigate('/tracking')}>
        <ExternalLink size={15} />
        <span>Open tracking</span>
      </button>
      <button type="button" className="map-control-button compact-fullscreen-button" title="Open fullscreen map" onClick={openFullscreen}>
        <Maximize2 size={15} />
        <span>Fullscreen</span>
      </button>
    </div>
  );

  const controls = (
    <div className={`live-fleet-map-toolbar tactical-map-toolbar real-map-toolbar ${isCompactMode ? 'compact-toolbar' : ''}`}>
      <div className="live-fleet-map-controls">
        {isFullPageMode && (
          <>
            <button type="button" className="map-control-button" title="Zoom out" onClick={() => triggerZoom('out')}>
              <Minus size={16} />
            </button>
            <button type="button" className="map-control-button" title="Zoom in" onClick={() => triggerZoom('in')}>
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
        <button type="button" className="map-control-button" title="Open fullscreen map" onClick={openFullscreen}>
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
      <div className={`live-fleet-map-card tactical-command-map real-command-map mode-${displayMode} ${isCompactMode ? 'compact preview' : 'full'} map-theme-${inlineMapTheme}`}>
        {isFullPageMode && (
          <div className="live-fleet-map-header tactical-map-header">
            <div>
              <h3>{title}</h3>
              <p>OpenStreetMap live tracking for active fleet movement, route risk, and tracker visibility.</p>
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
        )}

        {isFullPageMode && controls}
        {isFullPageMode && layerControls}

        {isFullPageMode && <FleetHudBar vehicles={displayedVehicles} compact={false} lastSync={selectedVehicle?.lastUpdated || selectedVehicle?.lastSeen} />}

        {isFullPageMode && (
          <div className="map-notification-badges tactical-alert-badges">
            {alertBadges.map((badge) => (
              <span key={badge.label} className={`map-notification-badge tone-${badge.tone}`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <RealFleetMapCanvas
          vehicles={displayedVehicles}
          selectedVehicleId={selectedVehicle?.vehicleId}
          displayMode={displayMode}
          showTraffic={isFullPageMode && showTraffic}
          hoveredVehicleId={hoveredVehicleId}
          mapTheme={inlineMapTheme}
          visibleLayers={inlineMapLayers}
          followSelected={followSelected}
          centerRequest={centerRequest}
          resetRequest={resetRequest}
          zoomCommand={zoomCommand}
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
        <div className={`map-fullscreen-overlay tactical-fullscreen-overlay real-map-fullscreen-overlay mode-fullscreen ${focusMode ? 'focus-mode' : ''}`}>
          <div className="map-fullscreen-shell tactical-fullscreen-shell">
            <div className="map-fullscreen-topbar tactical-fullscreen-topbar">
              <div className="tactical-fullscreen-left">
                <div className="tactical-fullscreen-title">
                  <span>Real map command view</span>
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
                  <span>Focus Mode</span>
                </button>
                <button type="button" className="map-control-button map-zoom-control" title="Zoom out" onClick={() => triggerZoom('out')}>
                  <Minus size={16} />
                </button>
                <button type="button" className="map-control-button map-zoom-control" title="Zoom in" onClick={() => triggerZoom('in')}>
                  <Plus size={16} />
                </button>
                {!focusMode && (
                  <button type="button" className={`map-control-button ${showTraffic && visibleLayers.risk ? 'active' : ''}`} onClick={() => toggleLayer('risk')}>
                    <Radar size={16} />
                    <span>Risk</span>
                  </button>
                )}
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
              {!focusMode && (
                <aside className="map-fullscreen-list tactical-fullscreen-list">
                  <FleetTray vehicles={displayedVehicles} selectedVehicleId={selectedVehicle?.vehicleId} onSelectVehicle={handleSelectVehicle} />
                </aside>
              )}

              <main className="map-fullscreen-map tactical-fullscreen-map real-fullscreen-map">
                <RealFleetMapCanvas
                  vehicles={fullscreenMapVehicles}
                  selectedVehicleId={selectedVehicle?.vehicleId}
                  displayMode={DISPLAY_MODES.FULLSCREEN}
                  showTraffic={!focusMode && showTraffic}
                  hoveredVehicleId={hoveredVehicleId}
                  mapTheme={mapTheme}
                  visibleLayers={focusMapLayers}
                  focusMode={focusMode}
                  followSelected={followSelected}
                  centerRequest={centerRequest}
                  resetRequest={resetRequest}
                  zoomCommand={zoomCommand}
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
          {toast && <div className="map-action-toast fullscreen-toast">{toast}</div>}
        </div>
      )}
    </>
  );
}
