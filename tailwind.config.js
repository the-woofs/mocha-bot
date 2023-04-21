/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
