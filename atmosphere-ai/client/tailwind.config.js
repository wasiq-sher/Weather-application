/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        atmosphere: {
          bg: '#080d1a',
          card: '#0e172a',
          cardHover: '#131e36',
          border: '#1e293b',
          cyan: '#38bdf8',
          teal: '#2dd4bf',
          purple: '#a855f7',
        },
      },
    },
  },
  plugins: [],
};
