/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-app': 'var(--bg-app)',
        'surface': 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'border-color': 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'brand': {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          hover: 'var(--brand-hover)',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6d5dfb',
          700: '#5b4bf0',
          800: '#4c3ed8',
          900: '#3c30ad',
        },
        'accent': {
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -10px rgba(109, 93, 251, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'card-hover-dark': '0 12px 30px -10px rgba(139, 124, 255, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
