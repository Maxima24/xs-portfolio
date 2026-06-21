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
    'Three production apps on the Play Store, offline-aware UI and push-driven real-time updates — a fix lands everywhere on one cadence.',
    ['React Native', 'Expo', 'EAS', 'TypeScript', 'React Navigation', 'FCM/APNs'],
  ),
  fe(
    'forge',
    'Built the Flutter worker app — GPS/geotag proof-of-work capture in the field — and two Next.js dashboards that run the whole supply chain.',
    'Three coordinated frontends — a field mobile app and two web dashboards — shipped solo for Squad Hackathon 3.0.',
    ['Flutter', 'Next.js', 'TypeScript', 'Tailwind', 'Squad API'],
  ),
  fe(
    'swifthum',
    'Built the Next.js dashboard and the Telegram mini-app UX for ultrasonic peer-to-peer transfers.',
    'Real-time transfer-status UI in a Turborepo monorepo with types shared across web and bot.',
    ['Next.js', 'TypeScript', 'Tailwind', 'Turborepo', 'aiogram'],
  ),
  fe(
    'synthsentry',
    'Built the risk-signal interface that turns a raw portfolio into a plain-language read on exposure.',
    'A legible UI over a Gemini risk model — built at the Bayse Hackathon.',
    ['Next.js', 'TypeScript', 'Tailwind', 'Gemini'],
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
    body: 'The 3D hero is dynamically imported (never blocking SSR), caps device-pixel-ratio, and swaps to a static accent gradient under prefers-reduced-motion or on mobile — keeping interaction smooth and the Lighthouse budget intact.',
    tags: ['Dynamic import', 'dpr cap', 'Reduced-motion'],
  },
];

export const frontend: TrackContent = {
  key: 'frontend',
  label: 'Frontend Engineer',
  hero: {
    role: 'Frontend Engineer & Frontend Lead @ PortalHq',
    valueProp:
      "I build interfaces that ship to real users — three production apps on the Play Store, and the motion-heavy UI you're reading right now.",
  },
  coreStack: 'React · Next.js · TS',
  projectsIntro:
    "Interfaces and cross-platform apps I've shipped to production — mobile clients, real-time dashboards, and checkout flows. Each card leads with what I built and how it feels to use.",
  projects,
  techDepthIntro:
    'How I think about UI under real-world conditions — auth, offline, real-time, and performance.',
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
        I build interfaces real people use — the Cargoland consumer, vendor, and
        rider apps are all in production, and I sweat the details on motion,
        performance, and feel (this site included). At PortalHq I lead frontend.
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
