import type { TrackContent } from '@/data/tracks/types';
import { hackathons } from '@/data/hackathons';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { FeaturedProducts } from './FeaturedProducts';
import { Hackathons } from './Hackathons';
import { TechnicalDepth } from './TechnicalDepth';
import { About } from './About';
import { Footer } from './Footer';

/**
 * One composition for all three portfolios (general / frontend / backend).
 * Identity, nav, hackathons, the 3D hero and résumé viewer are shared; only the
 * `content` (hero copy, featured projects, tech-depth, about) differs per track.
 */
export function Portfolio({ content }: { content: TrackContent }) {
  // Hero stat strip — derived from data so it's correct on every track.
  const stats = [
    { value: String(content.projects.length), label: 'production systems' },
    { value: String(hackathons.length), label: 'hackathon wins' },
    { value: content.coreStack, label: 'core stack' },
  ];
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero
          role={content.hero.role}
          valueProp={content.hero.valueProp}
          stats={stats}
        />
        <FeaturedProducts
          intro={content.projectsIntro}
          projects={content.projects}
        />
        <Hackathons />
        <TechnicalDepth intro={content.techDepthIntro} items={content.techDepth} />
        <About about={content.about} />
        <Footer />
      </main>
    </>
  );
}
