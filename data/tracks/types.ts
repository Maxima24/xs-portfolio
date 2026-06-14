import type { ReactNode } from 'react';
import type { Project } from '@/data/projects';
import type { TechDepthItem } from '@/data/techDepth';

export type TrackKey = 'general' | 'frontend' | 'backend';

export interface AboutContent {
  /** opening paragraph (may contain neon-highlight JSX) */
  lead: ReactNode;
  /** supporting paragraph */
  body: ReactNode;
  /** ordered so the track's primary stack leads */
  stack: string[];
  interests: string[];
}

/** Everything that differs between the general / frontend / backend portfolios. */
export interface TrackContent {
  key: TrackKey;
  /** human label, e.g. "Frontend Engineer" — used in metadata + OG */
  label: string;
  hero: {
    role: string;
    valueProp: string;
  };
  projectsIntro: string;
  /** featured products, already ordered + reframed for this audience */
  projects: Project[];
  techDepthIntro: string;
  techDepth: TechDepthItem[];
  about: AboutContent;
}
