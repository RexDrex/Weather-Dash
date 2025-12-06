import { useState, useEffect, useCallback } from 'react';
import { weatherAPI } from '@/services/weatherAPI';
import type { City, WeatherData } from '@/types/weather.types';

interface WeatherState {
  [cityId: string]: {
    data: WeatherData | null;
    isLoading: boolean;
    error: string | null;
  };
}

export const useWeatherData = (cities: City[]) => {
  const [weatherState, setWeatherState] = useState<WeatherState>({});

  const fetchWeatherForCity = useCallback(async (city: City) => {
    setWeatherState((prev) => ({
      ...prev,
      [city.id]: { data: prev[city.id]?.data || null, isLoading: true, error: null },
    }));

    try {
      const data = await weatherAPI.getWeatherByCoords(city.lat, city.lon);
      setWeatherState((prev) => ({
        ...prev,
        [city.id]: { data, isLoading: false, error: null },
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      setWeatherState((prev) => ({
        ...prev,
        [city.id]: { data: null, isLoading: false, error: errorMessage },
      }));
    }
  }, []);

  const fetchAllWeather = useCallback(() => {
    cities.forEach((city) => {
      fetchWeatherForCity(city);
    });
  }, [cities, fetchWeatherForCity]);

  const refreshCity = useCallback((cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      fetchWeatherForCity(city);
    }
  }, [cities, fetchWeatherForCity]);

  const refreshAll = useCallback(() => {
    weatherAPI.clearCache();
    fetchAllWeather();
  }, [fetchAllWeather]);

  useEffect(() => {
    fetchAllWeather();
  }, [fetchAllWeather]);

  const getWeather = (cityId: string) => {
    return weatherState[cityId] || { data: null, isLoading: true, error: null };
  };

  return {
    weatherState,
    getWeather,
    refreshCity,
    refreshAll,
    isAnyLoading: Object.values(weatherState).some((s) => s.isLoading),
  };
};
