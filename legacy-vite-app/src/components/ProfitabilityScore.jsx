export default function ProfitabilityScore({ score, riskLevel }) {
  const tone = score >= 80 ? 'green' : score >= 50 ? 'orange' : 'red';

  return (
    <div className={`profitability-score ${tone}`}>
      <strong>{score}</strong>
      <span>{riskLevel}</span>
    </div>
  );
}
