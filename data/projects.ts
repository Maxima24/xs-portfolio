export interface ProjectLink {
  label: string;
  href: string;
  kind: 'live' | 'github';
}

export interface Project {
  slug: string;
  title: string;
  /** one-line problem statement */
  problem: string;
  /** what I owned — lead with role and impact, not tooling */
  role: string;
  /** the headline outcome or metric */
  outcome: string;
  stack: string[];
  image: string;
  links: ProjectLink[];
  /** accent used for the card glow */
  accent: 'cyan' | 'magenta' | 'lime';
}

// Ordered depth-first — recruiters skim, so the deepest systems lead.
export const projects: Project[] = [
  {
    slug: 'swifthum',
    title: 'SwiftHum',
    problem:
      'Sending money on Telegram without exchanging account details — peer-to-peer transfers that work even when two phones share only the air between them.',
    role: 'Architected and built the system end-to-end: ultrasonic token transmission, payments core, bots, and infrastructure.',
    outcome:
      'HMAC-SHA256-signed payment tokens transmitted over ultrasonic sound — no internet on the receiver — settled under Serializable isolation with an idempotent ledger, deployed as a full Docker Compose stack on a VPS.',
    stack: [
      'Go (whatsmeow)',
      'NestJS',
      'Next.js',
      'aiogram',
      'Postgres',
      'Turborepo',
    ],
    image: '/projects/swifthum.svg',
    links: [],
    accent: 'magenta',
  },
  {
    slug: 'detector',
    title: 'Anomaly Detection Engine',
    problem:
      'Detect and mitigate HTTP-flood / DDoS traffic in real time, in front of an Nginx-protected service, with zero external dependencies.',
    role: 'Built a Go daemon that tails Nginx logs and runs sliding-window detection, baseline modelling, banning, and a live dashboard concurrently over goroutines and channels.',
    outcome:
      'Flags anomalies via Z-score (>3σ) and 5× spike checks, auto-bans through iptables on an exponential-backoff schedule, and ships as a tiny multi-stage Docker image.',
    stack: ['Go', 'Goroutines / Channels', 'iptables', 'Nginx', 'Docker', 'Slack'],
    image: '/projects/detector.svg',
    links: [],
    accent: 'magenta',
  },
  {
    slug: 'render-lite',
    title: 'RenderLite',
    problem:
      'Understand how a PaaS actually works by building one — automating Git-to-Docker deployments, container isolation, and dynamic routing from scratch.',
    role: 'Built the deployment orchestrator end-to-end: it drives the Docker Engine API to build and isolate each app in its own container, then routes traffic to it by subdomain.',
    outcome:
      'Buildpack-style pipeline — use a repo’s Dockerfile if present, else auto-generate one — in a type-safe Turborepo monorepo (Next.js dashboard + Node orchestrator).',
    stack: ['Node.js', 'Next.js', 'Docker Engine API', 'Postgres', 'Prisma', 'Turborepo'],
    image: '/projects/render-lite.svg',
    links: [],
    accent: 'cyan',
  },
  {
    slug: 'owise',
    title: 'OWise',
    problem:
      'Informal traders in Nigeria run their businesses on WhatsApp and feature phones — they need an AI assistant that meets them on WhatsApp, USSD, and voice.',
    role: 'Owned the full technical architecture and build: a Go comms microservice fronting a NestJS core, with Gemini Live powering voice.',
    outcome:
      'Multi-channel AI assistant (WhatsApp / USSD / voice) for informal traders — a Go comms microservice split from a NestJS core, with Google Gemini for language. Built for the OPay × Google National Innovation Challenge 2026.',
    stack: ['Go', 'NestJS', 'Google Gemini', 'Gemini Live', 'Docker Compose'],
    image: '/projects/owise.svg',
    links: [],
    accent: 'lime',
  },
  {
    slug: 'search-engine',
    title: 'Semantic Search Engine',
    problem:
      'Search that understands meaning, not just keywords — plus the analytics to see what users are actually looking for.',
    role: 'Built a NestJS engine that embeds documents locally with transformer models and serves vector search over Pinecone and pgvector, fed by a Bull/Redis indexing queue.',
    outcome:
      'Event-driven analytics and a background indexer keep results fresh without blocking queries.',
    stack: ['NestJS', 'Pinecone', 'pgvector', 'Transformers.js', 'Redis / Bull', 'Prisma'],
    image: '/projects/search-engine.svg',
    links: [],
    accent: 'lime',
  },
  {
    slug: 'cargoland',
    title: 'Cargoland',
    problem:
      'A multi-sided food-delivery marketplace needs three tightly-coupled mobile clients — consumer, vendor, and rider — kept in lockstep on a single release cadence.',
    role: 'Built all three React Native / Expo apps and owned the EAS build-and-release pipeline shipping to Google Play.',
    outcome:
      "Shipped three production apps (consumer, vendor, rider) to Google Play across two Play Console accounts — FCM/APNs dual-channel order alerts and background-location live tracking that cleared Google's policy review. [NUM: orders/day or vendors]",
    stack: ['React Native', 'Expo', 'EAS', 'NestJS', 'Postgres', 'FCM/APNs'],
    image: '/projects/cargoland.svg',
    links: [],
    accent: 'cyan',
  },
  {
    slug: 'payaza',
    title: 'PayAza',
    problem:
      'Tap-to-pay for everyday transactions — turning a phone into both an NFC payment terminal and a wallet.',
    role: 'Built the cross-platform clients: a React Native app with native NFC read/write and a Next.js web dashboard over a shared API.',
    outcome:
      'Refresh-queue JWT auth that retries in-flight requests after a silent token refresh, with Socket.IO live updates across hardware-NFC and QR flows.',
    stack: ['React Native', 'Expo', 'NFC', 'Next.js', 'Socket.IO', 'React Query'],
    image: '/projects/payaza.svg',
    links: [],
    accent: 'cyan',
  },
  {
    slug: 'quickbite',
    title: 'QuickBite',
    problem:
      'A food-delivery platform that needs reliable, production-grade payment collection from day one.',
    role: 'Took a NestJS food-delivery backend from code to live production solo — owned the AWS deploy, reverse proxy, DNS, and security hardening.',
    outcome:
      'AWS EC2 + Dockerized stack behind an Nginx reverse proxy and Cloudflare DNS, with security hardening (fail2ban + WAF) that blocked 142 bot intrusion attempts. Paystack payments live and verified end-to-end.',
    stack: ['NestJS', 'AWS EC2', 'Docker', 'Nginx', 'Cloudflare', 'Paystack'],
    image: '/projects/quickbite.svg',
    links: [],
    accent: 'cyan',
  },
  {
    slug: 'forge',
    title: 'Forge',
    problem:
      'Informal construction workers have real, verifiable labor but no credit history a bank can read — so they stay locked out of financing.',
    role: 'Built it solo for Squad Hackathon 3.0: a Flutter worker app with GPS/geotag proof-of-work, two Next.js dashboards, and the payments + KYC integrations behind them.',
    outcome:
      'A construction supply-chain fintech that turns verified labor transactions into bankable credit history for informal workers — Squad APIs for payments, Smile ID KYC — presented solo at Squad Hackathon 3.0.',
    stack: ['Flutter', 'Next.js', 'Squad API', 'Smile ID', 'Postgres'],
    image: '/projects/forge.svg',
    links: [],
    accent: 'cyan',
  },
  {
    slug: 'synthsentry',
    title: 'SynthSentry',
    problem:
      "Retail investors hold portfolios they can't actually read the risk of — exposure and synthetic-asset danger stay buried in raw numbers.",
    role: 'Built the full tool at the Bayse Hackathon — holdings ingestion, the Gemini risk-reasoning layer, and the plain-language signal UI.',
    outcome:
      'An AI portfolio-risk tool on Google Gemini + the Bayse API — turning raw holdings into plain-language risk signals.',
    stack: ['Next.js', 'Google Gemini', 'Bayse API', 'Python'],
    image: '/projects/synthsentry.svg',
    links: [],
    accent: 'magenta',
  },
  {
    slug: 'notification-service',
    title: 'Distributed Notification Service',
    problem:
      'The reliability patterns behind production infrastructure — exactly-once delivery, backpressure, retries — are easy to name and hard to get right, so I am building them from the ground up.',
    role: 'Designing and building it solo as a deep-dive into reliable infra: a Kafka broker, Redis rate-limiting, Postgres persistence, and channel workers with retry/backoff and dead-letter queues.',
    outcome:
      'Building a distributed notification system in Java/Spring Boot: Kafka broker, Redis rate-limiting, Postgres persistence, channel workers with retry/backoff, dead-letter queues, and idempotent delivery. A ground-up study in the systems patterns behind reliable infrastructure. [NUM: throughput target]',
    stack: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'Postgres'],
    image: '/projects/notification-service.svg',
    links: [],
    accent: 'lime',
  },
];

/**
 * Lookup by slug so per-track content modules (data/tracks/*) can reuse a
 * project's canonical base (title/problem/image/stack/accent/links) and
 * override only the framing (role/outcome/order) for frontend vs backend.
 */
export const projectsById: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
);
