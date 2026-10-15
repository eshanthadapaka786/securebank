/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aithos: {
          dark: '#0B192C',
          navy: '#1E3E62',
          blue: '#0284C7',
          lightBlue: '#38BDF8',
          surface: '#FFFFFF',
          bg: '#F0F4F8',
          border: '#DDE5ED',
          card: '#F8FAFC',
          muted: '#64748B',
        }
      },
      boxShadow: {
        'clay-card': '8px 8px 18px #d1d9e6, -8px -8px 18px #ffffff',
        'clay-card-hover': '12px 12px 24px #cbd5e1, -12px -12px 24px #ffffff',
        'clay-inset': 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
        'clay-btn': '5px 5px 12px #c5d0de, -5px -5px 12px #ffffff',
        'clay-btn-active': 'inset 3px 3px 6px #bcc9d9, inset -3px -3px 6px #ffffff',
        'clay-glow-blue': '0 0 20px rgba(2, 132, 199, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
