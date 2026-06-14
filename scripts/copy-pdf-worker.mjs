// Copies the installed pdf.js worker into /public so it is served as a static
// asset and stays version-matched to pdfjs-dist. Runs automatically before
// `dev` and `build` (see package.json predev/prebuild). The component points
// pdfjs.GlobalWorkerOptions.workerSrc at '/pdf.worker.min.mjs'.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

try {
  // Resolve the worker relative to the installed pdfjs-dist package.
  const pkg = require.resolve('pdfjs-dist/package.json');
  const src = join(dirname(pkg), 'build', 'pdf.worker.min.mjs');
  const destDir = join(process.cwd(), 'public');
  const dest = join(destDir, 'pdf.worker.min.mjs');

  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, dest);
  console.log(`[pdf-worker] copied ${src} -> ${dest}`);
} catch (err) {
  console.error('[pdf-worker] failed to copy pdf.js worker:', err.message);
  process.exit(1);
}
