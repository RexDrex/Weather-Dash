import { format } from 'date-fns';
import type { TemperatureUnit } from '@/types/weather.types';

export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

export const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 9 / 5 + 32);
};

export const formatTemperature = (kelvin: number, unit: TemperatureUnit): string => {
  if (unit === 'celsius') {
    return `${kelvinToCelsius(kelvin)}°C`;
  }
  return `${kelvinToFahrenheit(kelvin)}°F`;
};

export const formatTemperatureValue = (kelvin: number, unit: TemperatureUnit): number => {
  if (unit === 'celsius') {
    return kelvinToCelsius(kelvin);
  }
  return kelvinToFahrenheit(kelvin);
};

export const formatDate = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'EEEE, MMMM d');
};

export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'h:mm a');
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed * 3.6)} km/h`;
};

export const formatVisibility = (visibility: number): string => {
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
};

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
