import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-display)'],
      },
      colors: {
        background: 'hsl(var(--color-background))',
        surface: {
          DEFAULT: 'hsl(var(--color-surface))',
          muted: 'hsl(var(--color-surface-muted))',
        },
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
        },
        accent: 'hsl(var(--color-accent))',
        ink: 'hsl(var(--color-ink))',
        'muted-ink': 'hsl(var(--color-muted-ink))',
      },
      fontSize: {
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '1rem',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      backgroundImage: {
        'gradient-brand': 'var(--gradient-page)',
        'gradient-cta': 'var(--gradient-cta)',
        'gradient-card': 'var(--gradient-card)',
      },
      spacing: {
        'agency-xs': 'var(--space-xs)',
        'agency-sm': 'var(--space-sm)',
        'agency-md': 'var(--space-md)',
        'agency-lg': 'var(--space-lg)',
        'agency-xl': 'var(--space-xl)',
      },
    },
  },
  plugins: [],
} satisfies Config;
