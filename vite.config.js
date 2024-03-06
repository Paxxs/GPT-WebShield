// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      formats: ["cjs", "es", "iife", "umd"],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "gptGuard",
      // the proper extensions will be added
      fileName: "hijack",
    },
  },
});
