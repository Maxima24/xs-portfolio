'use client';

import type { Project } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectCarousel } from './ProjectCarousel';
import { useClientEnv } from './useClientEnv';

function Grid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}

/**
 * Renders the project grid by default (SSR + first paint → all cards in the
 * HTML, good for SEO/skimming and a no-JS fallback) and progressively enhances
 * to the 3D coverflow carousel only for desktop pointer users who haven't asked
 * for reduced motion. Mobile / touch / reduced-motion keep the grid.
 */
export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const { ready, isMobile, prefersReducedMotion } = useClientEnv();
  const enhance = ready && !isMobile && !prefersReducedMotion && projects.length > 1;

  if (!enhance) return <Grid projects={projects} />;
  return <ProjectCarousel projects={projects} />;
}
