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
          DEFAULT: '#7A3283',
          light: '#9e4ba8',
          dark: '#592261',
        },
        secondary: {
          DEFAULT: '#85CD7C',
          light: '#addca7',
          dark: '#62ac58',
        },
        background: '#FAF9F6', // Off-white for minimal UI
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
