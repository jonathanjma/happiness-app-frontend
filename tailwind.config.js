module.exports = {
  theme: {
    fontSize: {
      /* default design font sizes and line heights */
      sm: ["0.875rem", "1.5rem"] /* label */,
      base: ["1rem", "1.5rem"] /* body */,
      lg: ["1.25rem", "1.5rem"] /* h5 */,
      xl: ["1.5rem", "2rem"] /* h4 */,
      "2xl": ["1.75rem", "2.25rem"] /* h3 */,
      "3xl": ["2rem", "2.25rem"] /* h2 */,
      "4xl": ["2.25rem", "2.75rem"] /* h1 */,
    },
    colors: {
      black: "#212121",
      dark_gray: "#575F68",
      light_gray: "#808080",
      light_yellow: "#F6F0E0",
      "gray-50": "#F5F5F5",
      "gray-100": "#E5E5E5",
      "gray-200": "#E4E0E0",
      "gray-400": "#808080",
      medium_yellow: "#F6E2AE",
      yellow: "#F0CF78",
      secondary: "#664810",
      transparent: "rgba(255,255,255,0)",
      white: "#FFFFFF",
      brand_off_white: "#FAFAFA",
    },
    extend: {
      padding: {
        4.5: "18px",
      },
      width: {
        2.5: "10px",
      },
      height: {
        0.25: "1px",
        50: "200px",
      },
      borderWidth: {
        1: "1px",
      },
      gap: {
        0.25: "1px",
      },
      margin: {
        0.25: "1px",
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}", "node_modules/preline/dist/*.js"],
  plugins: [require("preline/plugin")],
};
