import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-display)']
      },
      borderRadius: {
        '2xl': 'var(--radius-2xl)'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)'
      }
    }
  },
  plugins: []
} satisfies Config;
