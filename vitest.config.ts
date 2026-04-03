import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./cypress/support/unit-setup.ts"],
    include: ["cypress/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    logHeapUsage: false,
    isolate: false,
    pool: 'threads',
    poolOptions: {
      threads: {
        isolate: false,
      },
    },
    coverage: {
      provider: "istanbul",
      reporter: ["json"],
      reportsDirectory: "coverage/unit",
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/main.tsx", "src/vite-env.d.ts", "src/interfaces/**", "src/types/**"],
      reportOnFailure: true,
    },
  },
});
