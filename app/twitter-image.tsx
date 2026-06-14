// Reuse the same generated PNG for Twitter/X summary_large_image.
// Route config must be literal exports (Next can't trace re-exported values),
// so we redeclare them and re-export only the renderer.
export { default } from './opengraph-image';

export const runtime = 'edge';
export const alt = 'Faith Popoola — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
