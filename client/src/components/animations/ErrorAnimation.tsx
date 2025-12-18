import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ErrorAnimationProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { circle: 40, stroke: 3 },
  md: { circle: 60, stroke: 4 },
  lg: { circle: 80, stroke: 5 },
};

export function ErrorAnimation({ show, size = 'md', className }: ErrorAnimationProps) {
  const { circle, stroke } = sizes[size];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn('flex items-center justify-center', className)}
        >
          <motion.svg
            width={circle}
            height={circle}
            viewBox={`0 0 ${circle} ${circle}`}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Circle */}
            <motion.circle
              cx={circle / 2}
              cy={circle / 2}
              r={(circle - stroke) / 2}
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth={stroke}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            {/* X mark - first line */}
            <motion.path
              d={`M ${circle * 0.35} ${circle * 0.35} L ${circle * 0.65} ${circle * 0.65}`}
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth={stroke}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            />
            {/* X mark - second line */}
            <motion.path
              d={`M ${circle * 0.65} ${circle * 0.35} L ${circle * 0.35} ${circle * 0.65}`}
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth={stroke}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shake wrapper for error states
export function ShakeOnError({
  children,
  trigger,
  className,
}: {
  children: React.ReactNode;
  trigger: boolean;
  className?: string;
}) {
  return (
    <motion.div
      animate={trigger ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Warning pulse
export function WarningPulse({ show, className }: { show: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0 hsl(var(--warning) / 0.4)',
              '0 0 0 10px hsl(var(--warning) / 0)',
              '0 0 0 0 hsl(var(--warning) / 0)',
            ],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 1.5, repeat: Infinity },
            boxShadow: { duration: 1.5, repeat: Infinity },
          }}
          className={cn('rounded-lg', className)}
        />
      )}
    </AnimatePresence>
  );
}
