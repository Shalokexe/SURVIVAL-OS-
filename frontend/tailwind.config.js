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
        survival: {
          bg: '#0a0d12',
          card: '#121720',
          border: '#1f2937',
          accent: '#e11d48', // Emergency red
          amber: '#f59e0b',  // Warning amber
          emerald: '#10b981',// Safe green
          cyan: '#06b6d4',   // Water cyan
          purple: '#a855f7', // Medical purple
        }
      }
    },
  },
  plugins: [],
}
