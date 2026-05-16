import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Coins,
  Fuel,
  Gauge,
  LayoutDashboard,
  MapPinned,
  MessageSquareMore,
  ShieldAlert,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';
import GuidedDemoTour from '../components/GuidedDemoTour';
import DemoControlPanel from '../components/DemoControlPanel';
import PineXLogo from '../components/PineXLogo';
import TourProgressPanel from '../components/TourProgressPanel';
import { usePresenterMode } from '../context/PresenterModeContext';

const tourSteps = [
  { targetId: 'demo-step-dashboard', title: 'Command Centre Dashboard', copy: 'This gives management one view of every active delivery, delayed job, available vehicle, overdue invoice, and operational risk.' },
  { targetId: 'demo-step-tracking', title: 'Live Fleet Tracking', copy: 'Instead of phoning drivers to ask where they are, dispatch can see every vehicle live, with job status, speed, ETA, and tracker connection status.' },
  { targetId: 'demo-step-dispatch', title: 'Dispatch Board', copy: 'Jobs are assigned, moved, delayed, and completed from one board instead of WhatsApp messages, notebooks, and memory.' },
  { targetId: 'demo-step-driver', title: 'Driver Portal', copy: 'Drivers update job progress from their phone, upload proof of delivery, report delays, and complete vehicle checklists.' },
  { targetId: 'demo-step-customer', title: 'Customer Portal', copy: 'Customers can track deliveries, view PODs, request jobs, and send messages without constantly phoning the office.' },
  { targetId: 'demo-step-maintenance', title: 'Maintenance Alerts', copy: 'The system shows services due, licence expiry, tracker issues, vehicle downtime, and breakdown risks before they become expensive surprises.' },
  { targetId: 'demo-step-finance', title: 'Finance Flow', copy: 'Quotes, jobs, deliveries, invoices, and payments connect into one flow, so completed work does not disappear before billing.' },
  { targetId: 'demo-step-leakage', title: 'Money Leakage Report', copy: 'This exposes the hidden losses from idle time, late deliveries, empty return trips, fuel waste, downtime, and overdue invoices.' },
  { targetId: 'demo-step-settings', title: 'Tracker Integration Settings', copy: 'The system is built to connect to real vehicle tracking providers like Cartrack, Netstar, Tracker SA, Mix Telematics, Ctrack, Webfleet, and Teltonika.' },
  { targetId: 'demo-step-why', title: 'Why This Matters', copy: 'This system gives logistics companies control over trucks, drivers, jobs, customers, invoices, and operational risk from one place.' },
];

