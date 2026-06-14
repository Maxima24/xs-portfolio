'use client';

import dynamic from 'next/dynamic';

// pdf.js touches the DOM/worker — load it only on the client, never during SSR.
// This also keeps pdf.js out of the main-page bundle (it ships only on /resume).
const ResumeViewer = dynamic(() => import('./ResumeViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center py-24 text-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-neon-cyan" />
    </div>
  ),
});

export function ResumeViewerClient() {
  return <ResumeViewer />;
}
