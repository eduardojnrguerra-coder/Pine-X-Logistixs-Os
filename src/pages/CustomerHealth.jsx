import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHealthCard from '../components/CustomerHealthCard';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';
import {
  getCustomerDisputes,
  getCustomerJobs,
  getCustomerServiceHistory,
} from '../data/demoData';

const buildHealth = (customer, jobs, serviceHistory, disputes) => {
  const history = serviceHistory || {
    complaints: 0,
    disputes: 0,
    averagePaymentDelay: 0,
    routePerformance: 90,
    delayExposure: 0,
    costToServe: Math.round(customer.totalRevenue * 0.58),
  };
  const deliveredJobs = jobs.filter((job) => job.status === 'Delivered').length;
  const delayedJobs = jobs.filter((job) => job.status === 'Delayed').length;
  const profitEstimate = Math.max(0, customer.totalRevenue - history.costToServe);
  const score = Math.max(
    18,
    Math.min(
      96,
      100 -
        history.averagePaymentDelay -
        delayedJobs * 6 -
        history.complaints * 7 -
        history.disputes * 8 +
        Math.round(profitEstimate / 12000)
    )
  );
  const riskLevel = score >= 80 ? 'Low' : score >= 50 ? 'Medium' : 'High';

  return {
    ...customer,
    deliveredJobs,
    delayedJobs,
    disputesCount: disputes.length,
    routePerformance: history.routePerformance,
    averagePaymentDelay: history.averagePaymentDelay,
    complaints: history.complaints,
    profitEstimate,
    costToServe: history.costToServe,
    healthScore: score,
    riskLevel,
    healthLabel:
      score >= 80
        ? 'Profitable and low risk'
        : score >= 50
          ? 'Profitable but operationally difficult'
          : 'Low margin or high account risk',
    recommendedAction:
      score >= 80
        ? 'Grow the account and reinforce service visibility.'
        : score >= 50
          ? 'Tighten route execution and billing discipline on this account.'
          : 'Review pricing, collections, and service exposure before expanding work.',
  };
};

export default function CustomerHealth() {
  const navigate = useNavigate();
  const { data, scenario } = usePresenterMode();

  const customers = useMemo(
    () =>
      data.customers
        .map((customer) => {
          const jobs = getCustomerJobs(customer.id, data.jobs);
          const history = getCustomerServiceHistory(customer.id);
          const disputes = getCustomerDisputes(customer.id);
          return buildHealth(customer, jobs, history, disputes);
        })
        .sort((a, b) => a.healthScore - b.healthScore),
    [data.customers, data.jobs]
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Customer Health</h1>
          <p>Commercial performance and operational difficulty combined into one account view.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="stats-grid reports-stats-grid">
        <div className="stat-card"><div className="stat-value">{customers.filter((item) => item.healthScore >= 80).length}</div><div className="stat-label">Healthy Accounts</div></div>
        <div className="stat-card"><div className="stat-value">{customers.filter((item) => item.healthScore >= 50 && item.healthScore < 80).length}</div><div className="stat-label">Watch Accounts</div></div>
        <div className="stat-card"><div className="stat-value">{customers.filter((item) => item.healthScore < 50).length}</div><div className="stat-label">High-Risk Accounts</div></div>
        <div className="stat-card"><div className="stat-value">R{customers.reduce((sum, item) => sum + item.profitEstimate, 0).toLocaleString()}</div><div className="stat-label">Estimated Profit</div></div>
      </div>

      <div className="customer-health-grid">
        {customers.map((customer) => (
          <div key={customer.id} className="dashboard-card">
            <CustomerHealthCard customer={customer} />
            <div className="sales-summary-grid compact">
              <div><span className="maintenance-detail-label">Payment behavior</span><p>{customer.averagePaymentDelay} day average delay</p></div>
              <div><span className="maintenance-detail-label">Route performance</span><p>{customer.routePerformance}% on-time</p></div>
              <div><span className="maintenance-detail-label">Delay exposure</span><p>{customer.delayedJobs} delayed jobs</p></div>
              <div><span className="maintenance-detail-label">Complaints / disputes</span><p>{customer.complaints} / {customer.disputesCount}</p></div>
            </div>
            <button className="action-btn small primary" onClick={() => navigate(`/customers/${customer.id}`)}>
              Open customer detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
