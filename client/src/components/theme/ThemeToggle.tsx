import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center justify-center w-10 h-10 border border-border transition-colors duration-300 hover:border-gold',
        className
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="w-4 h-4 text-gold" strokeWidth={1.5} />
      ) : (
        <Sun className="w-4 h-4 text-gold" strokeWidth={1.5} />
      )}
    </button>
  );
}