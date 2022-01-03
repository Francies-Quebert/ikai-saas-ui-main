module.exports = {
  important: true,
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        primary: { color: "#41527d", light: "rgba(65, 82 ,125 , 40%);" },
      },
      backgroundColor: {
        primary: { color: "#41527d", light: "rgba(65, 82 ,125 , 20%);" },
      },
      borderColor: {
        primary: { color: "#41527d ", light: "rgba(65, 82 ,125 , 20%);" },
      },
    },
  },

  variants: {
    extend: { backgroundColor: [] },
  },
  plugins: [],
};
