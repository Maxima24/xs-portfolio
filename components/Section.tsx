'use client';

import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: 'section' | 'div' | 'footer';
}

/**
 * Scroll-reveal wrapper: fades + translates content up on enter.
 * Framer Motion automatically respects prefers-reduced-motion when the
 * MotionConfig/user setting disables transforms; we also keep the travel
 * small so the reduced-motion fallback is unobtrusive.
 */
export function Section({
  id,
  className = '',
  children,
  as = 'section',
}: SectionProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Section heading with neon kicker + index marker, shared across sections. */
export function SectionHeading({
  kicker,
  title,
  index,
}: {
  kicker: string;
  title: string;
  index: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">
        <span className="text-muted">{index}</span> {'//'} {kicker}
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
