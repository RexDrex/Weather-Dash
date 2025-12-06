import React from 'react';
import { User, Mail, Calendar, Crown, Shield, Edit2, Camera } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import type { City } from '@/types/weather.types';

const ProfilePage: React.FC = () => {
  const { user, upgradeToPremium } = useAuth();
  const [cities] = useLocalStorage<City[]>(STORAGE_KEYS.CITIES, []);

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 animate-fade-in-up">Profile</h1>

          {/* Profile Card */}
          <div className="glass-card p-8 mb-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  {user.isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <button className="btn-secondary">
                <Edit2 className="h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-6 text-center animate-fade-in-up stagger-1">
              <p className="text-3xl font-bold text-primary">{cities.length}</p>
              <p className="text-sm text-muted-foreground">Cities Tracked</p>
            </div>
            <div className="glass-card p-6 text-center animate-fade-in-up stagger-2">
              <p className="text-3xl font-bold text-accent">{user.maxCities}</p>
              <p className="text-sm text-muted-foreground">City Limit</p>
            </div>
            <div className="glass-card p-6 text-center animate-fade-in-up stagger-3">
              <p className="text-3xl font-bold text-success">{user.isPremium ? '∞' : '3'}</p>
              <p className="text-sm text-muted-foreground">Max Cities</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-card p-6 animate-fade-in-up stagger-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium text-foreground">{memberSince}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium text-foreground">{user.isPremium ? 'Premium' : 'Free'}</p>
                </div>
              </div>
            </div>

            {!user.isPremium && (
              <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Upgrade to Premium</p>
                    <p className="text-sm text-muted-foreground">Unlock unlimited cities and more features</p>
                  </div>
                  <button onClick={upgradeToPremium} className="btn-primary">
                    <Crown className="h-4 w-4" /> Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
