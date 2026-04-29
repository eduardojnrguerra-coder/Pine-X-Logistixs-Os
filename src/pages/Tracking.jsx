import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import FleetTray from '../components/FleetTray';
import IntegrationStatusBadge from '../components/IntegrationStatusBadge';
import LiveEventTicker from '../components/LiveEventTicker';
import LiveFleetMap from '../components/LiveFleetMap';
import ScenarioBadge from '../components/ScenarioBadge';
import VehicleIntelPanel from '../components/VehicleIntelPanel';
import { usePresenterMode } from '../context/PresenterModeContext';
import { trackingService, TRACKING_MODES, TRACKING_PROVIDERS, providerLabels } from '../services/trackingService';

export default function Tracking() {
  const { data, scenario, scenarioKey } = usePresenterMode();
  const [provider, setProvider] = useState(trackingService.getProvider());
  const [mode, setMode] = useState(trackingService.getMode());
  const [selectedVehicleId, setSelectedVehicleId] = useState(data.liveVehicles[0]?.vehicleId || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [driverFilter, setDriverFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');

  const vehicleOptions = useMemo(
    () => ['All', ...data.liveVehicles.map((vehicle) => vehicle.vehicleName)],
    [data.liveVehicles]
  );
  const driverOptions = useMemo(
    () => ['All', ...Array.from(new Set(data.liveVehicles.map((vehicle) => vehicle.driverName)))],
    [data.liveVehicles]
  );
  const customerOptions = useMemo(
    () => ['All', ...Array.from(new Set(data.liveVehicles.map((vehicle) => vehicle.customerName)))],
    [data.liveVehicles]
  );

  const filteredVehicles = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return data.liveVehicles.filter((vehicle) => {
      const matchesQuery =
        searchTerm === '' ||
        vehicle.registration.toLowerCase().includes(query) ||
        vehicle.vehicleName.toLowerCase().includes(query) ||
        vehicle.driverName.toLowerCase().includes(query) ||
        vehicle.customerName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      const matchesVehicle = vehicleFilter === 'All' || vehicle.vehicleName === vehicleFilter;
      const matchesDriver = driverFilter === 'All' || vehicle.driverName === driverFilter;
      const matchesCustomer = customerFilter === 'All' || vehicle.customerName === customerFilter;
      return matchesQuery && matchesStatus && matchesVehicle && matchesDriver && matchesCustomer;
    });
  }, [customerFilter, data.liveVehicles, driverFilter, searchTerm, statusFilter, vehicleFilter]);

  const selectedVehicle =
    filteredVehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ||
    filteredVehicles[0] ||
    data.liveVehicles[0];

  const summary = {
    onRoute: data.liveVehicles.filter((vehicle) => vehicle.status === 'On Route').length,
    delayed: data.liveVehicles.filter((vehicle) => vehicle.status === 'Delayed').length,
    offline: data.liveVehicles.filter((vehicle) => vehicle.status === 'Offline').length,
    atSite: data.liveVehicles.filter((vehicle) => vehicle.status === 'At Site').length,
    atYard: data.liveVehicles.filter((vehicle) => vehicle.status === 'At Yard').length,
  };
  const connectionSummary = trackingService.getConnectionSummary();

  useEffect(() => {
    const unsubscribe = trackingService.subscribeToSettings((snapshot) => {
      setProvider(snapshot.provider);
      setMode(snapshot.mode);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="page-container tracking-page tactical-tracking-page">
      <div className="page-header tracking-command-header">
        <div>
          <h1>Live Fleet Tracking</h1>
          <p>Real-time command map tied directly to the active presenter scenario.</p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div className="tracking-connection-panel">
        <div>
          <h3>Tracker connection status</h3>
          <p>
            {mode === TRACKING_MODES.LIVE
              ? `Live provider mode is selected for ${providerLabels[provider]}.`
              : 'Demo mode is running normalized fleet telemetry for sales and operations demos.'}
          </p>
        </div>
        <div className="tracking-connection-meta">
          <IntegrationStatusBadge status={connectionSummary.status} />
          {mode === TRACKING_MODES.LIVE && provider !== TRACKING_PROVIDERS.DEMO && (
            <div className="live-mode-warning compact">
              <AlertTriangle size={14} />
              <span>{connectionSummary.warning}</span>
            </div>
          )}
        </div>
      </div>

      <div className="page-actions tracking-actions">
        <div className="provider-selector">
          <span className="provider-label">Provider:</span>
          <select value={provider} onChange={(event) => { trackingService.setProvider(event.target.value); setProvider(event.target.value); }}>
            <option value={TRACKING_PROVIDERS.DEMO}>Demo (Simulated)</option>
            <option value={TRACKING_PROVIDERS.CARTRACK}>Cartrack</option>
            <option value={TRACKING_PROVIDERS.NETSTAR}>Netstar</option>
            <option value={TRACKING_PROVIDERS.TRACKER_SA}>Tracker SA</option>
            <option value={TRACKING_PROVIDERS.MIX_TELEMATICS}>Mix Telematics</option>
            <option value={TRACKING_PROVIDERS.CTRACK}>Ctrack</option>
            <option value={TRACKING_PROVIDERS.WEBFLEET}>Webfleet</option>
            <option value={TRACKING_PROVIDERS.TELTONIKA}>Teltonika</option>
          </select>
        </div>

        <div className="tracking-filter-row">
          <label className="search-mini">
            <Search size={16} />
            <input type="text" placeholder="Search vehicle, driver, customer..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All statuses</option>
            <option value="On Route">On Route</option>
            <option value="Delayed">Delayed</option>
            <option value="Offline">Offline</option>
            <option value="At Site">At Site</option>
            <option value="At Yard">At Yard</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)}>
            {vehicleOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All vehicles' : option}
              </option>
            ))}
          </select>
          <select value={driverFilter} onChange={(event) => setDriverFilter(event.target.value)}>
            {driverOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All drivers' : option}
              </option>
            ))}
          </select>
          <select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)}>
            {customerOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All customers' : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tracking-stats tracking-stats-expanded">
        <div className="tracking-stat success"><span className="stat-value">{summary.onRoute}</span><span className="stat-label">Vehicles on route</span></div>
        <div className="tracking-stat danger"><span className="stat-value">{summary.delayed}</span><span className="stat-label">Delayed</span></div>
        <div className="tracking-stat neutral"><span className="stat-value">{summary.offline}</span><span className="stat-label">Offline trackers</span></div>
        <div className="tracking-stat info"><span className="stat-value">{summary.atSite}</span><span className="stat-label">At site</span></div>
        <div className="tracking-stat purple"><span className="stat-value">{summary.atYard}</span><span className="stat-label">At yard</span></div>
      </div>

      <div className="tracking-grid-upgraded tactical-tracking-grid">
        <div className="tracking-map-column tactical-tracking-map-column">
          <LiveFleetMap
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicle?.vehicleId}
            onSelectVehicle={(vehicle) => setSelectedVehicleId(vehicle.vehicleId)}
            showInlinePopup={false}
            scenario={scenario}
            scenarioKey={scenarioKey}
            title="Tactical Fleet Command Map"
          />
          <LiveEventTicker vehicles={filteredVehicles} scenarioKey={scenarioKey} maxItems={4} />
        </div>

        <div className="tracking-sidebar-column tactical-tracking-sidebar">
          {selectedVehicle && (
            <div className="page-card route-history-card selected-vehicle-panel">
              <div className="card-header"><h3>Vehicle intelligence</h3></div>
              <VehicleIntelPanel vehicle={selectedVehicle} />
            </div>
          )}

          <div className="page-card tracking-list-card tracking-vehicle-list-card">
            <FleetTray
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicle?.vehicleId}
              onSelectVehicle={(vehicle) => setSelectedVehicleId(vehicle.vehicleId)}
            />
          </div>

          {selectedVehicle && (
            <div className="page-card route-history-card">
              <div className="card-header"><h3>Route history timeline</h3></div>
              <div className="route-history-list">
                {selectedVehicle.routeHistory.map((entry) => (
                  <div key={`${entry.label}-${entry.time}`} className="route-history-item">
                    <div className="route-history-dot" />
                    <div>
                      <strong>{entry.label}</strong>
                      <p>{entry.detail}</p>
                      <span>{new Date(entry.time).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
