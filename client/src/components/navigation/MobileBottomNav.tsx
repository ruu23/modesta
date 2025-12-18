import { Link, useLocation } from 'react-router-dom';
import { Home, Shirt, Palette, MessageSquare, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/closet', icon: Shirt, label: 'Closet' },
  { to: '/outfit-builder', icon: Palette, label: 'Outfits' },
  { to: '/chat', icon: MessageSquare, label: 'Advisor' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div 
        className="flex items-center justify-around px-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" 
        role="menubar"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              role="menuitem"
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] px-3 py-2 transition-colors duration-200',
                isActive 
                  ? 'text-gold' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon 
                className="w-5 h-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-[10px] uppercase tracking-wider mt-1">
                {item.label}
              </span>
              
              {/* Active indicator - gold line */}
              {isActive && (
                <div className="absolute bottom-1 w-6 h-px bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}