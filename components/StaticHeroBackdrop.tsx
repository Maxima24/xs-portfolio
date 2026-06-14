/**
 * Lightweight, WebGL-free fallback for the hero background. Rendered for
 * mobile / coarse-pointer devices and when the user prefers reduced motion.
 * Pure CSS neon gradient — no JS animation when reduced-motion is set
 * (globals.css neutralizes the animation in that case).
 */
export function StaticHeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-pan opacity-90"
        style={{
          background:
            'radial-gradient(40rem 28rem at 70% 30%, rgba(0,240,255,0.22), transparent 60%), radial-gradient(34rem 24rem at 25% 75%, rgba(255,0,229,0.20), transparent 60%), radial-gradient(30rem 30rem at 50% 50%, rgba(122,249,255,0.10), transparent 65%)',
        }}
      />
      <div className="absolute inset-0 bg-grid-neon [background-size:44px_44px] opacity-40" />
      <div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, #00f0ff, #ff00e5, #aaff00, #00f0ff)',
        }}
      />
    </div>
  );
}
