import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  server: {
    host: "0.0.0.0",
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@auth": path.resolve(__dirname, "./src/lib/features/auth"),
      "@components": path.resolve(__dirname, "./src/lib/components"),
      "@contexts": path.resolve(__dirname, "./src/lib/contexts"),
      "@hooks": path.resolve(__dirname, "./src/lib/hooks"),
      "@utils": path.resolve(__dirname, "./src/lib/utils"),
      "@schemas": path.resolve(__dirname, "./src/lib/schemas"),
      "@services": path.resolve(__dirname, "./src/lib/services"),
    },
  },
});
