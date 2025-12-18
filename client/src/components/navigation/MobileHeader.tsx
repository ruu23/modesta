import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shirt, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export function MobileHeader({ 
  title = 'Modesta', 
  showBack,
  backTo = '/',
  rightContent,
  className 
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={cn(
        'sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border md:hidden',
        className
      )}>
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="min-w-[44px] min-h-[44px]"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-rose flex items-center justify-center">
                <Shirt className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">{title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {rightContent}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center">
                      <Shirt className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Modesta</h2>
                      <p className="text-xs text-muted-foreground">Your Style Assistant</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-w-[44px] min-h-[44px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Menu Links */}
                <nav className="flex-1 p-4 space-y-2">
                  <MenuLink to="/settings" icon={Settings} onClick={() => setIsMenuOpen(false)}>
                    Settings
                  </MenuLink>
                  <MenuLink to="/settings" icon={User} onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </MenuLink>
                </nav>
                
                {/* Menu Footer */}
                <div className="p-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Modesta v1.0.0
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuLink({ 
  to, 
  icon: Icon, 
  children, 
  onClick 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-accent/50 transition-colors min-h-[44px]"
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium">{children}</span>
    </Link>
  );
}
