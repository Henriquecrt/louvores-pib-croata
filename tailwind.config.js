/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#008000",
        "primary-hover": "#006400",
        "background-light": "#F0FFF0",
        "background-dark": "#0A1A0A",
        "text-main": "#1F2937",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}