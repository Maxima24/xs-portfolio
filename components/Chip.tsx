import { getTechIcon } from '@/data/techIcons';

export function Chip({ children }: { children: React.ReactNode }) {
  // When the chip is a known technology, lead with its brand glyph (monochrome,
  // inherits the chip's text/accent color). Unknown brands + concept tags fall
  // back to text-only.
  const Icon = typeof children === 'string' ? getTechIcon(children) : null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent">
      {Icon && <Icon aria-hidden className="shrink-0 text-[0.95em]" />}
      {children}
    </span>
  );
}
