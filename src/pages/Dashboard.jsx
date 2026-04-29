import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileClock,
  FileText,
  Filter,
  Gauge,
  Package,
  Search,
  ShieldAlert,
  Truck,
  Users,
} from 'lucide-react';
import LiveFleetMap from '../components/LiveFleetMap';
import ScenarioBadge from '../components/ScenarioBadge';
import StatusBadge from '../components/StatusBadge';
import VehicleHealthScore from '../components/VehicleHealthScore';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getCustomerById,
  getCustomersWithOverdueInvoices,
  getDriverById,
  getFleetHealthSummary,
  getOutstandingInvoices,
  getRecentCustomerMessages,
  getVehicleById,
  getVehiclesNeedingAttention,
} from '../data/demoData';

const ACTIVE_JOB_STATUSES = ['On Route', 'At Pickup', 'Loaded', 'At Dropoff', 'Dispatched', 'Delayed'];
const IN_PROGRESS_JOB_STATUSES = ['Scheduled', 'Dispatched', 'At Pickup', 'Loaded', 'On Route', 'At Dropoff', 'Delayed'];
const PENDING_QUOTE_STATUSES = ['Draft', 'Sent'];

const ROUTE_DISTANCE_LOOKUP = {
  'Cape Town|Hermanus': 123,
  'Stellenbosch|Somerset West': 28,
  'Caledon|Gansbaai': 81,
  'Paarl|Kleinmond': 118,
  'Cape Town|Onrus': 126,
  'Hermanus|Sandbaai': 8,
  'Somerset West|Hermanus': 92,
  'Gansbaai|Cape Town': 154,
  'Stellenbosch|Hermanus': 110,
  'Kleinmond|Caledon': 78,
  'Hermanus|Onrus': 6,
};

const formatCurrency = (value) => `R${value.toLocaleString()}`;

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const getRequestDisplayStatus = (status) => {
  if (status === 'Acknowledged') return 'In Review';
  if (status === 'Resolved') return 'Assigned';
  return status;
};

const parseQuantity = (quantity = '') => {
  const match = quantity.match(/(\d+(?:\.\d+)?)/);
  const unit = quantity.replace(/(\d+(?:\.\d+)?)/, '').trim() || 'units';
  return {
    value: match ? Number(match[1]) : 1,
    unit,
  };
};

const estimateRouteDistance = (job) =>
  ROUTE_DISTANCE_LOOKUP[`${job.pickupLocation}|${job.dropoffLocation}`] ||
  ROUTE_DISTANCE_LOOKUP[`${job.dropoffLocation}|${job.pickupLocation}`] ||
  64;

const matchesSearch = (query, values) => {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return values.some((value) => String(value || '').toLowerCase().includes(normalized));
};

const clampSeriesValue = (value) => Math.max(16, Math.min(100, value));

