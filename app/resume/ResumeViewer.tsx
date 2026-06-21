'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { site } from '@/data/site';

// pdf.js v4+ uses Promise.withResolvers — polyfill for older browsers.
if (typeof Promise.withResolvers === 'undefined') {
  // @ts-expect-error - patching a missing static for old runtimes
  Promise.withResolvers = function () {
    let resolve!: (value: unknown) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Worker is served from /public (copied there by scripts/copy-pdf-worker.mjs,
// run on predev/prebuild) so it's version-matched and works offline — no CDN.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const MAX_PAGE_WIDTH = 860;
const MIN_SCALE = 0.6;
const MAX_SCALE = 2;
const SCALE_STEP = 0.15;

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
      <span className="font-mono text-xs uppercase tracking-[0.25em]">
        {label}
      </span>
    </div>
  );
}

function Fallback() {
  return (
    <div className="surface mx-auto my-12 max-w-md rounded-xl p-8 text-center">
      <p className="text-white/80">Couldn&apos;t render the résumé here.</p>
      <p className="mt-2 text-sm text-muted">
        Your browser may block inline PDFs — use the buttons below.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <a
          href={site.resumeFile}
          download="Faith-Popoola-Resume.pdf"
          className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent shadow-glow-accent hover:bg-accent/20"
        >
          ↓ Download
        </a>
        <a
          href={site.resumeFile}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 hover:border-accent/50 hover:text-accent"
        >
          Open in new tab ↗
        </a>
      </div>
    </div>
  );
}

export default function ResumeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [failed, setFailed] = useState(false);

  // Track available width so pages render responsively (and re-render on resize).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setFailed(false);
  }, []);

  const onLoadError = useCallback(() => setFailed(true), []);

  // Page width = min(container, cap) * zoom; subtract a little for padding.
  const baseWidth = containerWidth
    ? Math.min(containerWidth - 8, MAX_PAGE_WIDTH)
    : MAX_PAGE_WIDTH;
  const pageWidth = Math.round(baseWidth * scale);

  const zoomOut = () =>
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)));
  const zoomIn = () =>
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
  const zoomReset = () => setScale(1);

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto rounded-2xl bg-ink-800/40 px-2 py-6 sm:px-4"
      >
        {failed ? (
          <Fallback />
        ) : (
          <Document
            file={site.resumeFile}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            onSourceError={onLoadError}
            loading={<Spinner label="Loading résumé" />}
            error={<Fallback />}
            className="flex flex-col items-center gap-6"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                className="surface overflow-hidden rounded-xl shadow-glow-soft ring-1 ring-white/5"
              >
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer
                  renderTextLayer
                  loading={
                    <div
                      style={{ width: pageWidth, height: pageWidth * 1.414 }}
                      className="animate-pulse bg-white/[0.03]"
                    />
                  }
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Floating zoom + page controls */}
      {!failed && numPages > 0 && (
        <div className="pointer-events-none sticky bottom-4 mt-4 flex justify-center">
          <div className="surface pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1.5 shadow-glow-soft">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30"
            >
              −
            </button>
            <button
              type="button"
              onClick={zoomReset}
              aria-label="Reset zoom"
              className="min-w-[3.25rem] rounded-full px-2 font-mono text-xs text-white/70 transition-colors hover:text-accent"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30"
            >
              +
            </button>
            <span aria-hidden className="mx-1 h-5 w-px bg-white/10" />
            <span className="px-2 font-mono text-xs text-muted">
              {numPages} {numPages === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
