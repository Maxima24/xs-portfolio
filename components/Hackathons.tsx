import { hackathons, hackathonsIntro } from '@/data/hackathons';
import { Section, SectionHeading } from './Section';
import { Chip } from './Chip';

const accentText = {
  cyan: 'text-neon-cyan border-neon-cyan/40',
  magenta: 'text-neon-magenta border-neon-magenta/40',
  lime: 'text-neon-lime border-neon-lime/40',
} as const;

export function Hackathons() {
  return (
    <Section
      id="hackathons"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8"
    >
      <SectionHeading index="02" kicker="ship under pressure" title="Hackathons" />
      <p className="mb-10 max-w-2xl text-white/65">{hackathonsIntro}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hackathons.map((h) => (
          <article
            key={h.event}
            className="surface group flex flex-col gap-3 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{h.project}</h3>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] ${accentText[h.accent]}`}
              >
                {h.status}
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              {h.event}
            </p>
            <p className="text-sm leading-relaxed text-white/70">{h.built}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-1">
              {h.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
