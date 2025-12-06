import React from 'react';
import { MapPin, Thermometer, Moon, Smartphone, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Multi-City Tracking',
    description: 'Monitor weather conditions for multiple cities at once. Perfect for travelers, remote teams, or anyone with loved ones across the globe.',
  },
  {
    icon: Thermometer,
    title: 'Unit Flexibility',
    description: 'Switch between Celsius and Fahrenheit with a single click. Your preference is saved and synced across sessions.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Easy on the eyes with a beautiful dark theme. Automatically respects your system preferences.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Looks stunning on any device. From phones to tablets to desktops, WeatherDash adapts perfectly.',
  },
  {
    icon: Zap,
    title: 'Real-Time Data',
    description: 'Powered by OpenWeatherMap API for accurate, up-to-date weather information with smart caching.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays on your device. We use localStorage for persistence, so your information never leaves your browser.',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Everything You Need
          </h2>
          <p className="section-subtitle">
            Powerful features designed to give you the best weather tracking experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
