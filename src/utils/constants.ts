export const API_CONFIG = {
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  OPENWEATHER_GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  API_KEY: '3de95d9874f494d2398dfb66dc9038f1',
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
} as const;

export const LIMITS = {
  FREE_MAX_CITIES: 3,
  PREMIUM_MAX_CITIES: 999,
} as const;

export const STORAGE_KEYS = {
  USER: 'weatherdash_user',
  CITIES: 'weatherdash_cities',
  THEME: 'weatherdash_theme',
  SETTINGS: 'weatherdash_settings',
  CREDENTIALS: 'weatherdash_credentials',
  WEATHER_CACHE: 'weatherdash_weather_cache',
  ALERTS: 'weatherdash_alerts',
} as const;

export const DEFAULT_CITIES = [
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
];

export const AQI_LEVELS = {
  1: { level: 'Good', color: 'success', message: 'Air quality is ideal for outdoor activities.' },
  2: { level: 'Fair', color: 'primary', message: 'Air quality is acceptable for most people.' },
  3: { level: 'Moderate', color: 'warning', message: 'Sensitive groups should limit outdoor activity.' },
  4: { level: 'Poor', color: 'destructive', message: 'Everyone should limit prolonged outdoor activity.' },
  5: { level: 'Very Poor', color: 'destructive', message: 'Avoid outdoor activities if possible.' },
} as const;

export const WEATHER_ALERTS_THRESHOLDS = {
  heatTemp: 35, // Celsius
  coldTemp: 0, // Celsius
  highWind: 11, // m/s
  highPrecipitation: 70, // %
  poorAirQuality: 4, // AQI level
} as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'monthly' as const,
    features: [
      'Track up to 3 cities',
      'Real-time weather data',
      'Temperature unit toggle',
      'Dark/Light theme',
      '5-day forecast',
      'Basic weather alerts',
    ],
    maxCities: 3,
    isPremium: false,
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 4.99,
    currency: 'USD',
    interval: 'monthly' as const,
    features: [
      'Unlimited cities',
      'Everything in Free',
      'Air quality data',
      'Hyperlocal forecasts',
      'Advanced weather alerts',
      'Priority support',
      'Custom widgets',
      'API access',
    ],
    maxCities: 999,
    isPremium: true,
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 49.99,
    currency: 'USD',
    interval: 'yearly' as const,
    features: [
      'Everything in Premium',
      'Save 17%',
      'Extended forecast (14 days)',
      'Historical weather data',
      'Weather widgets',
    ],
    maxCities: 999,
    isPremium: true,
  },
];
