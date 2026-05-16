export default function PineXLogo({
  className = '',
  showText = true,
  subtitle = 'Logistics Command Centre',
}) {
  return (
    <div className={`pine-x-logo-lockup ${className}`}>
      <span className="pine-x-logo-mark">
        <img src="/pine-x-logo.png" alt="Pine X logo" />
      </span>
      {showText && (
        <span className="pine-x-logo-copy">
          <strong>Pine X</strong>
          <small>{subtitle}</small>
        </span>
      )}
    </div>
  );
}
