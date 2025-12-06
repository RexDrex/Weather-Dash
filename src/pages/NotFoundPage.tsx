import React from 'react';
import { Link } from 'react-router-dom';
import { CloudOff, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        {/* Icon */}
        <div className="inline-flex p-6 rounded-3xl bg-muted mb-8">
          <CloudOff className="h-20 w-20 text-muted-foreground" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-8xl font-bold text-foreground mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Looks like you've wandered into uncharted weather territory. 
          The page you're looking for doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
