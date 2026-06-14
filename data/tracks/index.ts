import type { TrackKey, TrackContent } from './types';
import { general } from './general';
import { frontend } from './frontend';
import { backend } from './backend';
import { getActiveTrackKey } from './seo';

export const tracks: Record<TrackKey, TrackContent> = {
  general,
  frontend,
  backend,
};

/** The full TrackContent this deployment serves at `/` (per PORTFOLIO_TRACK). */
export function getActiveTrack(): TrackContent {
  return tracks[getActiveTrackKey()];
}

export { getActiveTrackKey } from './seo';
export type { TrackKey, TrackContent } from './types';
