import {
  ALERTS,
  CUSTOMER_MESSAGES,
  CUSTOMER_REQUESTS,
  CUSTOMERS,
  DRIVERS,
  INVOICES,
  JOBS,
  MAINTENANCE,
  QUOTES,
  VEHICLES,
  getMoneyLeakageReport,
} from '../data/demoData';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const PRESENTER_SCENARIOS = {
  normal: {
    key: 'normal',
    name: 'Normal Operations',
    painPoint: 'Even a stable day still hides manual coordination, update chasing, and leakage risk.',
    talkTrack:
      'Start with the clean operating picture, then show that Pine X replaces fragmented updates before the team falls into firefighting mode.',
    affectedModules: ['Dashboard', 'Tracking', 'Vehicles', 'Maintenance', 'Reports', 'Customer Portal'],
    salesAngle: 'Control and visibility before chaos starts.',
    nextScreen: '/',
  },
  tracker: {
    key: 'tracker',
    name: 'Tracker Offline Problem',
    painPoint: 'Operations often notice a dead tracker only when they urgently need the location history.',
    talkTrack:
      'This is why tracker connection monitoring matters. Pine X does not just show where trucks are. It shows when visibility itself is broken.',
    affectedModules: ['Dashboard', 'Tracking', 'Vehicles', 'Maintenance', 'Reports'],
    salesAngle: 'Visibility risk and operational control.',
    nextScreen: '/tracking',
  },
  delays: {
    key: 'delays',
    name: 'Delivery Delays Today',
    painPoint: 'Dispatch teams only realize a service problem after customers start calling.',
    talkTrack:
      'Show how delay risk becomes visible across jobs, tracking, customer communication, and revenue before it turns into a damaged client relationship.',
    affectedModules: ['Dashboard', 'Tracking', 'Reports', 'Customer Portal'],
    salesAngle: 'Service reliability and dispatch intervention.',
    nextScreen: '/dispatch',
  },
  maintenance: {
    key: 'maintenance',
    name: 'Maintenance Risk Week',
    painPoint: 'Reactive servicing quietly turns workshop time into lost delivery capacity and surprise breakdowns.',
    talkTrack:
      'This makes maintenance a management issue instead of a workshop-only issue because it affects delivery reliability and margin.',
    affectedModules: ['Dashboard', 'Vehicles', 'Maintenance', 'Reports', 'Tracking'],
    salesAngle: 'Preventive maintenance and uptime protection.',
    nextScreen: '/maintenance',
  },
  invoices: {
    key: 'invoices',
    name: 'Overdue Invoices Problem',
    painPoint: 'Completed work and invoice follow-up drift apart, creating avoidable cash flow pressure.',
    talkTrack:
      'Tie operational completion directly to billing and collections so owners can see where working capital is being stretched.',
    affectedModules: ['Dashboard', 'Reports', 'Customer Portal'],
    salesAngle: 'Cash flow control and finance visibility.',
    nextScreen: '/reports',
  },
  fuel: {
    key: 'fuel',
    name: 'Fuel Waste Problem',
    painPoint: 'Idle time and route inefficiency quietly burn margin because nobody sees the pattern fast enough.',
    talkTrack:
      'Pine X turns fuel waste into a visible daily management number instead of a month-end surprise.',
    affectedModules: ['Dashboard', 'Tracking', 'Reports', 'Vehicles'],
    salesAngle: 'Recoverable margin and driver accountability.',
    nextScreen: '/reports',
  },
  complaint: {
    key: 'complaint',
    name: 'Customer Complaint Scenario',
    painPoint: 'Clients escalate because nobody can give them one confident answer on ETA, status, POD, or invoice timing.',
    talkTrack:
      'Use this to show how the customer portal and shared communication history remove uncertainty from service conversations.',
    affectedModules: ['Dashboard', 'Customer Portal', 'Tracking', 'Reports'],
    salesAngle: 'Client service and account protection.',
    nextScreen: '/customer-portal',
  },
  leakage: {
    key: 'leakage',
    name: 'Invoice Leakage / Missed Billing Problem',
    painPoint: 'Work can happen, PODs can exist, and billing can still slip because the flow is disconnected.',
    talkTrack:
      'This is where Pine X protects revenue by connecting quotes, jobs, tracking, POD, invoices, and follow-up in one workflow.',
    affectedModules: ['Dashboard', 'Reports', 'Customer Portal'],
    salesAngle: 'Revenue capture and billing discipline.',
    nextScreen: '/invoices',
  },
};

