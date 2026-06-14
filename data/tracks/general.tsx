import { projects } from '@/data/projects';
import { techDepth } from '@/data/techDepth';
import { site } from '@/data/site';
import type { TrackContent } from './types';

// The general SWE portfolio — today's content, verbatim. Other tracks reframe
// this same material; this one is the baseline (no regression vs the original).
export const general: TrackContent = {
  key: 'general',
  label: 'Software Engineer',
  hero: {
    role: site.role,
    valueProp: site.valueProp,
  },
  projectsIntro:
    "Production systems I've architected and shipped — fintech rails, multi-platform mobile, and AI assistants. Each card leads with the role I owned and the outcome that shipped.",
  projects,
  techDepthIntro:
    'A few design decisions that show how I think about correctness, failure, and scale.',
  techDepth,
  about: {
    lead: (
      <>
        I&apos;m a full-stack engineer who likes owning systems end-to-end — from
        the mobile client down to the database isolation level. I&apos;ve been{' '}
        <span className="text-glow-cyan">Frontend Lead @ PortalHq</span> since
        August 2024, and I study{' '}
        <span className="text-white">
          Computer Engineering at Obafemi Awolowo University (OAU)
        </span>{' '}
        (graduating 2028), based in Nigeria.
      </>
    ),
    body: (
      <>
        Most of my work sits at the intersection of fintech and distributed
        systems: signed idempotent payments, multi-channel messaging, and release
        pipelines that put real apps in users&apos; hands. I move fast in
        hackathons and care about the boring guarantees — exactly-once delivery,
        replay-safety, clean service boundaries — that keep production honest.
      </>
    ),
    stack: [
      'TypeScript / JS',
      'NestJS',
      'Next.js',
      'React Native / Expo',
      'Go',
      'Python',
      'Docker',
      'Postgres',
      'AWS',
      'Hetzner',
      'Cloudflare',
    ],
    interests: ['Distributed systems', 'Fintech infrastructure', 'Hackathons'],
  },
};
