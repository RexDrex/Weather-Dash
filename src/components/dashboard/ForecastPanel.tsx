import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, TrendingUp, TrendingDown } from 'lucide-react';
import type { ForecastData, TemperatureUnit } from '@/types/weather.types';
import { formatTemperature, formatTime, capitalizeFirstLetter } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ForecastPanelProps {
  forecast: ForecastData | null;
  cityName: string;
  temperatureUnit: TemperatureUnit;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain')) return <CloudRain className="h-5 w-5 text-primary" />;
  if (desc.includes('snow')) return <Snowflake className="h-5 w-5 text-primary" />;
  if (desc.includes('cloud')) return <Cloud className="h-5 w-5 text-muted-foreground" />;
  if (desc.includes('wind')) return <Wind className="h-5 w-5 text-muted-foreground" />;
  return <Sun className="h-5 w-5 text-accent" />;
};

export const ForecastPanel: React.FC<ForecastPanelProps> = ({
  forecast,
  cityName,
  temperatureUnit,
}) => {
  if (!forecast) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No forecast data available
        </p>
      </div>
    );
  }

  // Group forecast by day (every 8 items = 1 day with 3-hour intervals)
  const dailyForecast = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        5-Day Forecast for {cityName}
      </h3>
      
      <div className="space-y-3">
        {dailyForecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div
              key={day.dt}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl bg-secondary/50 transition-colors hover:bg-secondary',
                index === 0 && 'ring-1 ring-primary/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 text-sm font-medium text-foreground">
                  {dayName}
                </div>
                {getWeatherIcon(day.description)}
                <span className="text-sm text-muted-foreground capitalize">
                  {capitalizeFirstLetter(day.description)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Droplets className="h-3 w-3" />
                  <span>{day.pop}%</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center text-foreground font-medium">
                    <TrendingUp className="h-3 w-3 mr-0.5 text-destructive" />
                    {formatTemperature(day.tempMax, temperatureUnit)}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <TrendingDown className="h-3 w-3 mr-0.5 text-primary" />
                    {formatTemperature(day.tempMin, temperatureUnit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Hourly Preview */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3">Next 24 Hours</h4>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {forecast.list.slice(0, 8).map((hour) => {
            const time = new Date(hour.dt * 1000);
            return (
              <div
                key={hour.dt}
                className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/30 min-w-[60px]"
              >
                <span className="text-xs text-muted-foreground">
                  {time.getHours().toString().padStart(2, '0')}:00
                </span>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                  alt={hour.description}
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-foreground">
                  {formatTemperature(hour.temp, temperatureUnit)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
