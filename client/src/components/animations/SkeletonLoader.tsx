import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'text';
}

export function AnimatedSkeleton({ className, variant = 'default' }: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted relative overflow-hidden',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'rounded h-4',
    variant === 'default' && 'rounded-lg',
    className
  );

  return (
    <div className={baseClasses}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <AnimatedSkeleton className="h-40 w-full" />
      <div className="space-y-2">
        <AnimatedSkeleton variant="text" className="w-3/4" />
        <AnimatedSkeleton variant="text" className="w-1/2" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          <AnimatedSkeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <AnimatedSkeleton variant="text" className="w-2/3" />
            <AnimatedSkeleton variant="text" className="w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}
