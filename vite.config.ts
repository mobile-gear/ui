import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import istanbul from "vite-plugin-istanbul";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react({
      plugins: isProduction
        ? [["@swc/plugin-react-remove-properties", { properties: ["^data-test$"] }]]
        : [],
    }),
    istanbul({
      include: "src/**/*.{ts,tsx}",
      exclude: ["node_modules", "cypress", "src/interfaces/**", "src/types/**"],
      cypress: true,
      requireEnv: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    watch: {
      ignored: ["**/coverage/**", "**/.nyc_output/**"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
