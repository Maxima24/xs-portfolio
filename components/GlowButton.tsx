import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/40 shadow-glow-cyan hover:bg-neon-cyan/20 hover:shadow-glow-cyan-lg hover:-translate-y-0.5',
  secondary:
    'bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/40 shadow-glow-magenta hover:bg-neon-magenta/20 hover:-translate-y-0.5',
  ghost:
    'bg-white/[0.03] text-white/80 border border-white/12 hover:border-neon-cyan/50 hover:text-neon-cyan hover:-translate-y-0.5',
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
