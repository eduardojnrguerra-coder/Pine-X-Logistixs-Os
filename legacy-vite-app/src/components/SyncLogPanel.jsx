import { RefreshCw, Trash2 } from 'lucide-react';

export default function SyncLogPanel({ logs = [], onRunSyncTest, onClearLogs }) {
  return (
    <div className="dashboard-card sync-log-panel">
      <div className="card-header">
        <h3>Sync Logs</h3>
        <div className="sync-log-actions">
          <button type="button" className="action-btn small" onClick={onRunSyncTest}>
            <RefreshCw size={14} />
            Run Sync Test
          </button>
          <button type="button" className="action-btn small" onClick={onClearLogs}>
            <Trash2 size={14} />
            Clear Logs
          </button>
        </div>
      </div>
      <div className="sync-log-list">
        {logs.map((log) => (
          <div key={log.id} className="sync-log-item">
            <div>
              <strong>{log.provider}</strong>
              <p>{log.message}</p>
            </div>
            <div className="sync-log-meta">
              <span>{log.eventType}</span>
              <span>{log.status}</span>
              <span>{new Date(log.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && <div className="panel-empty">No sync logs recorded yet.</div>}
      </div>
    </div>
  );
}
