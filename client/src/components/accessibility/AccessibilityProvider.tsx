import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
  keyboardShortcuts: boolean;
  screenReaderAnnouncements: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  reducedMotion: false,
  keyboardShortcuts: true,
  screenReaderAnnouncements: true,
  focusIndicators: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('modesta-accessibility');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
      // Check system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
      return {
        ...defaultSettings,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
      };
    }
    return defaultSettings;
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Font size
    root.classList.remove('font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${settings.fontSize}`);
    
    // Reduced motion
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    
    // Focus indicators
    root.classList.toggle('focus-visible-only', !settings.focusIndicators);
    
    // Save to localStorage
    localStorage.setItem('modesta-accessibility', JSON.stringify(settings));
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Live region announcements for screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReaderAnnouncements) return;
    
    const announcement = document.getElementById('a11y-announcer');
    if (announcement) {
      announcement.setAttribute('aria-live', priority);
      announcement.textContent = '';
      // Force reflow
      void announcement.offsetHeight;
      announcement.textContent = message;
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announce }}>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      {/* Live region for screen reader announcements */}
      <div
        id="a11y-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Keyboard shortcut hook
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const handler = (e: KeyboardEvent) => {
      const matchesKey = e.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = modifiers.ctrl ? (e.ctrlKey || e.metaKey) : true;
      const matchesShift = modifiers.shift ? e.shiftKey : true;
      const matchesAlt = modifiers.alt ? e.altKey : true;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers, settings.keyboardShortcuts]);
}
