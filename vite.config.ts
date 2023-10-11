import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig, loadEnv } from "vite";

/// <reference types="vite-plugin-svgr/client" />

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      plugins: [react(), svgr()],
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
