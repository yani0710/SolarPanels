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
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        heading: 'rgb(var(--c-heading) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        charcoal: '#111315',
        graphite: '#181B1F',
        panel: '#1F2630',
        solar: '#FF9F43',
        energy: '#FF9F43',
        sky: '#4FD1FF',
        warning: '#FFD166',
        danger: '#EF4444',
        mint: '#FF9F43',
        cyan: '#4FD1FF',
        navy: '#0F172A',
        ink: '#0F172A'
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.18), 0 16px 44px rgba(0,0,0,0.18)',
        'card-md': '0 20px 60px rgba(0,0,0,0.26)',
        glow: '0 0 30px rgba(255,159,67,0.24)',
        green: '0 6px 24px rgba(255,159,67,0.20)',
        cyan: '0 6px 26px rgba(79,209,255,0.18)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
};
