import { projectsById, type Project } from '@/data/projects';
import { techDepth } from '@/data/techDepth';
import type { TrackContent } from './types';

// Most projects are already systems-framed in the canonical data, so the backend
// track reuses their base verbatim and only reorders/selects. Cargoland and Forge
// are the exceptions — their canonical copy leads with the clients, so reframe to
// lead with the systems work.
const cargolandBackend: Project = {
  ...projectsById['cargoland'],
  role: 'Built the NestJS API and the transactional-outbox notification pipeline behind the three clients.',
  outcome:
    'Exactly-once push delivery across FCM and APNs via an outbox + dedup key, even under producer retries.',
  stack: ['NestJS', 'Postgres', 'Outbox', 'FCM/APNs', 'Prisma'],
};

const forgeBackend: Project = {
  ...projectsById['forge'],
  role: 'Wired the payments and identity backend — Squad APIs for disbursement and Smile ID KYC — behind the worker app and dashboards.',
  outcome:
    'A verified-labor → credit-history pipeline with real payment + KYC integrations, built solo for Squad Hackathon 3.0.',
  stack: ['NestJS', 'Squad API', 'Smile ID', 'Postgres'],
};

// The notification service is an in-progress distributed-systems study, not a
// shipped product — label it honestly so it never reads as a production headline.
const notificationServiceBuilding: Project = {
  ...projectsById['notification-service'],
  role: `Currently building — ${projectsById['notification-service'].role}`,
};

// Lead with deployed, user-facing production systems (QuickBite live on Paystack,
// Cargoland live on the Play Store, SwiftHum live on a VPS), then builds, then the
// in-progress notification service last.
const projects: Project[] = [
  projectsById['quickbite'],
  cargolandBackend,
  projectsById['swifthum'],
  projectsById['owise'],
  forgeBackend,
  notificationServiceBuilding,
];

export const backend: TrackContent = {
  key: 'backend',
  label: 'Backend & Distributed-Systems Engineer',
  hero: {
    role: 'Backend & Distributed-Systems Engineer · Founder @ QuickBite',
    valueProp:
      'I build systems that stay up as they scale — message queues, idempotent ledgers, hardened production deploys.',
  },
  coreStack: 'Go · NestJS · Docker',
  projectsIntro:
    "Services and systems I've architected and shipped — a Kafka notification pipeline, payment cores, an AI microservice, and the infrastructure under them. Each card leads with the system I owned and the guarantee it makes.",
  projects,
  techDepthIntro:
    'The design decisions behind these systems — correctness under failure, and scale.',
  techDepth,
  about: {
    lead: (
      <>
        Faith Popoola — backend &amp; distributed-systems engineer,{' '}
        <span className="text-accent">
          Founder / Backend Engineer at QuickBite
        </span>{' '}
        since April 2026.
        {/* TODO(owner): relocate PortalHq (prior Frontend Lead, since Aug 2024) to a dedicated Experience entry — real ~2yr tenure, don't lose it */}
      </>
    ),
    body: (
      <>
        I&apos;m drawn to systems that have to stay correct under pressure —
        payment ledgers, message queues, idempotent delivery. I deploy and harden
        my own infrastructure (AWS, Hetzner, Docker, Nginx, Cloudflare) and
        I&apos;m going deep on distributed systems through a Java/Spring Boot
        notification service built on Kafka, Redis, and Postgres.
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
