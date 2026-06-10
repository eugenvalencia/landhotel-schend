// Post-Build-Fix für den eingebetteten SaaS-Build (dist-astro/_saas).
//
// Die React-App wird mit `--base=/_saas/` gebaut, damit ihr JS/CSS-Bundle unter
// /_saas/assets/ korrekt auflöst. Vite prefixt dabei aber AUCH die absoluten
// Public-Pfade in der index.html (/fonts, /fotos, /favicon, /manifest, /icon …)
// auf /_saas/… — die existieren dort nicht (publicDir liegt am Astro-Root und
// wird absolut referenziert). Ergebnis sonst: 404 auf Fonts/Icons/Manifest.
//
// Fix: in der _saas/index.html alle /_saas/-Pfade AUSSER dem /_saas/assets/-Bundle
// wieder auf Root / zurücksetzen. Dann laden Fonts/Fotos/Icons aus dem Astro-Root,
// das Bundle bleibt unter /_saas/assets/. Kein 29-MB-Public-Duplikat im Deploy.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

// /_saas/ → /  (aber /_saas/assets/ unangetastet lassen, das ist das Bundle)
const PUBLIC_PATH = /\/_saas\/(?!assets\/)/g;

function fixFile(file) {
  if (!existsSync(file)) return null;
  const before = readFileSync(file, "utf8");
  const hits = (before.match(PUBLIC_PATH) || []).length;
  if (hits > 0) writeFileSync(file, before.replace(PUBLIC_PATH, "/"));
  return hits;
}

const indexFile = "dist-astro/_saas/index.html";
if (!existsSync(indexFile)) {
  console.error(`[fix-saas-base] ${indexFile} nicht gefunden — lief der SaaS-Build?`);
  process.exit(1);
}

let total = fixFile(indexFile) || 0;

// Auch im gebauten CSS: Vite prefixt absolute url()-Public-Pfade (z.B.
// mask-image: url(/schend-mark.png)) ebenfalls auf /_saas/ → 404. Zurücksetzen.
const assetsDir = "dist-astro/_saas/assets";
if (existsSync(assetsDir)) {
  for (const name of readdirSync(assetsDir)) {
    if (name.endsWith(".css")) total += fixFile(`${assetsDir}/${name}`) || 0;
  }
}

console.log(`[fix-saas-base] ${total} Public-Pfad(e) (index.html + CSS) auf Root zurückgesetzt.`);
