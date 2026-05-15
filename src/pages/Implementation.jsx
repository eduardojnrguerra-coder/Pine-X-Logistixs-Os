import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  KeyRound,
  Lock,
  Plug,
  Rocket,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import ScenarioBadge from '../components/ScenarioBadge';
import { usePresenterMode } from '../context/PresenterModeContext';

const rolloutWeeks = [
  {
    week: 'Week 1',
    title: 'Foundation setup',
    summary: 'Company setup, vehicles, drivers, customers',
    icon: Building2,
    outcomes: [
      'Company profile, VAT details, depots, and operating regions configured.',
      'Vehicle list loaded with registration, type, licence, service, and tracker references.',
      'Driver and customer records imported so dispatch can start with clean master data.',
    ],
  },
  {
    week: 'Week 2',
    title: 'Operations workflow',
    summary: 'Jobs, dispatch, driver portal',
    icon: ClipboardList,
    outcomes: [
      'Job templates, status stages, dispatch board, and driver handoff process configured.',
      'Driver portal tested for status updates, POD uploads, delays, and vehicle checks.',
      'Customer communication flow aligned so the office stops relying on scattered WhatsApps.',
    ],
  },
  {
    week: 'Week 3',
    title: 'Tracker integration',
    summary: 'Provider access, vehicle linking, live tracking readiness',
    icon: Plug,
    outcomes: [
      'Tracker provider credentials and API access reviewed with the client.',
      'Vehicles linked to tracker device IDs and normalized live location objects.',
      'Demo mode stays available while live provider mode is prepared safely.',
    ],
  },
  {
    week: 'Week 4',
    title: 'Go-live control',
    summary: 'Finance, reports, training, go-live',
    icon: Rocket,
    outcomes: [
      'Quotes, invoices, VAT, payment terms, and reporting defaults configured.',
      'Staff trained by role: owner, operations, dispatch, finance, drivers, and maintenance.',
      'Pilot fleet or depot goes live with daily support and a staged expansion plan.',
    ],
  },
];

const trackerProviders = [
  'Cartrack',
  'Netstar',
  'Tracker SA',
  'Mix Telematics',
  'Ctrack',
  'Webfleet',
  'Teltonika',
];

const requiredClientInfo = [
  {
    title: 'Vehicle list',
    owner: 'Operations',
    detail: 'Registration, vehicle type, depot, licence expiry, service intervals, odometer, and tracker device ID where available.',
    icon: Truck,
    route: '/vehicles',
  },
  {
    title: 'Driver list',
    owner: 'Operations',
    detail: 'Driver names, phone numbers, assigned vehicles, role access, and current operating status.',
    icon: Users,
    route: '/drivers',
  },
  {
    title: 'Tracker provider access',
    owner: 'IT or provider admin',
    detail: 'Provider name, API access status, base URL, vehicle-device mapping, and safe credential handoff process.',
    icon: KeyRound,
    route: '/settings',
  },
  {
    title: 'Customer list',
    owner: 'Sales or finance',
    detail: 'Company names, contacts, billing details, delivery locations, payment behavior, and current job history.',
    icon: Building2,
    route: '/customers',
  },
  {
    title: 'Invoice settings',
    owner: 'Finance',
    detail: 'VAT rate, invoice prefix, quote prefix, default terms, payment due days, and approval workflow.',
    icon: FileText,
    route: '/settings',
  },
];

const trustNotes = [
  {
    title: 'Role-based access',
    copy: 'Owners, operations, finance, maintenance, drivers, and customers see only the workflows relevant to their role.',
    icon: ShieldCheck,
  },
  {
    title: 'Secure API credentials',
    copy: 'Real provider credentials must be stored and processed server-side in production, never exposed in the browser.',
    icon: Lock,
  },
  {
    title: 'Staged rollout',
    copy: 'Start with one depot, one fleet group, or one operational lane before expanding to the full company.',
    icon: CalendarDays,
  },
  {
    title: 'Demo mode vs live mode',
    copy: 'Demo mode is safe for sales and training. Live mode connects real providers, live vehicle data, and production workflows.',
    icon: Database,
  },
];

