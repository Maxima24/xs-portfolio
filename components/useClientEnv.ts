'use client';

import { useEffect, useState } from 'react';

export interface ClientEnv {
  /** has mounted on the client (avoids SSR/CSR mismatch) */
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  /** true when we should render the heavy WebGL scene */
  canRender3D: boolean;
}

/**
 * Detects reduced-motion preference and small/coarse viewports so callers can
 * decide whether to mount the heavy Three.js scene or a static fallback.
 */
export function useClientEnv(mobileBreakpoint = 768): ClientEnv {
  const [env, setEnv] = useState<ClientEnv>({
    ready: false,
    prefersReducedMotion: false,
    isMobile: false,
    canRender3D: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia(
      `(max-width: ${mobileBreakpoint - 1}px), (pointer: coarse)`,
    );

    const update = () => {
      const prefersReducedMotion = motionQuery.matches;
      const isMobile = mobileQuery.matches;
      setEnv({
        ready: true,
        prefersReducedMotion,
        isMobile,
        canRender3D: !prefersReducedMotion && !isMobile,
      });
    };

    update();
    motionQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      motionQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, [mobileBreakpoint]);

  return env;
}
