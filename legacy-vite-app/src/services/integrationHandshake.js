import { appendSyncLog, getSyncLogs } from './syncLogs';

const HANDSHAKE_KEY = 'pinex-tracker-handshakes';

const readState = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(HANDSHAKE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeState = (value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HANDSHAKE_KEY, JSON.stringify(value));
};

export const HANDSHAKE_STATUSES = {
  NOT_CONNECTED: 'Not Connected',
  CREDENTIALS_SAVED: 'Credentials Saved',
  TESTING: 'Testing Connection',
  CONNECTED: 'Connected',
  ERROR: 'Error',
  SYNCING: 'Syncing',
  DEMO: 'Demo Mode',
};

export const getHandshakeState = (provider) => {
  const state = readState();
  return state[provider] || null;
};

export const saveHandshakeState = (provider, partialState) => {
  const state = readState();
  const next = {
    ...state,
    [provider]: {
      ...(state[provider] || {}),
      ...partialState,
      updatedAt: new Date().toISOString(),
    },
  };
  writeState(next);
  return next[provider];
};

export const saveCredentialsMock = (provider) => {
  appendSyncLog({
    provider,
    eventType: 'credentials_saved',
    status: HANDSHAKE_STATUSES.CREDENTIALS_SAVED,
    message: 'Provider credentials were saved locally for demo purposes.',
  });
  return saveHandshakeState(provider, { status: HANDSHAKE_STATUSES.CREDENTIALS_SAVED });
};

export const runProviderConnectionTest = async (provider, hasMaskedSecrets) => {
  saveHandshakeState(provider, { status: HANDSHAKE_STATUSES.TESTING });
  appendSyncLog({
    provider,
    eventType: 'connection_test',
    status: HANDSHAKE_STATUSES.TESTING,
    message: 'Connection test started.',
  });

  const ok = !hasMaskedSecrets;
  const status = ok ? HANDSHAKE_STATUSES.CONNECTED : HANDSHAKE_STATUSES.ERROR;
  const message = ok
    ? 'Mock provider connection succeeded.'
    : 'Connection test failed because the credentials are still placeholders.';

  appendSyncLog({
    provider,
    eventType: 'connection_test',
    status,
    message,
  });

  return saveHandshakeState(provider, {
    status,
    lastTestedAt: new Date().toISOString(),
    lastMessage: message,
  });
};

export const runSyncTest = async (provider) => {
  saveHandshakeState(provider, { status: HANDSHAKE_STATUSES.SYNCING });
  appendSyncLog({
    provider,
    eventType: 'sync_test',
    status: HANDSHAKE_STATUSES.SYNCING,
    message: 'Mock sync test started.',
  });

  const events = [
    { eventType: 'location_update', message: 'Location update received from demo adapter.' },
    { eventType: 'tracker_offline', message: 'Tracker offline event received for a demo vehicle.' },
    { eventType: 'ignition_event', message: 'Ignition state change received.' },
    { eventType: 'odometer_update', message: 'Odometer update normalized and recorded.' },
  ];

  events.forEach((event) =>
    appendSyncLog({
      provider,
      eventType: event.eventType,
      status: HANDSHAKE_STATUSES.CONNECTED,
      message: event.message,
    })
  );

  return saveHandshakeState(provider, {
    status: HANDSHAKE_STATUSES.CONNECTED,
    lastSyncedAt: new Date().toISOString(),
    lastMessage: 'Sync test completed successfully.',
  });
};

export const getIntegrationStatusSummary = () => ({
  logs: getSyncLogs(),
  states: readState(),
});
