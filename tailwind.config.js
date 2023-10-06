module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  theme: {
    extend: {},
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}", "node_modules/preline/dist/*.js"],
  plugins: [require("preline/plugin")],
};
