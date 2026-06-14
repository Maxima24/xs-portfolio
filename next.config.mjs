/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM helpers; let Next transpile them.
  transpilePackages: ['three'],
  webpack: (config) => {
    // pdf.js (react-pdf) optionally requires node-canvas, which we don't need
    // in the browser — alias it away so the build doesn't try to resolve it.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
