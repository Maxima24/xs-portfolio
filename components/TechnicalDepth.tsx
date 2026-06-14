import type { TechDepthItem } from '@/data/techDepth';
import { Section, SectionHeading } from './Section';

export function TechnicalDepth({
  intro,
  items,
}: {
  intro: string;
  items: TechDepthItem[];
}) {
  return (
    <Section
      id="depth"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8"
    >
      <SectionHeading
        index="03"
        kicker="selected architecture"
        title="Technical Depth"
      />
      <p className="mb-10 max-w-2xl text-white/65">{intro}</p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {items.map((d, i) => (
          <article
            key={d.title}
            className="surface relative flex flex-col gap-3 rounded-xl p-6"
          >
            <span className="font-mono text-xs text-neon-cyan/70">
              0{i + 1} · {d.context}
            </span>
            <h3 className="text-lg font-semibold leading-snug text-white">
              {d.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/70">{d.body}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {d.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
