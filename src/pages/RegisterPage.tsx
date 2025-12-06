import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
              <CloudSun className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Start tracking weather for your favorite cities
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 animate-fade-in-up stagger-1">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
