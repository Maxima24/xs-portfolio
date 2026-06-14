'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Project } from '@/data/projects';
import { Chip } from './Chip';

const RADIUS = 150; // px — orbit radius
const AUTO_MS = 6000; // matches the countdown arc duration
const SPIN = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';

const accent = {
  cyan: {
    text: 'text-neon-cyan',
    ring: 'border-neon-cyan shadow-glow-cyan',
    stroke: '#00f0ff',
    panel: 'before:bg-neon-cyan/10',
  },
  magenta: {
    text: 'text-neon-magenta',
    ring: 'border-neon-magenta shadow-glow-magenta',
    stroke: '#ff00e5',
    panel: 'before:bg-neon-magenta/10',
  },
  lime: {
    text: 'text-neon-lime',
    ring: 'border-neon-lime shadow-[0_0_8px_#aaff00,0_0_24px_rgba(170,255,0,0.4)]',
    stroke: '#aaff00',
    panel: 'before:bg-neon-lime/10',
  },
} as const;

/** shortest signed step distance from active to i around the ring */
function shortestDelta(i: number, active: number, n: number) {
  let d = i - active;
  const half = n / 2;
  if (d > half) d -= n;
  if (d < -half) d += n;
  return d;
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const n = projects.length;
  const step = 360 / n;
  const [active, setActive] = useState(0);
  const [rotation, setRotation] = useState(0); // cumulative deg, always short way
  const [paused, setPaused] = useState(false);

  const move = useCallback(
    (delta: number) => {
      if (!delta) return;
      setRotation((r) => r - delta * step);
      setActive((a) => (((a + delta) % n) + n) % n);
    },
    [step, n],
  );
  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);
  const goTo = useCallback(
    (i: number) => move(shortestDelta(i, active, n)),
    [move, active, n],
  );

  // Auto-advance on a timer that restarts whenever the active project changes
  // (manual nav included) and pauses on hover/focus. The countdown arc below is
  // a purely visual indicator kept roughly in sync via the same duration.
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = window.setTimeout(() => move(1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, n, move]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  const current = projects[active];
  const a = accent[current.accent];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2"
    >
      <p aria-live="polite" className="sr-only">
        Project {active + 1} of {n}: {current.title}
      </p>

      {/* ── Orbit selector ───────────────────────────────────── */}
      <div className="relative mx-auto h-[400px] w-[400px] max-w-full">
        {/* faint orbit ring + inner glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ width: RADIUS * 2, height: RADIUS * 2 }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            background:
              'radial-gradient(circle, rgba(0,240,255,0.07), transparent 70%)',
          }}
        />

        {/* rotating ring of discs */}
        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${rotation}deg)`, transition: SPIN }}
        >
          {projects.map((p, i) => {
            const angle = i * step; // 0deg = right (focal)
            const isActive = i === active;
            const size = isActive ? 84 : 56;
            const na = accent[p.accent];
            return (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%,-50%) rotate(${angle}deg) translateX(${RADIUS}px) rotate(${-angle}deg)`,
                }}
              >
                <div
                  style={{
                    transform: `rotate(${-rotation}deg)`,
                    transition: SPIN,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show ${p.title}`}
                    aria-current={isActive}
                    title={p.title}
                    style={{ width: size, height: size }}
                    className={`overflow-hidden rounded-full border-2 transition-all duration-500 ${
                      isActive
                        ? na.ring
                        : 'border-white/15 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={`/projects/thumbs/${p.slug}.svg`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* radial countdown ring at the focal point (right), drives auto-advance */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{ transform: `translate(-50%,-50%) translateX(${RADIUS}px)` }}
        >
          <svg width={100} height={100} viewBox="0 0 100 100" className="block">
            <circle
              key={active}
              cx="50"
              cy="50"
              r="46"
              pathLength={1}
              fill="none"
              stroke={a.stroke}
              strokeWidth={2.5}
              strokeDasharray={1}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="animate-countdown"
              style={{ animationPlayState: paused ? 'paused' : 'running' }}
            />
          </svg>
        </div>
      </div>

      {/* ── Detail panel ─────────────────────────────────────── */}
      <div
        key={current.slug}
        className={`surface relative animate-fadeIn overflow-hidden rounded-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] ${a.panel}`}
      >
        <div className="relative aspect-[16/9] border-b border-white/10">
          <img
            src={current.image}
            alt={`${current.title} — cover`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span
            className={`font-mono text-xs uppercase tracking-[0.25em] ${a.text}`}
          >
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <h3 className="text-2xl font-bold text-white">{current.title}</h3>
          <p className="text-sm leading-relaxed text-white/65">
            {current.problem}
          </p>
          <p className="text-sm">
            <span
              className={`font-mono text-xs uppercase tracking-wider ${a.text}`}
            >
              Role ·{' '}
            </span>
            <span className="text-white/80">{current.role}</span>
          </p>
          <p className="flex items-start gap-2 text-sm text-white/90">
            <span aria-hidden className={a.text}>
              ▸
            </span>
            <span className="font-medium">{current.outcome}</span>
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {current.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
          {current.links.length > 0 && (
            <div className="mt-1 flex items-center gap-4">
              {current.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono text-xs underline-offset-4 hover:underline ${a.text}`}
                >
                  {link.kind === 'github' ? 'GitHub ↗' : 'Live ↗'}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* prev / next */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/80 transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <span aria-hidden>‹</span>
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            auto-rotating · hover to pause
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/80 transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
