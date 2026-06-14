import { projectsById, type Project } from '@/data/projects';
import type { TechDepthItem } from '@/data/techDepth';
import type { TrackContent } from './types';

// Reframe a canonical project for a frontend audience: keep the base
// (title/problem/image/accent) and override role/outcome/stack to lead with UI.
const fe = (
  slug: string,
  role: string,
  outcome: string,
  stack: string[],
): Project => ({ ...projectsById[slug], role, outcome, stack });

const projects: Project[] = [
  fe(
    'cargoland',
    'Built all three React Native / Expo clients — consumer, vendor, and rider — on a shared component system, and owned the EAS build/release pipeline to Google Play.',
    'Shipped 3 production apps with offline-aware UI and push-driven real-time updates.',
    ['React Native', 'Expo', 'EAS', 'TypeScript', 'React Navigation', 'FCM/APNs'],
  ),
  fe(
    'payaza',
    'Built the React Native NFC app and the Next.js web dashboard over a shared, typed API client.',
    'Tap-to-pay + QR flows with Socket.IO live updates and a transparent token-refresh queue that replays in-flight requests.',
    ['React Native', 'Next.js', 'TypeScript', 'Socket.IO', 'React Query', 'Tailwind'],
  ),
  fe(
    'swifthum',
    'Built the Next.js dashboard and the Telegram mini-app UX for ultrasonic peer-to-peer transfers.',
    'Real-time transfer-status UI in a Turborepo monorepo with types shared across web and bot.',
    ['Next.js', 'TypeScript', 'Tailwind', 'Turborepo', 'aiogram'],
  ),
  fe(
    'render-lite',
    'Built the Next.js deployment dashboard — project creation, live build logs, and deploy status.',
    'Type-safe dashboard in a Turborepo monorepo driving the orchestrator API.',
    ['Next.js', 'TypeScript', 'Tailwind', 'Turborepo', 'Prisma'],
  ),
  fe(
    'quickbite',
    'Built the Next.js storefront and checkout UI.',
    'Production checkout with Paystack and responsive, mobile-first menus.',
    ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Paystack'],
  ),
];

const techDepth: TechDepthItem[] = [
  {
    title: 'Transparent token-refresh request queue',
    context: 'PayAza',
    body: 'When an access token expires mid-session, in-flight requests are parked in a queue, a single refresh runs, and the queued calls replay automatically — so the user never sees a flicker, a failed action, or a surprise re-login. Concurrent 401s collapse into one refresh instead of a stampede.',
    tags: ['Auth UX', 'Request queue', 'React Query'],
  },
  {
    title: 'One component system across three apps',
    context: 'Cargoland',
    body: 'The consumer, vendor, and rider apps share a single React Native component library and design tokens, with environment-driven config per client. One EAS build-and-release pipeline ships all three to Google Play, so a fix lands everywhere on the same cadence.',
    tags: ['React Native', 'Design system', 'EAS'],
  },
  {
    title: 'Real-time, offline-aware UI',
    context: 'SwiftHum · PayAza',
    body: 'Transfer and payment state stream over Socket.IO with optimistic updates, so the UI reflects an action instantly and reconciles when the server confirms. Reconnection and stale-state handling keep the screen trustworthy on flaky mobile networks.',
    tags: ['Socket.IO', 'Optimistic UI', 'Reconnect'],
  },
  {
    title: 'Performance-budgeted WebGL',
    context: 'This portfolio',
    body: 'The 3D hero is dynamically imported (never blocking SSR), caps device-pixel-ratio, and swaps to a static neon gradient under prefers-reduced-motion or on mobile — keeping interaction smooth and the Lighthouse budget intact.',
    tags: ['Dynamic import', 'dpr cap', 'Reduced-motion'],
  },
];

export const frontend: TrackContent = {
  key: 'frontend',
  label: 'Frontend Engineer',
  hero: {
    role: 'Frontend Engineer & Frontend Lead @ PortalHq · Computer Engineering @ OAU',
    valueProp:
      "I build fast, accessible interfaces and cross-platform apps end-to-end — React, Next.js, and React Native — with real-time UX and a designer's eye for detail.",
  },
  projectsIntro:
    "Interfaces and cross-platform apps I've shipped to production — mobile clients, real-time dashboards, and checkout flows. Each card leads with what I built and how it feels to use.",
  projects,
  techDepthIntro:
    'How I think about UI under real-world conditions — auth, offline, real-time, and performance.',
  techDepth,
  about: {
    lead: (
      <>
        I&apos;m a frontend engineer who likes owning the interface end-to-end —
        from design tokens to the network layer. I&apos;ve been{' '}
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
        I build with React, Next.js, and React Native: cross-platform apps,
        real-time dashboards, and checkout flows that stay fast and trustworthy on
        flaky mobile networks. I care about the details — accessibility, motion,
        optimistic UI, and performance budgets — that make an interface feel
        effortless.
      </>
    ),
    stack: [
      'TypeScript',
      'React',
      'Next.js',
      'React Native / Expo',
      'Tailwind CSS',
      'Framer Motion',
      'Zustand',
      'React Query',
      'Socket.IO',
      'Figma',
    ],
    interests: ['Design systems', 'Real-time UX', 'Performance'],
  },
};
