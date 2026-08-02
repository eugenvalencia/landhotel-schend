// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { execFileSync } from "node:child_process";

/**
 * Änderungsdatum je Seite für `lastmod` in der Sitemap.
 *
 * ⚠ Warum das zählt: Am 02.08.2026 gemessen — die Sitemap führte 76 URLs und
 * NULL `lastmod`-Einträge. Genau daran entscheidet Google, welche Seiten es neu
 * abholt. Ohne das Feld muss es raten, und es rät konservativ; eine Änderung
 * wie ein neues H1 wird dann Wochen später bemerkt statt Tage.
 *
 * ⚠ Es wird das echte Git-Datum der INHALTSQUELLE benutzt, nicht das
 * Build-Datum. Sonst trüge nach jedem Deploy jede der 76 Seiten das heutige
 * Datum — das ist gegenüber Google schlicht unwahr, und wer alles als neu
 * meldet, meldet nichts. Seiten ohne bekannte Quelle bekommen KEIN lastmod;
 * eine fehlende Angabe ist besser als eine erfundene.
 */
function gitDatum(pfad) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cI", "--", pfad], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return d || null;
  } catch {
    return null; // kein git (z. B. im Container) → lieber gar kein Datum
  }
}

/**
 * ⚠ Warnt, wenn die Git-Historie abgeschnitten ist (flacher Klon).
 *
 * Ohne volle Historie findet `git log` für JEDE Datei nur den einen geholten
 * Commit — alle Seiten bekommen dann denselben Tag, nämlich den des Deploys.
 * Die Sitemap sieht dabei völlig in Ordnung aus: 76 Einträge, 76 Daten. Nur
 * sind sie alle falsch, und Google lernt „alles ändert sich täglich", was das
 * Signal wertlos macht.
 *
 * Genau das ist am 02.08.2026 passiert (GitHub Actions holt standardmäßig
 * einen Commit). Der Build meldete nichts. Deshalb diese laute Warnung —
 * ein Fehler, der nur an der ausgelieferten Datei sichtbar wird, muss beim
 * Bauen schreien. → [[methode-waechter-der-immer-rot-leuchtet]]
 */
function historiePruefen() {
  try {
    const flach = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (flach === "true") {
      console.warn(
        "\n\x1b[33m\x1b[1m⚠ Flacher Git-Klon — die lastmod-Daten der Sitemap werden ALLE gleich sein.\x1b[0m\n" +
        "  Abhilfe in .github/workflows/deploy-cloudflare.yml:\n" +
        "    - uses: actions/checkout@v6\n" +
        "      with:\n" +
        "        fetch-depth: 0\n",
      );
    }
  } catch { /* kein git — dann gibt gitDatum() ohnehin null zurück */ }
}
historiePruefen();

/**
 * Seitenpfad → die Datei(en), die den Inhalt dieser Seite bestimmen.
 *
 * ⚠ Die Inhaltsdateien heißen DEUTSCH (`zimmer.ts`, nicht `rooms.ts`). Beim
 * ersten Versuch stand hier `rooms.ts` — die Datei gibt es nicht, und alle
 * 16 Zimmerseiten bekamen still kein Datum. Der Fehler fiel nur auf, weil die
 * Gegenprobe die Zimmerseiten einzeln ausgab. Wer nur die Gesamtzahl prüft,
 * sieht „24 mit lastmod" und hält das für Erfolg.
 *
 * Reihenfolge zählt: die erste passende Regel gewinnt. Spezifische Pfade
 * (Detailseiten) stehen deshalb VOR den allgemeinen Übersichtsseiten.
 */
const QUELLE = [
  [/^\/(en\/|fr\/|nl\/)?$/, ["site/i18n/content/home.ts", "site/components/pages/HomePage.astro"]],
  [/\/restaurant\/?$/, ["site/i18n/content/restaurant.ts", "site/components/pages/RestaurantPage.astro"]],
  [/\/zimmer\//, ["site/i18n/content/zimmer.ts", "site/components/pages/ZimmerDetailPage.astro"]],
  [/\/zimmer\/?$/, ["site/i18n/content/zimmer.ts"]],
  [/\/pakete\//, ["site/i18n/content/pakete.ts", "site/components/pages/PaketeDetailPage.astro"]],
  [/\/pakete\/?$/, ["site/i18n/content/pakete.ts", "site/components/pages/PaketeListPage.astro"]],
  [/\/urlaubsregion\/?$/, ["site/i18n/content/urlaubsregion.ts", "site/components/pages/RegionPage.astro"]],
  [/\/ueber-uns\/?$|\/about\/?$/, ["site/i18n/content/ueber-uns.ts", "site/components/pages/AboutPage.astro"]],
  [/\/anfrage\/?$/, ["site/i18n/content/anfrage.ts", "site/components/pages/AnfragePage.astro"]],
  [/\/galerie\/?$/, ["site/i18n/content/galerie.ts", "site/components/pages/GalleryPage.astro"]],
  [/\/faq\/?$/, ["site/i18n/content/faq.ts", "site/components/pages/FaqPage.astro"]],
  [/\/bildnachweis\/?$/, ["site/components/pages/BildnachweisPage.astro"]],
  [/\/barrierefreiheit\/?$/, ["site/i18n/content/legal"]],
];

/** Neuestes Datum aller Quellen einer Seite — die Seite ist so aktuell wie ihr jüngster Teil. */
function lastmodFuer(url) {
  const pfad = new URL(url).pathname;
  for (const [muster, dateien] of QUELLE) {
    if (!muster.test(pfad)) continue;
    const daten = dateien.map(gitDatum).filter(Boolean).sort();
    return daten.length ? daten[daten.length - 1] : undefined;
  }
  return undefined;
}

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
  // Kritisches CSS direkt ins <head> inlinen statt als eigene render-blockierende
  // Datei. Lighthouse flaggte Layout.css als render-blocking (~600 ms auf langsamem
  // 4G) → verzögerte den LCP (Hero-Poster malt erst nach CSS-Parse). Inline = kein
  // Extra-Roundtrip vor dem ersten Paint; HTML wird per gzip/brotli (Cloudflare)
  // komprimiert (~13 KB on-the-wire). Bessere LCP/FCP.
  build: { inlineStylesheets: "always" },
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
    sitemap({
      filter: (page) => !/\/(impressum|datenschutz|agb)\/?$/.test(page),
      // lastmod aus dem Git-Datum der Inhaltsquelle — siehe Erklärung oben.
      serialize: (eintrag) => {
        const d = lastmodFuer(eintrag.url);
        if (d) eintrag.lastmod = d;
        return eintrag;
      },
    }),
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