const buildTrendSeries = (base, pattern = []) =>
  pattern.map((delta) => clampSeriesValue(base + delta));

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, metrics, scenario, scenarioKey, moneyLeakage } = usePresenterMode();
  const [selectedVehicleId, setSelectedVehicleId] = useState(data.liveVehicles[0]?.vehicleId || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [focusFilter, setFocusFilter] = useState('all');

  const fleetHealth = useMemo(
    () => getFleetHealthSummary(data.vehicles, data.maintenance, data.alerts),
    [data.alerts, data.maintenance, data.vehicles]
  );
  const vehiclesNeedingAttention = useMemo(
    () => getVehiclesNeedingAttention(data.vehicles, data.maintenance, data.alerts),
    [data.alerts, data.maintenance, data.vehicles]
  );
  const recentCustomerMessages = useMemo(
    () => getRecentCustomerMessages(data.customerMessages),
    [data.customerMessages]
  );
  const overdueCustomers = useMemo(
    () => getCustomersWithOverdueInvoices(data.customers, data.invoices),
    [data.customers, data.invoices]
  );
  const outstandingInvoices = useMemo(
    () => getOutstandingInvoices(data.invoices),
    [data.invoices]
  );

  const activeJobs = useMemo(
    () => data.jobs.filter((job) => ACTIVE_JOB_STATUSES.includes(job.status)),
    [data.jobs]
  );
  const jobsInProgress = useMemo(
    () => data.jobs.filter((job) => IN_PROGRESS_JOB_STATUSES.includes(job.status)),
    [data.jobs]
  );
  const pendingQuotes = useMemo(
    () => data.quotes.filter((quote) => PENDING_QUOTE_STATUSES.includes(quote.status)),
    [data.quotes]
  );
  const revenueMtd = useMemo(() => {
    const now = new Date();
    return data.invoices
      .filter((invoice) => {
        const issueDate = new Date(invoice.issueDate);
        return (
          invoice.status !== 'Cancelled' &&
          issueDate.getFullYear() === now.getFullYear() &&
          issueDate.getMonth() === now.getMonth()
        );
      })
      .reduce((sum, invoice) => sum + invoice.total, 0);
  }, [data.invoices]);
  const delayedJobs = useMemo(
    () => data.jobs.filter((job) => job.status === 'Delayed'),
    [data.jobs]
  );
  const fleetUtilization = useMemo(() => {
    if (data.vehicles.length === 0) return 0;
    const utilized = data.vehicles.filter((vehicle) => ['Active', 'Maintenance'].includes(vehicle.status)).length;
    return Math.round((utilized / data.vehicles.length) * 100);
  }, [data.vehicles]);

  const dateLabel = useMemo(() => {
    if (dateRange === 'today') return 'Today';
    if (dateRange === '7d') return 'Last 7 days';
    if (dateRange === '30d') return 'Last 30 days';
    return 'This month';
  }, [dateRange]);

  const scenarioTone = useMemo(() => {
    switch (scenarioKey) {
      case 'tracker':
      case 'delays':
      case 'invoices':
      case 'complaint':
      case 'leakage':
        return 'warning';
      case 'maintenance':
      case 'fuel':
        return 'risk';
      default:
        return 'stable';
    }
  }, [scenarioKey]);

  const scenarioMetrics = useMemo(() => {
    const values = [];
    if (metrics.offlineTrackers > 0) values.push({ label: 'Offline trackers', value: metrics.offlineTrackers });
    if (metrics.delayedJobs > 0) values.push({ label: 'Delayed jobs', value: metrics.delayedJobs });
    if (metrics.openMaintenance > 0) values.push({ label: 'Open maintenance', value: metrics.openMaintenance });
    if (metrics.overdueInvoices > 0) values.push({ label: 'Overdue invoices', value: formatCurrency(metrics.overdueInvoices) });
    if (metrics.fuelRiskVehicles > 0) values.push({ label: 'Fuel-risk vehicles', value: metrics.fuelRiskVehicles });
    if (metrics.leakage > 0) values.push({ label: 'Leakage estimate', value: formatCurrency(metrics.leakage) });
    return values.slice(0, 4);
  }, [metrics]);

  const kpiTrends = useMemo(() => ({
    activeDeliveries: buildTrendSeries(metrics.activeDeliveries * 8, [-10, -4, 6, 12, 4, 14, 18]),
    jobsInProgress: buildTrendSeries(jobsInProgress.length * 9, [-6, 4, 8, 2, 10, 6, 12]),
    quotesPending: buildTrendSeries(pendingQuotes.length * 11, [-8, -2, 6, 8, 2, 10, 4]),
    invoicesOutstanding: buildTrendSeries(outstandingInvoices.length * 14, [4, 10, 6, 14, 18, 12, 20]),
    revenueMtd: buildTrendSeries(Math.round(revenueMtd / 2500), [-14, -4, 8, 18, 12, 24, 30]),
    fleet: scenarioKey === 'tracker'
      ? buildTrendSeries(metrics.offlineTrackers * 18, [6, 10, 12, 18, 10, 16, 22])
      : buildTrendSeries(fleetUtilization, [-12, -4, 2, 8, 4, 10, 14]),
  }), [fleetUtilization, jobsInProgress.length, metrics.activeDeliveries, metrics.offlineTrackers, outstandingInvoices.length, pendingQuotes.length, revenueMtd, scenarioKey]);

  const kpis = useMemo(() => [
    {
      label: 'Active Deliveries',
      value: metrics.activeDeliveries,
      meta: `${data.liveVehicles.filter((vehicle) => vehicle.status === 'On Route').length} trucks moving now`,
      change: `${activeJobs.filter((job) => job.priority === 'High').length} high-priority loads`,
      trend: kpiTrends.activeDeliveries,
      icon: Truck,
      tone: 'blue',
      onClick: () => navigate('/dispatch'),
    },
    {
      label: 'Jobs In Progress',
      value: jobsInProgress.length,
      meta: `${dateLabel} operating volume`,
      change: `${delayedJobs.length} exception${delayedJobs.length === 1 ? '' : 's'}`,
      trend: kpiTrends.jobsInProgress,
      icon: ClipboardList,
      tone: 'teal',
      onClick: () => navigate('/jobs'),
    },
    {
      label: 'Quotes Pending',
      value: pendingQuotes.length,
      meta: formatCurrency(pendingQuotes.reduce((sum, quote) => sum + quote.total, 0)),
      change: `${pendingQuotes.filter((quote) => quote.status === 'Sent').length} awaiting decision`,
      trend: kpiTrends.quotesPending,
      icon: FileClock,
      tone: 'amber',
      onClick: () => navigate('/reports'),
    },
    {
      label: 'Invoices Outstanding',
      value: formatCurrency(outstandingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0)),
      meta: `${outstandingInvoices.length} open invoices`,
      change: `${overdueCustomers.length} debtors need follow-up`,
      trend: kpiTrends.invoicesOutstanding,
      icon: CircleDollarSign,
      tone: 'orange',
      onClick: () => navigate('/reports'),
    },
    {
      label: 'Revenue MTD',
      value: formatCurrency(revenueMtd),
      meta: `${data.invoices.filter((invoice) => invoice.status === 'Paid').length} invoices paid`,
      change: `${formatCurrency(moneyLeakage.reduce((sum, item) => sum + item.amount, 0))} leakage visibility`,
      trend: kpiTrends.revenueMtd,
      icon: FileText,
      tone: 'green',
      onClick: () => navigate('/reports'),
    },
    {
      label: scenarioKey === 'tracker' ? 'Offline Trackers' : 'Fleet Utilization',
      value: scenarioKey === 'tracker' ? metrics.offlineTrackers : `${fleetUtilization}%`,
      meta: scenarioKey === 'tracker' ? 'Vehicles with stale visibility' : 'Assets engaged or earning',
      change: scenarioKey === 'tracker' ? 'Visibility needs recovery' : `${metrics.delayedJobs} delayed jobs today`,
      trend: kpiTrends.fleet,
      icon: scenarioKey === 'tracker' ? ShieldAlert : Gauge,
      tone: scenarioKey === 'tracker' ? 'red' : 'slate',
      onClick: () => navigate(scenarioKey === 'tracker' ? '/tracking' : '/vehicles'),
    },
  ], [activeJobs, data.invoices, data.liveVehicles, dateLabel, delayedJobs.length, fleetUtilization, jobsInProgress.length, kpiTrends.activeDeliveries, kpiTrends.fleet, kpiTrends.invoicesOutstanding, kpiTrends.jobsInProgress, kpiTrends.quotesPending, kpiTrends.revenueMtd, metrics.activeDeliveries, metrics.delayedJobs, metrics.offlineTrackers, moneyLeakage, navigate, outstandingInvoices, overdueCustomers.length, pendingQuotes, revenueMtd, scenarioKey]);

  const fleetStatusCounts = useMemo(() => ({
    total: data.vehicles.length,
    onRoute: data.liveVehicles.filter((vehicle) => vehicle.status === 'On Route').length,
    atSite: data.liveVehicles.filter((vehicle) => vehicle.status === 'At Site').length,
    atYard: data.liveVehicles.filter((vehicle) => vehicle.status === 'At Yard').length,
    maintenance: data.vehicles.filter((vehicle) => vehicle.status === 'Maintenance').length,
    offline: data.liveVehicles.filter((vehicle) => vehicle.status === 'Offline').length,
  }), [data.liveVehicles, data.vehicles]);

  const fleetRingStyle = useMemo(() => {
    const total = Math.max(1, fleetStatusCounts.total);
    const onRouteAngle = (fleetStatusCounts.onRoute / total) * 360;
    const atSiteAngle = (fleetStatusCounts.atSite / total) * 360;
    const atYardAngle = (fleetStatusCounts.atYard / total) * 360;
    const maintenanceAngle = (fleetStatusCounts.maintenance / total) * 360;
    const offlineAngle = (fleetStatusCounts.offline / total) * 360;
    const stop1 = onRouteAngle;
    const stop2 = stop1 + atSiteAngle;
    const stop3 = stop2 + atYardAngle;
    const stop4 = stop3 + maintenanceAngle;
    const stop5 = stop4 + offlineAngle;

    return {
      background: `conic-gradient(
        #16a34a 0deg ${stop1}deg,
        #2563eb ${stop1}deg ${stop2}deg,
        #7c3aed ${stop2}deg ${stop3}deg,
        #f97316 ${stop3}deg ${stop4}deg,
        #64748b ${stop4}deg ${stop5}deg,
        rgba(226,232,240,0.9) ${stop5}deg 360deg
      )`,
    };
  }, [fleetStatusCounts]);

  const equipmentAvailability = useMemo(() => {
    const tipperAvailable = data.vehicles.filter((vehicle) => vehicle.type === 'Tipper' && ['Active', 'Idle'].includes(vehicle.status)).length;
    const trailerAvailable = data.vehicles.filter((vehicle) => ['Semi-Bulk', 'Tautliner', 'Drop Side'].includes(vehicle.type) && ['Active', 'Idle'].includes(vehicle.status)).length;
    const excavators = scenarioKey === 'maintenance' ? 1 : scenarioKey === 'delays' ? 2 : 3;
    const loaders = scenarioKey === 'maintenance' ? 1 : 2;
    const skips = scenarioKey === 'tracker' ? Math.max(1, trailerAvailable - 1) : trailerAvailable;

    return [
      { label: 'Tipper Trucks', value: tipperAvailable },
      { label: 'Excavators', value: excavators },
      { label: 'Loaders', value: loaders },
      { label: 'Skips / Trailers', value: skips },
    ];
  }, [data.vehicles, scenarioKey]);

  const filteredCustomerRequests = useMemo(() => {
    const base = [...data.customerRequests]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((request) =>
        matchesSearch(searchTerm, [
          request.title,
          request.description,
          getCustomerById(request.customerId)?.companyName,
          request.status,
        ])
      );

    if (focusFilter === 'customer') return base.slice(0, 4);
    if (focusFilter === 'exceptions') return base.filter((request) => request.status === 'New').slice(0, 4);
    return base.slice(0, 3);
  }, [data.customerRequests, focusFilter, searchTerm]);

  const filteredActiveDeliveryRows = useMemo(() => {
    const rows = activeJobs
      .map((job) => {
        const customer = getCustomerById(job.customerId);
        const vehicle = getVehicleById(job.assignedVehicleId);
        const driver = getDriverById(job.assignedDriverId);
        const liveVehicle = data.liveVehicles.find((item) => item.currentJobId === job.id || item.vehicleId === job.assignedVehicleId);

        return {
          id: job.id,
          jobNumber: job.jobNumber,
          customer: customer?.companyName || 'Unassigned',
          material: job.cargo,
          destination: job.dropoffLocation,
          vehicle: vehicle?.registration || liveVehicle?.registration || 'Pending vehicle',
          driver: driver?.name || liveVehicle?.driverName || 'Pending driver',
          eta: liveVehicle?.eta || 'TBC',
          status: job.status,
        };
      })
      .filter((row) =>
        matchesSearch(searchTerm, [row.jobNumber, row.customer, row.material, row.destination, row.vehicle, row.driver, row.status])
      );

    if (focusFilter === 'exceptions') return rows.filter((row) => row.status === 'Delayed').slice(0, 8);
    return rows.slice(0, 8);
  }, [activeJobs, data.liveVehicles, focusFilter, searchTerm]);

  const filteredDriverActivity = useMemo(() => {
    const rows = data.drivers
      .map((driver) => {
        const vehicle = getVehicleById(driver.assignedVehicleId);
        const job = data.jobs.find((item) => item.id === driver.currentJobId);
        return {
          id: driver.id,
          name: driver.name,
          initials: getInitials(driver.name),
          vehicle: vehicle?.registration || 'Standby',
          route: job ? `${job.pickupLocation} to ${job.dropoffLocation}` : 'Awaiting assignment',
          status: driver.status,
          currentJobId: driver.currentJobId || 'Standby',
        };
      })
      .filter((row) =>
        matchesSearch(searchTerm, [row.name, row.vehicle, row.route, row.status, row.currentJobId])
      );

    if (focusFilter === 'fleet') return rows.filter((row) => row.status === 'On Duty').slice(0, 6);
    return rows.slice(0, 6);
  }, [data.drivers, data.jobs, focusFilter, searchTerm]);

  const filteredRecentDeliveries = useMemo(() => {
    const rows = data.jobs
      .filter((job) => job.status === 'Delivered')
      .sort((a, b) => new Date(b.deliveryDeadline) - new Date(a.deliveryDeadline))
      .map((job) => ({
        id: job.id,
        jobNumber: job.jobNumber,
        customer: getCustomerById(job.customerId)?.companyName || 'Unknown customer',
        material: job.cargo,
        time: new Date(job.deliveryDeadline).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      }))
      .filter((row) => matchesSearch(searchTerm, [row.jobNumber, row.customer, row.material]));

    return rows.slice(0, 5);
  }, [data.jobs, searchTerm]);

  const filteredRoutePerformance = useMemo(() => {
    const groupedRoutes = data.jobs.reduce((acc, job) => {
      const key = `${job.pickupLocation} to ${job.dropoffLocation}`;
      if (!acc[key]) {
        acc[key] = { route: key, jobs: 0, delayed: 0, distance: 0 };
      }
      acc[key].jobs += 1;
      acc[key].distance += estimateRouteDistance(job);
      if (job.status === 'Delayed') {
        acc[key].delayed += 1;
      }
      return acc;
    }, {});

    const rows = Object.values(groupedRoutes)
      .map((item) => ({
        ...item,
        onTimeRate: Math.max(0, Math.round(((item.jobs - item.delayed) / item.jobs) * 100)),
        delayRate: Math.min(100, Math.round((item.delayed / item.jobs) * 100)),
        trend: item.delayed > 0 ? 'At risk' : 'Stable',
      }))
      .filter((row) => matchesSearch(searchTerm, [row.route, row.trend]))
      .sort((a, b) => b.jobs - a.jobs);

    if (focusFilter === 'exceptions') return rows.filter((row) => row.delayed > 0).slice(0, 4);
    return rows.slice(0, 4);
  }, [data.jobs, focusFilter, searchTerm]);

  const filteredTopMaterials = useMemo(() => {
    const grouped = data.jobs.reduce((acc, job) => {
      const parsed = parseQuantity(job.quantity);
      if (!acc[job.cargo]) {
        acc[job.cargo] = { material: job.cargo, value: 0, unit: parsed.unit, jobs: 0 };
      }
      acc[job.cargo].value += parsed.value;
      acc[job.cargo].jobs += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .filter((item) => matchesSearch(searchTerm, [item.material]))
      .sort((a, b) => b.value - a.value || b.jobs - a.jobs)
      .slice(0, 5);
  }, [data.jobs, searchTerm]);

  const filteredInvoicesDue = useMemo(() => {
    const rows = [...outstandingInvoices]
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((invoice) => ({
        ...invoice,
        customerName: getCustomerById(invoice.customerId)?.companyName || 'Unknown customer',
      }))
      .filter((invoice) =>
        matchesSearch(searchTerm, [invoice.invoiceNumber, invoice.customerName, invoice.status, invoice.dueDate])
      );

    if (focusFilter === 'finance') return rows.slice(0, 5);
    return rows.slice(0, 4);
  }, [focusFilter, outstandingInvoices, searchTerm]);

  const filteredRecentMessages = useMemo(() => {
    const rows = recentCustomerMessages.filter((message) =>
      matchesSearch(searchTerm, [message.author, message.content, getCustomerById(message.customerId)?.companyName])
    );

    if (focusFilter === 'customer') return rows.slice(0, 4);
    return rows.slice(0, 3);
  }, [focusFilter, recentCustomerMessages, searchTerm]);

  const scenarioWarnings = useMemo(() => {
    if (scenarioKey === 'tracker') {
      return ['Tracker connections lost', 'Stale vehicle visibility', 'Dispatch blind spots'];
    }
    if (scenarioKey === 'delays') {
      return ['Service exceptions rising', 'Customer ETA pressure', 'Risk to same-day dispatch'];
    }
    if (scenarioKey === 'maintenance') {
      return ['Workshop demand increasing', 'Preventive service overdue', 'Downtime affecting capacity'];
    }
    if (scenarioKey === 'invoices') {
      return ['Collections pressure', 'Working capital tied up', 'Finance follow-up required'];
    }
    if (scenarioKey === 'fuel') {
      return ['Idle time leakage', 'Fuel burn visibility gap', 'Driver discipline pressure'];
    }
    if (scenarioKey === 'complaint') {
      return ['Client escalation risk', 'ETA confidence weakened', 'Service recovery needed'];
    }
    if (scenarioKey === 'leakage') {
      return ['Delivered work not billed', 'Revenue capture risk', 'POD-to-invoice gap'];
    }
    return ['Live operations visible', 'Dispatch aligned', 'Commercial risk under control'];
  }, [scenarioKey]);

  const safeScenarioNextScreen = scenario.nextScreen === '/invoices' ? '/reports' : scenario.nextScreen;

  return (
    <div className="page-container premium-dashboard-page summit-dashboard-page">
      <div className="dashboard-hero-card">
        <div className="dashboard-hero-copy">
          <div className="dashboard-hero-heading">
            <span className="dashboard-hero-kicker">Designed by Pine X Systems</span>
            <h1>Pine X Logistics Command Centre</h1>
            <p>Premium freight operations visibility for trucks, jobs, drivers, invoices, and customer pressure.</p>
          </div>
          <div className={`dashboard-scenario-strip tone-${scenarioTone}`}>
            <div>
              <strong>{scenario.name}</strong>
              <p>{scenario.painPoint}</p>
            </div>
            <div className="dashboard-scenario-metrics">
              {scenarioMetrics.map((item) => (
                <div key={item.label} className="dashboard-scenario-metric">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-hero-actions">
          <div className="dashboard-toolbar-row">
            <label className="dashboard-search-bar">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search jobs, customers, drivers, materials..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <div className="dashboard-toolbar-controls">
              <label className="dashboard-toolbar-select">
                <CalendarDays size={16} />
                <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                  <option value="today">Today</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="month">This month</option>
                </select>
              </label>
              <button type="button" className={`dashboard-filter-button ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen((value) => !value)}>
                <Filter size={16} />
                <span>Filters</span>
              </button>
              <ScenarioBadge scenario={scenario} />
            </div>
          </div>

          {filtersOpen && (
            <div className="dashboard-focus-row">
              {[
                ['all', 'All Operations'],
                ['fleet', 'Fleet Focus'],
                ['exceptions', 'Exceptions'],
                ['customer', 'Customer'],
                ['finance', 'Finance'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`dashboard-focus-chip ${focusFilter === key ? 'active' : ''}`}
                  onClick={() => setFocusFilter(key)}
                >
                  {label}
                </button>
              ))}
              <button type="button" className="dashboard-link-button" onClick={() => navigate(safeScenarioNextScreen || '/')}>
                Show best next screen
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-kpi-grid summit-kpi-grid">
        {kpis.map((kpi) => (
          <button key={kpi.label} type="button" className={`dashboard-kpi-card tone-${kpi.tone}`} onClick={kpi.onClick}>
            <div className="dashboard-kpi-top">
              <span className="dashboard-kpi-label">{kpi.label}</span>
              <span className="dashboard-kpi-icon">
                <kpi.icon size={18} />
              </span>
            </div>
            <strong className="dashboard-kpi-value">{kpi.value}</strong>
            <span className="dashboard-kpi-meta">{kpi.meta}</span>
            <div className="dashboard-kpi-sparkline" aria-hidden="true">
              {kpi.trend.map((point, index) => (
                <span
                  key={`${kpi.label}-${index}`}
                  className="dashboard-kpi-sparkline-bar"
                  style={{ height: `${point}%` }}
                />
              ))}
            </div>
            <span className="dashboard-kpi-change">{kpi.change}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-command-grid summit-command-grid">
        <div className="dashboard-command-main">
          <div className="dashboard-card live-tracking-map-card premium-map-shell summit-map-shell">
            <div className="dashboard-map-header">
              <div>
                <div className="dashboard-map-title-row">
                  <h3>Live Fleet Tracking</h3>
                  <span className="live-badge">LIVE</span>
                </div>
                <p>Real-time vehicle locations and status across active freight routes.</p>
              </div>
            </div>
            <LiveFleetMap
              vehicles={data.liveVehicles.slice(0, 6)}
              selectedVehicleId={selectedVehicleId}
              compact
              showCompactToolbar
              onSelectVehicle={(vehicle) => setSelectedVehicleId(vehicle.vehicleId)}
              scenario={scenario}
              scenarioKey={scenarioKey}
              title="Live Fleet Tracking"
            />
            <div className="compact-map-actions">
              <button className="action-btn small" onClick={() => navigate('/tracking')}>
                Open full tracking
              </button>
              <button className="action-btn small primary" onClick={() => selectedVehicleId && navigate(`/vehicles/${selectedVehicleId}`)}>
                Open selected vehicle
              </button>
            </div>
          </div>

          <div className="dashboard-card owner-insight-card scenario-alert-card">
            <div className="card-header">
              <div>
                <h3>Operations Watchlist</h3>
                <p className="card-subtitle">{scenario.salesAngle}</p>
              </div>
            </div>
            <div className="sales-storyline">
              {data.ownerInsights.map((insight) => (
                <div key={insight} className="sales-storyline-row">
                  <AlertTriangle size={16} />
                  <p>{insight}</p>
                </div>
              ))}
              {scenarioWarnings.map((warning) => (
                <div key={warning} className="sales-storyline-row compact-row">
                  <ShieldAlert size={16} />
                  <p>{warning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-command-side">
          <div className="dashboard-card fleet-overview-card">
            <div className="card-header">
              <div>
                <h3>Fleet Status Overview</h3>
                <p className="card-subtitle">{`Total assets ${fleetStatusCounts.total} · Average health ${fleetHealth.averageScore}/100`}</p>
              </div>
            </div>
            <div className="dashboard-fleet-overview">
              <div className="fleet-ring-chart" style={fleetRingStyle}>
                <div className="fleet-ring-chart-inner">
                  <strong>{fleetStatusCounts.total}</strong>
                  <span>assets</span>
                </div>
              </div>
              <div className="fleet-status-breakdown">
                {[
                  ['On Route', fleetStatusCounts.onRoute],
                  ['At Site', fleetStatusCounts.atSite],
                  ['At Yard', fleetStatusCounts.atYard],
                  ['Maintenance', fleetStatusCounts.maintenance],
                  ['Offline', fleetStatusCounts.offline],
                ].map(([label, value]) => (
                  <div key={label} className="fleet-status-row">
                    <span>{label}</span>
                    <div className="fleet-status-row-meta">
                      <div className="fleet-status-meter" aria-hidden="true">
                        <span style={{ width: `${Math.max(8, Math.min(100, (value / Math.max(1, fleetStatusCounts.total)) * 100))}%` }} />
                      </div>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Equipment Availability</h3>
            </div>
            <div className="dashboard-mini-metrics compact">
              {equipmentAvailability.map((item) => (
                <div key={item.label} className="dashboard-mini-metric compact">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Customer Requests</h3>
            </div>
            <div className="request-list">
              {filteredCustomerRequests.map((request) => (
                <div key={request.id} className="request-list-item">
                  <div>
                    <strong>{getCustomerById(request.customerId)?.companyName}</strong>
                    <p>{request.title}</p>
                  </div>
                  <StatusBadge status={getRequestDisplayStatus(request.status)} />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card dashboard-risk-card">
            <div className="card-header">
              <div>
                <h3>Scenario Impact</h3>
                <p className="card-subtitle">{scenario.talkTrack}</p>
              </div>
            </div>
            <div className="dashboard-risk-chip-row">
              {scenario.affectedModules.map((module) => (
                <span key={module} className="dashboard-risk-chip">{module}</span>
              ))}
            </div>
            <button type="button" className="action-btn primary" onClick={() => navigate(safeScenarioNextScreen || '/')}>
              Open recommended screen
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-lower-grid summit-lower-grid">
        <div className="dashboard-card dashboard-table-card delivery-table-card">
          <div className="card-header">
            <div>
              <h3>Active Deliveries Today</h3>
              <p className="card-subtitle">{`${filteredActiveDeliveryRows.length} visible movements in the current dashboard view`}</p>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table full-width">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Customer</th>
                  <th>Material</th>
                  <th>Destination</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>ETA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActiveDeliveryRows.map((row) => (
                  <tr key={row.id} onClick={() => navigate(`/jobs/${row.id}`)} style={{ cursor: 'pointer' }}>
                    <td className="job-id">{row.jobNumber}</td>
                    <td>{row.customer}</td>
                    <td>{row.material}</td>
                    <td>{row.destination}</td>
                    <td>{row.vehicle}</td>
                    <td>{row.driver}</td>
                    <td>{row.eta}</td>
                    <td><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Driver Activity</h3>
          </div>
          <div className="dashboard-driver-list">
            {filteredDriverActivity.map((driver) => (
              <div key={driver.id} className="dashboard-driver-item rich-driver-item">
                <div className="driver-avatar">{driver.initials}</div>
                <div className="dashboard-driver-main">
                  <strong>{driver.name}</strong>
                  <span>{driver.vehicle}</span>
                </div>
                <div className="dashboard-driver-meta">
                  <span>{driver.route}</span>
                  <small>{driver.currentJobId}</small>
                </div>
                <StatusBadge status={driver.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Deliveries</h3>
          </div>
          <div className="invoice-list">
            {filteredRecentDeliveries.map((job) => (
              <div key={job.id} className="invoice-item">
                <div className="invoice-info">
                  <span className="invoice-id">{job.jobNumber}</span>
                  <span className="invoice-client">{`${job.customer} · ${job.material}`}</span>
                </div>
                <div className="invoice-meta">
                  <span className="invoice-amount">{job.time}</span>
                  <StatusBadge status="Delivered" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card route-performance-card">
          <div className="card-header">
            <h3>Route Performance</h3>
          </div>
          <div className="dashboard-route-list">
            {filteredRoutePerformance.map((routeItem) => (
              <div key={routeItem.route} className="dashboard-route-item rich-route-item">
                <div className="dashboard-route-copy">
                  <strong>{routeItem.route}</strong>
                  <p>{`${routeItem.jobs} deliveries · ${routeItem.distance} km total`}</p>
                </div>
                <div className="dashboard-route-metrics">
                  <div className="dashboard-route-sparkline" aria-hidden="true">
                    {[routeItem.onTimeRate - 18, routeItem.onTimeRate - 8, routeItem.onTimeRate - 2, routeItem.onTimeRate].map((point, index) => (
                      <span key={`${routeItem.route}-${index}`} style={{ height: `${clampSeriesValue(point)}%` }} />
                    ))}
                  </div>
                  <span className="route-score">{routeItem.onTimeRate}%</span>
                  <small>{`${routeItem.delayRate}% delay · ${routeItem.trend}`}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Top Materials Delivered</h3>
          </div>
          <div className="dashboard-material-list">
            {filteredTopMaterials.map((item) => (
              <div key={item.material} className="dashboard-material-item">
                <div className="dashboard-material-main">
                  <span className="dashboard-material-icon">
                    <Package size={15} />
                  </span>
                  <div>
                    <strong>{item.material}</strong>
                    <p>{`${item.jobs} job${item.jobs === 1 ? '' : 's'}`}</p>
                  </div>
                </div>
                <span className="dashboard-material-value">{`${item.value} ${item.unit}`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card invoices-due-card">
          <div className="card-header">
            <div>
              <h3>Invoices Due</h3>
              <p className="card-subtitle">{`${formatCurrency(outstandingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0))} total outstanding`}</p>
            </div>
          </div>
          <div className="invoice-list">
            {filteredInvoicesDue.map((invoice) => (
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-info">
                  <span className="invoice-id">{invoice.invoiceNumber}</span>
                  <span className="invoice-client">{invoice.customerName}</span>
                </div>
                <div className="invoice-meta">
                  <span className="invoice-amount">{formatCurrency(invoice.balance)}</span>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Attention Queue</h3>
          </div>
          <div className="health-score-list">
            {vehiclesNeedingAttention.slice(0, 3).map((item) => (
              <div key={item.vehicle.id} className="health-score-list-item">
                <div className="health-score-list-header">
                  <div>
                    <strong>{item.vehicle.registration}</strong>
                    <p>{item.vehicle.name}</p>
                  </div>
                  <button className="action-btn small" onClick={() => navigate(`/vehicles/${item.vehicle.id}`)}>
                    Open
                  </button>
                </div>
                <VehicleHealthScore health={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Customer Messages</h3>
          </div>
          <div className="invoice-list">
            {filteredRecentMessages.map((message) => (
              <div key={message.id} className="invoice-item">
                <div className="invoice-info">
                  <span className="invoice-id">{getCustomerById(message.customerId)?.companyName}</span>
                  <span className="invoice-client">{message.content}</span>
                </div>
                <div className="invoice-meta">
                  <span className="invoice-amount">{message.author}</span>
                  <span className="invoice-due sent">
                    <Users size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
