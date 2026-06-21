/**
 * Lightweight, WebGL-free fallback for the hero background. Rendered for
 * mobile / coarse-pointer devices and when the user prefers reduced motion.
 *
 * Accent-aware: colors are driven by the per-track CSS variables
 * (`--accent`, `--accent-rgb`, `--accent-2`, `--accent-2-rgb`) set on
 * `body[data-track]` (globals.css), so it adapts automatically per track during
 * SSR — no JS needed. The backend track gets a more structural node-graph /
 * grid treatment (scoped via a co-located <style> block keyed off
 * body[data-track='backend']) to match its system motif.
 *
 * Pure CSS — no JS animation when reduced-motion is set (globals.css
 * neutralizes `animate-gradient-pan` in that case).
 */
export function StaticHeroBackdrop() {
  return (
    <div aria-hidden className="static-hero-backdrop absolute inset-0 overflow-hidden">
      {/* Backend-track structural treatment (.shb-grid/.shb-nodes/.shb-orb) lives
          in app/globals.css — an inline <style> here caused an SSR/CSR hydration
          mismatch (apostrophes in data-track='backend' escape differently). */}

      {/* accent-tinted glow wash (adapts per track via CSS vars) */}
      <div
        className="absolute inset-0 animate-gradient-pan opacity-90"
        style={{
          background:
            'radial-gradient(40rem 28rem at 70% 30%, rgb(var(--accent-rgb) / 0.22), transparent 60%), radial-gradient(34rem 24rem at 25% 75%, rgb(var(--accent-2-rgb) / 0.18), transparent 60%), radial-gradient(30rem 30rem at 50% 50%, rgb(var(--accent-rgb) / 0.10), transparent 65%)',
        }}
      />

      {/* structural grid — finer + brighter on backend (see <style> above) */}
      <div className="shb-grid absolute inset-0 bg-grid-neon opacity-40 [background-size:44px_44px]" />

      {/* backend-only: faint static node-graph dots (structural infra feel) */}
      <div
        className="shb-nodes absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 22% 30%, rgb(var(--accent-rgb) / 0.55) 0 2px, transparent 3px), radial-gradient(circle at 68% 22%, rgb(var(--accent-rgb) / 0.45) 0 2px, transparent 3px), radial-gradient(circle at 80% 64%, rgb(var(--accent-rgb) / 0.5) 0 2px, transparent 3px), radial-gradient(circle at 38% 72%, rgb(var(--accent-rgb) / 0.45) 0 2px, transparent 3px), radial-gradient(circle at 52% 46%, rgb(var(--accent-2-rgb) / 0.5) 0 2px, transparent 3px)',
        }}
      />

      {/* central orb — accent conic glow (softened on backend) */}
      <div
        className="shb-orb absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent), var(--accent-2))',
        }}
      />
    </div>
  );
}
