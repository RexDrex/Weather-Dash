import React from 'react';
import { Thermometer, Bell, RefreshCw, Moon, RotateCcw } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const { settings, toggleTemperatureUnit, toggleAlerts, toggleAutoRefresh, setRefreshInterval, resetSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 animate-fade-in-up">Settings</h1>

          {/* Temperature Unit */}
          <div className="glass-card p-6 mb-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Thermometer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Temperature Unit</h3>
                  <p className="text-sm text-muted-foreground">Choose between Celsius and Fahrenheit</p>
                </div>
              </div>
              <div className="flex items-center bg-secondary rounded-xl p-1">
                <button
                  onClick={() => settings.temperatureUnit !== 'celsius' && toggleTemperatureUnit()}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', settings.temperatureUnit === 'celsius' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground')}
                >
                  °C
                </button>
                <button
                  onClick={() => settings.temperatureUnit !== 'fahrenheit' && toggleTemperatureUnit()}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', settings.temperatureUnit === 'fahrenheit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground')}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="glass-card p-6 mb-4 animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Theme</h3>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={cn('relative w-14 h-8 rounded-full transition-colors', theme === 'dark' ? 'bg-primary' : 'bg-secondary')}
              >
                <span className={cn('absolute top-1 w-6 h-6 rounded-full bg-background shadow transition-transform', theme === 'dark' ? 'translate-x-7' : 'translate-x-1')} />
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="glass-card p-6 mb-4 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Weather Alerts</h3>
                  <p className="text-sm text-muted-foreground">Show weather warnings and alerts</p>
                </div>
              </div>
              <button
                onClick={toggleAlerts}
                className={cn('relative w-14 h-8 rounded-full transition-colors', settings.alertsEnabled ? 'bg-primary' : 'bg-secondary')}
              >
                <span className={cn('absolute top-1 w-6 h-6 rounded-full bg-background shadow transition-transform', settings.alertsEnabled ? 'translate-x-7' : 'translate-x-1')} />
              </button>
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="glass-card p-6 mb-4 animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Auto Refresh</h3>
                  <p className="text-sm text-muted-foreground">Automatically update weather data</p>
                </div>
              </div>
              <button
                onClick={toggleAutoRefresh}
                className={cn('relative w-14 h-8 rounded-full transition-colors', settings.autoRefresh ? 'bg-primary' : 'bg-secondary')}
              >
                <span className={cn('absolute top-1 w-6 h-6 rounded-full bg-background shadow transition-transform', settings.autoRefresh ? 'translate-x-7' : 'translate-x-1')} />
              </button>
            </div>
            {settings.autoRefresh && (
              <div className="mt-4 pl-16">
                <label className="text-sm text-muted-foreground mb-2 block">Refresh interval</label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="input-field w-full max-w-xs"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={10}>Every 10 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                </select>
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="glass-card p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <RotateCcw className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Reset Settings</h3>
                  <p className="text-sm text-muted-foreground">Restore all settings to default values</p>
                </div>
              </div>
              <button onClick={resetSettings} className="btn-destructive">
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
