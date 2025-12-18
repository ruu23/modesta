import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              layout: { duration: 0.2 },
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
