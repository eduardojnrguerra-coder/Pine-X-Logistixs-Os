import { useEffect, useMemo, useState } from 'react';
import { RadioTower } from 'lucide-react';
import { liveFleetSimulator } from '../services/liveFleetSimulator';

const SCENARIO_EVENTS = {
  tracker: 'Signal loss detected across multiple trackers. Dispatch visibility degraded.',
  delays: 'ETA risk detected on R43. Dispatch intervention recommended.',
  maintenance: 'Maintenance yard capacity warning. Uptime risk increasing.',
  fuel: 'Idle and low fuel pattern detected across active vehicles.',
  complaint: 'Customer site escalation received. Operations response required.',
  leakage: 'Delivered job has no matching invoice event. Billing risk flagged.',
};

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--';

const normalizeSeverity = (severity) => {
  if (severity === 'danger' || severity === 'critical') return 'critical';
  if (severity === 'warning') return 'warning';
  return 'info';
};

const getEventSignature = (message = '') => {
  const normalized = message
    .toLowerCase()
    .replace(/\d{1,2}:\d{2}/g, '')
    .replace(/\b(px|cf|ca)\s?\d+[\w-]*\b/g, 'vehicle')
    .replace(/\btruck\s?\d+\b/g, 'vehicle')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.includes('delay risk')) return 'delay-risk';
  if (normalized.includes('tracker') && (normalized.includes('lost') || normalized.includes('signal'))) return 'tracker-signal';
  if (normalized.includes('low fuel')) return 'low-fuel';
  if (normalized.includes('maintenance')) return 'maintenance';
  if (normalized.includes('billing') || normalized.includes('invoice')) return 'billing-risk';
  if (normalized.includes('customer')) return 'customer-risk';
  if (normalized.includes('entered')) return normalized.replace(/^.* entered /, 'entered ');
  if (normalized.includes('stopped at')) return normalized.replace(/^.* stopped at /, 'stopped at ');

  return normalized;
};

const dedupeEvents = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = getEventSignature(item.message);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortByNewest = (items) =>
  [...items].sort((first, second) => new Date(second.timestamp || 0).getTime() - new Date(first.timestamp || 0).getTime());

export default function LiveEventTicker({
  vehicles = [],
  scenarioKey = 'normal',
  compact = false,
  maxItems = 4,
}) {
  const [events, setEvents] = useState(() => liveFleetSimulator.getEvents());

  useEffect(() => {
    const unsubscribe = liveFleetSimulator.subscribeEvents(setEvents);
    return unsubscribe;
  }, []);

  const derivedEvents = useMemo(() => {
    const scenarioEvent = SCENARIO_EVENTS[scenarioKey]
      ? {
          id: `scenario-${scenarioKey}`,
          timestamp: new Date().toISOString(),
          severity: scenarioKey === 'normal' ? 'info' : 'warning',
          message: SCENARIO_EVENTS[scenarioKey],
        }
      : null;

    const urgentVehicleEvents = vehicles
      .filter((vehicle) => vehicle.liveAlerts?.length > 0)
      .slice(0, compact ? 1 : 3)
      .map((vehicle) => ({
        id: `vehicle-${vehicle.vehicleId}-${vehicle.status}`,
        timestamp: vehicle.lastSeen,
        severity: vehicle.status === 'Delayed' || vehicle.status === 'Offline' ? 'critical' : 'warning',
        message: `${vehicle.registration} ${vehicle.liveAlerts[0].label.toLowerCase()} near ${vehicle.nextStop}.`,
      }));

    const normalizedEvents = [scenarioEvent, ...urgentVehicleEvents, ...events].filter(Boolean).map((event) => ({
      ...event,
      severity: normalizeSeverity(event.severity),
    }));

    return dedupeEvents(sortByNewest(normalizedEvents)).slice(0, maxItems);
  }, [compact, events, maxItems, scenarioKey, vehicles]);

  return (
    <div className={`live-event-ticker ${compact ? 'compact' : ''}`}>
      <div className="live-event-ticker-label">
        <RadioTower size={compact ? 13 : 15} />
        <span>Live ops feed</span>
      </div>
      <div className="live-event-ticker-stream">
        {derivedEvents.map((event) => (
          <div key={event.id} className={`live-event-item severity-${event.severity || 'info'}`}>
            <span>{formatTime(event.timestamp)}</span>
            <strong>{event.message}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
