import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  className?: string;
  ripple?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ripple = true, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleEffect[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples((prev) => [...prev, { x, y, id }]);
        
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
      
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={handleClick}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
