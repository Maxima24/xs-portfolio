import type { Project } from '@/data/projects';
import { Section, SectionHeading } from './Section';
import { ProjectsShowcase } from './ProjectsShowcase';

export function FeaturedProducts({
  intro,
  projects,
}: {
  intro: string;
  projects: Project[];
}) {
  return (
    <Section
      id="work"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8"
    >
      <SectionHeading index="01" kicker="featured products" title="Work" />
      <p className="mb-10 max-w-2xl text-white/65">{intro}</p>
      <ProjectsShowcase projects={projects} />
    </Section>
  );
}
