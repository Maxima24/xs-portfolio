'use client';

import { MotionConfig } from 'framer-motion';

/**
 * P2.2 a11y: makes every Framer Motion animation honor the OS
 * `prefers-reduced-motion` setting. The global CSS rule in globals.css only
 * neutralizes CSS transitions/animations — Framer drives transforms in JS, so
 * without `reducedMotion="user"` the scroll-reveal + hero motion would still run
 * for users who asked for reduced motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
