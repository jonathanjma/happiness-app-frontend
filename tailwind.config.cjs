module.exports = {
  theme: {
    fontSize: {
      /* default design font sizes and line heights */
      xs: ["0.75rem", "1rem"] /* xs */,
      sm: ["0.875rem", "1.5rem"] /* label */,
      base: ["1rem", "1.5rem"] /* body */,
      lg: ["1.25rem", "1.5rem"] /* h5 */,
      xl: ["1.5rem", "2rem"] /* h4 */,
      "2xl": ["1.75rem", "2.25rem"] /* h3 */,
      "3xl": ["2rem", "2.25rem"] /* h2 */,
      "4xl": ["2.25rem", "2.75rem"] /* h1 */
    },
    colors: {
      "gray-50": "#F5F5F5",
      "gray-100": "#E5E5E5",
      "gray-200": "#E4E0E0",
      "gray-300": "#D5D5D5",
      "gray-400": "#808080",
      "gray-600": "#575F68",
      "gray-800": "#212121",
      light_yellow: "#F7EFD7",
      medium_yellow: "#F6E2AE",
      yellow: "#F0CF78",
      secondary: "#664810",
      transparent: "rgba(255,255,255,0)",
      white: "#FFFFFF",
      brand_off_white: "#FAFAFA"
    },
    extend: {
      padding: {
        4.5: "18px"
      },
      width: {
        2.5: "10px"
      },
      height: {
        0.25: "1px",
        50: "200px"
      },
      borderWidth: {
        1: "1px",
        1.5: "1.5px"
      },
      gap: {
        0.25: "1px"
      },
      margin: {
        0.25: "1px"
      },
      boxShadow: {
        md1: "0px 4px 16px 0px rgba(0, 0, 0, 0.12)",
        md2: "0px 2px 20px 0px rgba(0, 0, 0, 0.15)"
      }
    }
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}", "node_modules/preline/dist/*.js"],
  plugins: [require("preline/plugin")]
};
