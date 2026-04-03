import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import istanbul from "vite-plugin-istanbul";
import path from "path";

function removeDataTestAttrs(): Plugin {
  return {
    name: "remove-data-test",
    enforce: "pre",
    apply: "build",
    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return;
      const result = code.replace(/\s+data-test=\{?"[^"]*"\}?/g, "");
      if (result === code) return;
      return { code: result, map: null };
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    removeDataTestAttrs(),
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
