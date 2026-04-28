export default function SettingsSection({
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="settings-section">
      <div className="settings-section-header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      <div className="settings-section-body">{children}</div>
    </section>
  );
}
