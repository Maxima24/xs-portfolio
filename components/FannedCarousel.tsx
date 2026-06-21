'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { Project } from '@/data/projects';
import { Chip } from './Chip';

// ── Fan geometry ────────────────────────────────────────────────────────────
// Single arc: the ACTIVE card is the enlarged middle of the arc. Smaller cards
// flow up and outward symmetrically (smile-shaped — edges rise). There is no
// separate "big card" layer; the centre card simply grows in place.
const CARD_W = 140; // base fanned card width (px)
const CARD_H = 184; // base fanned card height (px)
const ACTIVE_SCALE = 1.6; // how much the centre card grows (≈ 224×294)
const SPREAD_X = 168; // px between adjacent card CENTRES (tighter = hugs the middle)
const CENTER_CLEARANCE = 60; // extra px pushed onto the FIRST neighbours so the
//                              enlarged centre card has breathing room beside it
const SPREAD_FALLOFF = 0.16; // each step beyond the first spreads a little less (curved, not linear)
const RISE_BASE = 30; // px the FIRST neighbour rises; further steps rise more (quadratic)
const RISE_CURVE = 12; // additional px rise per step² — gives the arc its bow
const DEPTH_Z = 64; // px each step recedes from the viewer
const ROT_Y = 24; // deg yaw per step (edge cards turn side-on)
const ROT_Z = 3.5; // deg roll per step (the splay)
const AUTO_MS = 4000; // auto-advance interval (ms)
// Max cards shown on EACH side of the centre. Capping per-side keeps the arc
// symmetric for any project count (even counts would otherwise fan 3-on-one-
// side / 2-on-the-other because of index wrapping). Overflow cards are tucked
// behind the centre and hidden.
const MAX_PER_SIDE = 2;

/**
 * Signed, wrapped distance active → i, in range (-n/2, n/2], so the arc is
 * symmetric (cards split evenly to both sides of the active card) regardless
 * of which index is active.
 */
function fanOffset(i: number, active: number, n: number): number {
  let d = i - active;
  const half = n / 2;
  if (d > half) d -= n;
  if (d < -half) d += n;
  return d;
}

/**
 * Transform for a card on the single arc.
 * - offset 0 (active): centred, enlarged, sits forward and lowest on the arc.
 * - |offset| grows: card moves outward (X), rises (−Y, smile), recedes (−Z),
 *   yaws/rolls outward, and shrinks. A hovered non-active card lifts slightly.
 */
function arcTransform(offset: number, lifted: boolean): string {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);

  if (offset === 0) {
    // the enlarged centre card — grows from its CENTRE (so it doesn't clip the
    // top of the stage), pulled toward the viewer, faces front
    return [
      'translateX(0px)',
      'translateY(0px)',
      'translateZ(95px)',
      'rotateX(2deg)',
      'rotateY(0deg)',
      'rotateZ(0deg)',
      `scale(${ACTIVE_SCALE})`,
    ].join(' ');
  }

  // Curved horizontal spread: each successive step adds slightly less X, so
  // cards bunch toward the centre instead of marching out in a straight line.
  // A fixed CENTER_CLEARANCE is added to every card so the enlarged centre
  // card has clean space beside it (otherwise the first neighbours tuck under).
  let x = CENTER_CLEARANCE;
  for (let s = 1; s <= abs; s += 1) {
    x += SPREAD_X * (1 - (s - 1) * SPREAD_FALLOFF);
  }
  x *= sign;

  // Quadratic rise: edges lift increasingly, giving the arc its bow (smile).
  const rise = RISE_BASE * abs + RISE_CURVE * abs * abs;

  const lift = lifted ? -16 : 0;
  const liftZ = lifted ? 26 : 0;
  const scale = Math.max(0.6, 1 - abs * 0.07);

  return [
    `translateX(${x}px)`,
    `translateY(${-rise + lift}px)`, // negative = rise toward edges (smile)
    `translateZ(${-abs * DEPTH_Z + liftZ}px)`,
    `rotateY(${offset * -ROT_Y}deg)`,
    `rotateZ(${offset * -ROT_Z}deg)`,
    `scale(${scale})`,
  ].join(' ');
}

