import { MonitorPlay, RotateCcw, X } from 'lucide-react';
import { usePresenterMode } from '../context/PresenterModeContext';
import ScenarioBadge from './ScenarioBadge';

export default function PresenterModePanel() {
  const {
    scenario,
    scenarioKey,
    scenarios,
    metrics,
    panelOpen,
    setPanelOpen,
    setScenario,
    resetScenario,
  } = usePresenterMode();

  return (
    <>
      <button
        type="button"
        className="presenter-mode-toggle"
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <MonitorPlay size={18} />
        <span>Presenter Mode</span>
      </button>

      {panelOpen && (
        <div className="presenter-mode-panel">
          <div className="presenter-mode-panel-top">
            <ScenarioBadge scenario={scenario} />
            <button type="button" className="ghost-button small" onClick={() => setPanelOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <p className="presenter-mode-copy">{scenario.painPoint}</p>

          <div className="presenter-scenario-list">
            {Object.values(scenarios).map((item) => (
              <button
                key={item.key}
                type="button"
                className={`demo-scenario-button ${scenarioKey === item.key ? 'active' : ''}`}
                onClick={() => setScenario(item.key)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="demo-scenario-details presenter-details">
            <div>
              <span className="maintenance-detail-label">Talk track</span>
              <p>{scenario.talkTrack}</p>
            </div>
            <div>
              <span className="maintenance-detail-label">Sales angle</span>
              <p>{scenario.salesAngle}</p>
            </div>
            <div>
              <span className="maintenance-detail-label">Suggested next screen</span>
              <p>{scenario.nextScreen}</p>
            </div>
          </div>

          <div className="presenter-metrics-grid">
            <div className="presenter-metric-card">
              <span>Delayed jobs</span>
              <strong>{metrics.delayedJobs}</strong>
            </div>
            <div className="presenter-metric-card">
              <span>Offline trackers</span>
              <strong>{metrics.offlineTrackers}</strong>
            </div>
            <div className="presenter-metric-card">
              <span>Leakage exposed</span>
              <strong>R{metrics.leakage.toLocaleString()}</strong>
            </div>
          </div>

          <button type="button" className="action-btn small" onClick={resetScenario}>
            <RotateCcw size={14} />
            Reset to Normal Operations
          </button>
        </div>
      )}
    </>
  );
}
