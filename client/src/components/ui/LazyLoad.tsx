import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/animations/LoadingSpinner';
import { cn } from '@/lib/utils';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
}

export function LazyLoad({ 
  children, 
  fallback,
  className,
  minHeight = '200px'
}: LazyLoadProps) {
  const defaultFallback = (
    <div 
      className={cn(
        'flex items-center justify-center bg-background/50',
        className
      )}
      style={{ minHeight }}
    >
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <Suspense fallback={fallback ?? defaultFallback}>
      {children}
    </Suspense>
  );
}

// Page-level lazy loading wrapper
export function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground text-sm animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