const applyTrackerScenario = (state) => {
  ['V002', 'V010', 'V011'].forEach((vehicleId) => {
    const vehicle = state.vehicles.find((item) => item.id === vehicleId);
    if (vehicle) vehicle.status = 'Offline';
    const liveVehicle = state.liveVehicles.find((item) => item.vehicleId === vehicleId);
    if (liveVehicle) {
      liveVehicle.status = 'Offline';
      liveVehicle.speed = 0;
      liveVehicle.ignitionStatus = 'Unknown';
      liveVehicle.insights = [{ label: 'Tracker offline', tone: 'neutral' }];
      liveVehicle.eta = 'Tracker offline';
    }
    state.alerts.push({
      id: `SCN-TRACKER-${vehicleId}`,
      vehicleId,
      type: 'Tracker Offline',
      title: 'Tracker connection lost',
      message: `${vehicleId} has stale location data and needs immediate visibility recovery.`,
      severity: 'Critical',
      createdAt: new Date().toISOString(),
      status: 'New',
    });
  });
  state.ownerInsights.push('3 vehicles have stale location data and dispatch visibility is degraded.');
};

const applyDelayScenario = (state) => {
  state.jobs.forEach((job) => {
    if (['JOB-001', 'JOB-004', 'JOB-010'].includes(job.id)) {
      job.status = 'Delayed';
      job.notes = 'Traffic congestion and late site readiness are creating delivery slippage.';
    }
  });
  state.liveVehicles.forEach((vehicle) => {
    if (['JOB-001', 'JOB-004', 'JOB-010'].includes(vehicle.currentJobId)) {
      vehicle.status = 'Delayed';
      vehicle.speed = Math.max(12, Math.round(vehicle.speed * 0.45));
      vehicle.eta = '1h 55m';
      vehicle.delayReason = 'Traffic congestion and offloading queue at customer site.';
      vehicle.insights = [{ label: 'Potential delay', tone: 'danger' }];
    }
  });
  state.customerMessages.push({
    id: 'SCN-MSG-DELAY',
    customerId: 'C001',
    author: 'System',
    type: 'system',
    content: 'ETA for job PX0001 moved out by 45 minutes because of route congestion.',
    timestamp: new Date().toISOString(),
  });
  state.ownerInsights.push('Delay risk is spreading across three active jobs before billing is complete.');
};

const applyMaintenanceScenario = (state) => {
  ['V004', 'V007', 'V011'].forEach((vehicleId, index) => {
    state.maintenance.unshift({
      id: `SCN-MAINT-${vehicleId}`,
      vehicleId,
      type: index === 0 ? 'Engine' : index === 1 ? 'Tracker' : 'Inspection',
      title: index === 0 ? 'Engine performance review' : index === 1 ? 'Tracker bracket repair' : 'Roadworthy inspection',
      description: 'Scenario-generated workshop pressure item for the presenter mode.',
      status: index === 0 ? 'Overdue' : 'Open',
      priority: index === 0 ? 'Critical' : 'High',
      reportedDate: '2026-04-23',
      dueDate: '2026-04-26',
      completedDate: null,
      cost: 6800 + index * 1200,
      odometer: state.vehicles.find((item) => item.id === vehicleId)?.odometer || 0,
      downtimeDays: 2 + index,
      assignedWorkshop: 'Pine X Workshop',
      notes: 'Scenario-generated maintenance risk.',
    });
  });
  state.ownerInsights.push('Workshop load is starting to impact uptime and dispatch capacity this week.');
};

const applyInvoiceScenario = (state) => {
  state.invoices.forEach((invoice) => {
    if (['INV002', 'INV004', 'INV007'].includes(invoice.id)) {
      invoice.status = 'Overdue';
      invoice.balance = Math.max(invoice.balance, Math.round(invoice.total * 0.82));
    }
  });
  state.ownerInsights.push('Collections exposure is pulling cash out of operations across overdue customer accounts.');
};

