import type { SocialLink } from '@/data/site';

function Icon({ name }: { name: SocialLink['icon'] }) {
  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
          <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.62 8.21 11.18.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.81 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.51.12-3.15 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.28-1.52 3.29-1.2 3.29-1.2.65 1.64.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.15 0 4.51-2.81 5.5-5.49 5.79.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .32.21.69.83.57A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="h-5 w-5">
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3.5 6.5 8.5 6 8.5-6" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );
  }
}

interface SocialIconsProps {
  socials: SocialLink[];
  className?: string;
}

export function SocialIcons({ socials, className = '' }: SocialIconsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socials.map((s) => {
        const isPlaceholder = s.href === '#';
        return (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            title={s.label}
            target={isPlaceholder ? undefined : '_blank'}
            rel={isPlaceholder ? undefined : 'noopener noreferrer'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:text-neon-cyan hover:shadow-glow-cyan"
          >
            <Icon name={s.icon} />
          </a>
        );
      })}
    </div>
  );
}
