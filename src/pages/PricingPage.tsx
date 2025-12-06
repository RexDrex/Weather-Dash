import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Crown, Zap, Shield, Cloud, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/utils/constants';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PricingPage: React.FC = () => {
  const { user, isAuthenticated, upgradeToPremium } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    // Simulate payment processing (demo mode)
    await new Promise(resolve => setTimeout(resolve, 2000));

    upgradeToPremium();
    setIsProcessing(false);
    
    toast({
      title: '🎉 Welcome to Premium!',
      description: 'Your account has been upgraded successfully. Enjoy unlimited cities!',
    });

    navigate('/dashboard');
  };

  const freePlan = SUBSCRIPTION_PLANS[0];
  const premiumPlan = SUBSCRIPTION_PLANS[1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
            {/* Free Plan */}
            <div className="glass-card p-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{freePlan.name}</h3>
                  <p className="text-sm text-muted-foreground">For personal use</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>

              <ul className="space-y-3 mb-8">
                {freePlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-success/20">
                      <Check className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan('free')}
                className="w-full btn-secondary"
                disabled={isProcessing}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="glass-card p-8 ring-2 ring-primary relative animate-fade-in-up stagger-1">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  Most Popular
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{premiumPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">For power users</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${premiumPlan.price}</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-xs text-muted-foreground mt-1">Demo mode - Free upgrade!</p>
              </div>

              <ul className="space-y-3 mb-8">
                {premiumPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-success/20">
                      <Check className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan('premium_monthly')}
                className={cn('w-full btn-primary', isProcessing && selectedPlan === 'premium_monthly' && 'opacity-50')}
                disabled={isProcessing || user?.isPremium}
              >
                {isProcessing && selectedPlan === 'premium_monthly' ? (
                  <>Processing...</>
                ) : user?.isPremium ? (
                  <>Already Premium</>
                ) : (
                  <>
                    Upgrade Now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="glass-card p-8 animate-fade-in-up stagger-2">
            <h3 className="text-xl font-bold text-foreground text-center mb-8">Why Upgrade?</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Unlimited Cities</h4>
                <p className="text-sm text-muted-foreground">Track weather in as many cities as you want</p>
              </div>
              <div className="text-center p-4">
                <div className="inline-flex p-4 rounded-2xl bg-accent/10 mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Air Quality Data</h4>
                <p className="text-sm text-muted-foreground">Get detailed air pollution information</p>
              </div>
              <div className="text-center p-4">
                <div className="inline-flex p-4 rounded-2xl bg-success/10 mb-4">
                  <Crown className="h-8 w-8 text-success" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Advanced Alerts</h4>
                <p className="text-sm text-muted-foreground">Custom weather alerts and notifications</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
