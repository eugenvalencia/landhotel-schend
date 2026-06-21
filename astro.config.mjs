// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// Schend → Astro SSG (DR-029 / SITE-COMPLIANCE § A0).
// Läuft ISOLIERT neben der bestehenden Vite/React-App:
//   - eigener srcDir (./site) statt ./src   → die React-App bleibt unberührt
//   - eigener outDir (./dist-astro) statt ./dist
//   - eigene PostCSS-Pipeline (unten)       → die geteilte Root-postcss.config.js
//     der Vite-App wird NICHT geerbt, kein Doppel-Tailwind
//   - publicDir bleibt ./public             → Fonts + Fotos werden 1:1 geteilt
// Stack-Wahl: Astro für öffentliche Seiten (Zero-JS-Default = bestes SEO/GEO,
// natives i18n-Routing). Dashboard + Booking bleiben React/Supabase.
export default defineConfig({
  site: "https://landhaus-schend.de",
  srcDir: "./site",
  outDir: "./dist-astro",
  publicDir: "./public",
  // Eine kanonische URL-Form: immer mit Trailing-Slash (= was Cloudflare Pages aus
  // ordner/index.html ausliefert). So treffen canonical + hreflang + interne Links die
  // 200-URL direkt statt eines 308-Redirects. localizedPath() hängt den Slash passend an.
  trailingSlash: "always",
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en", "fr", "nl"],
    routing: { prefixDefaultLocale: false },
  },
  // @astrojs/react bleibt installiert, wird aber erst in Stufe 3 (Booking-Island)
  // als Integration registriert — sonst landet die ungenutzte React-Runtime als
  // Orphan-Bundle im Build (Zero-JS-Default, DR-029).
  // noindex-Rechtsseiten (Impressum/Datenschutz/AGB) gehören NICHT in den Sitemap —
  // sonst widersprüchliches Signal (eingereicht, aber per Meta noindex).
  integrations: [
    sitemap({ filter: (page) => !/\/(impressum|datenschutz|agb)\/?$/.test(page) }),
  ],
  vite: {
    css: {
      // Eigene, explizite PostCSS-Pipeline mit der site-eigenen Tailwind-Config.
      // Ersetzt die automatische Erkennung der Root-postcss.config.js, damit die
      // Vite-App (src/) und diese Astro-Schicht (site/) sich nicht ins Gehege kommen.
      postcss: {
        plugins: [
          tailwindcss({ config: "./site/tailwind.config.cjs" }),
          autoprefixer(),
        ],
      },
    },
  },
});
