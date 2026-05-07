/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '390px'
      },
      colors: {
        // Semantic tokens — driven by CSS variables so they auto-switch in dark mode
        // Usage: bg-surface, text-heading, text-muted, border-border
        // Opacity modifier works: bg-surface/50 → rgb(var(--c-surface) / 0.5)
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        heading: 'rgb(var(--c-heading) / <alpha-value>)',
        muted:   'rgb(var(--c-muted)   / <alpha-value>)',
        border:  'rgb(var(--c-border)  / <alpha-value>)',
        // Brand colours — fixed regardless of theme
        solar:   '#F59E0B',
        energy:  '#16A34A',
        sky:     '#0EA5E9',
        warning: '#F59E0B',
        danger:  '#EF4444',
        // Legacy aliases — kept for HeroVisual Three.js labels (do NOT use in new code)
        mint:    '#16A34A',
        cyan:    '#0EA5E9',
        navy:    '#0F172A',
        ink:     '#0F172A',
      },
      boxShadow: {
        card:     '0 1px 3px rgba(15,23,42,0.08), 0 10px 28px rgba(15,23,42,0.06)',
        'card-md':'0 12px 36px rgba(15,23,42,0.12)',
        glow:     '0 0 24px rgba(245,158,11,0.25)',  // amber glow
        green:    '0 4px 20px rgba(22,163,74,0.20)',
        cyan:     '0 4px 20px rgba(14,165,233,0.18)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    }
  },
  plugins: []
};
