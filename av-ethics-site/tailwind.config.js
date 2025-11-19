/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,md}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}