const applyFuelScenario = (state) => {
  state.alerts.push({
    id: 'SCN-FUEL-001',
    vehicleId: 'V001',
    type: 'High Idle Time',
    title: 'Idle time increased',
    message: 'Truck 04 has 18% higher idle time than the fleet average.',
    severity: 'Warning',
    createdAt: new Date().toISOString(),
    status: 'New',
  });
  state.liveVehicles.forEach((vehicle) => {
    if (['V001', 'V003', 'V006'].includes(vehicle.vehicleId)) {
      vehicle.fuelLevel = Math.max(18, vehicle.fuelLevel - 20);
      vehicle.idleMinutes = 14;
      vehicle.insights = [...(vehicle.insights || []), { label: 'Idle for 14 min', tone: 'warning' }];
    }
  });
  state.ownerInsights.push('Fuel waste is rising through idle time and poor route discipline on active vehicles.');
};

const applyComplaintScenario = (state) => {
  const customer = state.customers.find((item) => item.id === 'C002');
  if (customer) {
    customer.riskLevel = 'High';
    customer.notes = `${customer.notes} Customer escalated after missing two ETA updates this week.`;
  }
  state.customerMessages.push({
    id: 'SCN-COMPLAINT-001',
    customerId: 'C002',
    author: 'Anna Meyer',
    type: 'customer',
    content: 'This is the second time we have had to ask for an ETA update. Please escalate.',
    timestamp: new Date().toISOString(),
  });
  state.customerRequests.unshift({
    id: 'SCN-REQ-COMPLAINT',
    customerId: 'C002',
    title: 'Service complaint',
    description: 'Client requested escalation because of poor ETA communication.',
    status: 'New',
    createdAt: new Date().toISOString(),
  });
  state.ownerInsights.push('A service complaint is now threatening account retention and collections confidence.');
};

const applyLeakageScenario = (state) => {
  state.jobs.forEach((job) => {
    if (['JOB-006', 'JOB-009'].includes(job.id)) {
      job.status = 'Delivered';
    }
  });
  state.invoices = state.invoices.filter((invoice) => !['INV006'].includes(invoice.id));
  state.ownerInsights.push('Completed work exists without clean invoice follow-through, which exposes missed billing risk.');
};

export const buildScenarioState = ({
  scenarioKey = 'normal',
  liveVehicles = [],
}) => {
  const state = {
    vehicles: clone(VEHICLES),
    drivers: clone(DRIVERS),
    jobs: clone(JOBS),
    invoices: clone(INVOICES),
    maintenance: clone(MAINTENANCE),
    alerts: clone(ALERTS),
    customers: clone(CUSTOMERS),
    customerMessages: clone(CUSTOMER_MESSAGES),
    customerRequests: clone(CUSTOMER_REQUESTS),
    quotes: clone(QUOTES),
    liveVehicles: liveVehicles.length > 0 ? clone(liveVehicles) : [],
    ownerInsights: [],
  };

  switch (scenarioKey) {
    case 'tracker':
      applyTrackerScenario(state);
      break;
    case 'delays':
      applyDelayScenario(state);
      break;
    case 'maintenance':
      applyMaintenanceScenario(state);
      break;
    case 'invoices':
      applyInvoiceScenario(state);
      break;
    case 'fuel':
      applyFuelScenario(state);
      break;
    case 'complaint':
      applyComplaintScenario(state);
      break;
    case 'leakage':
      applyLeakageScenario(state);
      break;
    default:
      break;
  }

  const moneyLeakage = getMoneyLeakageReport(
    state.jobs,
    state.invoices,
    state.maintenance,
    state.alerts,
    state.vehicles
  );
  const updatedMetrics = {
    activeDeliveries: state.jobs.filter((job) =>
      ['On Route', 'At Pickup', 'Loaded', 'At Dropoff', 'Dispatched', 'Delayed'].includes(job.status)
    ).length,
    delayedJobs: state.jobs.filter((job) => job.status === 'Delayed').length,
    offlineTrackers: state.liveVehicles.filter((vehicle) => vehicle.status === 'Offline').length,
    openMaintenance: state.maintenance.filter((item) => item.status !== 'Completed').length,
    overdueInvoices: state.invoices
      .filter((invoice) => invoice.status === 'Overdue')
      .reduce((sum, invoice) => sum + invoice.balance, 0),
    fuelRiskVehicles: state.liveVehicles.filter((vehicle) => (vehicle.fuelLevel || 0) <= 25).length,
    leakage: moneyLeakage.reduce((sum, item) => sum + item.amount, 0),
  };

  return {
    scenario: PRESENTER_SCENARIOS[scenarioKey] || PRESENTER_SCENARIOS.normal,
    data: state,
    metrics: updatedMetrics,
    moneyLeakage,
  };
};
