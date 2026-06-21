import type { IconType } from 'react-icons';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiGo,
  SiNestjs,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiApachekafka,
  SiPython,
  SiTailwindcss,
  SiFlutter,
  SiSpringboot,
  SiNginx,
  SiCloudflare,
  SiExpo,
  SiSocketdotio,
  SiReactquery,
  SiPrisma,
  SiTurborepo,
  SiFramer,
  SiFigma,
  SiGrafana,
  SiCelery,
  SiRabbitmq,
  SiExpress,
  SiNodedotjs,
  SiSlack,
  SiGooglegemini,
  SiHuggingface,
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa6';

// Normalized-key → brand icon. Compound/aliased labels collapse to a primary
// brand (see keyOf). Unknown brands (Squad API, Smile ID, Bayse API, Paystack,
// Hetzner, Pinecone, Zustand…) and concept tags (Idempotency, Microservices…)
// are intentionally absent → they render text-only.
const ICONS: Record<string, IconType> = {
  react: SiReact,
  reactnative: SiReact,
  reactnavigation: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  js: SiJavascript,
  javascript: SiJavascript,
  go: SiGo,
  nestjs: SiNestjs,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  pgvector: SiPostgresql,
  redis: SiRedis,
  docker: SiDocker,
  dockercompose: SiDocker,
  dockerengineapi: SiDocker,
  kafka: SiApachekafka,
  python: SiPython,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  flutter: SiFlutter,
  springboot: SiSpringboot,
  nginx: SiNginx,
  cloudflare: SiCloudflare,
  expo: SiExpo,
  eas: SiExpo,
  socketio: SiSocketdotio,
  reactquery: SiReactquery,
  prisma: SiPrisma,
  turborepo: SiTurborepo,
  framer: SiFramer,
  framermotion: SiFramer,
  figma: SiFigma,
  grafana: SiGrafana,
  celery: SiCelery,
  rabbitmq: SiRabbitmq,
  express: SiExpress,
  expressjs: SiExpress,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  slack: SiSlack,
  gemini: SiGooglegemini,
  geminilive: SiGooglegemini,
  googlegemini: SiGooglegemini,
  transformersjs: SiHuggingface,
  huggingface: SiHuggingface,
  java: FaJava,
  aws: FaAws,
  awsec2: FaAws,
};

/**
 * Normalize a stack label to a lookup key: lowercase, drop parentheticals
 * ("Go (whatsmeow)" → go), take the part before a slash ("Redis / Bull" → redis,
 * "FCM/APNs" → fcm), strip non-alphanumerics ("Next.js" → nextjs).
 */
function keyOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .split('/')[0]
    .replace(/[^a-z0-9]/g, '');
}

/** Brand icon for a technology label, or null for unknown brands / concept tags. */
export function getTechIcon(label: string): IconType | null {
  return ICONS[keyOf(label)] ?? null;
}
