import type { AboutContent } from '@/data/tracks/types';
import { Section, SectionHeading } from './Section';
import { Chip } from './Chip';

export function About({ about }: { about: AboutContent }) {
  return (
    <Section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8"
    >
      <SectionHeading index="04" kicker="who i am" title="About" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <p className="text-lg leading-relaxed text-white/80">{about.lead}</p>
          <p className="leading-relaxed text-white/65">{about.body}</p>

          <div className="pt-2">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent/80">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="surface rounded-xl p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent2/80">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {about.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
