/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '390px'
      },
      colors: {
        navy: '#06111f',
        ink: '#e7f8ff',
        mint: '#35e58b',
        cyan: '#38bdf8',
        solar: '#facc15',
        surface: '#0b253d',
        muted: '#9fb7c9',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(53, 229, 139, 0.20)',
        cyan: '0 24px 80px rgba(56, 189, 248, 0.18)',
        card: '0 24px 70px rgba(0, 0, 0, 0.28)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};
