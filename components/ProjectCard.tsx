import type { Project } from '@/data/projects';
import { Chip } from './Chip';

// Monochrome: one accent per track (driven by the CSS var), not per project.
const a = {
  border: 'hover:border-accent/60',
  glow: 'hover:shadow-glow-accent-lg',
  text: 'text-accent',
  ring: 'group-hover:ring-accent/40',
};

export function ProjectCard({ project }: { project: Project }) {
  // P1.1: the live demo is the highest-payoff signal — surface it as a prominent
  // button, not a small header link. Secondary links (repo) stay in the header.
  const liveLink = project.links.find((l) => l.kind === 'live');
  const secondaryLinks = project.links.filter((l) => l.kind !== 'live');

  return (
    <article
      className={`surface group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 ${a.border} ${a.glow}`}
    >
      {/* visual */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
        <img
          src={project.image}
          alt={`Cover illustration for ${project.title}`}
          loading="lazy"
          width={1280}
          height={720}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition-all duration-300 ${a.ring}`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          {secondaryLinks.length > 0 && (
            <div className="flex items-center gap-3 text-sm">
              {secondaryLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono text-xs underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none ${a.text}`}
                >
                  {link.kind === 'github' ? 'Code ↗' : `${link.label} ↗`}
                </a>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed text-white/65">
          {project.problem}
        </p>

        <div className="space-y-2 text-sm">
          <p>
            <span className={`font-mono text-xs uppercase tracking-wider ${a.text}`}>
              Role ·{' '}
            </span>
            <span className="text-white/80">{project.role}</span>
          </p>
          <p className="flex items-start gap-2 text-white/90">
            <span aria-hidden className={a.text}>
              ▸
            </span>
            <span className="font-medium">{project.outcome}</span>
          </p>
        </div>

        {liveLink && (
          <a
            href={liveLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent shadow-glow-accent transition-colors hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span aria-hidden>▶</span>
            {liveLink.label || 'Live Demo'}
          </a>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>
    </article>
  );
}
