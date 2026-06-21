import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm near-black base + elevation shades so panels read with depth.
        ink: {
          DEFAULT: '#0b0a0d',
          950: '#0b0a0d',
          900: '#0e0d12',
          850: '#131218',
          800: '#18161f',
          700: '#201e29',
          600: '#2a2734',
        },
        // Per-track accent, resolved from CSS vars set by body[data-track].
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        accent2: 'rgb(var(--accent-2-rgb) / <alpha-value>)',
        // Legacy fixed neon (still referenced by 3D hero hex); accent supersedes it in chrome.
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00e5',
          lime: '#aaff00',
        },
        muted: '#8a8aa3',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Per-track accent glows, softened ~40% vs the old neon (smaller blur + lower alpha).
        'glow-accent':
          '0 0 4px rgb(var(--accent-rgb) / 0.45), 0 0 16px rgb(var(--accent-rgb) / 0.20)',
        'glow-accent-lg':
          '0 0 6px rgb(var(--accent-rgb) / 0.5), 0 0 24px rgb(var(--accent-rgb) / 0.28)',
        'glow-soft':
          '0 0 0 1px rgb(var(--accent-rgb) / 0.12), 0 10px 40px rgb(var(--accent-rgb) / 0.06)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        countdown: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 12s ease infinite',
        countdown: 'countdown 6s linear forwards',
        fadeIn: 'fadeIn 0.45s ease both',
      },
      backgroundImage: {
        'grid-neon':
          'linear-gradient(to right, rgb(var(--accent-rgb) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--accent-rgb) / 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