export default function SalesDemo() {
  const navigate = useNavigate();
  const {
    scenario,
    scenarioKey,
    scenarios,
    metrics,
    analytics,
    resumeTourStep,
    setScenario,
    resetScenario,
    recordTourEvent,
    updateTourProgress,
    dismissTour,
    replayTour,
  } = usePresenterMode();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [ctaFeedback, setCtaFeedback] = useState('');

  useEffect(() => {
    recordTourEvent('sales_demo_opened', { scenarioKey });
  }, [recordTourEvent, scenarioKey]);

  const moduleCards = [
    { id: 'demo-step-dashboard', icon: LayoutDashboard, title: 'Command Dashboard', copy: 'One operational view for jobs, fleet status, cash flow, and risk.', action: () => navigate('/') },
    { id: 'demo-step-tracking', icon: MapPinned, title: 'Live Fleet Tracking', copy: 'See every vehicle, job link, speed, ETA, and tracker state in one place.', action: () => navigate('/tracking') },
    { id: 'demo-step-dispatch', icon: ClipboardList, title: 'Dispatch Board', copy: 'Move jobs through the day without relying on memory and calls.', action: () => navigate('/dispatch') },
    { id: 'demo-step-driver', icon: Users, title: 'Driver Portal', copy: 'Drivers update status, upload PODs, and report issues from the field.', action: () => navigate('/driver') },
    { id: 'demo-step-customer', icon: MessageSquareMore, title: 'Customer Portal', copy: 'Customers self-serve delivery updates, disputes, and invoice visibility.', action: () => navigate('/customer-portal') },
    { id: 'demo-step-maintenance', icon: Wrench, title: 'Maintenance Alerts', copy: 'Stay ahead of services, downtime, licence risk, and tracker faults.', action: () => navigate('/maintenance') },
    { id: 'demo-step-finance', icon: Coins, title: 'Finance Flow', copy: 'Connect quotes, jobs, PODs, invoices, and collections into one process.', action: () => navigate('/invoices') },
    { id: 'demo-step-leakage', icon: ShieldAlert, title: 'Money Leakage Report', copy: 'Show exactly where margin is leaking and what to fix first.', action: () => navigate('/reports') },
    { id: 'demo-step-settings', icon: Gauge, title: 'Tracker Settings', copy: 'Provider-ready configuration for real fleet tracking rollouts.', action: () => navigate('/settings') },
  ];

  const objections = [
    { title: 'We already use WhatsApp', answer: 'WhatsApp is fast for conversation, but Pine X turns updates into an accountable workflow and financial record.' },
    { title: 'We already have trackers', answer: 'Trackers alone show dots. Pine X connects those dots to jobs, drivers, customers, maintenance, and billing risk.' },
    { title: 'Our drivers will not use it', answer: 'The driver workflow is task-based and faster than repeated phone calls from dispatch.' },
    { title: 'This sounds expensive', answer: 'Fuel waste, downtime, delayed billing, and client churn usually cost more than the platform.' },
    { title: 'We already use spreadsheets', answer: 'Spreadsheets record yesterday. Pine X gives live fleet control and connected workflow visibility.' },
    { title: 'We do not have time to implement a system', answer: 'Start with one depot or one fleet group, prove the workflow, then expand.' },
  ];

  const roiMetrics = useMemo(
    () => ({
      fuelWaste: Math.round(metrics.leakage * 0.14),
      idleTimeCost: Math.round(metrics.leakage * 0.18),
      overdueInvoices: metrics.overdueInvoices,
      downtimeCost: Math.round(metrics.openMaintenance * 3500),
      monthlySavings: Math.round(metrics.leakage * 0.38),
    }),
    [metrics]
  );

  const startTour = (resume = false) => {
    const step = resume && resumeTourStep !== null ? resumeTourStep : 0;
    setTourStep(step);
    setTourOpen(true);
    recordTourEvent('tour_started', { step });
    updateTourProgress({
      currentStep: step,
      totalSteps: tourSteps.length,
      lastCompletedStep: step,
      completed: false,
    });
  };

  return (
    <div className="page-container sales-demo-page">
      <div className="sales-demo-hero">
        <div className="sales-demo-hero-copy">
          <PineXLogo className="sales-demo-brand" subtitle="Logistics Command Centre" />
          <h1>One control system for trucks, drivers, jobs, customers, invoices, and live tracking.</h1>
          <p>Walk a prospect from operational chaos to control, visibility, and recoverable margin using one connected demo system.</p>
          <div className="sales-demo-hero-actions">
            <button className="primary-button" onClick={() => startTour(false)}>Start Guided Tour</button>
            <button className="action-btn small primary" onClick={() => navigate(scenario.nextScreen)}>Open Suggested Screen</button>
          </div>
        </div>

        <div className="sales-demo-kpi-grid" id="demo-step-why">
          <div className="sales-kpi-card"><span className="maintenance-detail-label">Active deliveries</span><strong>{metrics.activeDeliveries}</strong><p>Management sees live movement, not a pile of status calls.</p></div>
          <div className="sales-kpi-card"><span className="maintenance-detail-label">Offline trackers</span><strong>{metrics.offlineTrackers}</strong><p>Scenario switching updates the operational screens instantly.</p></div>
          <div className="sales-kpi-card"><span className="maintenance-detail-label">Leakage exposed</span><strong>R{metrics.leakage.toLocaleString()}</strong><p>Hidden waste becomes a visible, fixable management number.</p></div>
        </div>
      </div>

      <DemoControlPanel scenarios={scenarios} selectedScenario={scenarioKey} onSelectScenario={setScenario} onReset={resetScenario} />

      <div className="sales-demo-layout">
        <div className="sales-demo-main">
          <section className="dashboard-card" id="demo-step-dashboard">
            <div className="card-header"><h3>Problem</h3></div>
            <div className="sales-chip-grid">
              {[
                'Jobs managed on WhatsApp',
                'No live visibility',
                'Drivers update late',
                'Invoices delayed',
                'Fuel waste hidden',
                'Maintenance surprises',
                'Customers constantly calling for updates',
                'Owners do not know where money leaks',
              ].map((item) => <span key={item} className="sales-chip danger">{item}</span>)}
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>Solution</h3></div>
            <div className="sales-module-grid">
              {moduleCards.map((module) => (
                <div key={module.id} id={module.id} className="sales-module-card">
                  <div className="sales-module-top"><module.icon size={20} /><h4>{module.title}</h4></div>
                  <p>{module.copy}</p>
                  <button className="action-btn small" onClick={module.action}>Open module</button>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>Before vs After</h3></div>
            <div className="sales-compare-grid">
              <div className="sales-compare-card">
                <h4>Before</h4>
                {['Guessing where trucks are', 'Chasing drivers', 'Manual job tracking', 'Late invoicing', 'Missed maintenance', 'Unclear profit'].map((item) => <span key={item} className="sales-chip danger">{item}</span>)}
              </div>
              <div className="sales-compare-card success">
                <h4>After</h4>
                {['Live visibility', 'Driver accountability', 'Connected job flow', 'Faster invoicing', 'Preventive maintenance', 'Clear profit and leakage reporting'].map((item) => <span key={item} className="sales-chip success">{item}</span>)}
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>ROI / Savings</h3></div>
            <div className="sales-roi-grid">
              <div className="sales-kpi-card"><span className="maintenance-detail-label">Estimated monthly fuel waste</span><strong>R{roiMetrics.fuelWaste.toLocaleString()}</strong></div>
              <div className="sales-kpi-card"><span className="maintenance-detail-label">Estimated idle time cost</span><strong>R{roiMetrics.idleTimeCost.toLocaleString()}</strong></div>
              <div className="sales-kpi-card"><span className="maintenance-detail-label">Estimated overdue invoices</span><strong>R{roiMetrics.overdueInvoices.toLocaleString()}</strong></div>
              <div className="sales-kpi-card"><span className="maintenance-detail-label">Estimated downtime cost</span><strong>R{roiMetrics.downtimeCost.toLocaleString()}</strong></div>
              <div className="sales-kpi-card primary"><span className="maintenance-detail-label">Estimated monthly savings</span><strong>R{roiMetrics.monthlySavings.toLocaleString()}</strong></div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>Implementation Timeline</h3></div>
            <div className="sales-timeline">
              <div className="sales-timeline-step"><strong>Week 1</strong><p>Setup company, vehicles, drivers, customers</p></div>
              <div className="sales-timeline-step"><strong>Week 2</strong><p>Jobs, dispatch, driver portal</p></div>
              <div className="sales-timeline-step"><strong>Week 3</strong><p>Tracking provider connection</p></div>
              <div className="sales-timeline-step"><strong>Week 4</strong><p>Finance, reports, staff training, go-live</p></div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>Objection Handling</h3></div>
            <div className="sales-objection-list">
              {objections.map((item) => (
                <div key={item.title} className="sales-objection-card">
                  <h4>{item.title}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-card sales-cta-card">
            <div className="card-header"><h3>Final CTA</h3></div>
            {ctaFeedback && <div className="settings-feedback">{ctaFeedback}</div>}
            <div className="sales-cta-actions">
              <button className="primary-button" onClick={() => setCtaFeedback('Audit request captured locally for the sales demo.')}>Book a logistics system audit</button>
              <button className="action-btn small primary" onClick={() => { navigate('/reports'); setCtaFeedback('Opening the money leakage report view.'); }}>See your money leakage report</button>
              <button className="action-btn small" onClick={() => setCtaFeedback('Pilot rollout story saved: start with one depot or one fleet group.')}>Start with one depot or one fleet group</button>
            </div>
          </section>
        </div>

        <div className="sales-demo-side">
          <TourProgressPanel analytics={analytics} onResume={() => startTour(true)} onReplay={replayTour} onDismiss={dismissTour} />

          <section className="dashboard-card">
            <div className="card-header"><h3>Scenario Snapshot</h3></div>
            <div className="maintenance-summary-list">
              <div className="summary-row"><span>Scenario</span><strong>{scenario.name}</strong></div>
              <div className="summary-row"><span>Affected modules</span><strong>{scenario.affectedModules.length}</strong></div>
              <div className="summary-row"><span>Delayed jobs</span><strong>{metrics.delayedJobs}</strong></div>
              <div className="summary-row"><span>Offline trackers</span><strong>{metrics.offlineTrackers}</strong></div>
              <div className="summary-row"><span>Savings story</span><strong>R{roiMetrics.monthlySavings.toLocaleString()}</strong></div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="card-header"><h3>Demo Storyline</h3></div>
            <div className="sales-storyline">
              <div className="sales-storyline-row"><AlertTriangle size={16} /><p>{scenario.painPoint}</p></div>
              <div className="sales-storyline-row"><Truck size={16} /><p>{scenario.talkTrack}</p></div>
              <div className="sales-storyline-row"><Fuel size={16} /><p>{scenario.salesAngle}</p></div>
              <div className="sales-storyline-row"><ArrowRight size={16} /><p>Suggested next screen: {scenario.nextScreen}</p></div>
            </div>
          </section>
        </div>
      </div>

      <GuidedDemoTour
        open={tourOpen}
        steps={tourSteps}
        currentStep={tourStep}
        onNext={() => {
          const nextStep = Math.min(tourStep + 1, tourSteps.length - 1);
          setTourStep(nextStep);
          recordTourEvent('step_completed', { step: tourStep + 1 });
          updateTourProgress({
            currentStep: nextStep,
            totalSteps: tourSteps.length,
            lastCompletedStep: nextStep,
            completed: false,
          });
        }}
        onBack={() => setTourStep((step) => Math.max(step - 1, 0))}
        onSkip={() => {
          setTourOpen(false);
          recordTourEvent('tour_skipped', { step: tourStep });
        }}
        onFinish={() => {
          setTourOpen(false);
          recordTourEvent('tour_finished', { steps: tourSteps.length });
          updateTourProgress({
            currentStep: tourSteps.length,
            totalSteps: tourSteps.length,
            lastCompletedStep: tourSteps.length,
            completed: true,
          });
        }}
        onStepView={(_, index) => {
          recordTourEvent('step_viewed', { step: index + 1 });
        }}
      />
    </div>
  );
}
