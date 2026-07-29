/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
    },
    extend: {
      keyframes: {
        'gallery-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'hero-fade-up': {
          from: { opacity: '0', transform: 'translateY(25px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gallery-scroll': 'gallery-scroll 25s linear infinite',
        'hero-fade-up': 'hero-fade-up 0.9s ease',
      },
    },
  },
  plugins: [],
}