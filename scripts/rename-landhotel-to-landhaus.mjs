// Einmal-Skript: Foto-Dateinamen + alle Referenzen von "landhotel" auf "landhaus"
// umstellen (Marken-Konsistenz, Eugen 16.06.). Sicher: ersetzt NUR innerhalb von
// Bild-Dateinamen (…landhotel….{jpg,webp,png,avif}). Lässt unberührt:
//   - Facebook-Handle facebook.com/Landhotel.Schend  (Großschreibung, kein Bild)
//   - Cloudflare-Infra  landhotel-schend.pages.dev    (kein Bild)
//   - Repo-/Projektname landhotel-schend               (kein Bild)
import { readdirSync, renameSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const FOTOS = join(ROOT, "public", "fotos");

// 1) Physische Dateien umbenennen (jpg + webp + alles mit "landhotel")
let renamed = 0;
for (const name of readdirSync(FOTOS)) {
  if (name.includes("landhotel")) {
    renameSync(join(FOTOS, name), join(FOTOS, name.replace(/landhotel/g, "landhaus")));
    renamed++;
  }
}
console.log(`[1] Foto-Dateien umbenannt: ${renamed}`);

// 2) foto-dims.json (enthält ausschließlich Bildpfade)
const dimsPath = join(ROOT, "site", "lib", "foto-dims.json");
if (existsSync(dimsPath)) {
  const before = readFileSync(dimsPath, "utf8");
  const after = before.replace(/landhotel/g, "landhaus");
  if (before !== after) { writeFileSync(dimsPath, after); console.log("[2] foto-dims.json aktualisiert"); }
}

// 3) Code-Referenzen — NUR Bild-Dateinamen ersetzen (case-sensitive, lowercase).
const IMG_RE = /[\w/.-]*landhotel[\w/.-]*\.(?:jpe?g|png|webp|avif)/g;
const exts = new Set([".ts", ".tsx", ".astro", ".js", ".jsx", ".mjs", ".json", ".html"]);
let filesChanged = 0, refsChanged = 0;
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", "dist-astro", ".git"].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!exts.has(extname(e.name))) continue;
    if (p === dimsPath) continue; // schon in Schritt 2
    const src = readFileSync(p, "utf8");
    let n = 0;
    const out = src.replace(IMG_RE, (m) => { n++; return m.replace(/landhotel/g, "landhaus"); });
    if (n > 0) { writeFileSync(p, out); filesChanged++; refsChanged += n; }
  }
}
for (const d of ["site", "src", "public"]) walk(join(ROOT, d));
console.log(`[3] Code-Dateien geändert: ${filesChanged}, Bild-Referenzen: ${refsChanged}`);
