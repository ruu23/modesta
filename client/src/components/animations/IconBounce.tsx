import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconBounceProps {
  children: ReactNode;
  className?: string;
}

export function IconBounce({ children, className }: IconBounceProps) {
  return (
    <motion.div
      className={cn('inline-flex', className)}
      whileHover={{
        y: [0, -5, 0],
        transition: {
          duration: 0.4,
          times: [0, 0.5, 1],
          ease: 'easeOut',
        },
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.div>
  );
}