export function FannedCarousel({ projects }: { projects: Project[] }) {
  // Geometry below is tuned for ~6–9 featured cards. Outside that range the
  // opacity/scale falloff may make far cards nearly invisible — retune the
  // falloff constants if the featured set changes substantially.
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Hover and focus pause the auto-advance independently, so a mouse leaving
  // the stage can't un-pause while a keyboard user still holds focus.
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const paused = hoverPaused || focusPaused;

  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Honor prefers-reduced-motion: drop parallax + shorten transitions.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const move = useCallback(
    (delta: number) => setActive((a) => (((a + delta) % n) + n) % n),
    [n],
  );
  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  // Mouse parallax — write CSS vars on the tilt group via rAF (no re-render).
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !stageRef.current || !tiltRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = tiltRef.current;
      if (!el) return;
      el.style.setProperty('--tilt-x', `${(-py * 6).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(px * 8).toFixed(2)}deg`);
    });
  };
  const onMouseLeave = () => {
    setHoverPaused(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = tiltRef.current;
    if (el) {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }
  };
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Auto-advance the arc; restarts on every change, pauses on hover/focus, and
  // is disabled under reduced motion.
  useEffect(() => {
    if (paused || reduceMotion || n <= 1) return;
    const id = window.setTimeout(() => move(1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduceMotion, n, move]);

  const current = projects[active];
  const cardTransition = reduceMotion
    ? 'transform 0.15s ease, border-color 0.15s ease, opacity 0.15s ease'
    : 'transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, opacity 0.4s ease';

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-8"
    >
      <p aria-live="polite" className="sr-only">
        Project {active + 1} of {n}: {current.title}
      </p>

      {/* ── Arc stage ─────────────────────────────────────────── */}
      <div
        ref={stageRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={onMouseLeave}
        onFocusCapture={() => setFocusPaused(true)}
        onBlurCapture={() => setFocusPaused(false)}
        className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60"
        style={{ perspective: '1300px' }}
      >
        {/* subtle grid-paper backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        {/* soft accent floor glow under the active card (single accent light source) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'rgb(var(--accent-rgb) / 0.10)' }}
        />

        {/* 3D scene — tilted by mouse parallax */}
        <div
          ref={tiltRef}
          className="absolute inset-0"
          style={
            {
              transformStyle: 'preserve-3d',
              transform:
                'rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))',
              transition: 'transform 0.25s ease-out',
              '--tilt-x': '0deg',
              '--tilt-y': '0deg',
            } as CSSProperties
          }
        >
          {/* single arc — all cards share this curve; the active card is the
              enlarged middle of it. Anchored so the enlarged centre card sits
              comfortably within the stage. */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {projects.map((p, i) => {
              const offset = fanOffset(i, active, n);
              const isActive = i === active;
              const lifted = hovered === i && !isActive;
              // Cards beyond the per-side cap are tucked behind the centre and
              // faded out, so the visible arc is always symmetric.
              const hidden = Math.abs(offset) > MAX_PER_SIDE;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered((h) => (h === i ? null : h))}
                  aria-label={`Show ${p.title}`}
                  aria-current={isActive}
                  title={p.title}
                  className="absolute overflow-hidden rounded-[14px] border bg-ink-800 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  tabIndex={hidden ? -1 : 0}
                  aria-hidden={hidden}
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -CARD_W / 2,
                    marginTop: -CARD_H / 2,
                    transform: hidden
                      ? 'translateZ(-200px) scale(0.6)'
                      : arcTransform(offset, lifted),
                    transformOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                    transition: cardTransition,
                    pointerEvents: hidden ? 'none' : 'auto',
                    // active card always on top; nearer cards above farther ones
                    zIndex: isActive ? 100 : 60 - Math.abs(offset),
                    opacity: hidden
                      ? 0
                      : isActive
                        ? 1
                        : Math.max(0.5, 1 - Math.abs(offset) * 0.1),
                    borderColor: isActive
                      ? 'rgb(var(--accent-rgb) / 0.6)'
                      : 'rgba(255,255,255,0.14)',
                    boxShadow: isActive
                      ? '0 34px 80px rgba(0,0,0,0.6), 0 0 18px rgb(var(--accent-rgb) / 0.08)'
                      : '0 14px 34px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src={p.image}
                    alt=""
                    width={CARD_W}
                    height={CARD_H}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Detail panel ──────────────────────────────────────── */}
      <div className="surface relative overflow-hidden rounded-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-accent/10 before:content-['']">
        <div className="flex flex-col gap-3 p-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <h3 className="text-2xl font-bold text-white">{current.title}</h3>
          <p className="text-sm leading-relaxed text-white/65">
            {current.problem}
          </p>
          <p className="text-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-accent">
              Role ·{' '}
            </span>
            <span className="text-white/80">{current.role}</span>
          </p>
          <p className="flex items-start gap-2 text-sm text-white/90">
            <span aria-hidden className="text-accent">
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
                  className="font-mono text-xs text-accent underline-offset-4 hover:underline"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/80 transition-colors hover:border-accent/50 hover:text-accent"
          >
            <span aria-hidden>‹</span>
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {reduceMotion ? 'use ← → to browse' : 'auto-rotating · hover to pause'}
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/80 transition-colors hover:border-accent/50 hover:text-accent"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}