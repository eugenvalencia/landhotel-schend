// WebP + Bildmaße erzeugen — für die <Pic>-Pipeline (site/components/Pic.astro).
// Jedes Bild in /public/{fotos,marquee,pakete,region,hero} bekommt eine .webp-Kopie
// (JPG/PNG bleiben als Fallback), und site/lib/foto-dims.json wird neu geschrieben
// (intrinsische Maße für die Galerie → kein Layout-Springen / CLS).
//
// AUSFÜHREN nach dem Hinzufügen neuer Bilder:  npm run images:webp
// (Sonst fehlt die .webp-Datei und die <source> im <picture> bricht.)
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMG_DIRS = ["public/fotos", "public/marquee", "public/pakete", "public/region", "public/hero"];
const RASTER = /\.(jpe?g|png)$/i;

let made = 0, srcBytes = 0, webpBytes = 0;
for (const rel of IMG_DIRS) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!RASTER.test(f)) continue;
    const src = path.join(dir, f);
    const out = src.replace(RASTER, ".webp");
    try {
      await sharp(src).webp({ quality: 80 }).toFile(out);
      made++; srcBytes += fs.statSync(src).size; webpBytes += fs.statSync(out).size;
    } catch (e) { console.warn("skip", rel + "/" + f, String(e).slice(0, 60)); }
  }
}

// Bildmaße aus /public/fotos (von der Galerie genutzt).
const fotosDir = path.join(ROOT, "public/fotos");
const dims = {};
for (const f of fs.readdirSync(fotosDir)) {
  if (!RASTER.test(f)) continue;
  try { const m = await sharp(path.join(fotosDir, f)).metadata(); dims["/fotos/" + f] = [m.width, m.height]; }
  catch {}
}
fs.writeFileSync(path.join(ROOT, "site/lib/foto-dims.json"), JSON.stringify(dims, null, 0));

const mb = (b) => (b / 1048576).toFixed(1) + " MB";
console.log(`WebP: ${made} Dateien  (${mb(srcBytes)} -> ${mb(webpBytes)}, -${Math.round((1 - webpBytes / srcBytes) * 100)}%)`);
console.log(`Bildmaße: ${Object.keys(dims).length} -> site/lib/foto-dims.json`);
