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
        ink: {
          DEFAULT: '#0a0a0f',
          800: '#0f0f17',
          700: '#14141f',
          600: '#1b1b27',
        },
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
        'glow-cyan': '0 0 5px #00f0ff, 0 0 20px rgba(0,240,255,0.45)',
        'glow-cyan-lg': '0 0 8px #00f0ff, 0 0 32px rgba(0,240,255,0.55)',
        'glow-magenta': '0 0 5px #ff00e5, 0 0 20px rgba(255,0,229,0.45)',
        'glow-soft': '0 0 0 1px rgba(0,240,255,0.18), 0 8px 40px rgba(0,240,255,0.08)',
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
          'linear-gradient(to right, rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
