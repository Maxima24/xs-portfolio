'use client';

import { motion } from 'framer-motion';
import { site, socials } from '@/data/site';
import { HeroSceneClient } from './HeroSceneClient';
import { GlowButton } from './GlowButton';
import { SocialIcons } from './SocialIcons';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
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
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* 3D / static neon backdrop */}
      <div className="absolute inset-0 -z-10">
        <HeroSceneClient />
        {/* readability gradient over the canvas */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8"
      >
        <motion.p
          variants={item}
          className="mb-5 font-mono text-sm tracking-[0.25em] text-neon-cyan/90"
        >
          <span className="text-muted">{'>'}</span> HI, I&apos;M{' '}
          <span className="text-glow-cyan">{site.handle}</span>
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          <span className="text-white">Faith </span>
          <span className="text-gradient-neon">Popoola</span>
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
                <span className="font-semibold text-glow-cyan">{s.value}</span>{' '}
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

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span className="h-8 w-px animate-pulse-glow bg-gradient-to-b from-neon-cyan to-transparent" />
        </div>
      </div>
    </section>
  );
}
