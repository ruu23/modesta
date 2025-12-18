import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Animated wardrobe illustration
export function WardrobeIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Wardrobe body */}
      <motion.rect
        x="30" y="30" width="140" height="150"
        rx="8"
        fill="currentColor"
        className="text-primary/10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      
      {/* Left door */}
      <motion.rect
        x="35" y="35" width="62" height="140"
        rx="4"
        fill="currentColor"
        className="text-card"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ rotateY: -30 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ transformOrigin: 'left' }}
      />
      
      {/* Right door - open */}
      <motion.g
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -45 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: '160px 105px' }}
      >
        <rect
          x="103" y="35" width="62" height="140"
          rx="4"
          fill="currentColor"
          className="text-card"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="110" cy="105" r="4" fill="currentColor" className="text-primary" />
      </motion.g>
      
      {/* Hanging clothes inside */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Hanger bar */}
        <rect x="50" y="50" width="80" height="3" rx="1.5" fill="currentColor" className="text-muted-foreground/30" />
        
        {/* Hangers with clothes */}
        <motion.path
          d="M60 53 L70 65 L80 53"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/50"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.rect
          x="62" y="65" width="16" height="25" rx="2"
          fill="currentColor"
          className="text-primary/40"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        
        <motion.path
          d="M95 53 L105 65 L115 53"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/50"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.rect
          x="97" y="65" width="16" height="30" rx="2"
          fill="currentColor"
          className="text-rose-400/40"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
      </motion.g>
      
      {/* Door handle on left */}
      <circle cx="90" cy="105" r="4" fill="currentColor" className="text-primary" />
    </motion.svg>
  );
}

// Empty calendar illustration
export function CalendarIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Calendar body */}
      <motion.rect
        x="30" y="50" width="140" height="120"
        rx="12"
        fill="currentColor"
        className="text-card"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Header */}
      <rect x="30" y="50" width="140" height="30" rx="12" fill="currentColor" className="text-primary" />
      <rect x="30" y="68" width="140" height="12" fill="currentColor" className="text-primary" />
      
      {/* Binding rings */}
      {[60, 100, 140].map((x, i) => (
        <motion.g key={i}>
          <rect x={x - 5} y="42" width="10" height="20" rx="5" fill="currentColor" className="text-muted-foreground/30" />
        </motion.g>
      ))}
      
      {/* Calendar grid */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={45 + col * 25}
            y={95 + row * 22}
            width="20"
            height="18"
            rx="4"
            fill="currentColor"
            className="text-muted/50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (row * 5 + col) * 0.05 }}
          />
        ))
      )}
      
      {/* Sparkle */}
      <motion.g
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path d="M160 40 L165 50 L175 45 L165 50 L170 60 L165 50 L155 55 L165 50 Z" fill="currentColor" className="text-primary" />
      </motion.g>
    </motion.svg>
  );
}

// Empty chat illustration
export function ChatIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main chat bubble */}
      <motion.path
        d="M40 50 Q40 30 60 30 L140 30 Q160 30 160 50 L160 100 Q160 120 140 120 L80 120 L50 150 L60 120 L60 120 Q40 120 40 100 Z"
        fill="currentColor"
        className="text-primary/20"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      />
      
      {/* Typing dots */}
      {[70, 100, 130].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy="75"
          r="8"
          fill="currentColor"
          className="text-primary"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      
      {/* Small sparkles */}
      <motion.circle
        cx="170"
        cy="45"
        r="4"
        fill="currentColor"
        className="text-rose-400"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="35"
        cy="80"
        r="3"
        fill="currentColor"
        className="text-amber-400"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.svg>
  );
}

