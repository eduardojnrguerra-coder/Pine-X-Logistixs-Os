import {
  ALERTS,
  MAINTENANCE,
  VEHICLES,
  getCustomerById,
  getDriverById,
  getJobById,
} from '../data/demoData';

const LOCATION_POINTS = {
  'Cape Town': { latitude: -33.9249, longitude: 18.4241, mapX: 9, mapY: 22, labelX: 7, labelY: 16 },
  'Somerset West': { latitude: -34.0797, longitude: 18.8565, mapX: 27, mapY: 28, labelX: 24, labelY: 22 },
  Hermanus: { latitude: -34.4187, longitude: 19.2345, mapX: 58, mapY: 54, labelX: 60, labelY: 48 },
  Onrus: { latitude: -34.4231, longitude: 19.1761, mapX: 53, mapY: 58, labelX: 48, labelY: 63 },
  Sandbaai: { latitude: -34.4265, longitude: 19.1524, mapX: 50, mapY: 61, labelX: 44, labelY: 66 },
  Kleinmond: { latitude: -34.3388, longitude: 19.0248, mapX: 44, mapY: 46, labelX: 38, labelY: 43 },
  "Betty's Bay": { latitude: -34.3597, longitude: 18.9084, mapX: 37, mapY: 50, labelX: 28, labelY: 55 },
  Gansbaai: { latitude: -34.5806, longitude: 19.3519, mapX: 77, mapY: 67, labelX: 79, labelY: 62 },
  Caledon: { latitude: -34.2299, longitude: 19.4265, mapX: 73, mapY: 36, labelX: 75, labelY: 31 },
  Workshop: { latitude: -34.4142, longitude: 19.2366, mapX: 60, mapY: 58, labelX: 63, labelY: 63 },
  Yard: { latitude: -34.4156, longitude: 19.2402, mapX: 61, mapY: 56, labelX: 64, labelY: 51 },
};

const point = (name, overrides = {}) => ({
  name,
  ...LOCATION_POINTS[name],
  zone: 'main',
  stop: false,
  ...overrides,
});

