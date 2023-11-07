import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

/// <reference types="vite-plugin-svgr/client" />

export default defineConfig(() => {
  return {
    define: {
      plugins: [react(), svgr()],
    },
  };
});
