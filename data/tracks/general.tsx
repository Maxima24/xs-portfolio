import { projectsById, type Project } from '@/data/projects';
import { techDepth } from '@/data/techDepth';
import { site } from '@/data/site';
import type { TrackContent } from './types';

// The general SWE portfolio — calm, plain, impact-first. Features the seven
// flagship builds in canonical (depth-first) voice; the other canonical
// projects stay in data/ for the frontend/backend tracks to reframe.
const projects: Project[] = [
  projectsById['cargoland'],
  projectsById['swifthum'],
  projectsById['quickbite'],
  projectsById['owise'],
  projectsById['notification-service'],
  projectsById['forge'],
  projectsById['synthsentry'],
];

export const general: TrackContent = {
  key: 'general',
  label: 'Software Engineer',
  hero: {
    role: site.role,
    valueProp: site.valueProp,
  },
  coreStack: 'Go · TS · NestJS',
  projectsIntro:
    "Production systems I've shipped — fintech rails, multi-platform mobile, and AI assistants. Each card leads with the problem, what I built, and the result.",
  projects,
  techDepthIntro:
    'A few design decisions that show how I think about correctness, failure, and scale.',
  techDepth,
  about: {
    lead: (
      <>
        Faith Popoola — full-stack engineer and{' '}
        <span className="text-accent">Frontend Lead at PortalHq</span> since
        August 2024.
      </>
    ),
    body: (
      <>
        I ship. Three apps live on the Play Store, a payment backend hardened in
        production, multiple hackathon builds taken from idea to demo solo.
        I&apos;m happiest owning a problem end-to-end — schema, API, client,
        deploy — and I move fast without leaving a mess behind.
      </>
    ),
    stack: [
      'TypeScript / JS',
      'NestJS',
      'Next.js',
      'Express.js',
      'RabbitMq',
      'Kafka',
      'Celery',
      'Grafana',
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
