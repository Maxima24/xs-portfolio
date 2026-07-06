import type { TrackKey } from './types';

const KEYS: TrackKey[] = ['general', 'frontend', 'backend'];

/**
 * Which portfolio this deployment serves at `/`, chosen by the PORTFOLIO_TRACK
 * env var (set per Vercel project). Unknown / unset → general.
 */
export function getActiveTrackKey(): TrackKey {
  const raw = (process.env.PORTFOLIO_TRACK || '').toLowerCase();
  return (KEYS as string[]).includes(raw) ? (raw as TrackKey) : 'general';
}

export interface TrackSeo {
  title: string;
  description: string;
  /** role line on the OG image */
  ogRole: string;
  /** secondary tagline on the OG image */
  ogTagline: string;
}

// Plain strings only (no JSX / no project imports) so the edge OG route and
// page metadata can import this without pulling in full track content.
export const trackSeo: Record<TrackKey, TrackSeo> = {
  // Identity reconciled to "QuickBite is the truth" (PortalHq removed → owner to relocate
  // to an Experience entry). Each track keeps its own framing.
  general: {
    title: 'Faith Popoola | Software Engineer',
    description:
      'Faith "XS" Popoola — Full-stack engineer, Founder / Backend Engineer @ QuickBite. I build production fintech and platform systems end-to-end: React Native, NestJS, Go, distributed systems.',
    ogRole: 'Full-stack Engineer · Founder / Backend Engineer @ QuickBite',
    ogTagline:
      'Fintech infrastructure · Distributed systems · Go · NestJS · React Native',
  },
  frontend: {
    title: 'Faith Popoola | Frontend Engineer',
    description:
      'Faith "XS" Popoola — Frontend Engineer building cross-platform React Native apps, real-time dashboards, and checkout flows with React, Next.js, and TypeScript.',
    ogRole: 'Frontend Engineer · React · Next.js · React Native',
    ogTagline: 'React · Next.js · React Native · Real-time UI · Performance',
  },
  backend: {
    title: 'Faith Popoola | Backend Engineer',
    description:
      'Faith "XS" Popoola — Backend & Distributed-Systems Engineer, Founder / Backend Engineer @ QuickBite. Idempotent ledgers, payment-rail integration, and reconciliation shipped in production — Go, NestJS, Postgres, Redis.',
    ogRole: 'Backend & Distributed-Systems Engineer · Founder @ QuickBite',
    ogTagline: 'Go · NestJS · Postgres · Redis · Docker · Idempotency',
  },
};
