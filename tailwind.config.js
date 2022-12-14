/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'link-color': '#0000EE'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
