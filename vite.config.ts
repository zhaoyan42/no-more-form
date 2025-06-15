import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/validation": fileURLToPath(
        new URL("./src/validation", import.meta.url),
      ),
      "@/pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@/assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
    },
  },
});
