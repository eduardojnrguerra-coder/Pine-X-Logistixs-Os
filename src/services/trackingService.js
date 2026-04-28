import {
  VEHICLES,
  getVehicleById,
} from '../data/demoData';
import {
  liveFleetSimulator,
  getNormalizedFleetSnapshot,
} from './liveFleetSimulator';
import {
  HANDSHAKE_STATUSES,
  runProviderConnectionTest,
  runSyncTest,
  saveCredentialsMock,
} from './integrationHandshake';

const TRACKING_PROVIDERS = {
  DEMO: 'demo',
  CARTRACK: 'cartrack',
  NETSTAR: 'netstar',
  TRACKER_SA: 'tracker_sa',
  MIX_TELEMATICS: 'mix_telematics',
  CTRACK: 'ctrack',
  WEBFLEET: 'webfleet',
  TELTONIKA: 'teltonika',
};

const TRACKING_MODES = {
  DEMO: 'demo',
  LIVE: 'live',
};

const VEHICLE_STATUS = {
  ON_ROUTE: 'On Route',
  AT_SITE: 'At Site',
  AT_YARD: 'At Yard',
  DELAYED: 'Delayed',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Offline',
  DELIVERED: 'Delivered',
};

const providerLabels = {
  [TRACKING_PROVIDERS.DEMO]: 'Demo Adapter',
  [TRACKING_PROVIDERS.CARTRACK]: 'Cartrack',
  [TRACKING_PROVIDERS.NETSTAR]: 'Netstar',
  [TRACKING_PROVIDERS.TRACKER_SA]: 'Tracker SA',
  [TRACKING_PROVIDERS.MIX_TELEMATICS]: 'Mix Telematics',
  [TRACKING_PROVIDERS.CTRACK]: 'Ctrack',
  [TRACKING_PROVIDERS.WEBFLEET]: 'Webfleet',
  [TRACKING_PROVIDERS.TELTONIKA]: 'Teltonika',
};

const createProviderConfig = (provider, status, linkedVehicles) => ({
  provider,
  providerName: providerLabels[provider],
  status,
  apiBaseUrl:
    provider === TRACKING_PROVIDERS.DEMO
      ? 'https://demo.pinexlogistics.local/tracking'
      : `https://api.${provider.replace(/_/g, '-')}.example.com`,
  apiKey: provider === TRACKING_PROVIDERS.DEMO ? 'demo-key-****' : 'pk_live_********',
  apiSecret: provider === TRACKING_PROVIDERS.DEMO ? 'demo-secret-****' : 'sk_live_********',
  lastSynced: provider === TRACKING_PROVIDERS.DEMO ? new Date().toISOString() : null,
  vehiclesLinkedCount: linkedVehicles,
});

const defaultProviderConfigs = {
  [TRACKING_PROVIDERS.DEMO]: createProviderConfig(TRACKING_PROVIDERS.DEMO, 'Demo Mode', 12),
  [TRACKING_PROVIDERS.CARTRACK]: createProviderConfig(TRACKING_PROVIDERS.CARTRACK, 'Not Connected', 4),
  [TRACKING_PROVIDERS.NETSTAR]: createProviderConfig(TRACKING_PROVIDERS.NETSTAR, 'Not Connected', 3),
  [TRACKING_PROVIDERS.TRACKER_SA]: createProviderConfig(TRACKING_PROVIDERS.TRACKER_SA, 'Error', 2),
  [TRACKING_PROVIDERS.MIX_TELEMATICS]: createProviderConfig(TRACKING_PROVIDERS.MIX_TELEMATICS, 'Not Connected', 0),
  [TRACKING_PROVIDERS.CTRACK]: createProviderConfig(TRACKING_PROVIDERS.CTRACK, 'Not Connected', 1),
  [TRACKING_PROVIDERS.WEBFLEET]: createProviderConfig(TRACKING_PROVIDERS.WEBFLEET, 'Not Connected', 0),
  [TRACKING_PROVIDERS.TELTONIKA]: createProviderConfig(TRACKING_PROVIDERS.TELTONIKA, 'Not Connected', 2),
};

class TrackingService {
  constructor() {
    this.provider = TRACKING_PROVIDERS.DEMO;
    this.mode = TRACKING_MODES.DEMO;
    this.callbacks = [];
    this.settingsCallbacks = [];
    this.providerConfigs = { ...defaultProviderConfigs };
    this.unsubscribeSimulator = null;
    this.latestVehicles = [];
  }

  setProvider(provider) {
    this.provider = provider;
    this.emitSettings();
    this.refreshSnapshot();
  }

  getProvider() {
    return this.provider;
  }

  setMode(mode) {
    this.mode = mode;
    this.emitSettings();
    this.refreshSnapshot();
  }

  getMode() {
    return this.mode;
  }

  isLiveMode() {
    return this.mode === TRACKING_MODES.LIVE;
  }

  getProviderConfigs() {
    return { ...this.providerConfigs };
  }

  getProviderConfig(provider) {
    return this.providerConfigs[provider];
  }

  updateProviderConfig(provider, partialConfig) {
    if (provider !== TRACKING_PROVIDERS.DEMO) {
      saveCredentialsMock(provider);
    }
    this.providerConfigs = {
      ...this.providerConfigs,
      [provider]: {
        ...this.providerConfigs[provider],
        ...partialConfig,
      },
    };
    this.emitSettings();
    this.refreshSnapshot();
    return this.providerConfigs[provider];
  }

