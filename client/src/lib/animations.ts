import { Variants, Transition } from 'framer-motion';

// Smooth spring transitions
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Fade variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: smoothTransition,
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: smoothTransition,
  },
};

// Scale variants
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
};

export const popInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Slide variants
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: smoothTransition,
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: smoothTransition,
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Card hover
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    transition: smoothTransition,
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: smoothTransition,
  },
};

// Button press
export const buttonTapVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
};

// Shake animation for errors
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// Success checkmark
export const checkmarkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: 'easeInOut' },
      opacity: { duration: 0.1 },
    },
  },
};

// Pulse animation
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating animation
export const floatVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Notification slide in
export const notificationVariants: Variants = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Modal variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// List item variants for staggered lists
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// Gradient text animation keyframes
export const gradientShift = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'linear',
  },
};