export default function Implementation() {
  const navigate = useNavigate();
  const { scenario } = usePresenterMode();

  return (
    <div className="page-container implementation-page">
      <section className="implementation-hero">
        <div className="implementation-hero-copy">
          <span className="implementation-kicker">Implementation & Integration</span>
          <h1>From demo to live logistics control in four focused weeks.</h1>
          <p>
            A practical rollout plan for transport companies: clean master data, connected dispatch,
            tracker readiness, finance setup, staff training, and a controlled go-live.
          </p>
          <div className="implementation-hero-actions">
            <button type="button" className="primary-button" onClick={() => navigate('/settings')}>
              Open integration settings
            </button>
            <button type="button" className="action-btn small primary" onClick={() => navigate('/sales-demo')}>
              Open sales demo
            </button>
          </div>
        </div>

        <div className="implementation-hero-panel">
          <div className="implementation-panel-top">
            <div>
              <span>Current presenter scenario</span>
              <strong>{scenario.name}</strong>
            </div>
            <ScenarioBadge scenario={scenario} />
          </div>
          <div className="implementation-readiness-grid">
            <div>
              <strong>4</strong>
              <span>week rollout</span>
            </div>
            <div>
              <strong>7</strong>
              <span>tracker providers</span>
            </div>
            <div>
              <strong>5</strong>
              <span>client data packs</span>
            </div>
          </div>
          <p>
            Use this page in a sales meeting to show prospects that the system is not just a demo.
            It has a clear path to rollout, integration, adoption, and management control.
          </p>
        </div>
      </section>

      <section className="dashboard-card implementation-section">
        <div className="card-header implementation-section-header">
          <div>
            <h3>Four-week rollout plan</h3>
            <p className="card-subtitle">A simple implementation rhythm that avoids big-bang rollout risk.</p>
          </div>
          <button type="button" className="action-btn small" onClick={() => navigate('/dispatch')}>
            Preview operations flow
          </button>
        </div>
        <div className="implementation-timeline">
          {rolloutWeeks.map((week) => (
            <article key={week.week} className="implementation-week-card">
              <div className="implementation-week-top">
                <span className="implementation-week-icon">
                  <week.icon size={18} />
                </span>
                <div>
                  <span>{week.week}</span>
                  <strong>{week.title}</strong>
                </div>
              </div>
              <p>{week.summary}</p>
              <div className="implementation-outcomes">
                {week.outcomes.map((outcome) => (
                  <div key={outcome} className="implementation-outcome">
                    <CheckCircle2 size={15} />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="implementation-grid">
        <div className="dashboard-card implementation-section">
          <div className="card-header implementation-section-header">
            <div>
              <h3>Tracker provider readiness</h3>
              <p className="card-subtitle">Provider cards show who can be connected during live rollout.</p>
            </div>
            <button type="button" className="action-btn small primary" onClick={() => navigate('/settings')}>
              Configure providers
            </button>
          </div>
          <div className="implementation-provider-grid">
            {trackerProviders.map((provider) => (
              <button
                key={provider}
                type="button"
                className="implementation-provider-card"
                onClick={() => navigate('/settings')}
              >
                <span className="implementation-provider-icon">
                  <Plug size={16} />
                </span>
                <div>
                  <strong>{provider}</strong>
                  <small>Provider adapter ready for safe credential handoff</small>
                </div>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-card implementation-section implementation-mode-card">
          <div className="card-header">
            <h3>Demo mode vs live mode</h3>
          </div>
          <div className="implementation-mode-compare">
            <div>
              <span>Demo mode</span>
              <strong>Sales and training safe</strong>
              <p>Uses mock telemetry, demo jobs, fake customer data, and scenario switching for presentations.</p>
            </div>
            <div>
              <span>Live mode</span>
              <strong>Production ready path</strong>
              <p>Requires backend credential storage, provider auth, webhook ingestion, and vehicle-to-device linking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-card implementation-section">
        <div className="card-header implementation-section-header">
          <div>
            <h3>Required client information</h3>
            <p className="card-subtitle">These inputs make implementation faster, cleaner, and easier to manage.</p>
          </div>
          <button type="button" className="action-btn small" onClick={() => navigate('/customers')}>
            Open customer records
          </button>
        </div>
        <div className="implementation-info-grid">
          {requiredClientInfo.map((item) => (
            <article key={item.title} className="implementation-info-card">
              <div className="implementation-info-top">
                <span>
                  <item.icon size={17} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.owner}</small>
                </div>
              </div>
              <p>{item.detail}</p>
              <button type="button" className="action-btn small" onClick={() => navigate(item.route)}>
                Open relevant page
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-card implementation-section">
        <div className="card-header implementation-section-header">
          <div>
            <h3>Trust notes for the buying committee</h3>
            <p className="card-subtitle">Use these points to answer security, adoption, and rollout questions clearly.</p>
          </div>
          <button type="button" className="action-btn small primary" onClick={() => navigate('/tracking')}>
            View live tracking
          </button>
        </div>
        <div className="implementation-trust-grid">
          {trustNotes.map((note) => (
            <article key={note.title} className="implementation-trust-card">
              <span>
                <note.icon size={18} />
              </span>
              <div>
                <strong>{note.title}</strong>
                <p>{note.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
