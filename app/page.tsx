import type { Metadata } from 'next';
import { Portfolio } from '@/components/Portfolio';
import { getActiveTrack, getActiveTrackKey } from '@/data/tracks';
import { trackSeo } from '@/data/tracks/seo';

// Per-deployment metadata: each Vercel project sets PORTFOLIO_TRACK, so the
// root serves (and is described as) that track. Read at build → stays static.
export function generateMetadata(): Metadata {
  const s = trackSeo[getActiveTrackKey()];
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: '/',
      title: s.title,
      description: s.description,
      siteName: 'Faith Popoola',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.title,
      description: s.description,
    },
  };
}

export default function HomePage() {
  return <Portfolio content={getActiveTrack()} />;
}
