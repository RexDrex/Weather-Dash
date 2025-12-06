export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  dt: number;
  timezone: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  pop: number;
  windSpeed: number;
}

export interface ForecastData {
  city: {
    name: string;
    country: string;
    timezone: number;
  };
  list: ForecastItem[];
}

export interface AirQualityData {
  aqi: number;
  level: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor';
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  healthMessage: string;
}

export interface WeatherAlert {
  id: string;
  type: 'heat' | 'cold' | 'wind' | 'precipitation' | 'air_quality' | 'storm';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action: string;
  cityId: string;
  cityName: string;
  timestamp: number;
  dismissed: boolean;
}

export interface HyperlocalData {
  precipitationChance: number;
  precipitationIntensity: number;
  nextHourForecast: {
    time: number;
    temp: number;
    precipitation: number;
  }[];
  streetLevelTemp: number;
  windVariation: number;
}

export interface CompleteWeatherData {
  current: WeatherData;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  hyperlocal: HyperlocalData | null;
  alerts: WeatherAlert[];
  lastUpdated: number;
}

export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface Settings {
  temperatureUnit: TemperatureUnit;
  theme: 'light' | 'dark';
  alertsEnabled: boolean;
  notificationsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}
