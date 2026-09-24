module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#3b5cf0",
          600: "#2f49d6",
          700: "#263ab0",
        },
      },
    },
  },
  plugins: [],
};
