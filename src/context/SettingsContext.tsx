import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import type { Settings } from '@/types/weather.types';

const defaultSettings: Settings = {
  temperatureUnit: 'celsius',
  theme: 'light',
  alertsEnabled: true,
  notificationsEnabled: false,
  autoRefresh: true,
  refreshInterval: 10,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  toggleTemperatureUnit: () => void;
  toggleAlerts: () => void;
  toggleNotifications: () => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (minutes: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>(STORAGE_KEYS.SETTINGS, defaultSettings);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  const toggleTemperatureUnit = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      temperatureUnit: prev.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius',
    }));
  }, [setSettings]);

  const toggleAlerts = useCallback(() => {
    setSettings(prev => ({ ...prev, alertsEnabled: !prev.alertsEnabled }));
  }, [setSettings]);

  const toggleNotifications = useCallback(() => {
    setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  }, [setSettings]);

  const toggleAutoRefresh = useCallback(() => {
    setSettings(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }));
  }, [setSettings]);

  const setRefreshInterval = useCallback((minutes: number) => {
    setSettings(prev => ({ ...prev, refreshInterval: minutes }));
  }, [setSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        toggleTemperatureUnit,
        toggleAlerts,
        toggleNotifications,
        toggleAutoRefresh,
        setRefreshInterval,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
