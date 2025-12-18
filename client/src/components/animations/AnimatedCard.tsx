import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverEffect = true, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={
          hoverEffect
            ? {
                y: -6,
                boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.15)',
                transition: { duration: 0.2 },
              }
            : undefined
        }
        whileTap={hoverEffect ? { scale: 0.98 } : undefined}
        className={cn('will-change-transform', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
