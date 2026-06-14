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
  general: {
    title: 'Faith Popoola | Software Engineer',
    description:
      'Faith "XS" Popoola — Full-stack engineer & Frontend Lead @ PortalHq. I build production fintech and platform systems end-to-end: React Native, NestJS, Go, distributed systems.',
    ogRole: 'Software Engineer · Full-stack & Frontend Lead @ PortalHq',
    ogTagline:
      'Fintech infrastructure · Distributed systems · Go · NestJS · React Native',
  },
  frontend: {
    title: 'Faith Popoola | Frontend Engineer',
    description:
      'Faith "XS" Popoola — Frontend Engineer & Frontend Lead @ PortalHq. Cross-platform React Native apps, real-time dashboards, and checkout flows built with React, Next.js, and TypeScript.',
    ogRole: 'Frontend Engineer · Frontend Lead @ PortalHq',
    ogTagline: 'React · Next.js · React Native · Real-time UI · Performance',
  },
  backend: {
    title: 'Faith Popoola | Backend Engineer',
    description:
      'Faith "XS" Popoola — Backend & Distributed-Systems Engineer. Go and NestJS services, idempotent payments, real-time anomaly detection, and container orchestration.',
    ogRole: 'Backend & Distributed-Systems Engineer',
    ogTagline: 'Go · NestJS · Postgres · Redis · Docker · Idempotency',
  },
};
