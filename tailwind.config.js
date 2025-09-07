/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-teal': "#005044",
        'teal-action': "#00A38A",
        'hover-teal-buttons': "#E6F7F5",
        'dashboard-bg': "#F0F7F4",
        'error-red': "#EF4444",
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'sora': ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
