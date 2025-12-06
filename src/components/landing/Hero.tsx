import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in-up">
          <Sparkles className="h-4 w-4" />
          <span>Real-time weather for multiple cities</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up stagger-1">
          Track Weather{' '}
          <span className="text-gradient">Anywhere</span>
          <br />
          <span className="text-gradient-sunset">Anytime</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
          Your personal multi-city weather dashboard. Get real-time updates, 
          beautiful visualizations, and accurate forecasts for all the places you care about.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
          <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up stagger-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">200K+</p>
            <p className="text-sm text-muted-foreground">Cities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">Real-time</p>
            <p className="text-sm text-muted-foreground">Updates</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">Free</p>
            <p className="text-sm text-muted-foreground">To Start</p>
          </div>
        </div>

        {/* Floating Weather Icon */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-20">
          <CloudSun className="w-96 h-96 text-primary" />
        </div>
      </div>
    </section>
  );
};
