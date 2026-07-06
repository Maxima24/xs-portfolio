import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { writingBySlug, writingPosts } from '@/data/writing';

interface Params {
  params: { slug: string };
}

// Statically render every write-up at build time.
export function generateStaticParams() {
  return writingPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = writingBySlug[params.slug];
  if (!post) return {};
  return {
    title: `${post.title} | Faith Popoola`,
    description: post.dek,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.dek,
    },
  };
}

export default function WritingPost({ params }: Params) {
  const post = writingBySlug[params.slug];
  if (!post) notFound();

  return (
    <main className="mx-auto min-h-[100svh] max-w-2xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/writing"
        className="nav-underline inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> All writing
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <span className="font-mono text-xs uppercase tracking-wider text-accent/80">
            {post.project} · {post.readingMinutes} min read
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{post.dek}</p>
        </header>

        {/* Draft banner — flags what the owner still needs to verify. Remove once confirmed. */}
        {post.ownerVerify && (
          <aside
            role="note"
            className="mb-10 rounded-lg border border-amber-400/40 bg-amber-400/[0.06] p-4 text-sm leading-relaxed text-amber-200/90"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-amber-300">
              Draft — owner verification needed
            </span>
            <p className="mt-2">{post.ownerVerify}</p>
          </aside>
        )}

        <div className="flex flex-col gap-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-semibold text-white">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-white/75">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
