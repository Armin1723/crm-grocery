/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    /^bg-/, /^text-/, /^max-w-/, /^w-/
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors:{
        primary: '#fafafa',
        secondary: '#ffffff',
        sidebar: '#f4f2f8',
        accent: '#5d3fd3',
        accentDark: '#4c1d95',
      },
      screens:{
        tab: '520px'
      }
    },
  },
  plugins: ["@tailwindcss/a"],
}