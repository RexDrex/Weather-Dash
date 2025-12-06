import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Trash2, RefreshCw, AlertTriangle, TrendingUp, Leaf } from 'lucide-react';
import type { WeatherData, ForecastData, AirQualityData, TemperatureUnit, City } from '@/types/weather.types';
import { formatTemperature, formatWindSpeed, formatVisibility, formatTime, capitalizeFirstLetter, getWeatherIconUrl } from '@/utils/formatters';
import { CardSkeleton } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

interface CityWeatherCardProps {
  city: City;
  weather: WeatherData | null;
  forecast?: ForecastData | null;
  airQuality?: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  onDelete: () => void;
  onRefresh: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  index: number;
  viewMode?: 'grid' | 'list';
}

export const CityWeatherCard: React.FC<CityWeatherCardProps> = ({
  city,
  weather,
  forecast,
  airQuality,
  isLoading,
  error,
  temperatureUnit,
  onDelete,
  onRefresh,
  onSelect,
  isSelected = false,
  index,
  viewMode = 'grid',
}) => {
  if (isLoading && !weather) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{city.name}</h3>
            <p className="text-sm text-muted-foreground">{city.country}</p>
          </div>
          <button onClick={onDelete} className="btn-icon text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 rounded-full bg-destructive/10 mb-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">Failed to load weather data</p>
          <button onClick={onRefresh} className="btn-secondary text-sm">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const nextForecast = forecast?.list[0];

  return (
    <div
      onClick={onSelect}
      className={cn(
        'glass-card-hover p-6 animate-fade-in-up cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary shadow-lg',
        viewMode === 'list' && 'flex items-center gap-6'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className={cn('flex items-start justify-between', viewMode === 'list' ? 'flex-1' : 'mb-4')}>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{weather.name}</h3>
          <p className="text-sm text-muted-foreground">{weather.country}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
            className={cn('btn-icon text-muted-foreground', isLoading && 'animate-spin')}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="btn-icon text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className={cn('flex items-center justify-between', viewMode === 'list' ? 'flex-1' : 'mb-6')}>
        <div>
          <p className="text-5xl font-bold text-foreground">
            {formatTemperature(weather.temp, temperatureUnit)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Feels like {formatTemperature(weather.feelsLike, temperatureUnit)}
          </p>
          <p className="text-sm font-medium text-foreground mt-2 capitalize">
            {capitalizeFirstLetter(weather.description)}
          </p>
        </div>
        <img src={getWeatherIconUrl(weather.icon)} alt={weather.description} className="weather-icon animate-float" />
      </div>

      {viewMode === 'grid' && (
        <>
          {/* Quick Stats */}
          {nextForecast && (
            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-primary/5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {nextForecast.pop}% rain chance
              </span>
              {airQuality && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Leaf className="h-4 w-4 text-success" />
                  <span className="text-xs text-muted-foreground">AQI {airQuality.aqi}</span>
                </>
              )}
            </div>
          )}

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Droplets className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-medium text-foreground">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Wind className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="text-sm font-medium text-foreground">{formatWindSpeed(weather.windSpeed)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Eye className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="text-sm font-medium text-foreground">{formatVisibility(weather.visibility)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Gauge className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Pressure</p>
                <p className="text-sm font-medium text-foreground">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>

          {/* Sunrise/Sunset */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">{formatTime(weather.sunrise)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">{formatTime(weather.sunset)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
