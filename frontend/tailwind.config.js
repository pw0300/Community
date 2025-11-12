/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e6fffb',
          100: '#b3fff3',
          200: '#80ffeb',
          300: '#4dfbe1',
          400: '#26e8d1',
          500: '#14b8a6',
          600: '#0f9d8d',
          700: '#0c7f72',
          800: '#0b665c',
          900: '#094f48',
        },
        amber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'slate-950': '#0f172a',
      },
      fontFamily: {
        display: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 50px -20px rgba(15, 118, 110, 0.45)',
      },
    },
  },
  plugins: [],
}
