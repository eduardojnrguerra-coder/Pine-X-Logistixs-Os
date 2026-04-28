/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trackingService } from '../services/trackingService';
import {
  buildScenarioState,
  PRESENTER_SCENARIOS,
} from '../services/scenarioEngine';
import {
  clearTourProgress,
  getDemoAnalyticsSummary,
  getTourPreferences,
  getTourProgress,
  saveTourProgress,
  setTourPreference,
  trackDemoEvent,
} from '../services/demoAnalytics';

const PRESENTER_SCENARIO_KEY = 'pinex-presenter-scenario';

const PresenterModeContext = createContext(null);

const getStoredScenario = () => {
  if (typeof window === 'undefined') return 'normal';
  return window.localStorage.getItem(PRESENTER_SCENARIO_KEY) || 'normal';
};

export function PresenterModeProvider({ children }) {
  const [scenarioKey, setScenarioKeyState] = useState(getStoredScenario);
  const [panelOpen, setPanelOpen] = useState(false);
  const [liveVehicles, setLiveVehicles] = useState([]);
  const [tourAnalytics, setTourAnalytics] = useState(getDemoAnalyticsSummary);
  const [tourPrefs, setTourPrefs] = useState(getTourPreferences);
  const [tourProgress, setTourProgressState] = useState(getTourProgress);

  useEffect(() => {
    trackingService.startLiveUpdates();
    trackingService.getVehicles().then(setLiveVehicles);
    const unsubscribe = trackingService.subscribe(setLiveVehicles);
    return () => {
      unsubscribe();
      trackingService.stopLiveUpdates();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PRESENTER_SCENARIO_KEY, scenarioKey);
  }, [scenarioKey]);

  const scenarioState = useMemo(
    () => buildScenarioState({ scenarioKey, liveVehicles }),
    [liveVehicles, scenarioKey]
  );

  const refreshAnalytics = useCallback(() => {
    setTourAnalytics(getDemoAnalyticsSummary());
    setTourPrefs(getTourPreferences());
    setTourProgressState(getTourProgress());
  }, []);

  const setScenario = useCallback((nextScenarioKey) => {
    setScenarioKeyState(nextScenarioKey);
    trackDemoEvent('scenario_selected', { scenarioKey: nextScenarioKey });
    refreshAnalytics();
  }, [refreshAnalytics]);

  const resetScenario = useCallback(() => setScenario('normal'), [setScenario]);

  const recordTourEvent = useCallback((type, payload = {}) => {
    trackDemoEvent(type, payload);
    refreshAnalytics();
  }, [refreshAnalytics]);

  const updateTourProgress = useCallback((progress) => {
    saveTourProgress(progress);
    refreshAnalytics();
  }, [refreshAnalytics]);

  const dismissTour = useCallback(() => {
    setTourPreference({ dismissed: true });
    refreshAnalytics();
  }, [refreshAnalytics]);

  const replayTour = useCallback(() => {
    clearTourProgress();
    setTourPreference({ dismissed: false, replayCount: tourPrefs.replayCount + 1 });
    refreshAnalytics();
  }, [refreshAnalytics, tourPrefs.replayCount]);

  const resumeTourStep = tourProgress.completed ? null : tourProgress.currentStep;

  const value = {
    scenarioKey,
    scenario: scenarioState.scenario,
    scenarios: PRESENTER_SCENARIOS,
    metrics: scenarioState.metrics,
    moneyLeakage: scenarioState.moneyLeakage,
    data: scenarioState.data,
    panelOpen,
    setPanelOpen,
    setScenario,
    resetScenario,
    analytics: tourAnalytics,
    tourPrefs,
    tourProgress,
    resumeTourStep,
    recordTourEvent,
    updateTourProgress,
    dismissTour,
    replayTour,
  };

  return (
    <PresenterModeContext.Provider value={value}>
      {children}
    </PresenterModeContext.Provider>
  );
}

export const usePresenterMode = () => {
  const context = useContext(PresenterModeContext);
  if (!context) {
    throw new Error('usePresenterMode must be used within PresenterModeProvider');
  }
  return context;
};
