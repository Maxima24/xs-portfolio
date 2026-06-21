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
    title: 'Idempotency under concurrency',
    context: 'SwiftHum · Notification Service',
    body: "SwiftHum's ledger uses HMAC-signed tokens with Serializable isolation so a replayed or duplicated transfer can never double-spend — the same discipline as the notification service's dedup layer.",
    tags: ['Serializable isolation', 'HMAC tokens', 'Idempotency'],
  },
  {
    title: 'Service boundaries on purpose',
    context: 'OWise',
    body: 'OWise splits a Go comms microservice from the NestJS core so the latency-sensitive channel layer scales independently of business logic.',
    tags: ['Microservices', 'Go concurrency', 'Service boundaries'],
  },
  {
    title: 'Reliability primitives',
    context: 'Distributed Notification Service',
    body: 'The notification system applies the patterns that keep infra up: retry with exponential backoff, dead-letter queues, and at-least-once delivery made safe by idempotency.',
    tags: ['Retry / backoff', 'Dead-letter queues', 'At-least-once'],
  },
];
