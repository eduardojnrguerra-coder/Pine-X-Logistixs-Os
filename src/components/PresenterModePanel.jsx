import { ArrowRight, BriefcaseBusiness, MapPinned, MessageSquareText, MonitorPlay, RotateCcw, Target, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePresenterMode } from '../context/PresenterModeContext';
import ScenarioBadge from './ScenarioBadge';

const NEXT_SCREEN_LABELS = {
  '/': 'Owner Dashboard',
  '/tracking': 'Live Fleet Tracking',
  '/dispatch': 'Dispatch Board',
  '/maintenance': 'Maintenance Alerts',
  '/reports': 'Reports & Money Leakage',
  '/customer-portal': 'Customer Portal',
  '/invoices': 'Invoices',
};

export default function PresenterModePanel() {
  const navigate = useNavigate();
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
  const nextScreenLabel = NEXT_SCREEN_LABELS[scenario.nextScreen] || scenario.nextScreen;

  const openNextScreen = () => {
    navigate(scenario.nextScreen || '/');
    setPanelOpen(false);
  };

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

          <div className="presenter-talk-track-panel">
            <div className="presenter-talk-track-heading">
              <MessageSquareText size={18} />
              <div>
                <span>Presenter talk track</span>
                <strong>{scenario.name}</strong>
              </div>
            </div>

            <div className="presenter-talk-track-grid">
              <div className="presenter-talk-track-item">
                <span className="presenter-talk-track-icon"><MessageSquareText size={15} /></span>
                <div>
                  <strong>What to say</strong>
                  <p>{scenario.talkTrack}</p>
                </div>
              </div>
              <div className="presenter-talk-track-item">
                <span className="presenter-talk-track-icon"><Target size={15} /></span>
                <div>
                  <strong>What problem to point out</strong>
                  <p>{scenario.painPoint}</p>
                </div>
              </div>
              <div className="presenter-talk-track-item">
                <span className="presenter-talk-track-icon"><MapPinned size={15} /></span>
                <div>
                  <strong>Which page to open next</strong>
                  <p>{nextScreenLabel}</p>
                  <button type="button" className="presenter-next-screen-button" onClick={openNextScreen}>
                    Open {nextScreenLabel}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="presenter-talk-track-item">
                <span className="presenter-talk-track-icon"><BriefcaseBusiness size={15} /></span>
                <div>
                  <strong>What business pain this solves</strong>
                  <p>{scenario.salesAngle}</p>
                </div>
              </div>
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
