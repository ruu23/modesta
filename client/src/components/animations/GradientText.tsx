import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        'bg-gradient-to-r from-primary via-rose-gold to-primary bg-clip-text text-transparent bg-[length:200%_100%]',
        className
      )}
      animate={
        animate
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : undefined
      }
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}
