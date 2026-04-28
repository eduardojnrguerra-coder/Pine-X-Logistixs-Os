import { ArrowRight } from 'lucide-react';

const formatRowValue = (value, format) => {
  if (format === 'currency') return `R${Number(value || 0).toLocaleString()}`;
  if (format === 'percentage') return `${value}%`;
  if (format === 'ratio') return `${value}`;
  if (format === 'count') return `${value}`;
  return value;
};

export default function ReportCard({
  title,
  value,
  subtitle,
  rows = [],
  format = 'count',
}) {
  return (
    <div className="report-card">
      <div className="report-card-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="report-card-value">{value}</div>
      </div>

      <div className="report-card-rows">
        {rows.slice(0, 5).map((row) => (
          <div key={`${title}-${row.label}`} className="report-card-row">
            <div>
              <span>{row.label}</span>
              {row.subtitle && <small>{row.subtitle}</small>}
            </div>
            <strong>{formatRowValue(row.value, format)}</strong>
          </div>
        ))}
      </div>

      <div className="report-card-footer">
        <span>Live demo analytics</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}
