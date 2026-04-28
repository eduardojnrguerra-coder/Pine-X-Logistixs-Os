import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import StatCard from '../components/StatCard';
import ReportCard from '../components/ReportCard';
import MoneyLeakagePanel from '../components/MoneyLeakagePanel';
import InsightCard from '../components/InsightCard';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getAiInsights,
  getFleetUtilizationRate,
  getOnTimeDeliveryRate,
  getOperationalReportCards,
  getOutstandingInvoices,
  getRevenueThisMonth,
  isDateInRange,
} from '../data/demoData';

const currency = (amount) => `R${Number(amount || 0).toLocaleString()}`;

export default function Reports() {
  const { data, moneyLeakage, scenario } = usePresenterMode();
  const [dateRange, setDateRange] = useState('30d');
  const [customerFilter, setCustomerFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('');

  const filteredJobs = useMemo(
    () =>
      data.jobs.filter((job) => {
        const matchesDate = isDateInRange(job.pickupTime, dateRange);
        const matchesCustomer = customerFilter === '' || job.customerId === customerFilter;
        const matchesVehicle = vehicleFilter === '' || job.assignedVehicleId === vehicleFilter;
        const matchesDriver = driverFilter === '' || job.assignedDriverId === driverFilter;
        return matchesDate && matchesCustomer && matchesVehicle && matchesDriver;
      }),
    [customerFilter, data.jobs, dateRange, driverFilter, vehicleFilter]
  );

  const filteredInvoices = useMemo(
    () => data.invoices.filter((invoice) => isDateInRange(invoice.issueDate, dateRange)),
    [data.invoices, dateRange]
  );

  const executiveSummary = useMemo(() => {
    const outstandingInvoices = getOutstandingInvoices(filteredInvoices);
    return {
      revenueThisMonth: getRevenueThisMonth(filteredJobs),
      outstandingInvoices: outstandingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0),
      delayedDeliveries: filteredJobs.filter((job) => job.status === 'Delayed').length,
      fleetUtilization: getFleetUtilizationRate(data.vehicles),
      onTimeDeliveryRate: getOnTimeDeliveryRate(data.drivers),
      maintenanceCost: data.maintenance.reduce((sum, item) => sum + (item.cost || 0), 0),
      estimatedLeakage: moneyLeakage.reduce((sum, item) => sum + item.amount, 0),
    };
  }, [data.drivers, data.maintenance, data.vehicles, filteredInvoices, filteredJobs, moneyLeakage]);

  const operationalReports = useMemo(() => {
    const reports = getOperationalReportCards(
      filteredJobs,
      filteredInvoices,
      data.drivers,
      data.vehicles,
      data.maintenance
    );
    return reportTypeFilter === '' ? reports : reports.filter((report) => report.type === reportTypeFilter);
  }, [data.drivers, data.maintenance, data.vehicles, filteredInvoices, filteredJobs, reportTypeFilter]);

  const insights = useMemo(
    () => getAiInsights(filteredJobs, filteredInvoices, data.drivers, data.vehicles, data.maintenance, data.alerts),
    [data.alerts, data.drivers, data.maintenance, data.vehicles, filteredInvoices, filteredJobs]
  );

  const summaryCards = [
    { label: 'Revenue This Month', value: currency(executiveSummary.revenueThisMonth), change: 'Live', trend: 'up', color: '#10b981' },
    { label: 'Outstanding Invoices', value: currency(executiveSummary.outstandingInvoices), change: 'Follow-up', trend: 'down', color: '#f59e0b' },
    { label: 'Delayed Deliveries', value: executiveSummary.delayedDeliveries, change: 'Risk', trend: 'down', color: '#ef4444' },
    { label: 'Fleet Utilization', value: `${executiveSummary.fleetUtilization}%`, change: 'Fleet', trend: 'up', color: '#2563eb' },
    { label: 'On-Time Delivery Rate', value: `${executiveSummary.onTimeDeliveryRate}%`, change: 'Service', trend: 'up', color: '#06b6d4' },
    { label: 'Maintenance Cost', value: currency(executiveSummary.maintenanceCost), change: 'Workshop', trend: 'down', color: '#8b5cf6' },
    { label: 'Estimated Money Leakage', value: currency(executiveSummary.estimatedLeakage), change: 'Recoverable', trend: 'down', color: '#f97316' },
  ];

  return (
    <div className="page-container reports-page">
      <div className="page-header">
        <div>
          <h1>Reports & Money Leakage</h1>
          <p>Commercial and operational reporting driven by the active presenter scenario.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="reports-filter-bar">
        <div className="reports-filter-title">
          <Filter size={18} />
          <span>Filter reports</span>
        </div>
        <div className="reports-filter-grid">
          <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="filter-select">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)} className="filter-select">
            <option value="">All customers</option>
            {data.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </select>
          <select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)} className="filter-select">
            <option value="">All vehicles</option>
            {data.vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration}</option>)}
          </select>
          <select value={driverFilter} onChange={(event) => setDriverFilter(event.target.value)} className="filter-select">
            <option value="">All drivers</option>
            {data.drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
          </select>
          <select value={reportTypeFilter} onChange={(event) => setReportTypeFilter(event.target.value)} className="filter-select">
            <option value="">All report types</option>
            {[...new Set(getOperationalReportCards(data.jobs, data.invoices, data.drivers, data.vehicles, data.maintenance).map((item) => item.type))].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid reports-stats-grid">
        {summaryCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <MoneyLeakagePanel items={moneyLeakage} total={executiveSummary.estimatedLeakage} />

      <div className="reports-layout">
        <div className="reports-main-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Operational Reports</h3>
            </div>
            <div className="operational-reports-grid">
              {operationalReports.map((report) => <ReportCard key={report.id} {...report} />)}
            </div>
          </div>

          <div className="dashboard-card sales-summary-card">
            <div className="card-header">
              <h3>Sales Demo Summary</h3>
            </div>
            <div className="sales-summary-grid">
              <div><span className="maintenance-detail-label">Problem</span><p>{scenario.painPoint}</p></div>
              <div><span className="maintenance-detail-label">Talk track</span><p>{scenario.talkTrack}</p></div>
              <div><span className="maintenance-detail-label">Sales angle</span><p>{scenario.salesAngle}</p></div>
              <div><span className="maintenance-detail-label">Estimated monthly savings</span><strong>{currency(Math.round(executiveSummary.estimatedLeakage * 0.38))}</strong></div>
            </div>
          </div>
        </div>

        <div className="reports-side-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>AI-Style Insights</h3>
            </div>
            <div className="insight-card-list">
              {insights.map((insight) => <InsightCard key={insight.id} {...insight} />)}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Executive Summary</h3>
            </div>
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Revenue this month</span><strong>{currency(executiveSummary.revenueThisMonth)}</strong></div>
              <div className="summary-row"><span>Outstanding invoices</span><strong>{currency(executiveSummary.outstandingInvoices)}</strong></div>
              <div className="summary-row"><span>Delayed deliveries</span><strong>{executiveSummary.delayedDeliveries}</strong></div>
              <div className="summary-row"><span>Fleet utilization</span><strong>{executiveSummary.fleetUtilization}%</strong></div>
              <div className="summary-row"><span>On-time delivery rate</span><strong>{executiveSummary.onTimeDeliveryRate}%</strong></div>
              <div className="summary-row"><span>Maintenance cost</span><strong>{currency(executiveSummary.maintenanceCost)}</strong></div>
              <div className="summary-row"><span>Estimated leakage</span><strong>{currency(executiveSummary.estimatedLeakage)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