// Empty outfits illustration
export function OutfitsIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mannequin */}
      <motion.ellipse
        cx="100"
        cy="40"
        rx="20"
        ry="25"
        fill="currentColor"
        className="text-muted-foreground/30"
      />
      
      {/* Body */}
      <motion.path
        d="M70 70 Q60 90 65 140 L75 170 L85 170 L90 130 L100 130 L110 130 L115 170 L125 170 L135 140 Q140 90 130 70 Q115 60 100 60 Q85 60 70 70"
        fill="currentColor"
        className="text-primary/20"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Dress overlay */}
      <motion.path
        d="M75 80 Q70 100 72 130 L90 150 L100 145 L110 150 L128 130 Q130 100 125 80 Q115 75 100 75 Q85 75 75 80"
        fill="currentColor"
        className="text-rose-400/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      
      {/* Plus signs floating */}
      {[
        { x: 45, y: 60, delay: 0 },
        { x: 155, y: 80, delay: 0.3 },
        { x: 50, y: 140, delay: 0.6 },
      ].map((pos, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: pos.delay }}
        >
          <line x1={pos.x - 8} y1={pos.y} x2={pos.x + 8} y2={pos.y} stroke="currentColor" strokeWidth="3" className="text-primary" />
          <line x1={pos.x} y1={pos.y - 8} x2={pos.x} y2={pos.y + 8} stroke="currentColor" strokeWidth="3" className="text-primary" />
        </motion.g>
      ))}
    </motion.svg>
  );
}

// Error illustration
export function ErrorIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Broken circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeDasharray="100 30"
        className="text-destructive/30"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Exclamation mark */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <rect x="92" y="55" width="16" height="50" rx="8" fill="currentColor" className="text-destructive" />
        <circle cx="100" cy="130" r="10" fill="currentColor" className="text-destructive" />
      </motion.g>
      
      {/* Sparkles */}
      {[
        { x: 40, y: 50 },
        { x: 160, y: 60 },
        { x: 45, y: 150 },
        { x: 155, y: 140 },
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r="4"
          fill="currentColor"
          className="text-muted-foreground/50"
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </motion.svg>
  );
}

// 404 illustration
export function NotFoundIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 300 200"
      className={`w-64 h-40 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 4 */}
      <motion.text
        x="30"
        y="140"
        fontSize="100"
        fontWeight="bold"
        fill="currentColor"
        className="text-primary/20"
        initial={{ x: -50 }}
        animate={{ x: 30 }}
        transition={{ type: 'spring' }}
      >
        4
      </motion.text>
      
      {/* 0 with hanger inside */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
      >
        <text
          x="110"
          y="140"
          fontSize="100"
          fontWeight="bold"
          fill="currentColor"
          className="text-primary/20"
        >
          0
        </text>
        {/* Hanger */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '150px 50px' }}
        >
          <path
            d="M150 30 L150 50 M130 70 L150 50 L170 70"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-primary"
            strokeLinecap="round"
          />
          <circle cx="150" cy="25" r="6" fill="currentColor" className="text-primary" />
        </motion.g>
      </motion.g>
      
      {/* 4 */}
      <motion.text
        x="200"
        y="140"
        fontSize="100"
        fontWeight="bold"
        fill="currentColor"
        className="text-primary/20"
        initial={{ x: 350 }}
        animate={{ x: 200 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        4
      </motion.text>
    </motion.svg>
  );
}

// Search empty illustration
export function SearchEmptyIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Magnifying glass */}
      <motion.circle
        cx="85"
        cy="85"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-primary/30"
      />
      
      <motion.line
        x1="120"
        y1="120"
        x2="160"
        y2="160"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="text-primary/30"
      />
      
      {/* Question mark inside */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <text
          x="70"
          y="100"
          fontSize="40"
          fontWeight="bold"
          fill="currentColor"
          className="text-primary"
        >
          ?
        </text>
      </motion.g>
      
      {/* Floating elements */}
      {[
        { x: 30, y: 40, size: 6 },
        { x: 160, y: 50, size: 8 },
        { x: 40, y: 160, size: 5 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.size}
          fill="currentColor"
          className="text-muted-foreground/30"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </motion.svg>
  );
}
