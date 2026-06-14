import { renderOgImage } from './_og/render';
import { getActiveTrackKey, trackSeo } from '@/data/tracks/seo';

// Env-aware: each deployment's OG image reflects its PORTFOLIO_TRACK.
export const runtime = 'edge';
export const alt = 'Faith Popoola, Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const s = trackSeo[getActiveTrackKey()];
  return renderOgImage({ role: s.ogRole, tagline: s.ogTagline });
}
