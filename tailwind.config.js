/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        luna: {
          rose:       '#C4798D',
          'rose-deep':'#A85E72',
          blush:      '#E8B4BC',
          'blush-soft':'#F5DDE0',
          cream:      '#FAF5F2',
          'cream-dark':'#F3EBE6',
          sage:       '#8FA895',
          'sage-light':'#B8CBBF',
          text:       '#3D3035',
          muted:      '#9E8E8E',
          card:       '#FFFFFF',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':  'scaleIn 0.2s ease-out',
        'tab-in':    'tabIn 0.3s ease-out',
        'float':     'float 4s ease-in-out infinite',
        'breathe':   'breathe 4s ease-in-out infinite',
        'petal-fall':'petalFall 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        scaleIn:   { from: { transform: 'scale(0.95)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        tabIn:     { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        breathe:   { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
        petalFall: { '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' }, '20%': { opacity: '1' }, '100%': { transform: 'translateY(40px) rotate(30deg)', opacity: '0' } },
      },
      boxShadow: {
        'luna-sm':  '0 2px 12px rgba(196,121,141,0.10)',
        'luna':     '0 4px 24px rgba(196,121,141,0.14)',
        'luna-lg':  '0 8px 40px rgba(196,121,141,0.18)',
        'luna-xl':  '0 16px 60px rgba(196,121,141,0.22)',
        'card':     '0 2px 16px rgba(61,48,53,0.06)',
        'card-lg':  '0 6px 32px rgba(61,48,53,0.09)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
