import { site, socials } from '@/data/site';
import { Section } from './Section';
import { GlowButton } from './GlowButton';
import { SocialIcons } from './SocialIcons';

export function Footer() {
  const year = 2026; // build-time constant; bump in source as needed

  return (
    <Section
      as="footer"
      id="contact"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8"
    >
      <div className="surface relative overflow-hidden rounded-2xl p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--accent), transparent 70%)',
          }}
        />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">
          05 // get in touch
        </span>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Let&apos;s build something that ships.
        </h2>
        <p className="mt-4 max-w-xl text-white/65">
          I build production fintech and platform systems end-to-end. I&apos;m
          open to software-engineering roles with ambitious teams worldwide —
          remote or relocation. The fastest way to reach me is email.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <GlowButton href={`mailto:${site.email}`} variant="primary" external>
            {site.email}
          </GlowButton>
          <GlowButton href={site.resumeUrl} variant="ghost">
            Resume →
          </GlowButton>
          <SocialIcons socials={socials} className="ml-1" />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-muted sm:flex-row">
        <p>
          © {year}{' '}
          <span className="font-mono text-glow-accent">Faith Popoola</span>. Built
          with Next.js, Three.js &amp; Tailwind.
        </p>
        <a href="#top" className="nav-underline hover:text-white">
          Back to top ↑
        </a>
      </div>
    </Section>
  );
}
