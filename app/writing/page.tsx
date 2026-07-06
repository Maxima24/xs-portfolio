import type { Metadata } from 'next';
import Link from 'next/link';
import { writingPosts } from '@/data/writing';

export const metadata: Metadata = {
  title: 'Writing | Faith Popoola',
  description:
    'Engineering write-ups on fintech infrastructure — idempotent ledgers, exactly-once delivery, and settlement-path correctness — each walking a real trade-off end to end.',
};

export default function WritingIndex() {
  return (
    <main className="mx-auto min-h-[100svh] max-w-3xl px-5 pb-24 pt-8 sm:px-8">
      <header className="mb-12">
        <Link
          href="/#depth"
          className="nav-underline inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> Back to portfolio
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Writing
        </h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Short engineering write-ups from the systems I&apos;ve shipped — each one
          walks a single trade-off: the problem, the naive approach and why it fails,
          the decision, and how it was verified.
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        {writingPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="surface group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-accent/80">
                {post.project} · {post.readingMinutes} min read
              </span>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-white group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{post.dek}</p>
              <span className="mt-4 inline-block font-mono text-xs text-accent">
                Read the write-up →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
