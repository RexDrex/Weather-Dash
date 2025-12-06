import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { weatherAPI } from '@/services/weatherAPI';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import type { City, CompleteWeatherData, WeatherAlert } from '@/types/weather.types';

interface WeatherState {
  weatherData: Record<string, CompleteWeatherData>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  alerts: WeatherAlert[];
  lastRefresh: number | null;
}

type WeatherAction =
  | { type: 'SET_LOADING'; payload: { cityId: string; loading: boolean } }
  | { type: 'SET_WEATHER'; payload: { cityId: string; data: CompleteWeatherData } }
  | { type: 'SET_ERROR'; payload: { cityId: string; error: string } }
  | { type: 'CLEAR_WEATHER'; payload: string }
  | { type: 'SET_ALERTS'; payload: WeatherAlert[] }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'SET_LAST_REFRESH'; payload: number };

const initialState: WeatherState = {
  weatherData: {},
  loading: {},
  errors: {},
  alerts: [],
  lastRefresh: null,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.cityId]: action.payload.loading },
      };
    case 'SET_WEATHER':
      return {
        ...state,
        weatherData: { ...state.weatherData, [action.payload.cityId]: action.payload.data },
        loading: { ...state.loading, [action.payload.cityId]: false },
        errors: { ...state.errors, [action.payload.cityId]: null },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.cityId]: action.payload.error },
        loading: { ...state.loading, [action.payload.cityId]: false },
      };
    case 'CLEAR_WEATHER':
      const { [action.payload]: _, ...remainingData } = state.weatherData;
      const { [action.payload]: __, ...remainingLoading } = state.loading;
      const { [action.payload]: ___, ...remainingErrors } = state.errors;
      return {
        ...state,
        weatherData: remainingData,
        loading: remainingLoading,
        errors: remainingErrors,
        alerts: state.alerts.filter(a => a.cityId !== action.payload),
      };
    case 'SET_ALERTS':
      return {
        ...state,
        alerts: action.payload,
      };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a => 
          a.id === action.payload ? { ...a, dismissed: true } : a
        ),
      };
    case 'SET_LAST_REFRESH':
      return {
        ...state,
        lastRefresh: action.payload,
      };
    default:
      return state;
  }
}

interface WeatherContextType {
  state: WeatherState;
  fetchWeather: (city: City) => Promise<void>;
  refreshCity: (city: City) => Promise<void>;
  refreshAll: (cities: City[]) => Promise<void>;
  clearCityData: (cityId: string) => void;
  dismissAlert: (alertId: string) => void;
  getWeatherData: (cityId: string) => CompleteWeatherData | null;
  isLoading: (cityId: string) => boolean;
  getError: (cityId: string) => string | null;
  activeAlerts: WeatherAlert[];
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const [storedAlerts, setStoredAlerts] = useLocalStorage<WeatherAlert[]>(STORAGE_KEYS.ALERTS, []);

  // Sync alerts with localStorage
  useEffect(() => {
    if (state.alerts.length > 0) {
      setStoredAlerts(state.alerts);
    }
  }, [state.alerts, setStoredAlerts]);

  const fetchWeather = useCallback(async (city: City) => {
    dispatch({ type: 'SET_LOADING', payload: { cityId: city.id, loading: true } });
    
    try {
      const data = await weatherAPI.getCompleteWeatherData(city.lat, city.lon, city.id, city.name);
      dispatch({ type: 'SET_WEATHER', payload: { cityId: city.id, data } });
      
      // Update alerts
      if (data.alerts.length > 0) {
        dispatch({ type: 'SET_ALERTS', payload: [...state.alerts.filter(a => a.cityId !== city.id), ...data.alerts] });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { cityId: city.id, error: 'Failed to fetch weather data' } 
      });
    }
  }, [state.alerts]);

  const refreshCity = useCallback(async (city: City) => {
    weatherAPI.clearCityCache(city.lat, city.lon);
    await fetchWeather(city);
  }, [fetchWeather]);

  const refreshAll = useCallback(async (cities: City[]) => {
    weatherAPI.clearCache();
    await Promise.all(cities.map(city => fetchWeather(city)));
    dispatch({ type: 'SET_LAST_REFRESH', payload: Date.now() });
  }, [fetchWeather]);

  const clearCityData = useCallback((cityId: string) => {
    dispatch({ type: 'CLEAR_WEATHER', payload: cityId });
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    dispatch({ type: 'DISMISS_ALERT', payload: alertId });
  }, []);

  const getWeatherData = useCallback((cityId: string) => {
    return state.weatherData[cityId] || null;
  }, [state.weatherData]);

  const isLoading = useCallback((cityId: string) => {
    return state.loading[cityId] || false;
  }, [state.loading]);

  const getError = useCallback((cityId: string) => {
    return state.errors[cityId] || null;
  }, [state.errors]);

  const activeAlerts = state.alerts.filter(a => !a.dismissed);

  return (
    <WeatherContext.Provider
      value={{
        state,
        fetchWeather,
        refreshCity,
        refreshAll,
        clearCityData,
        dismissAlert,
        getWeatherData,
        isLoading,
        getError,
        activeAlerts,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
