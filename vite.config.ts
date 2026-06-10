import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: false,
  },
  build: {
    // SaaS-Bundle (mode "saas") wird unter dist-astro/_saas eingebettet. Der
    // publicDir (fotos/fonts/hero, ~29 MB) liegt im Astro-Build bereits am Root
    // und wird absolut (/fotos/…) referenziert — also NICHT nochmal nach _saas
    // kopieren, sonst doppelt im Deploy.
    copyPublicDir: mode !== "saas",
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
