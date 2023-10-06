module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  theme: {
    extend: {},
  },
  content: ["node_modules/preline/dist/*.js"],
  plugins: [require("preline/plugin")],
};
