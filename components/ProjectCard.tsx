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
          {project.links.length > 0 && (
            <div className="flex items-center gap-3 text-sm">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono text-xs underline-offset-4 hover:underline ${a.text}`}
                >
                  {link.kind === 'github' ? 'GitHub ↗' : 'Live ↗'}
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

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>
    </article>
  );
}
