import ProfitabilityScore from './ProfitabilityScore';

export default function CustomerHealthCard({ customer }) {
  return (
    <div className="customer-health-card">
      <div className="customer-health-top">
        <div>
          <span className="vehicle-list-card-id">{customer.companyName}</span>
          <h3>{customer.healthLabel}</h3>
          <p>{customer.recommendedAction}</p>
        </div>
        <ProfitabilityScore score={customer.healthScore} riskLevel={customer.riskLevel} />
      </div>

      <div className="customer-health-metrics">
        <span>Revenue: R{customer.totalRevenue.toLocaleString()}</span>
        <span>Outstanding: R{customer.outstandingBalance.toLocaleString()}</span>
        <span>Profit estimate: R{customer.profitEstimate.toLocaleString()}</span>
        <span>Cost to serve: R{customer.costToServe.toLocaleString()}</span>
      </div>
    </div>
  );
}
