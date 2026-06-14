'use client';

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
 */
export function HeroSceneClient() {
  const { ready, canRender3D } = useClientEnv();

  if (!ready || !canRender3D) {
    return <StaticHeroBackdrop />;
  }

  return <HeroScene />;
}
