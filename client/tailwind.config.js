/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mustard': '#fda403',
        'orange': '#e8751a',
        'pink': '#c51350',
      }
    },
  },
  plugins: [],
}