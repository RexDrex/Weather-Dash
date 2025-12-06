import React from 'react';
import { X, AlertTriangle, Thermometer, Wind, Droplets, AlertCircle } from 'lucide-react';
import type { WeatherAlert } from '@/types/weather.types';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: WeatherAlert[];
  onDismiss: (alertId: string) => void;
}

const alertIcons: Record<WeatherAlert['type'], React.ReactNode> = {
  heat: <Thermometer className="h-5 w-5" />,
  cold: <Thermometer className="h-5 w-5" />,
  wind: <Wind className="h-5 w-5" />,
  precipitation: <Droplets className="h-5 w-5" />,
  air_quality: <AlertCircle className="h-5 w-5" />,
  storm: <AlertTriangle className="h-5 w-5" />,
};

const severityColors: Record<WeatherAlert['severity'], string> = {
  low: 'bg-primary/10 border-primary/20 text-primary',
  medium: 'bg-accent/10 border-accent/20 text-accent',
  high: 'bg-destructive/10 border-destructive/20 text-destructive',
};

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2 space-y-2 max-h-48 overflow-y-auto">
      {alerts.slice(0, 3).map((alert, index) => (
        <div
          key={alert.id}
          className={cn(
            'flex items-center justify-between gap-4 px-4 py-3 rounded-xl border backdrop-blur-sm animate-fade-in-up',
            severityColors[alert.severity]
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-3">
            {alertIcons[alert.type]}
            <div>
              <p className="font-semibold text-sm">{alert.title}</p>
              <p className="text-xs opacity-80">{alert.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs opacity-70 max-w-xs truncate">
              {alert.action}
            </span>
            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      {alerts.length > 3 && (
        <p className="text-center text-sm text-muted-foreground">
          +{alerts.length - 3} more alerts
        </p>
      )}
    </div>
  );
};
