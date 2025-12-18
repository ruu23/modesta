import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll events
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      { rootMargin: '100px', ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
}

// Virtual list hook for long lists
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex, virtualItems, totalHeight } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    const virtualItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      offsetTop: (startIndex + index) * itemHeight,
    }));

    return {
      startIndex,
      endIndex,
      virtualItems,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  };
}

// Preload images hook
export function usePreloadImages(urls: string[]) {
  useEffect(() => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [urls.join(',')]);
}

// Performance metrics tracking
export function usePerformanceMetrics() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          // LCP tracking - can be sent to analytics
        }
        if (entry.entryType === 'first-input') {
          // FID tracking
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch {
      // Not all browsers support these entry types
    }

    return () => observer.disconnect();
  }, []);
}

// Memoized expensive calculation hook
export function useMemoizedCalculation<T, R>(
  items: T[],
  calculator: (items: T[]) => R,
  deps: React.DependencyList = []
): R {
  return useMemo(() => calculator(items), [items, ...deps]);
}
