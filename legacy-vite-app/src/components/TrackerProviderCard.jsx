import { useState } from 'react';
import { PlugZap, Save } from 'lucide-react';
import IntegrationStatusBadge from './IntegrationStatusBadge';

export default function TrackerProviderCard({
  config,
  onSave,
  onTestConnection,
}) {
  const [formState, setFormState] = useState(config);
  const [feedback, setFeedback] = useState('');

  const handleSave = () => {
    onSave(formState);
    setFeedback('Settings saved locally.');
  };

  const handleTest = async () => {
    const result = await onTestConnection(formState);
    setFormState((prev) => ({
      ...prev,
      status: result.status,
      lastSynced: result.ok ? new Date().toISOString() : prev.lastSynced,
    }));
    setFeedback(result.message);
  };

  return (
    <div className="tracker-provider-card">
      <div className="tracker-provider-top">
        <div>
          <h3>{formState.providerName}</h3>
          <p>{formState.vehiclesLinkedCount} vehicles linked</p>
        </div>
        <IntegrationStatusBadge status={formState.status} />
      </div>

      <div className="settings-form-grid">
        <div className="form-group">
          <label>API base URL</label>
          <input
            type="text"
            value={formState.apiBaseUrl}
            onChange={(event) => setFormState({ ...formState, apiBaseUrl: event.target.value })}
          />
        </div>
        <div className="form-group">
          <label>API key</label>
          <input
            type="text"
            value={formState.apiKey}
            onChange={(event) => setFormState({ ...formState, apiKey: event.target.value })}
          />
        </div>
        <div className="form-group">
          <label>API secret</label>
          <input
            type="text"
            value={formState.apiSecret}
            onChange={(event) => setFormState({ ...formState, apiSecret: event.target.value })}
          />
        </div>
      </div>

      <div className="tracker-provider-meta">
        <span>Last synced: {formState.lastSynced ? new Date(formState.lastSynced).toLocaleString('en-ZA') : 'Never'}</span>
      </div>

      <div className="tracker-provider-actions">
        <button className="action-btn small" onClick={handleTest}>
          <PlugZap size={14} />
          Test Connection
        </button>
        <button className="action-btn small primary" onClick={handleSave}>
          <Save size={14} />
          Save Settings
        </button>
      </div>

      {feedback && <div className="settings-feedback">{feedback}</div>}
    </div>
  );
}
