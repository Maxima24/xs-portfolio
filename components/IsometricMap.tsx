'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Project } from '@/data/projects';
import { Chip } from './Chip';

// ── Board geometry (board-local px, before the isometric tilt) ───────────────
const BOARD = 560; // logical board size
const TILE = 60; // node tile size
const BOARD_SCALE = 0.64; // shrink the tilted board to fit the stage
const TILT = 'rotateX(54deg) rotateZ(-45deg)'; // the isometric plane
const UNTILT = 'rotateZ(45deg) rotateX(-54deg)'; // inverse — keeps labels facing the camera
const AUTO_MS = 4200;

// Relative node positions (0..1). A loose network, not a grid — first n used.
const REL: [number, number][] = [
  [0.5, 0.22],
  [0.22, 0.4],
  [0.78, 0.38],
  [0.4, 0.58],
  [0.64, 0.6],
  [0.18, 0.72],
  [0.82, 0.7],
  [0.5, 0.84],
];

/** Connect each node to its 2 nearest neighbours → a sparse, readable mesh. */
function buildEdges(pts: { x: number; y: number }[]): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const d: { j: number; v: number }[] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      d.push({ j, v: dx * dx + dy * dy });
    }
    d.sort((a, b) => a.v - b.v);
    for (let k = 0; k < 2 && k < d.length; k++) {
      const j = d[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([Math.min(i, j), Math.max(i, j)]);
    }
  }
  return edges;
}

/** Short label for a node pin (keeps the board legible). */
function shortLabel(title: string): string {
  if (title.length <= 14) return title;
  const first = title.split(' ')[0];
  return first.length >= 6 ? first : title.slice(0, 13) + '…';
}

export function IsometricMap({ projects }: { projects: Project[] }) {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const paused = hoverPaused || focusPaused;

  const pts = useMemo(
    () => REL.slice(0, n).map(([rx, ry]) => ({ x: rx * BOARD, y: ry * BOARD })),
    [n],
  );
  const edges = useMemo(() => buildEdges(pts), [pts]);

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
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prev();
    }
  };

  // Auto-cycle the active node; pauses on hover/focus, off under reduced motion.
  useEffect(() => {
    if (paused || reduceMotion || n <= 1) return;
    const id = window.setTimeout(() => move(1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduceMotion, n, move]);

  const current = projects[active];
  const isEdgeActive = (a: number, b: number) => a === active || b === active;
  const tileTransition = reduceMotion
    ? 'transform 0.12s ease, box-shadow 0.12s ease'
    : 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease';

  return (
    <div
      role="group"
      aria-roledescription="diagram"
      aria-label="Featured projects — system map"
      onKeyDown={onKeyDown}
      className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.35fr_1fr]"
    >
      {/* keyframes isoFlow / isoFloat live in app/globals.css */}
      <p aria-live="polite" className="sr-only">
        Project {active + 1} of {n}: {current.title}
      </p>

      {/* ── Isometric board ───────────────────────────────────── */}
      <div
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setFocusPaused(true)}
        onBlurCapture={() => setFocusPaused(false)}
        className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60"
        style={{ perspective: '1100px' }}
      >
        {/* ambient accent wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'rgb(var(--accent-rgb) / 0.10)' }}
        />

        {/* the tilted plane */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: BOARD,
            height: BOARD,
            transformStyle: 'preserve-3d',
            transform: `translate(-50%,-50%) ${TILT} scale(${BOARD_SCALE})`,
          }}
        >
          {/* floor grid */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[18px] border border-white/10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              boxShadow: 'inset 0 0 80px rgb(var(--accent-rgb) / 0.06)',
            }}
          />

          {/* edges (data-flow paths) on the plane */}
          <svg
            aria-hidden
            className="absolute inset-0 overflow-visible"
            width={BOARD}
            height={BOARD}
          >
            {edges.map(([a, b]) => {
              const on = isEdgeActive(a, b);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pts[a].x}
                  y1={pts[a].y}
                  x2={pts[b].x}
                  y2={pts[b].y}
                  stroke="rgb(var(--accent-rgb))"
                  strokeWidth={on ? 2 : 1}
                  strokeOpacity={on ? 0.85 : 0.18}
                  strokeDasharray={on && !reduceMotion ? '5 7' : undefined}
                  style={
                    on && !reduceMotion
                      ? { animation: 'isoFlow 0.7s linear infinite' }
                      : undefined
                  }
                />
              );
            })}
          </svg>

          {/* nodes */}
          {projects.map((p, i) => {
            const isActive = i === active;
            const isHot = isActive || hovered === i;
            const raised = isActive ? 58 : hovered === i ? 38 : 14;
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
                className="absolute outline-none"
                style={{
                  left: pts[i].x - TILE / 2,
                  top: pts[i].y - TILE / 2,
                  width: TILE,
                  height: TILE,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* floor shadow */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[12px] bg-black/50 blur-md"
                  style={{ transform: 'translateZ(0px)' }}
                />
                {/* raised tile (the node block) */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[12px] border"
                  style={{
                    transform: `translateZ(${raised}px)`,
                    transition: tileTransition,
                    borderColor: isHot
                      ? 'rgb(var(--accent-rgb) / 0.9)'
                      : 'rgba(255,255,255,0.18)',
                    background: isHot
                      ? 'linear-gradient(150deg, rgb(var(--accent-rgb) / 0.55), rgb(var(--accent-rgb) / 0.12))'
                      : 'linear-gradient(150deg, rgba(40,38,52,0.95), rgba(22,20,28,0.95))',
                    boxShadow: isActive
                      ? '0 0 0 1px rgb(var(--accent-rgb) / 0.6), 0 0 26px rgb(var(--accent-rgb) / 0.45)'
                      : isHot
                        ? '0 0 20px rgb(var(--accent-rgb) / 0.3)'
                        : '0 10px 20px rgba(0,0,0,0.4)',
                    animation:
                      isActive && !reduceMotion
                        ? 'isoFloat 3.2s ease-in-out infinite'
                        : undefined,
                  }}
                />
                {/* camera-facing pin label */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-0 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[11px]"
                  style={{
                    transform: `translate(-50%,-150%) translateZ(${raised + 30}px) ${UNTILT}`,
                    transition: tileTransition,
                    color: isHot ? '#fff' : 'rgba(255,255,255,0.7)',
                    background: isHot
                      ? 'rgb(var(--accent-rgb) / 0.18)'
                      : 'rgba(10,10,14,0.7)',
                    border: `1px solid ${isHot ? 'rgb(var(--accent-rgb) / 0.5)' : 'rgba(255,255,255,0.12)'}`,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {shortLabel(p.title)}
                </span>
              </button>
            );
          })}
        </div>

        {/* corner caption */}
        <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          system map
        </span>
      </div>

      {/* ── Detail panel ──────────────────────────────────────── */}
      <div className="surface relative flex flex-col overflow-hidden rounded-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-accent/10 before:content-['']">
        <div className="flex flex-1 flex-col gap-3 p-6">
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
            {reduceMotion ? 'use ← → to browse' : 'click a node · ← → to browse'}
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
