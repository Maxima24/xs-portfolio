import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/data/site';
import { ResumeViewerClient } from './ResumeViewerClient';

export const metadata: Metadata = {
  title: 'Résumé | Faith Popoola',
  description:
    'Résumé of Faith "XS" Popoola — Software Engineer & Frontend Lead @ PortalHq. View in-browser or download the PDF.',
};

const downloadName = 'Faith-Popoola-Resume.pdf';

export default function ResumePage() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-5xl flex-col px-4 pb-8 pt-5 sm:px-6">
      {/* Top bar */}
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="nav-underline inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-neon-cyan"
          >
            <span aria-hidden>←</span> Back to portfolio
          </Link>
          <span aria-hidden className="text-white/15">
            |
          </span>
          <h1 className="font-mono text-sm uppercase tracking-[0.3em] text-glow-cyan">
            Résumé
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={site.resumeFile}
            download={downloadName}
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-sm font-medium text-neon-cyan shadow-glow-cyan transition-all duration-200 hover:-translate-y-0.5 hover:bg-neon-cyan/20 hover:shadow-glow-cyan-lg"
          >
            <span aria-hidden>↓</span> Download PDF
          </a>
          <a
            href={site.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            Open in new tab <span aria-hidden>↗</span>
          </a>
        </div>
      </header>

      {/* On-theme PDF viewer (pdf.js, client-only) */}
      <ResumeViewerClient />

      {/* Always-available fallback for environments where inline embedding fails */}
      <p className="mt-4 text-center text-sm text-muted">
        Can&apos;t see the résumé?{' '}
        <a
          href={site.resumeFile}
          download={downloadName}
          className="text-neon-cyan underline-offset-4 hover:underline"
        >
          Download the PDF
        </a>{' '}
        or{' '}
        <a
          href={site.resumeFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon-cyan underline-offset-4 hover:underline"
        >
          open it in a new tab
        </a>
        .
      </p>
    </main>
  );
}
