const SYNC_LOGS_KEY = 'pinex-sync-logs';

const readLogs = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(SYNC_LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeLogs = (logs) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SYNC_LOGS_KEY, JSON.stringify(logs));
};

export const getSyncLogs = () => readLogs();

export const appendSyncLog = ({ provider, eventType, status, message }) => {
  const logs = readLogs();
  const entry = {
    id: `sync-${Date.now()}-${logs.length + 1}`,
    timestamp: new Date().toISOString(),
    provider,
    eventType,
    status,
    message,
  };
  writeLogs([entry, ...logs].slice(0, 100));
  return entry;
};

export const clearSyncLogs = () => writeLogs([]);
