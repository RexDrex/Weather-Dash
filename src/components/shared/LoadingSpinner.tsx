import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};

export const FullPageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 animate-shimmer rounded" />
          <div className="h-4 w-24 animate-shimmer rounded" />
        </div>
        <div className="h-16 w-16 animate-shimmer rounded-full" />
      </div>
      <div className="h-12 w-24 animate-shimmer rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-4 animate-shimmer rounded" />
        <div className="h-4 animate-shimmer rounded" />
        <div className="h-4 animate-shimmer rounded" />
        <div className="h-4 animate-shimmer rounded" />
      </div>
    </div>
  );
};
