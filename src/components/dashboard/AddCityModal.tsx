import React, { useState, useCallback } from 'react';
import { X, Search, MapPin, AlertCircle, Crown } from 'lucide-react';
import { weatherAPI } from '@/services/weatherAPI';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import type { GeoLocation, City } from '@/types/weather.types';
import { generateId } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: City) => void;
  existingCities: City[];
}

export const AddCityModal: React.FC<AddCityModalProps> = ({
  isOpen,
  onClose,
  onAddCity,
  existingCities,
}) => {
  const { user, upgradeToPremium } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const isAtLimit = user ? existingCities.length >= user.maxCities : true;

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const results = await weatherAPI.searchCity(searchQuery.trim());
      if (results.length === 0) {
        setError('No cities found. Try a different search term.');
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddCity = (location: GeoLocation) => {
    const alreadyExists = existingCities.some(
      (c) =>
        c.lat.toFixed(2) === location.lat.toFixed(2) &&
        c.lon.toFixed(2) === location.lon.toFixed(2)
    );

    if (alreadyExists) {
      setError('This city is already in your list');
      return;
    }

    const newCity: City = {
      id: generateId(),
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      addedAt: Date.now(),
    };

    onAddCity(newCity);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    onClose();
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Add City</h2>
          <button onClick={handleClose} className="btn-icon text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Limit Warning */}
        {isAtLimit && (
          <div className="mb-4 p-4 rounded-xl bg-accent/10 border border-accent/20 animate-scale-in">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">City limit reached</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Free accounts can track up to 3 cities. Upgrade to Premium for unlimited cities.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="mt-3 text-sm font-medium text-accent hover:underline"
                >
                  Upgrade to Premium (Free Demo)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="input-field pl-12 pr-24"
            disabled={isAtLimit}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || searchQuery.trim().length < 2 || isAtLimit}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm"
          >
            {isSearching ? <LoadingSpinner size="sm" /> : 'Search'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-destructive/10 text-destructive animate-scale-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((location, index) => (
              <button
                key={`${location.lat}-${location.lon}`}
                onClick={() => handleAddCity(location)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{location.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.state ? `${location.state}, ` : ''}{location.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && !error && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Search for a city to add it to your dashboard
          </p>
        )}
      </div>
    </div>
  );
};
