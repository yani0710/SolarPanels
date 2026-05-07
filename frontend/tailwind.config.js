/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '390px'
      },
      colors: {
        // New semantic tokens (light system)
        solar:   '#F59E0B',  // amber-400 — brand accent, solar
        energy:  '#16A34A',  // green-600 — CTA, success
        sky:     '#0EA5E9',  // sky-500   — info blue
        surface: '#F8FAFC',  // slate-50  — page background
        heading: '#0F172A',  // slate-900 — primary text
        muted:   '#64748B',  // slate-500 — secondary text
        border:  '#E2E8F0',  // slate-200 — borders
        warning: '#F59E0B',  // amber-400
        danger:  '#EF4444',  // red-500
        // Legacy aliases — kept for HeroVisual Three.js labels (do NOT use in new code)
        mint:    '#16A34A',  // remapped → energy green
        cyan:    '#0EA5E9',  // remapped → sky blue
        navy:    '#0F172A',  // remapped → heading dark
        ink:     '#0F172A',  // remapped → heading dark
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
