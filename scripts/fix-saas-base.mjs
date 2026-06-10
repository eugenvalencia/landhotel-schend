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
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const file = "dist-astro/_saas/index.html";
if (!existsSync(file)) {
  console.error(`[fix-saas-base] ${file} nicht gefunden — lief der SaaS-Build?`);
  process.exit(1);
}

const before = readFileSync(file, "utf8");
// /_saas/ → /  (aber /_saas/assets/ unangetastet lassen)
const after = before.replace(/\/_saas\/(?!assets\/)/g, "/");
writeFileSync(file, after);

const fixed = (before.match(/\/_saas\/(?!assets\/)/g) || []).length;
console.log(`[fix-saas-base] ${fixed} Public-Pfad(e) in ${file} auf Root zurückgesetzt.`);
