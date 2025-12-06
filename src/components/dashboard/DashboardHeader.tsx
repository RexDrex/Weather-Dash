import React from 'react';
import { Plus, RefreshCw, Thermometer, Crown, Grid, List } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import type { TemperatureUnit, City } from '@/types/weather.types';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  cities: City[];
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
  onAddCity: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cities,
  temperatureUnit,
  onToggleUnit,
  onAddCity,
  onRefresh,
  isRefreshing,
  viewMode = 'grid',
  onViewModeChange,
}) => {
  const { user } = useAuth();
  const canAddMore = user ? cities.length < user.maxCities : false;

  return (
    <header className="glass-card p-4 sm:p-6 mb-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your Weather Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Tracking {cities.length} {cities.length === 1 ? 'city' : 'cities'}
            {user && !user.isPremium && (
              <span className="text-xs ml-2 text-muted-foreground/70">
                ({cities.length}/{user.maxCities} free limit)
              </span>
            )}
            {user?.isPremium && (
              <span className="inline-flex items-center gap-1 ml-2 text-xs text-accent">
                <Crown className="h-3 w-3" /> Premium
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {onViewModeChange && (
            <div className="flex items-center bg-secondary rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-muted')}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-muted')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}

          <ThemeToggle />

          <button
            onClick={onToggleUnit}
            className="btn-icon bg-secondary"
            title={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <Thermometer className="h-4 w-4" />
            <span className="text-xs font-bold ml-1">
              {temperatureUnit === 'celsius' ? '°C' : '°F'}
            </span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-icon bg-secondary"
            title="Refresh weather data"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </button>

          <button
            onClick={onAddCity}
            disabled={!canAddMore}
            className={cn('btn-primary text-sm', !canAddMore && 'opacity-50 cursor-not-allowed')}
            title={canAddMore ? 'Add a city' : 'City limit reached'}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add City</span>
          </button>
        </div>
      </div>
    </header>
  );
};
