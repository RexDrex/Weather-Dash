import React from 'react';
import { Wind, Droplets, AlertTriangle, Leaf, Gauge } from 'lucide-react';
import type { AirQualityData } from '@/types/weather.types';
import { cn } from '@/lib/utils';

interface AirQualityWidgetProps {
  airQuality: AirQualityData | null;
  cityName: string;
}

const aqiColors: Record<string, { bg: string; text: string; bar: string }> = {
  Good: { bg: 'bg-success/10', text: 'text-success', bar: 'bg-success' },
  Fair: { bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary' },
  Moderate: { bg: 'bg-accent/10', text: 'text-accent', bar: 'bg-accent' },
  Poor: { bg: 'bg-destructive/10', text: 'text-destructive', bar: 'bg-destructive' },
  'Very Poor': { bg: 'bg-destructive/10', text: 'text-destructive', bar: 'bg-destructive' },
};

export const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({
  airQuality,
  cityName,
}) => {
  if (!airQuality) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Air Quality</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No air quality data available
        </p>
      </div>
    );
  }

  const colors = aqiColors[airQuality.level] || aqiColors.Moderate;
  const aqiPercentage = (airQuality.aqi / 5) * 100;

  const pollutants = [
    { name: 'PM2.5', value: airQuality.components.pm2_5, unit: 'μg/m³', icon: <Droplets className="h-4 w-4" /> },
    { name: 'PM10', value: airQuality.components.pm10, unit: 'μg/m³', icon: <Wind className="h-4 w-4" /> },
    { name: 'O₃', value: airQuality.components.o3, unit: 'μg/m³', icon: <Leaf className="h-4 w-4" /> },
    { name: 'NO₂', value: airQuality.components.no2, unit: 'μg/m³', icon: <Gauge className="h-4 w-4" /> },
  ];

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Air Quality</h3>
        <span className="text-xs text-muted-foreground">{cityName}</span>
      </div>

      {/* Main AQI Display */}
      <div className={cn('rounded-xl p-4 mb-4', colors.bg)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('p-2 rounded-lg', colors.bg)}>
              <AlertTriangle className={cn('h-5 w-5', colors.text)} />
            </div>
            <div>
              <p className={cn('text-2xl font-bold', colors.text)}>
                {airQuality.aqi}
              </p>
              <p className="text-sm text-muted-foreground">AQI</p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn('text-lg font-semibold', colors.text)}>
              {airQuality.level}
            </p>
            <p className="text-xs text-muted-foreground">Air Quality</p>
          </div>
        </div>

        {/* AQI Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', colors.bar)}
            style={{ width: `${aqiPercentage}%` }}
          />
        </div>
      </div>

      {/* Health Message */}
      <p className="text-sm text-muted-foreground mb-4">
        {airQuality.healthMessage}
      </p>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-2">
        {pollutants.map(({ name, value, unit, icon }) => (
          <div
            key={name}
            className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
          >
            <div className="text-muted-foreground">{icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{name}</p>
              <p className="text-sm font-medium text-foreground">
                {value.toFixed(1)} <span className="text-xs">{unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
