import { projectsById, type Project } from '@/data/projects';
import { techDepth } from '@/data/techDepth';
import type { TrackContent } from './types';

// Most projects are already systems-framed in the canonical data, so the backend
// track reuses their base verbatim and only reorders/selects. Cargoland is the
// exception — its canonical copy leads with the mobile clients, so reframe it.
const cargolandBackend: Project = {
  ...projectsById['cargoland'],
  role: 'Built the NestJS API and the transactional-outbox notification pipeline behind the three clients.',
  outcome:
    'Exactly-once push delivery across FCM and APNs via an outbox + dedup key, even under producer retries.',
  stack: ['NestJS', 'Postgres', 'Outbox', 'FCM/APNs', 'Prisma'],
};

const projects: Project[] = [
  projectsById['detector'],
  projectsById['render-lite'],
  projectsById['swifthum'],
  projectsById['search-engine'],
  projectsById['owise'],
  cargolandBackend,
  projectsById['quickbite'],
];

export const backend: TrackContent = {
  key: 'backend',
  label: 'Backend & Distributed-Systems Engineer',
  hero: {
    role: 'Backend & Distributed-Systems Engineer · Frontend Lead @ PortalHq · Computer Engineering @ OAU',
    valueProp:
      'I design and ship backend systems end-to-end — Go and NestJS services, distributed-systems correctness, and the infrastructure that runs them.',
  },
  projectsIntro:
    "Services and systems I've architected and shipped — payments cores, an AI microservice, a search engine, and infra. Each card leads with the system I owned and the guarantee it makes.",
  projects,
  techDepthIntro:
    'The design decisions behind these systems — correctness under failure, and scale.',
  techDepth,
  about: {
    lead: (
      <>
        I&apos;m a backend &amp; systems engineer who likes owning services
        end-to-end — from the HTTP edge down to the database isolation level.
        I&apos;ve been{' '}
        <span className="text-glow-cyan">Frontend Lead @ PortalHq</span> since
        August 2024 (I work across the stack), and I study{' '}
        <span className="text-white">
          Computer Engineering at Obafemi Awolowo University (OAU)
        </span>{' '}
        (graduating 2028), based in Nigeria.
      </>
    ),
    body: (
      <>
        My focus is fintech and distributed systems: signed idempotent payments,
        exactly-once messaging, Go services tuned for concurrency, and the
        Docker/VPS infrastructure to run them. I care about the boring guarantees
        — replay-safety, clean service boundaries, idempotency — that keep
        production honest.
      </>
    ),
    stack: [
      'Go',
      'NestJS',
      'Postgres',
      'Redis',
      'Docker',
      'TypeScript',
      'Python',
      'RabbitMQ',
      'Prisma',
      'AWS',
      'Hetzner',
    ],
    interests: [
      'Distributed systems',
      'Fintech infrastructure',
      'Concurrency & reliability',
    ],
  },
};
