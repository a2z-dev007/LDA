/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C4517A",
        dark: "#1C1B2E",
        light: "#FAF0F4",
        day1: "#FFB347",
        day2: "#77DD77",
        day3: "#89CFF0",
        day4: "#B19CD9",
        day5: "#C4517A",
      },
      fontFamily: {
        playfair: ["PlayfairDisplay-Regular"],
        "playfair-bold": ["PlayfairDisplay-Bold"],
        "playfair-italic": ["PlayfairDisplay-Italic"],
        inter: ["Inter-Regular"],
        "inter-bold": ["Inter-Bold"],
      },
    },
  },
  plugins: [],
}
