import axios from 'axios';
import { API_CONFIG, AQI_LEVELS, WEATHER_ALERTS_THRESHOLDS } from '@/utils/constants';
import type { 
  GeoLocation, 
  OpenWeatherResponse, 
  WeatherData, 
  ForecastData, 
  ForecastItem,
  AirQualityData,
  WeatherAlert,
  HyperlocalData,
  CompleteWeatherData 
} from '@/types/weather.types';
import { generateId } from '@/utils/formatters';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class WeatherCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > API_CONFIG.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const weatherCache = new WeatherCache();

export const weatherAPI = {
  async searchCity(cityName: string): Promise<GeoLocation[]> {
    const response = await axios.get<GeoLocation[]>(`${API_CONFIG.OPENWEATHER_GEO_URL}/direct`, {
      params: {
        q: cityName,
        limit: 5,
        appid: API_CONFIG.API_KEY,
      },
    });
    return response.data;
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = weatherCache.get<WeatherData>(cacheKey);
    if (cached) return cached;

    const response = await axios.get<OpenWeatherResponse>(`${API_CONFIG.OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_CONFIG.API_KEY,
      },
    });

    const weatherData = this.transformWeatherData(response.data);
    weatherCache.set(cacheKey, weatherData);

    return weatherData;
  },

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const cacheKey = `forecast_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = weatherCache.get<ForecastData>(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${API_CONFIG.OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_CONFIG.API_KEY,
        cnt: 40, // 5 days * 8 (3-hour intervals)
      },
    });

    const forecastData = this.transformForecastData(response.data);
    weatherCache.set(cacheKey, forecastData);

    return forecastData;
  },

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const cacheKey = `airquality_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = weatherCache.get<AirQualityData>(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${API_CONFIG.OPENWEATHER_BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_CONFIG.API_KEY,
      },
    });

    const airQualityData = this.transformAirQualityData(response.data);
    weatherCache.set(cacheKey, airQualityData);

    return airQualityData;
  },

  async getCompleteWeatherData(lat: number, lon: number, cityId: string, cityName: string): Promise<CompleteWeatherData> {
    const cacheKey = `complete_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = weatherCache.get<CompleteWeatherData>(cacheKey);
    if (cached) return cached;

    try {
      const [current, forecast, airQuality] = await Promise.all([
        this.getWeatherByCoords(lat, lon),
        this.getForecast(lat, lon).catch(() => null),
        this.getAirQuality(lat, lon).catch(() => null),
      ]);

      const hyperlocal = this.generateHyperlocalData(current, forecast);
      const alerts = this.detectAlerts(current, forecast, airQuality, cityId, cityName);

      const completeData: CompleteWeatherData = {
        current,
        forecast,
        airQuality,
        hyperlocal,
        alerts,
        lastUpdated: Date.now(),
      };

      weatherCache.set(cacheKey, completeData);
      return completeData;
    } catch (error) {
      console.error('Failed to fetch complete weather data:', error);
      throw error;
    }
  },

  transformWeatherData(data: OpenWeatherResponse): WeatherData {
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      dt: data.dt,
      timezone: data.timezone,
    };
  },

  transformForecastData(data: any): ForecastData {
    const list: ForecastItem[] = data.list.map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      humidity: item.main.humidity,
      description: item.weather[0]?.description || 'Unknown',
      icon: item.weather[0]?.icon || '01d',
      pop: Math.round((item.pop || 0) * 100),
      windSpeed: item.wind.speed,
    }));

    return {
      city: {
        name: data.city.name,
        country: data.city.country,
        timezone: data.city.timezone,
      },
      list,
    };
  },

  transformAirQualityData(data: any): AirQualityData {
    const aqi = data.list[0]?.main?.aqi || 1;
    const components = data.list[0]?.components || {};
    const aqiInfo = AQI_LEVELS[aqi as keyof typeof AQI_LEVELS];

    return {
      aqi,
      level: aqiInfo.level as AirQualityData['level'],
      components: {
        co: components.co || 0,
        no: components.no || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        so2: components.so2 || 0,
        pm2_5: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        nh3: components.nh3 || 0,
      },
      healthMessage: aqiInfo.message,
    };
  },

  generateHyperlocalData(current: WeatherData, forecast: ForecastData | null): HyperlocalData {
    const nextHourForecast: HyperlocalData['nextHourForecast'] = [];
    const now = Date.now();

    // Generate simulated minute-by-minute data based on current conditions
    for (let i = 0; i < 12; i++) {
      const variation = (Math.random() - 0.5) * 2;
      nextHourForecast.push({
        time: now + i * 5 * 60 * 1000, // Every 5 minutes
        temp: current.temp + variation,
        precipitation: forecast?.list[0]?.pop || 0,
      });
    }

    // Add street-level variations (simulated micro-climate)
    const streetLevelVariation = (Math.random() - 0.5) * 3;
    const windVariation = Math.random() * 20;

    return {
      precipitationChance: forecast?.list[0]?.pop || 0,
      precipitationIntensity: Math.random() * 5,
      nextHourForecast,
      streetLevelTemp: current.temp + streetLevelVariation,
      windVariation,
    };
  },

  detectAlerts(
    current: WeatherData,
    forecast: ForecastData | null,
    airQuality: AirQualityData | null,
    cityId: string,
    cityName: string
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const tempCelsius = current.temp - 273.15;

    // Heat alert
    if (tempCelsius > WEATHER_ALERTS_THRESHOLDS.heatTemp) {
      alerts.push({
        id: generateId(),
        type: 'heat',
        severity: 'high',
        title: '🌡️ Extreme Heat Warning',
        message: `Temperature in ${cityName} is ${Math.round(tempCelsius)}°C`,
        action: 'Stay hydrated, avoid direct sun exposure, use air conditioning',
        cityId,
        cityName,
        timestamp: Date.now(),
        dismissed: false,
      });
    }

    // Cold alert
    if (tempCelsius < WEATHER_ALERTS_THRESHOLDS.coldTemp) {
      alerts.push({
        id: generateId(),
        type: 'cold',
        severity: 'medium',
        title: '❄️ Freezing Conditions',
        message: `Temperature in ${cityName} is ${Math.round(tempCelsius)}°C`,
        action: 'Dress warmly, protect exposed skin, check on vulnerable neighbors',
        cityId,
        cityName,
        timestamp: Date.now(),
        dismissed: false,
      });
    }

    // Wind alert
    if (current.windSpeed > WEATHER_ALERTS_THRESHOLDS.highWind) {
      alerts.push({
        id: generateId(),
        type: 'wind',
        severity: 'medium',
        title: '💨 Strong Wind Advisory',
        message: `Wind speed in ${cityName} is ${Math.round(current.windSpeed)} m/s`,
        action: 'Secure outdoor items, avoid high-profile vehicles',
        cityId,
        cityName,
        timestamp: Date.now(),
        dismissed: false,
      });
    }

    // Precipitation alert
    if (forecast?.list[0]?.pop && forecast.list[0].pop > WEATHER_ALERTS_THRESHOLDS.highPrecipitation) {
      alerts.push({
        id: generateId(),
        type: 'precipitation',
        severity: 'low',
        title: '🌧️ Rain Expected',
        message: `${forecast.list[0].pop}% chance of precipitation in ${cityName}`,
        action: 'Carry an umbrella, plan for indoor activities',
        cityId,
        cityName,
        timestamp: Date.now(),
        dismissed: false,
      });
    }

    // Air quality alert
    if (airQuality && airQuality.aqi >= WEATHER_ALERTS_THRESHOLDS.poorAirQuality) {
      alerts.push({
        id: generateId(),
        type: 'air_quality',
        severity: 'high',
        title: '😷 Poor Air Quality',
        message: `Air quality index in ${cityName} is ${airQuality.aqi} (${airQuality.level})`,
        action: 'Limit outdoor activities, wear a mask if going outside',
        cityId,
        cityName,
        timestamp: Date.now(),
        dismissed: false,
      });
    }

    return alerts;
  },

  clearCache() {
    weatherCache.clear();
  },

  clearCityCache(lat: number, lon: number) {
    const keys = [
      `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`,
      `forecast_${lat.toFixed(2)}_${lon.toFixed(2)}`,
      `airquality_${lat.toFixed(2)}_${lon.toFixed(2)}`,
      `complete_${lat.toFixed(2)}_${lon.toFixed(2)}`,
    ];
    keys.forEach(key => weatherCache.delete(key));
  },
};
