import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none';

// Monochrome per track (single accent), with hierarchy: primary = filled-tint
// + glow, secondary = outline, ghost = neutral with accent hover.
const variants: Record<Variant, string> = {
  primary:
    'bg-accent/15 text-accent border border-accent/50 shadow-glow-accent hover:bg-accent/25 hover:shadow-glow-accent-lg hover:-translate-y-0.5',
  secondary:
    'bg-transparent text-accent border border-accent/30 hover:bg-accent/10 hover:border-accent/50 hover:-translate-y-0.5',
  ghost:
    'bg-white/[0.03] text-white/80 border border-white/12 hover:border-accent/50 hover:text-accent hover:-translate-y-0.5',
};

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function GlowButton({
  href,
  children,
  variant = 'primary',
  external,
  className = '',
  ariaLabel,
}: GlowButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cls}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={cls}>
      {children}
    </Link>
  );
}
