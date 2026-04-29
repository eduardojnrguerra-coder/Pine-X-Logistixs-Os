import {
  ALERTS,
  MAINTENANCE,
  VEHICLES,
  getCustomerById,
  getDriverById,
  getJobById,
} from '../data/demoData';

const LOCATION_POINTS = {
  'Cape Town Depot': { latitude: -33.925, longitude: 18.424, mapX: 9, mapY: 22, labelX: 6.5, labelY: 15.5 },
  'Cape Town': { latitude: -33.9249, longitude: 18.4241, mapX: 12, mapY: 25, labelX: 10.5, labelY: 30 },
  'Somerset West': { latitude: -34.0797, longitude: 18.8565, mapX: 29, mapY: 34, labelX: 23.5, labelY: 29 },
  Caledon: { latitude: -34.2299, longitude: 19.4265, mapX: 61, mapY: 38, labelX: 62, labelY: 33 },
  Hermanus: { latitude: -34.4187, longitude: 19.2345, mapX: 62, mapY: 62, labelX: 63.5, labelY: 56 },
  'Hermanus Yard': { latitude: -34.4156, longitude: 19.2402, mapX: 59, mapY: 58, labelX: 58, labelY: 53 },
  Onrus: { latitude: -34.4231, longitude: 19.1761, mapX: 54, mapY: 64, labelX: 49, labelY: 69 },
  Sandbaai: { latitude: -34.4265, longitude: 19.1524, mapX: 50, mapY: 67, labelX: 43.5, labelY: 72 },
  Kleinmond: { latitude: -34.3388, longitude: 19.0248, mapX: 44, mapY: 52, labelX: 37, labelY: 49 },
  "Betty's Bay": { latitude: -34.3597, longitude: 18.9084, mapX: 35, mapY: 58, labelX: 26, labelY: 62 },
  Stanford: { latitude: -34.4395, longitude: 19.4556, mapX: 75, mapY: 61, labelX: 76, labelY: 56 },
  Gansbaai: { latitude: -34.5806, longitude: 19.3519, mapX: 82, mapY: 74, labelX: 84, labelY: 69 },
  'Maintenance Yard': { latitude: -34.4142, longitude: 19.2366, mapX: 58, mapY: 62, labelX: 61, labelY: 67 },
  'HFC Site': { latitude: -34.407, longitude: 19.185, mapX: 57, mapY: 66, labelX: 58, labelY: 71 },
  'Onrus Site': { latitude: -34.421, longitude: 19.18, mapX: 52, mapY: 62, labelX: 47, labelY: 58 },
};

const point = (name, overrides = {}) => ({
  name,
  ...LOCATION_POINTS[name],
  speedZone: 'main',
  stop: false,
  ...overrides,
});

