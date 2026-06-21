'use client';

import type { RefObject } from 'react';
import dynamic from 'next/dynamic';
import { useClientEnv } from './useClientEnv';
import { StaticHeroBackdrop } from './StaticHeroBackdrop';

// Load the R3F scene only on the client — never during SSR.
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <StaticHeroBackdrop />,
});

/**
 * Decides between the heavy WebGL hero scene and the static neon fallback.
 * Renders the static backdrop until the client environment is known, so the
 * first paint never blocks on WebGL and SSR markup stays stable.
 *
 * `eventSourceRef` is the hero <section>; the canvas itself is pointer-events
 * none, so r3f sources pointer events from that element instead (see HeroScene).
 */
export function HeroSceneClient({
  eventSourceRef,
}: {
  eventSourceRef: RefObject<HTMLElement>;
}) {
  const { ready, canRender3D } = useClientEnv();

  if (!ready || !canRender3D) {
    return <StaticHeroBackdrop />;
  }

  return <HeroScene eventSourceRef={eventSourceRef} />;
}
