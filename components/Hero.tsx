'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { site, socials } from '@/data/site';
import { HeroSceneClient } from './HeroSceneClient';
import { GlowButton } from './GlowButton';
import { SocialIcons } from './SocialIcons';
import { useClientEnv } from './useClientEnv';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  // Slides the whole intro out to the left once the user engages the 3D scene.
  gone: {
    x: '-110%',
    opacity: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function Hero({
  role,
  valueProp,
  stats,
}: {
  role: string;
  valueProp: string;
  stats: { value: string; label: string }[];
}) {
  // The hero section is the pointer event-source for the 3D canvas (which is
  // itself pointer-events:none so the headline/buttons stay clickable).
  const heroRef = useRef<HTMLElement>(null);
  const { canRender3D } = useClientEnv();
  const [gone, setGone] = useState(false);

  // Slide the intro out of the way once the user starts interacting with the 3D
  // scene — desktop+3D only, and never when they're pressing a control
  // (View Work / Resume / socials), which stay usable.
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canRender3D || gone) return;
    if ((e.target as HTMLElement).closest('a,button')) return;
    setGone(true);
  };

  return (
    <section
      id="top"
      ref={heroRef}
      onPointerDown={handlePointerDown}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* 3D / static neon backdrop */}
      <div className="absolute inset-0 -z-10">
        <HeroSceneClient eventSourceRef={heroRef} />
        {/* readability gradient over the canvas */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={gone ? 'gone' : 'show'}
        className={`mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8 ${
          gone ? 'pointer-events-none' : ''
        }`}
      >
        <motion.p
          variants={item}
          className="mb-5 font-mono text-sm tracking-[0.25em] text-accent/90"
        >
          <span className="text-muted">{'>'}</span> HI, I&apos;M{' '}
          <span className="text-glow-accent">{site.handle}</span>
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          <span className="text-white">Faith </span>
          <span className="text-gradient-accent">Popoola</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-2xl font-mono text-sm text-white/70 sm:text-base"
        >
          {role}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
        >
          {valueProp}
        </motion.p>

        <motion.ul
          variants={item}
          className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted sm:text-sm"
        >
          {stats.map((s, i) => (
            <li key={s.label} className="flex items-center gap-4">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-3 w-px bg-white/15 sm:block"
                />
              )}
              <span>
                <span className="font-semibold text-glow-accent">{s.value}</span>{' '}
                <span>{s.label}</span>
              </span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <GlowButton href="#work" variant="primary">
            View Work
            <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </GlowButton>
          <GlowButton href={site.resumeUrl} variant="secondary">
            Resume
            <span aria-hidden>→</span>
          </GlowButton>
          <SocialIcons socials={socials} className="ml-1" />
        </motion.div>
      </motion.div>
    </section>
  );
}
