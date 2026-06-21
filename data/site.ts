export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** key maps to an icon in components/SocialIcons.tsx */
  icon: 'github' | 'email' | 'linkedin';
}

// Base URL resolved per deployment so canonical/OG/sitemap self-reference the
// right domain. Set NEXT_PUBLIC_SITE_URL for a custom domain; otherwise Vercel's
// production URL is used; local dev falls back to localhost.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const site = {
  name: 'Faith Popoola',
  handle: 'XS',
  role: 'Full-stack Engineer & Frontend Lead @ PortalHq',
  valueProp:
    'I ship full products end-to-end — from Postgres schema to AWS deploy — and own the outcome, not just the ticket.',
  location: 'Nigeria',
  email: 'steelmaxim80@gmail.com',
  resumeUrl: '/resume', // in-site viewer page
  resumeFile: '/resume.pdf', // the raw asset (download / open / embed)
  url: SITE_URL,
  ogImage: '/og-image.svg',
} as const;

export const navLinks: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'Hackathons', href: '#hackathons' },
  { label: 'Depth', href: '#depth' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/Maxima24', icon: 'github' },
  { label: 'Email', href: 'mailto:steelmaxim80@gmail.com', icon: 'email' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/Faith-Popoola', icon: 'linkedin' },
];
