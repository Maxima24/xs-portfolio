export interface TechDepthItem {
  title: string;
  /** the system / project it comes from */
  context: string;
  /** 2-3 sentences, no fluff — demonstrate systems thinking */
  body: string;
  tags: string[];
}

export const techDepth: TechDepthItem[] = [
  {
    title: 'Ultrasonic tokens with end-to-end idempotency',
    context: 'SwiftHum',
    body: 'Payment intents are encoded into short-lived tokens signed with HMAC-SHA256 and broadcast over ultrasonic audio, so a transfer survives a noisy channel without trusting it. Settlement runs inside Serializable-isolation transactions keyed by a unique token id, making replays and double-spends a no-op rather than a race.',
    tags: ['HMAC-SHA256', 'Serializable isolation', 'Idempotency'],
  },
  {
    title: 'Go ↔ NestJS microservice split',
    context: 'OWise',
    body: 'Channel I/O (WhatsApp, USSD, and Gemini Live voice) lives in a lean Go comms service tuned for concurrent, latency-sensitive connections, while business logic and AI orchestration sit in a NestJS core. The seam is a narrow internal contract, so each side scales and deploys on its own without the other blocking it.',
    tags: ['Microservices', 'Go concurrency', 'Service boundaries'],
  },
  {
    title: 'Reliable distributed notifications',
    context: 'Cargoland',
    body: 'Push delivery across three apps uses a transactional outbox so a notification is only ever emitted after its source state commits — no lost or phantom sends. A dedup key plus idempotent dispatch to FCM and APNs guarantees a user is notified exactly once even when producers retry.',
    tags: ['Outbox pattern', 'Deduplication', 'FCM/APNs'],
  },
  {
    title: 'Real-time anomaly detection over sliding windows',
    context: 'Anomaly Detection Engine (Go)',
    body: 'Per-IP and global request rates live in time-evicted sliding windows, while a rolling 30-minute baseline with time-of-day awareness models what "normal" looks like right now. Traffic is flagged when it crosses a 3σ Z-score or a 5× spike multiplier, then banned via iptables on an exponential-backoff schedule — with the log tailer, baseline, detector, and unbanner all running concurrently over goroutines.',
    tags: ['Sliding window', 'Z-score / σ', 'Go concurrency'],
  },
  {
    title: 'Buildpack-style container orchestration',
    context: 'RenderLite (PaaS)',
    body: 'Each deployment is built and run inside its own Docker container via the Docker Engine API, then exposed on its own subdomain through a reverse proxy. The build step mirrors real PaaS buildpacks — use the repo’s Dockerfile if it exists, otherwise generate one — so per-service isolation and routing happen automatically.',
    tags: ['Docker Engine API', 'Container isolation', 'Reverse proxy'],
  },
];
