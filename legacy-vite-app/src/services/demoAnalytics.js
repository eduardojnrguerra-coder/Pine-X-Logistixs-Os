const EVENTS_KEY = 'pinex-demo-analytics-events';
const TOUR_PROGRESS_KEY = 'pinex-demo-tour-progress';
const TOUR_PREFS_KEY = 'pinex-demo-tour-prefs';

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const trackDemoEvent = (type, payload = {}) => {
  const events = readJson(EVENTS_KEY, []);
  const nextEvent = {
    id: `event-${Date.now()}-${events.length + 1}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
  };
  writeJson(EVENTS_KEY, [nextEvent, ...events].slice(0, 200));
  return nextEvent;
};

export const getDemoEvents = () => readJson(EVENTS_KEY, []);

export const saveTourProgress = ({ currentStep, totalSteps, lastCompletedStep, completed }) => {
  const progress = {
    currentStep,
    totalSteps,
    lastCompletedStep,
    completed,
    updatedAt: new Date().toISOString(),
  };
  writeJson(TOUR_PROGRESS_KEY, progress);
  return progress;
};

export const getTourProgress = () =>
  readJson(TOUR_PROGRESS_KEY, {
    currentStep: 0,
    totalSteps: 0,
    lastCompletedStep: 0,
    completed: false,
    updatedAt: null,
  });

export const clearTourProgress = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOUR_PROGRESS_KEY);
};

export const setTourPreference = (partialPrefs) => {
  const current = readJson(TOUR_PREFS_KEY, {
    dismissed: false,
    replayCount: 0,
  });
  const next = {
    ...current,
    ...partialPrefs,
  };
  writeJson(TOUR_PREFS_KEY, next);
  return next;
};

export const getTourPreferences = () =>
  readJson(TOUR_PREFS_KEY, {
    dismissed: false,
    replayCount: 0,
  });

export const getDemoAnalyticsSummary = () => {
  const events = getDemoEvents();
  const progress = getTourProgress();
  const prefs = getTourPreferences();
  const started = events.filter((event) => event.type === 'tour_started').length;
  const finished = events.filter((event) => event.type === 'tour_finished').length;
  const skipped = events.filter((event) => event.type === 'tour_skipped').length;
  const lastScenario = events.find((event) => event.type === 'scenario_selected')?.payload?.scenarioKey || 'normal';

  return {
    started,
    finished,
    skipped,
    completionPercentage:
      progress.totalSteps > 0 ? Math.round((progress.lastCompletedStep / progress.totalSteps) * 100) : 0,
    lastCompletedStep: progress.lastCompletedStep,
    resumeStep: progress.completed ? null : progress.currentStep,
    dismissed: prefs.dismissed,
    replayCount: prefs.replayCount,
    lastScenario,
  };
};