export const TRACKING_ROUTE_CORRIDORS = [
  {
    id: 'route-hermanus-onrus',
    name: 'Hermanus to Onrus',
    points: [
      point('Hermanus', { stop: true, zone: 'town' }),
      point('Hermanus', { mapX: 56, mapY: 55, latitude: -34.4201, longitude: 19.218, zone: 'town' }),
      point('Onrus', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-sandbaai',
    name: 'Hermanus to Sandbaai',
    points: [
      point('Hermanus', { stop: true, zone: 'town' }),
      point('Hermanus', { mapX: 55, mapY: 57, latitude: -34.4219, longitude: 19.205, zone: 'town' }),
      point('Sandbaai', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-kleinmond',
    name: 'Hermanus to Kleinmond',
    points: [
      point('Hermanus', { stop: true, zone: 'town' }),
      point('Kleinmond', { mapX: 54, mapY: 50, latitude: -34.391, longitude: 19.154, zone: 'main' }),
      point('Kleinmond', { mapX: 49, mapY: 47, latitude: -34.362, longitude: 19.086, zone: 'main' }),
      point('Kleinmond', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-gansbaai',
    name: 'Hermanus to Gansbaai',
    points: [
      point('Hermanus', { stop: true, zone: 'town' }),
      point('Gansbaai', { mapX: 64, mapY: 58, latitude: -34.462, longitude: 19.28, zone: 'main' }),
      point('Gansbaai', { mapX: 71, mapY: 63, latitude: -34.522, longitude: 19.323, zone: 'main' }),
      point('Gansbaai', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-hermanus-caledon',
    name: 'Hermanus to Caledon',
    points: [
      point('Hermanus', { stop: true, zone: 'town' }),
      point('Caledon', { mapX: 63, mapY: 47, latitude: -34.355, longitude: 19.312, zone: 'main' }),
      point('Caledon', { mapX: 69, mapY: 40, latitude: -34.287, longitude: 19.394, zone: 'main' }),
      point('Caledon', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-somerset-cape',
    name: 'Somerset West to Cape Town',
    points: [
      point('Somerset West', { stop: true, zone: 'town' }),
      point('Somerset West', { mapX: 21, mapY: 26, latitude: -34.033, longitude: 18.756, zone: 'main' }),
      point('Cape Town', { mapX: 14, mapY: 23, latitude: -33.975, longitude: 18.602, zone: 'main' }),
      point('Cape Town', { stop: true, zone: 'town' }),
    ],
  },
  {
    id: 'route-kleinmond-bettys',
    name: "Kleinmond to Betty's Bay",
    points: [
      point('Kleinmond', { stop: true, zone: 'town' }),
      point("Betty's Bay", { mapX: 41, mapY: 48, latitude: -34.347, longitude: 18.968, zone: 'town' }),
      point("Betty's Bay", { stop: true, zone: 'town' }),
    ],
  },
];

const VEHICLE_ROUTE_ASSIGNMENTS = {
  V001: 'route-hermanus-onrus',
  V002: 'route-somerset-cape',
  V003: 'route-hermanus-gansbaai',
  V004: 'route-hermanus-caledon',
  V005: 'route-hermanus-sandbaai',
  V006: 'route-hermanus-kleinmond',
  V007: 'route-hermanus-sandbaai',
  V008: 'route-kleinmond-bettys',
  V009: 'route-hermanus-gansbaai',
  V010: 'route-somerset-cape',
  V011: 'route-hermanus-kleinmond',
  V012: 'route-hermanus-onrus',
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

const createVehicleState = (vehicle, index) => {
  const route = getRouteById(VEHICLE_ROUTE_ASSIGNMENTS[vehicle.id]);
  const job = getJobById(vehicle.currentJobId);
  const driver = getDriverById(vehicle.driverId);
  const customer = job ? getCustomerById(job.customerId) : null;
  const maintenanceItem = MAINTENANCE.find((item) => item.vehicleId === vehicle.id && item.status !== 'Completed');
  const trackerAlert = ALERTS.find((alert) => alert.vehicleId === vehicle.id && alert.type === 'Tracker Offline' && alert.status !== 'Resolved');
  const baseStatus = getVehicleBaseStatus(vehicle, job);
  const initialSegment = vehicle.status === 'Idle' ? 0 : clamp(index % (route.points.length - 1), 0, route.points.length - 2);
  const initialProgress = baseStatus === 'On Route' || baseStatus === 'Delayed' ? 0.12 + (index % 3) * 0.18 : 0;
  const start = route.points[initialSegment];
  const end = route.points[initialSegment + 1] || start;
  const easedProgress = easeInOut(initialProgress);

  const state = {
    vehicleId: vehicle.id,
    registration: vehicle.registration,
    vehicleName: vehicle.name,
    provider: vehicle.trackerProvider || 'Demo Adapter',
    trackerDeviceId: vehicle.trackerDeviceId,
    latitude: lerp(start.latitude, end.latitude, easedProgress),
    longitude: lerp(start.longitude, end.longitude, easedProgress),
    mapX: lerp(start.mapX, end.mapX, easedProgress),
    mapY: lerp(start.mapY, end.mapY, easedProgress),
    speed:
      baseStatus === 'On Route'
        ? start.zone === 'town'
          ? 34 + (index % 2) * 4
          : 58 + (index % 3) * 7
        : baseStatus === 'Delayed'
          ? 18
          : 0,
    heading: getHeading(start, end),
    ignitionStatus: baseStatus === 'At Yard' || baseStatus === 'Maintenance' || baseStatus === 'Offline' ? 'Off' : 'On',
    odometer: vehicle.odometer,
    fuelLevel: vehicle.fuelLevel,
    lastSeen: new Date().toISOString(),
    status: baseStatus,
    currentJobId: job?.id || null,
    driverId: driver?.id || null,
    eta: baseStatus === 'Offline' ? 'Tracker offline' : baseStatus === 'Maintenance' ? 'Workshop' : '1h 05m',
    routeProgress: Math.round(((initialSegment + initialProgress) / Math.max(1, route.points.length - 1)) * 100),
    nextStop: end.name,
    routeId: route.id,
    routeName: route.name,
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
    pickupLocation: job?.pickupLocation || route.points[0].name,
    dropoffLocation: job?.dropoffLocation || route.points[route.points.length - 1].name,
    cargo: job?.cargo || 'General cargo',
    priority: job?.priority || 'Medium',
    delayReason: job?.status === 'Delayed' ? job.notes || 'Traffic congestion on the corridor.' : '',
    maintenanceWarning: maintenanceItem ? `${maintenanceItem.title} is ${maintenanceItem.status.toLowerCase()}.` : '',
    serviceDueKm: vehicle.serviceDueKm,
    openInvoiceValue: job?.price || 0,
    trackerAlert: trackerAlert?.message || '',
    latestStop: start.name,
    scheduleState: getScheduleState(baseStatus, 0, 0),
    routeHistory: [],
  };

  state.scheduleState = getScheduleState(state.status, state.routeProgress, state.speed);
  state.insights = buildVehicleInsights(state);
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

const advanceVehicle = (vehicle) => {
  const now = new Date().toISOString();

  if (vehicle.status === 'Offline') {
    const offlineVehicle = {
      ...vehicle,
      speed: 0,
      ignitionStatus: 'Off',
      eta: 'Tracker offline',
      scheduleState: 'Delayed',
    };
    return {
      ...offlineVehicle,
      insights: buildVehicleInsights(offlineVehicle),
    };
  }

  if (vehicle.status === 'Maintenance') {
    const workshop = LOCATION_POINTS.Workshop;
    const maintenanceVehicle = {
      ...vehicle,
      mapX: workshop.mapX,
      mapY: workshop.mapY,
      latitude: workshop.latitude,
      longitude: workshop.longitude,
      speed: 0,
      ignitionStatus: 'Off',
      eta: 'Workshop',
      nextStop: 'Workshop bay',
      scheduleState: 'At risk',
      lastSeen: now,
    };
    return {
      ...maintenanceVehicle,
      insights: buildVehicleInsights(maintenanceVehicle),
    };
  }

  if (vehicle.pauseTicks > 0) {
    const pausedVehicle = {
      ...vehicle,
      pauseTicks: vehicle.pauseTicks - 1,
      speed: 0,
      status: vehicle.status === 'At Yard' ? 'At Yard' : 'At Site',
      ignitionStatus: vehicle.status === 'At Yard' ? 'Off' : 'On',
      idleMinutes: vehicle.idleMinutes + 2,
      eta: formatEta(Math.max(8, Math.round((100 - vehicle.routeProgress) * 0.9))),
      lastSeen: now,
    };
    pausedVehicle.scheduleState = getScheduleState(pausedVehicle.status, pausedVehicle.routeProgress, pausedVehicle.speed);
    pausedVehicle.insights = buildVehicleInsights(pausedVehicle);
    return pausedVehicle;
  }

  const routePoints = vehicle.routePoints;
  const currentIndex = clamp(vehicle.routeIndex, 0, routePoints.length - 2);
  const start = routePoints[currentIndex];
  const end = routePoints[currentIndex + 1] || start;
  const approachingStop = end.stop && vehicle.segmentProgress > 0.68;
  const baseIncrement = approachingStop ? 0.12 : start.zone === 'town' ? 0.18 : 0.24;
  const delayMode = vehicle.currentJobId === 'JOB-010' || vehicle.status === 'Delayed';
  const nextSegmentProgress = clamp(
    vehicle.segmentProgress + (delayMode ? baseIncrement * 0.45 : baseIncrement),
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
    pauseTicks = routePoints[nextIndex].stop ? 1 + (routePoints[nextIndex].zone === 'town' ? 1 : 0) : 0;
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
  const mapX = lerp(nextStart.mapX, nextEnd.mapX, easedProgress);
  const mapY = lerp(nextStart.mapY, nextEnd.mapY, easedProgress);
  const routeProgress = Math.round(((nextIndex + segmentProgress) / Math.max(1, routePoints.length - 1)) * 100);

  let speed = 0;
  if (status === 'On Route') {
    speed = nextStart.zone === 'town' ? 24 + Math.round(Math.random() * 18) : 54 + Math.round(Math.random() * 28);
    if (approachingStop) speed = Math.max(20, speed - 18);
  } else if (status === 'Delayed') {
    speed = 7 + Math.round(Math.random() * 17);
  }

  const etaMinutes =
    status === 'Delivered'
      ? 0
      : Math.max(6, Math.round(((100 - routeProgress) / 100) * (status === 'Delayed' ? 135 : 82)));

  const updated = {
    ...vehicle,
    latitude,
    longitude,
    mapX,
    mapY,
    speed,
    heading: getHeading(nextStart, nextEnd),
    ignitionStatus: status === 'Delivered' ? 'Off' : status === 'At Yard' ? 'Off' : 'On',
    odometer: vehicle.odometer + Math.max(0, Math.round(speed / 7)),
    fuelLevel: clamp(vehicle.fuelLevel - (speed > 0 ? 0.28 : 0.04), 8, 100),
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
  };

  updated.scheduleState = getScheduleState(updated.status, updated.routeProgress, updated.speed);
  updated.insights = buildVehicleInsights(updated);
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
    this.intervalId = null;
    this.fleet = VEHICLES.filter((vehicle) => vehicle.trackerDeviceId).slice(0, 9).map(createVehicleState);
    this.lastUpdated = new Date().toISOString();
  }

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.fleet = this.fleet.map(advanceVehicle);
      this.lastUpdated = new Date().toISOString();
      this.emit();
    }, 1400);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getFleet());
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    };
  }

  emit() {
    const snapshot = this.getFleet();
    this.listeners.forEach((listener) => listener(snapshot));
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
export const TRACKING_MAP_POINTS = LOCATION_POINTS;
