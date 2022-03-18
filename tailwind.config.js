module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        equalize: {
          "0%": {
            height: "100%",
          },
          "20%": {
            height: "70%",
          },
          "40%": {
            height: "50%",
          },
          "60%": {
            height: "30%",
          },
          "80%": {
            height: "10%",
          },
          "100%": {
            height: "30%",
          },
        },
      },
      animation: {
        equalize: "equalize 4s linear alternate infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