export const TRACKING_ROUTE_CORRIDORS = [
  {
    id: 'route-cape-hermanus',
    name: 'Cape Town Depot to Hermanus',
    roadLabel: 'N2 / R43',
    startDepot: 'Cape Town Depot',
    pickupPoint: 'Somerset West',
    dropoffPoint: 'Hermanus',
    waypoints: ['Somerset West', 'Caledon'],
    roadType: 'Main road',
    riskZones: ['zone-caledon', 'zone-r43'],
    distanceKm: 123,
    etaMinutes: 108,
    labelX: 39,
    labelY: 36,
    points: [
      point('Cape Town Depot', { stop: true, speedZone: 'yard' }),
      point('Cape Town', { mapX: 16, mapY: 27, latitude: -33.97, longitude: 18.54, speedZone: 'main' }),
      point('Somerset West', { stop: true, speedZone: 'town' }),
      point('Caledon', { mapX: 48, mapY: 36, latitude: -34.16, longitude: 19.12, speedZone: 'main' }),
      point('Caledon', { stop: true, speedZone: 'town' }),
      point('Hermanus', { mapX: 60, mapY: 52, latitude: -34.34, longitude: 19.26, speedZone: 'main' }),
      point('Hermanus', { stop: true, speedZone: 'town' }),
    ],
  },
  {
    id: 'route-yard-onrus-sandbaai',
    name: 'Hermanus Yard to Sandbaai',
    roadLabel: 'R43',
    startDepot: 'Hermanus Yard',
    pickupPoint: 'Hermanus Yard',
    dropoffPoint: 'Sandbaai',
    waypoints: ['Onrus'],
    roadType: 'Town road',
    riskZones: ['zone-onrus-site'],
    distanceKm: 9,
    etaMinutes: 24,
    labelX: 54,
    labelY: 63,
    points: [
      point('Hermanus Yard', { stop: true, speedZone: 'yard' }),
      point('Onrus', { mapX: 56, mapY: 60, latitude: -34.421, longitude: 19.19, speedZone: 'town' }),
      point('Onrus', { stop: true, speedZone: 'town' }),
      point('Sandbaai', { stop: true, speedZone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-kleinmond-bettys',
    name: 'Hermanus to Bettys Bay',
    roadLabel: 'R44',
    startDepot: 'Hermanus Yard',
    pickupPoint: 'Hermanus',
    dropoffPoint: "Betty's Bay",
    waypoints: ['Kleinmond'],
    roadType: 'Coastal road',
    riskZones: ['zone-kleinmond'],
    distanceKm: 55,
    etaMinutes: 62,
    labelX: 45,
    labelY: 51,
    points: [
      point('Hermanus', { stop: true, speedZone: 'town' }),
      point('Kleinmond', { mapX: 55, mapY: 56, latitude: -34.39, longitude: 19.14, speedZone: 'main' }),
      point('Kleinmond', { stop: true, speedZone: 'town' }),
      point("Betty's Bay", { stop: true, speedZone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-gansbaai',
    name: 'Hermanus to Gansbaai',
    roadLabel: 'R43',
    startDepot: 'Hermanus Yard',
    pickupPoint: 'Hermanus',
    dropoffPoint: 'Gansbaai',
    waypoints: ['Stanford'],
    roadType: 'Main road',
    riskZones: ['zone-gansbaai'],
    distanceKm: 44,
    etaMinutes: 52,
    labelX: 72,
    labelY: 65,
    points: [
      point('Hermanus', { stop: true, speedZone: 'town' }),
      point('Stanford', { mapX: 70, mapY: 61, latitude: -34.43, longitude: 19.39, speedZone: 'main' }),
      point('Stanford', { stop: true, speedZone: 'town' }),
      point('Gansbaai', { stop: true, speedZone: 'town' }),
    ],
  },
  {
    id: 'route-caledon-onrus',
    name: 'Caledon to Onrus',
    roadLabel: 'R320',
    startDepot: 'Caledon',
    pickupPoint: 'Caledon',
    dropoffPoint: 'Onrus',
    waypoints: ['Hermanus'],
    roadType: 'Regional road',
    riskZones: ['zone-r43'],
    distanceKm: 48,
    etaMinutes: 58,
    labelX: 59,
    labelY: 49,
    points: [
      point('Caledon', { stop: true, speedZone: 'town' }),
      point('Hermanus', { mapX: 64, mapY: 47, latitude: -34.32, longitude: 19.35, speedZone: 'main' }),
      point('Hermanus', { stop: true, speedZone: 'town' }),
      point('Onrus', { stop: true, speedZone: 'town' }),
    ],
  },
  {
    id: 'route-somerset-cape',
    name: 'Somerset West to Cape Town',
    roadLabel: 'N2',
    startDepot: 'Somerset West',
    pickupPoint: 'Somerset West',
    dropoffPoint: 'Cape Town Depot',
    waypoints: ['Cape Town'],
    roadType: 'Main road',
    riskZones: ['zone-n2'],
    distanceKm: 48,
    etaMinutes: 56,
    labelX: 20,
    labelY: 25,
    points: [
      point('Somerset West', { stop: true, speedZone: 'town' }),
      point('Cape Town', { mapX: 22, mapY: 29, latitude: -34.02, longitude: 18.72, speedZone: 'main' }),
      point('Cape Town', { mapX: 15, mapY: 26, latitude: -33.97, longitude: 18.56, speedZone: 'main' }),
      point('Cape Town Depot', { stop: true, speedZone: 'yard' }),
    ],
  },
  {
    id: 'route-gansbaai-stanford-hermanus',
    name: 'Gansbaai to Hermanus',
    roadLabel: 'R316 / R43',
    startDepot: 'Gansbaai',
    pickupPoint: 'Gansbaai',
    dropoffPoint: 'Hermanus',
    waypoints: ['Stanford'],
    roadType: 'Regional road',
    riskZones: ['zone-gansbaai'],
    distanceKm: 47,
    etaMinutes: 54,
    labelX: 72,
    labelY: 58,
    points: [
      point('Gansbaai', { stop: true, speedZone: 'town' }),
      point('Stanford', { stop: true, speedZone: 'town' }),
      point('Hermanus', { mapX: 68, mapY: 59, latitude: -34.41, longitude: 19.31, speedZone: 'main' }),
      point('Hermanus', { stop: true, speedZone: 'town' }),
    ],
  },
];

export const TRACKING_GEOFENCES = [
  { id: 'zone-cape-depot', label: 'Depot zone', type: 'depot', mapX: 9, mapY: 22, radius: 5.4, severity: 'info' },
  { id: 'zone-hermanus-yard', label: 'Hermanus yard', type: 'depot', mapX: 59, mapY: 58, radius: 4.8, severity: 'info' },
  { id: 'zone-maintenance-yard', label: 'Maintenance yard', type: 'maintenance', mapX: 58, mapY: 62, radius: 4.4, severity: 'warning' },
  { id: 'zone-onrus-site', label: 'Customer site', type: 'site', mapX: 52, mapY: 62, radius: 4.2, severity: 'info' },
  { id: 'zone-r43', label: 'Delay risk', type: 'risk', mapX: 63, mapY: 53, radius: 7.5, severity: 'danger' },
  { id: 'zone-gansbaai', label: 'Tracker blind spot', type: 'signal', mapX: 79, mapY: 69, radius: 7.2, severity: 'danger' },
  { id: 'zone-kleinmond', label: 'Coastal delay risk', type: 'risk', mapX: 45, mapY: 53, radius: 6.3, severity: 'warning' },
  { id: 'zone-n2', label: 'N2 congestion', type: 'risk', mapX: 20, mapY: 28, radius: 6.6, severity: 'warning' },
  { id: 'zone-caledon', label: 'Fuel risk', type: 'risk', mapX: 61, mapY: 38, radius: 5.2, severity: 'warning' },
];

export const TRACKING_RISK_ZONES = TRACKING_GEOFENCES.filter((zone) => ['risk', 'signal', 'maintenance'].includes(zone.type));

const VEHICLE_ROUTE_ASSIGNMENTS = {
  V001: 'route-cape-hermanus',
  V002: 'route-somerset-cape',
  V003: 'route-hermanus-gansbaai',
  V004: 'route-caledon-onrus',
  V005: 'route-yard-onrus-sandbaai',
  V006: 'route-hermanus-kleinmond-bettys',
  V007: 'route-yard-onrus-sandbaai',
  V008: 'route-hermanus-kleinmond-bettys',
  V009: 'route-gansbaai-stanford-hermanus',
  V010: 'route-somerset-cape',
  V011: 'route-cape-hermanus',
  V012: 'route-caledon-onrus',
};

const STATUS_COLORS = {
  'On Route': '#22c55e',
  'At Site': '#2563eb',
  'At Yard': '#7c3aed',
  Delayed: '#ef4444',
  Maintenance: '#f97316',
  Offline: '#94a3b8',
  Delivered: '#334155',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => t * t * (3 - 2 * t);

let simulatorSpeedMultiplier = 1;

const getHeading = (start, end) => {
  const deltaY = end.latitude - start.latitude;
  const deltaX = end.longitude - start.longitude;
  return ((Math.atan2(deltaX, deltaY) * 180) / Math.PI + 360) % 360;
};

const formatEta = (minutes) => {
  if (minutes <= 0) return 'Arrived';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${remainder}m`;
};

const getRouteById = (routeId) =>
  TRACKING_ROUTE_CORRIDORS.find((route) => route.id === routeId) || TRACKING_ROUTE_CORRIDORS[0];

const getVehicleBaseStatus = (vehicle, job) => {
  if (vehicle.status === 'Maintenance') return 'Maintenance';
  if (vehicle.status === 'Offline') return 'Offline';
  if (!job && vehicle.status === 'Idle') return 'At Yard';
  if (job?.status === 'Delayed') return 'Delayed';
  return 'On Route';
};

const getScheduleState = (status, routeProgress, speed) => {
  if (status === 'Delayed') return 'Delayed';
  if (status === 'At Site' || status === 'At Yard') return 'At risk';
  if (routeProgress >= 72 && speed >= 60) return 'Ahead of schedule';
  if (speed < 28 && routeProgress < 45) return 'At risk';
  return 'On time';
};

const buildLiveAlerts = (state) => {
  const alerts = [];
  if (state.status === 'Delayed') alerts.push({ label: 'DELAY RISK', tone: 'danger' });
  if (state.status === 'Offline' || state.trackerAlert) alerts.push({ label: 'TRACKER LOST', tone: 'neutral' });
  if (state.fuelLevel <= 25) alerts.push({ label: 'LOW FUEL', tone: 'warning' });
  if (state.status === 'Maintenance') alerts.push({ label: 'MAINTENANCE', tone: 'warning' });
  return alerts.slice(0, 2);
};

const buildVehicleInsights = (state) => {
  const primaryInsight =
    state.scheduleState === 'Delayed'
      ? 'Potential delay'
      : state.scheduleState === 'At risk'
        ? 'At risk'
        : state.scheduleState === 'Ahead of schedule'
          ? 'Ahead of schedule'
          : 'On time';

  const insights = [{ label: primaryInsight, tone: state.scheduleState === 'Delayed' ? 'danger' : state.scheduleState === 'At risk' ? 'warning' : 'success' }];

  if (state.idleMinutes >= 10) insights.push({ label: `Idle for ${state.idleMinutes} min`, tone: 'warning' });
  if (state.fuelLevel <= 25) insights.push({ label: 'Fuel level low', tone: 'warning' });
  if (state.status === 'Offline') insights.push({ label: 'Tracker offline', tone: 'neutral' });
  if (state.serviceDueKm <= 2500) insights.push({ label: 'Service due soon', tone: 'warning' });

  return insights.slice(0, 4);
};

const appendTrailPoint = (trail, trailPoint) => [...(trail || []).slice(-10), trailPoint];

const distanceToZone = (mapX, mapY, zone) => Math.hypot(mapX - zone.mapX, mapY - zone.mapY);

const getZonesForPosition = (mapX, mapY) =>
  TRACKING_GEOFENCES.filter((zone) => distanceToZone(mapX, mapY, zone) <= zone.radius).map((zone) => zone.id);

const getZoneLabel = (zoneId) => TRACKING_GEOFENCES.find((zone) => zone.id === zoneId)?.label || 'operational zone';

const createVehicleState = (vehicle, index) => {
  const route = getRouteById(VEHICLE_ROUTE_ASSIGNMENTS[vehicle.id]);
  const job = getJobById(vehicle.currentJobId);
  const driver = getDriverById(vehicle.driverId);
  const customer = job ? getCustomerById(job.customerId) : null;
  const maintenanceItem = MAINTENANCE.find((item) => item.vehicleId === vehicle.id && item.status !== 'Completed');
  const trackerAlert = ALERTS.find((alert) => alert.vehicleId === vehicle.id && alert.type === 'Tracker Offline' && alert.status !== 'Resolved');
  const baseStatus = getVehicleBaseStatus(vehicle, job);
  const initialSegment = vehicle.status === 'Idle' ? 0 : clamp(index % (route.points.length - 1), 0, route.points.length - 2);
  const initialProgress = baseStatus === 'On Route' || baseStatus === 'Delayed' ? 0.1 + (index % 4) * 0.16 : 0;
  const start = route.points[initialSegment];
  const end = route.points[initialSegment + 1] || start;
  const easedProgress = easeInOut(initialProgress);
  const baseMapX = lerp(start.mapX, end.mapX, easedProgress);
  const baseMapY = lerp(start.mapY, end.mapY, easedProgress);
  const currentZones = getZonesForPosition(baseMapX, baseMapY);

  const state = {
    vehicleId: vehicle.id,
    registration: vehicle.registration,
    vehicleName: vehicle.name,
    provider: vehicle.trackerProvider || 'Demo Adapter',
    trackerDeviceId: vehicle.trackerDeviceId,
    latitude: lerp(start.latitude, end.latitude, easedProgress),
    longitude: lerp(start.longitude, end.longitude, easedProgress),
    mapX: baseMapX,
    mapY: baseMapY,
    baseMapX,
    baseMapY,
    speed:
      baseStatus === 'On Route'
        ? start.speedZone === 'town'
          ? 28 + (index % 3) * 5
          : 56 + (index % 4) * 7
        : baseStatus === 'Delayed'
          ? 16
          : 0,
    targetSpeed: 0,
    heading: getHeading(start, end),
    ignitionStatus: baseStatus === 'At Yard' || baseStatus === 'Maintenance' || baseStatus === 'Offline' ? 'Off' : 'On',
    odometer: vehicle.odometer,
    fuelLevel: vehicle.fuelLevel,
    lastSeen: new Date().toISOString(),
    status: baseStatus,
    currentJobId: job?.id || null,
    driverId: driver?.id || null,
    driverStatus: driver?.status || 'On Duty',
    eta: baseStatus === 'Offline' ? 'Tracker offline' : baseStatus === 'Maintenance' ? 'Workshop' : formatEta(route.etaMinutes),
    routeProgress: Math.round(((initialSegment + initialProgress) / Math.max(1, route.points.length - 1)) * 100),
    nextStop: end.name,
    routeId: route.id,
    routeName: route.name,
    routeRoadLabel: route.roadLabel,
    routeDistanceKm: route.distanceKm,
    routeEtaMinutes: route.etaMinutes,
    routeRiskZones: route.riskZones,
    routePoints: route.points,
    routeIndex: initialSegment,
    segmentProgress: initialProgress,
    pauseTicks: baseStatus === 'At Yard' ? 2 : 0,
    idleMinutes: baseStatus === 'At Yard' ? 11 + index : 0,
    driverName: driver?.name || 'Unassigned',
    driverPhone: driver?.phone || 'No mobile assigned',
    customerName: customer?.companyName || customer?.name || 'Internal movement',
    customerId: customer?.id || null,
    currentJobNumber: job?.jobNumber || 'No active job',
    pickupLocation: job?.pickupLocation || route.pickupPoint,
    dropoffLocation: job?.dropoffLocation || route.dropoffPoint,
    cargo: job?.cargo || 'General cargo',
    priority: job?.priority || 'Medium',
    delayReason: job?.status === 'Delayed' ? job.notes || 'Traffic congestion on the corridor.' : '',
    maintenanceWarning: maintenanceItem ? `${maintenanceItem.title} is ${maintenanceItem.status.toLowerCase()}.` : '',
    complianceWarning:
      vehicle.licenceExpiry && new Date(vehicle.licenceExpiry) < new Date('2026-06-30')
        ? `Licence expires ${vehicle.licenceExpiry}.`
        : '',
    serviceDueKm: vehicle.serviceDueKm,
    openInvoiceValue: job?.price || 0,
    trackerAlert: trackerAlert?.message || '',
    latestStop: start.name,
    scheduleState: getScheduleState(baseStatus, 0, 0),
    routeHistory: [],
    movementTrail: appendTrailPoint([], { mapX: baseMapX, mapY: baseMapY }),
    motionTick: index * 3,
    idleJitterSeed: index + 1,
    zoneIds: currentZones,
    zoneLabels: currentZones.map(getZoneLabel),
    suggestedAction: '',
  };

  state.scheduleState = getScheduleState(state.status, state.routeProgress, state.speed);
  state.liveAlerts = buildLiveAlerts(state);
  state.insights = buildVehicleInsights(state);
  state.suggestedAction =
    state.status === 'Delayed'
      ? 'Call driver and update customer ETA before escalation.'
      : state.status === 'Offline'
        ? 'Recover tracker visibility and verify position with the driver.'
        : state.fuelLevel <= 25
          ? 'Check fuel plan before next segment.'
          : 'Monitor route and keep dispatch aligned.';
  state.routeHistory = [
    {
      label: 'Job created',
      time: new Date(Date.now() - (140 + index * 9) * 60000).toISOString(),
      detail: `${state.currentJobNumber} created for ${state.customerName}.`,
    },
    {
      label: 'Dispatched',
      time: new Date(Date.now() - (88 + index * 7) * 60000).toISOString(),
      detail: `${state.vehicleName} left ${state.pickupLocation}.`,
    },
    {
      label: 'Live position update',
      time: state.lastSeen,
      detail: `${Math.round(state.speed)} km/h toward ${state.nextStop}.`,
    },
  ];

  return state;
};

const getIdleJitter = (vehicle) => ({
  x: Math.sin((vehicle.motionTick + vehicle.idleJitterSeed) / 1.8) * 0.12,
  y: Math.cos((vehicle.motionTick + vehicle.idleJitterSeed) / 2.2) * 0.09,
});

const getTargetSpeed = ({ delayMode, approachingStop, speedZone }) => {
  let targetSpeed;
  if (delayMode) {
    targetSpeed = 7 + Math.round(Math.random() * 18);
  } else if (speedZone === 'yard') {
    targetSpeed = 0;
  } else if (speedZone === 'town') {
    targetSpeed = 18 + Math.round(Math.random() * 24);
  } else {
    targetSpeed = 54 + Math.round(Math.random() * 32);
  }

  return approachingStop ? Math.max(6, targetSpeed - 24) : targetSpeed;
};

const buildStatusEvent = (vehicle) => {
  if (vehicle.status === 'Delayed') {
    return {
      severity: 'danger',
      message: `Delay risk detected on ${vehicle.routeRoadLabel || vehicle.routeName} for ${vehicle.registration}.`,
    };
  }
  if (vehicle.status === 'Offline') {
    return {
      severity: 'neutral',
      message: `Tracker signal lost for ${vehicle.vehicleName}.`,
    };
  }
  if (vehicle.fuelLevel <= 22) {
    return {
      severity: 'warning',
      message: `Low fuel warning on ${vehicle.registration}.`,
    };
  }
  if (vehicle.status === 'At Site') {
    return {
      severity: 'info',
      message: `${vehicle.vehicleName} stopped at ${vehicle.nextStop} site.`,
    };
  }
  return {
    severity: 'info',
    message: `${vehicle.registration} entered ${vehicle.nextStop} corridor.`,
  };
};

const advanceVehicle = (vehicle) => {
  const now = new Date().toISOString();
  const motionTick = vehicle.motionTick + 1;

  if (vehicle.status === 'Offline') {
    const offlineVehicle = {
      ...vehicle,
      speed: 0,
      targetSpeed: 0,
      ignitionStatus: 'Off',
      eta: 'Tracker offline',
      scheduleState: 'Delayed',
      motionTick,
      liveAlerts: buildLiveAlerts(vehicle),
      eventCandidate: Math.random() > 0.68 ? buildStatusEvent(vehicle) : null,
    };
    offlineVehicle.insights = buildVehicleInsights(offlineVehicle);
    return offlineVehicle;
  }

  if (vehicle.status === 'Maintenance') {
    const workshop = LOCATION_POINTS['Maintenance Yard'];
    const maintenanceVehicle = {
      ...vehicle,
      baseMapX: workshop.mapX,
      baseMapY: workshop.mapY,
      mapX: workshop.mapX,
      mapY: workshop.mapY,
      latitude: workshop.latitude,
      longitude: workshop.longitude,
      speed: 0,
      targetSpeed: 0,
      ignitionStatus: 'Off',
      eta: 'Workshop',
      nextStop: 'Maintenance Yard',
      scheduleState: 'At risk',
      lastSeen: now,
      motionTick,
      movementTrail: appendTrailPoint(vehicle.movementTrail, { mapX: workshop.mapX, mapY: workshop.mapY }),
      zoneIds: getZonesForPosition(workshop.mapX, workshop.mapY),
      eventCandidate: Math.random() > 0.74 ? { severity: 'warning', message: `${vehicle.vehicleName} is held at maintenance yard.` } : null,
    };
    maintenanceVehicle.zoneLabels = maintenanceVehicle.zoneIds.map(getZoneLabel);
    maintenanceVehicle.liveAlerts = buildLiveAlerts(maintenanceVehicle);
    maintenanceVehicle.insights = buildVehicleInsights(maintenanceVehicle);
    return maintenanceVehicle;
  }

  if (vehicle.pauseTicks > 0) {
    const jitter = getIdleJitter({ ...vehicle, motionTick });
    const mapX = vehicle.baseMapX + jitter.x;
    const mapY = vehicle.baseMapY + jitter.y;
    const currentZones = getZonesForPosition(mapX, mapY);
    const pausedVehicle = {
      ...vehicle,
      pauseTicks: vehicle.pauseTicks - 1,
      speed: Math.max(0, vehicle.speed - 10),
      targetSpeed: 0,
      status: vehicle.status === 'At Yard' ? 'At Yard' : 'At Site',
      ignitionStatus: vehicle.status === 'At Yard' ? 'Off' : 'On',
      idleMinutes: vehicle.idleMinutes + 2,
      eta: formatEta(Math.max(8, Math.round((100 - vehicle.routeProgress) * 0.9))),
      lastSeen: now,
      motionTick,
      mapX,
      mapY,
      movementTrail: appendTrailPoint(vehicle.movementTrail, { mapX, mapY }),
      zoneIds: currentZones,
      zoneLabels: currentZones.map(getZoneLabel),
      eventCandidate: Math.random() > 0.65 ? buildStatusEvent({ ...vehicle, status: 'At Site' }) : null,
    };
    pausedVehicle.scheduleState = getScheduleState(pausedVehicle.status, pausedVehicle.routeProgress, pausedVehicle.speed);
    pausedVehicle.liveAlerts = buildLiveAlerts(pausedVehicle);
    pausedVehicle.insights = buildVehicleInsights(pausedVehicle);
    return pausedVehicle;
  }

  const routePoints = vehicle.routePoints;
  const currentIndex = clamp(vehicle.routeIndex, 0, routePoints.length - 2);
  const start = routePoints[currentIndex];
  const end = routePoints[currentIndex + 1] || start;
  const approachingStop = end.stop && vehicle.segmentProgress > 0.68;
  const delayMode = vehicle.currentJobId === 'JOB-010' || vehicle.status === 'Delayed';
  const targetSpeed = getTargetSpeed({ delayMode, approachingStop, speedZone: start.speedZone });
  const accelerationLimit = targetSpeed > vehicle.speed ? 8 : 10;
  const acceleratedSpeed = clamp(vehicle.speed + clamp(targetSpeed - vehicle.speed, -accelerationLimit, accelerationLimit), 0, 90);
  const nextSegmentProgress = clamp(
    vehicle.segmentProgress + ((acceleratedSpeed / 100) * 0.17 + 0.026) * simulatorSpeedMultiplier,
    0,
    1
  );

  let nextIndex = currentIndex;
  let segmentProgress = nextSegmentProgress;
  let pauseTicks = 0;
  let status = delayMode ? 'Delayed' : 'On Route';

  if (nextSegmentProgress >= 1 && currentIndex < routePoints.length - 2) {
    nextIndex = currentIndex + 1;
    segmentProgress = 0;
    pauseTicks = routePoints[nextIndex].stop ? 1 + (routePoints[nextIndex].speedZone === 'town' ? 1 : 0) : 0;
    status = pauseTicks > 0 ? 'At Site' : status;
  } else if (nextSegmentProgress >= 1 && currentIndex >= routePoints.length - 2) {
    segmentProgress = 1;
    pauseTicks = 2;
    status = 'Delivered';
  }

  const nextStart = routePoints[nextIndex];
  const nextEnd = routePoints[nextIndex + 1] || routePoints[nextIndex];
  const easedProgress = easeInOut(segmentProgress);
  const latitude = lerp(nextStart.latitude, nextEnd.latitude, easedProgress);
  const longitude = lerp(nextStart.longitude, nextEnd.longitude, easedProgress);
  const baseMapX = lerp(nextStart.mapX, nextEnd.mapX, easedProgress);
  const baseMapY = lerp(nextStart.mapY, nextEnd.mapY, easedProgress);
  const routeProgress = Math.round(((nextIndex + segmentProgress) / Math.max(1, routePoints.length - 1)) * 100);
  const currentZones = getZonesForPosition(baseMapX, baseMapY);
  const enteredZoneId = currentZones.find((zoneId) => !vehicle.zoneIds?.includes(zoneId));

  let speed = acceleratedSpeed;
  if (status === 'Delivered' || status === 'At Site' || status === 'At Yard') {
    speed = 0;
  }

  const etaMinutes =
    status === 'Delivered'
      ? 0
      : Math.max(6, Math.round(((100 - routeProgress) / 100) * (status === 'Delayed' ? 135 : vehicle.routeEtaMinutes || 82) / simulatorSpeedMultiplier));

  const updated = {
    ...vehicle,
    latitude,
    longitude,
    baseMapX,
    baseMapY,
    mapX: baseMapX,
    mapY: baseMapY,
    speed,
    targetSpeed,
    heading: getHeading(nextStart, nextEnd),
    ignitionStatus: status === 'Delivered' ? 'Off' : status === 'At Yard' ? 'Off' : 'On',
    odometer: vehicle.odometer + Math.max(0, Math.round(speed / 7)),
    fuelLevel: clamp(vehicle.fuelLevel - (speed > 0 ? 0.24 : 0.04), 8, 100),
    lastSeen: now,
    status,
    eta: status === 'Delivered' ? 'Delivered' : formatEta(etaMinutes),
    routeProgress,
    nextStop: status === 'Delivered' ? vehicle.dropoffLocation : nextEnd.name,
    routeIndex: nextIndex,
    segmentProgress,
    pauseTicks,
    idleMinutes: pauseTicks > 0 ? vehicle.idleMinutes + 2 : 0,
    latestStop: nextStart.name,
    delayReason: status === 'Delayed' ? vehicle.delayReason || 'Traffic congestion and slow customer access.' : '',
    motionTick,
    movementTrail: appendTrailPoint(vehicle.movementTrail, { mapX: baseMapX, mapY: baseMapY }),
    zoneIds: currentZones,
    zoneLabels: currentZones.map(getZoneLabel),
  };

  updated.scheduleState = getScheduleState(updated.status, updated.routeProgress, updated.speed);
  updated.liveAlerts = buildLiveAlerts(updated);
  updated.insights = buildVehicleInsights(updated);
  updated.suggestedAction =
    updated.status === 'Delayed'
      ? 'Call driver and update customer ETA before escalation.'
      : updated.status === 'Offline'
        ? 'Recover tracker visibility and verify position with driver.'
        : updated.fuelLevel <= 25
          ? 'Check fuel plan before the next route segment.'
          : 'Continue monitoring route execution.';

  const zoneEvent = enteredZoneId
    ? {
        severity: TRACKING_GEOFENCES.find((zone) => zone.id === enteredZoneId)?.severity || 'info',
        message: `${updated.registration} entered ${getZoneLabel(enteredZoneId)}.`,
      }
    : null;
  updated.eventCandidate = zoneEvent || (Math.random() > 0.74 ? buildStatusEvent(updated) : null);

  updated.routeHistory = [
    {
      label:
        updated.status === 'Delayed'
          ? 'Delay risk'
          : updated.status === 'At Site'
            ? 'At customer site'
            : updated.status === 'Delivered'
              ? 'Delivered'
              : 'Position ping',
      time: now,
      detail:
        updated.status === 'Delayed'
          ? `${updated.vehicleName} slowed near ${updated.nextStop}.`
          : updated.status === 'At Site'
            ? `${updated.vehicleName} paused at ${updated.nextStop}.`
            : updated.status === 'Delivered'
              ? `${updated.currentJobNumber} completed at ${updated.dropoffLocation}.`
              : `${Math.round(updated.speed)} km/h toward ${updated.nextStop}.`,
    },
    ...vehicle.routeHistory,
  ].slice(0, 6);

  return updated;
};

class LiveFleetSimulator {
  constructor() {
    this.listeners = [];
    this.eventListeners = [];
    this.intervalId = null;
    this.fleet = VEHICLES.filter((vehicle) => vehicle.trackerDeviceId).slice(0, 9).map(createVehicleState);
    this.lastUpdated = new Date().toISOString();
    this.events = [
      {
        id: 'evt-initial-command-ready',
        timestamp: this.lastUpdated,
        severity: 'info',
        message: 'Fleet command map synchronized with demo telemetry.',
      },
    ];
  }

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.fleet = this.fleet.map(advanceVehicle);
      this.lastUpdated = new Date().toISOString();
      this.captureEvents();
      this.emit();
    }, 1400);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setSpeedMultiplier(multiplier) {
    simulatorSpeedMultiplier = multiplier;
    this.addEvent({
      severity: 'info',
      message: `Demo simulator speed changed to ${multiplier}x.`,
    });
    this.emit();
  }

  getSpeedMultiplier() {
    return simulatorSpeedMultiplier;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getFleet());
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    };
  }

  subscribeEvents(listener) {
    this.eventListeners.push(listener);
    listener(this.getEvents());
    return () => {
      this.eventListeners = this.eventListeners.filter((entry) => entry !== listener);
    };
  }

  addEvent(event) {
    this.events = [
      {
        id: `evt-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        severity: event.severity || 'info',
        message: event.message,
      },
      ...this.events,
    ].slice(0, 16);
    this.emitEvents();
  }

  captureEvents() {
    const candidates = this.fleet
      .map((vehicle) => vehicle.eventCandidate)
      .filter(Boolean);

    if (candidates.length > 0) {
      this.addEvent(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }

  emit() {
    const snapshot = this.getFleet();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  emitEvents() {
    const snapshot = this.getEvents();
    this.eventListeners.forEach((listener) => listener(snapshot));
  }

  getEvents() {
    return [...this.events];
  }

  getFleet() {
    return this.fleet.map((vehicle) => ({
      ...vehicle,
      statusColor: STATUS_COLORS[vehicle.status] || STATUS_COLORS['On Route'],
      lastUpdated: this.lastUpdated,
    }));
  }

  getVehicle(vehicleId) {
    return this.getFleet().find((vehicle) => vehicle.vehicleId === vehicleId);
  }

  getSummary() {
    const fleet = this.getFleet();
    return {
      total: fleet.length,
      onRoute: fleet.filter((vehicle) => vehicle.status === 'On Route').length,
      delayed: fleet.filter((vehicle) => vehicle.status === 'Delayed').length,
      offline: fleet.filter((vehicle) => vehicle.status === 'Offline').length,
      atSite: fleet.filter((vehicle) => vehicle.status === 'At Site').length,
      atYard: fleet.filter((vehicle) => vehicle.status === 'At Yard').length,
      maintenance: fleet.filter((vehicle) => vehicle.status === 'Maintenance').length,
      lastUpdated: this.lastUpdated,
    };
  }
}

export const liveFleetSimulator = new LiveFleetSimulator();
export const getNormalizedFleetSnapshot = () => liveFleetSimulator.getFleet();
export const getFleetSummary = () => liveFleetSimulator.getSummary();
export const getFleetVehicle = (vehicleId) => liveFleetSimulator.getVehicle(vehicleId);
export const getFleetEvents = () => liveFleetSimulator.getEvents();
export const TRACKING_MAP_POINTS = LOCATION_POINTS;
