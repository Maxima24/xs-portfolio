export interface Hackathon {
  event: string;
  project: string;
  /** placement or current status */
  status: string;
  built: string;
  stack: string[];
  accent: 'cyan' | 'magenta' | 'lime';
}

export const hackathonsIntro =
  'Multiple hackathon wins — I build fast, ship working systems under deadline, and present them.';

export const hackathons: Hackathon[] = [
  {
    event: 'OPay × Google National Innovation Challenge 2026',
    project: 'OWise',
    status: 'Built for the challenge',
    built: 'Pitched and prototyped against a national field — an AI assistant that meets informal traders on the channels they already use.',
    stack: ['Go', 'NestJS', 'Gemini Live'],
    accent: 'lime',
  },
  {
    event: 'SwiftyEx Hackfest',
    project: 'SwiftHum',
    status: 'Built & presented',
    built: 'Telegram P2P payments over ultrasonic sound with signed, idempotent tokens.',
    stack: ['Go', 'NestJS', 'Next.js'],
    accent: 'magenta',
  },
  {
    event: 'Squad Hackathon 3.0',
    project: 'Forge',
    status: 'Won · presented',
    built: 'Construction supply-chain fintech connecting builders with material financing.',
    stack: ['Next.js', 'NestJS', 'Postgres'],
    accent: 'cyan',
  },
  {
    event: 'OAU × Bayse Hackathon',
    project: 'SynthSentry',
    status: 'Built & presented',
    built: 'AI portfolio-risk tool surfacing exposure and synthetic-asset risk signals.',
    stack: ['Next.js', 'Python', 'AI'],
    accent: 'cyan',
  },
];
