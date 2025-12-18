import { ReactNode, useEffect } from 'react';
import { MobileBottomNav } from '@/components/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function AppLayout({ children, showBottomNav = true, className }: AppLayoutProps) {
  const isMobile = useIsMobile();

  // Add padding for bottom nav on mobile
  return (
    <div className={cn(
      'min-h-screen bg-background',
      isMobile && showBottomNav && 'pb-20',
      className
    )}>
      {children}
      {isMobile && showBottomNav && <MobileBottomNav />}
    </div>
  );
}

// Hook to detect reduced motion preference
export function usePrefersReducedMotion() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return () => {};
  }, []);

  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