  getConnectionSummary() {
    const activeProvider = this.providerConfigs[this.provider];
    return {
      mode: this.mode,
      activeProvider: this.provider,
      activeProviderLabel: providerLabels[this.provider],
      status: activeProvider?.status || 'Not Connected',
      warning:
        this.isLiveMode() && this.provider !== TRACKING_PROVIDERS.DEMO
          ? 'Live provider mode requires real credentials, server-side secret storage, and provider-specific polling or webhooks.'
          : 'Demo mode is streaming normalized mock telemetry for live sales demos.',
      connectedProviders: Object.values(this.providerConfigs).filter(
        (config) => config.status === 'Connected' || config.status === 'Demo Mode'
      ).length,
    };
  }

  async testConnection(provider) {
    const config = this.providerConfigs[provider];
    const hasMaskedValues =
      (config.apiKey || '').includes('****') || (config.apiSecret || '').includes('****');

    if (provider === TRACKING_PROVIDERS.DEMO) {
      this.updateProviderConfig(provider, {
        status: 'Demo Mode',
        lastSynced: new Date().toISOString(),
      });
      return { ok: true, status: 'Demo Mode', message: 'Demo adapter is active and responding.' };
    }

    const handshake = await runProviderConnectionTest(provider, hasMaskedValues || !config.apiBaseUrl);
    if (handshake.status === HANDSHAKE_STATUSES.ERROR) {
      this.updateProviderConfig(provider, { status: 'Error' });
      return {
        ok: false,
        status: 'Error',
        message: 'Connection test failed because the provider still has masked demo credentials.',
      };
    }

    this.updateProviderConfig(provider, {
      status: 'Connected',
      lastSynced: new Date().toISOString(),
    });
    return {
      ok: true,
      status: 'Connected',
      message: `${providerLabels[provider]} mock connection succeeded.`,
    };
  }

  async runSyncTest(provider = this.provider) {
    const result = await runSyncTest(provider);
    this.updateProviderConfig(provider, {
      status: result.status,
      lastSynced: result.lastSyncedAt || new Date().toISOString(),
    });
    return result;
  }

  applyProviderAdapter(vehicle) {
    const providerLabel = providerLabels[this.provider];
    const config = this.providerConfigs[this.provider];

    if (!this.isLiveMode() || this.provider === TRACKING_PROVIDERS.DEMO) {
      return {
        ...vehicle,
        provider: providerLabel,
      };
    }

    if (config.status !== 'Connected') {
      return {
        ...vehicle,
        provider: providerLabel,
        status: VEHICLE_STATUS.OFFLINE,
        ignitionStatus: 'Unknown',
        speed: 0,
        lastSeen: config.lastSynced || vehicle.lastSeen,
      };
    }

    // Real adapters for Cartrack, Netstar, Tracker SA, Mix Telematics, Ctrack,
    // Webfleet, and Teltonika will plug in here and map their payloads into
    // the normalized vehicle location object used throughout the app.
    return {
      ...vehicle,
      provider: providerLabel,
      trackerDeviceId: `${this.provider.toUpperCase()}-${vehicle.vehicleId}`,
      lastSeen: config.lastSynced || vehicle.lastSeen,
    };
  }

  getVehiclesFromSnapshot() {
    const fleet = getNormalizedFleetSnapshot();
    return fleet.map((vehicle) => this.applyProviderAdapter(vehicle));
  }

  async getVehicles() {
    const snapshot = this.getVehiclesFromSnapshot();
    this.latestVehicles = snapshot;
    return snapshot;
  }

  async getVehicle(vehicleId) {
    const vehicles = this.latestVehicles.length > 0 ? this.latestVehicles : await this.getVehicles();
    return vehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
  }

  getVehicleProviderStatus(vehicleId) {
    const vehicle = getVehicleById(vehicleId);
    const config = this.providerConfigs[this.provider];
    return {
      provider: providerLabels[this.provider],
      providerStatus: config?.status || 'Not Connected',
      vehicleName: vehicle?.name || vehicleId,
    };
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  subscribeToSettings(callback) {
    this.settingsCallbacks.push(callback);
    return () => {
      this.settingsCallbacks = this.settingsCallbacks.filter((cb) => cb !== callback);
    };
  }

  emitVehicles(vehicles) {
    this.latestVehicles = vehicles;
    this.callbacks.forEach((callback) => callback(vehicles));
  }

  emitSettings() {
    const snapshot = {
      provider: this.provider,
      mode: this.mode,
      providerConfigs: this.getProviderConfigs(),
      connectionSummary: this.getConnectionSummary(),
    };
    this.settingsCallbacks.forEach((callback) => callback(snapshot));
  }

  refreshSnapshot() {
    const vehicles = this.getVehiclesFromSnapshot();
    this.emitVehicles(vehicles);
  }

  startLiveUpdates() {
    if (!this.unsubscribeSimulator) {
      this.unsubscribeSimulator = liveFleetSimulator.subscribe((fleet) => {
        const vehicles = fleet.map((vehicle) => this.applyProviderAdapter(vehicle));
        this.emitVehicles(vehicles);
      });
    }

    liveFleetSimulator.start();
    this.refreshSnapshot();
    this.emitSettings();
  }

  stopLiveUpdates() {
    if (this.unsubscribeSimulator) {
      this.unsubscribeSimulator();
      this.unsubscribeSimulator = null;
    }

    liveFleetSimulator.stop();
  }
}

export const trackingService = new TrackingService();
export { TRACKING_MODES, TRACKING_PROVIDERS, VEHICLE_STATUS, providerLabels, VEHICLES };
