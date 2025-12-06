import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, Plus, Map, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CityWeatherCard } from '@/components/dashboard/CityWeatherCard';
import { AddCityModal } from '@/components/dashboard/AddCityModal';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { ForecastPanel } from '@/components/dashboard/ForecastPanel';
import { AirQualityWidget } from '@/components/dashboard/AirQualityWidget';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWeather } from '@/context/WeatherContext';
import { useSettings } from '@/context/SettingsContext';
import { STORAGE_KEYS } from '@/utils/constants';
import type { City } from '@/types/weather.types';

const DashboardPage: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>(STORAGE_KEYS.CITIES, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { fetchWeather, refreshCity, refreshAll, getWeatherData, isLoading, getError, activeAlerts, dismissAlert, clearCityData } = useWeather();
  const { settings, toggleTemperatureUnit } = useSettings();

  // Fetch weather for all cities on mount
  useEffect(() => {
    cities.forEach(city => {
      if (!getWeatherData(city.id)) {
        fetchWeather(city);
      }
    });
  }, [cities, fetchWeather, getWeatherData]);

  // Auto-refresh
  useEffect(() => {
    if (!settings.autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshAll(cities);
    }, settings.refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval, cities, refreshAll]);

  const handleAddCity = useCallback((city: City) => {
    setCities(prev => [...prev, city]);
    fetchWeather(city);
  }, [setCities, fetchWeather]);

  const handleDeleteCity = useCallback((cityId: string) => {
    setCities(prev => prev.filter(c => c.id !== cityId));
    clearCityData(cityId);
    if (selectedCityId === cityId) {
      setSelectedCityId(null);
    }
  }, [setCities, clearCityData, selectedCityId]);

  const handleRefreshAll = useCallback(() => {
    refreshAll(cities);
  }, [refreshAll, cities]);

  const isAnyLoading = cities.some(city => isLoading(city.id));
  const selectedCity = cities.find(c => c.id === selectedCityId);
  const selectedWeatherData = selectedCityId ? getWeatherData(selectedCityId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Alert Banner */}
      {settings.alertsEnabled && activeAlerts.length > 0 && (
        <AlertBanner alerts={activeAlerts} onDismiss={dismissAlert} />
      )}
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            cities={cities}
            temperatureUnit={settings.temperatureUnit}
            onToggleUnit={toggleTemperatureUnit}
            onAddCity={() => setIsModalOpen(true)}
            onRefresh={handleRefreshAll}
            isRefreshing={isAnyLoading}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {cities.length === 0 ? (
            <div className="glass-card p-12 text-center animate-fade-in-up">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Cities Added Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start tracking weather by adding your first city. You can search for any city in the world.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                <Plus className="h-5 w-5" />
                Add Your First City
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Weather Grid */}
              <div className={`lg:col-span-2 ${viewMode === 'grid' ? 'grid sm:grid-cols-2 gap-4' : 'space-y-4'}`}>
                {cities.map((city, index) => {
                  const weatherData = getWeatherData(city.id);
                  const loading = isLoading(city.id);
                  const error = getError(city.id);
                  
                  return (
                    <CityWeatherCard
                      key={city.id}
                      city={city}
                      weather={weatherData?.current || null}
                      forecast={weatherData?.forecast || null}
                      airQuality={weatherData?.airQuality || null}
                      isLoading={loading}
                      error={error}
                      temperatureUnit={settings.temperatureUnit}
                      onDelete={() => handleDeleteCity(city.id)}
                      onRefresh={() => {
                        const cityToRefresh = cities.find(c => c.id === city.id);
                        if (cityToRefresh) refreshCity(cityToRefresh);
                      }}
                      onSelect={() => setSelectedCityId(city.id)}
                      isSelected={selectedCityId === city.id}
                      index={index}
                      viewMode={viewMode}
                    />
                  );
                })}
              </div>

              {/* Sidebar - Forecast & Air Quality */}
              <div className="space-y-4">
                {selectedCity && selectedWeatherData ? (
                  <>
                    <ForecastPanel 
                      forecast={selectedWeatherData.forecast}
                      cityName={selectedCity.name}
                      temperatureUnit={settings.temperatureUnit}
                    />
                    <AirQualityWidget 
                      airQuality={selectedWeatherData.airQuality}
                      cityName={selectedCity.name}
                    />
                  </>
                ) : (
                  <div className="glass-card p-6 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select a City
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click on a city card to view detailed forecast and air quality data
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <AddCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCity={handleAddCity}
        existingCities={cities}
      />
    </div>
  );
};

export default DashboardPage;
