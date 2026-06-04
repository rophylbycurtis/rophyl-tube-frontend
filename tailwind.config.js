/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          450: '#f03040',
        },
        brand: {
          red: '#E8001D',
          redHover: '#ff1a35',
          redDark: '#b0001a',
          dark: '#0a0a0f',
          darker: '#060608',
          card: '#111118',
          cardHover: '#16161f',
          border: '#1e1e2e',
          muted: '#6b6b8a',
          text: '#e2e2f0',
          subtext: '#9090b0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 0, 29, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(232, 0, 29, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}