import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onComplete?: () => void;
}

const sizes = {
  sm: { circle: 40, stroke: 3 },
  md: { circle: 60, stroke: 4 },
  lg: { circle: 80, stroke: 5 },
};

export function SuccessAnimation({
  show,
  size = 'md',
  className,
  onComplete,
}: SuccessAnimationProps) {
  const { circle, stroke } = sizes[size];
  const radius = (circle - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onAnimationComplete={onComplete}
          className={cn('flex items-center justify-center', className)}
        >
          <svg
            width={circle}
            height={circle}
            viewBox={`0 0 ${circle} ${circle}`}
          >
            {/* Circle background */}
            <motion.circle
              cx={circle / 2}
              cy={circle / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--primary) / 0.2)"
              strokeWidth={stroke}
            />
            {/* Animated circle */}
            <motion.circle
              cx={circle / 2}
              cy={circle / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={stroke}
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
              }}
            />
            {/* Checkmark */}
            <motion.path
              d={`M ${circle * 0.28} ${circle * 0.5} L ${circle * 0.42} ${circle * 0.65} L ${circle * 0.72} ${circle * 0.35}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti effect
export function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = [
        'hsl(var(--primary))',
        'hsl(var(--accent))',
        'hsl(350, 60%, 65%)',
        'hsl(45, 90%, 60%)',
        'hsl(200, 80%, 60%)',
      ];
      
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 2000);
    }
  }, [show]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 1,
              y: -20,
              x: `${particle.x}vw`,
              scale: Math.random() * 0.5 + 0.5,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              y: '100vh',
              rotate: Math.random() * 720 - 360,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ backgroundColor: particle.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
