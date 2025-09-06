/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          500: '#0891b2',
          600: '#0e7490',
        },
        accent: {
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}