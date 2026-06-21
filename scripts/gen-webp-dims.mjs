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

// ── Responsive Breiten-Varianten (name-<w>.webp) ────────────────────────────
// Nur für die wirklich großflächigen Bilder (Vollbild-Heroes + Split-Sektionen):
// mobile Geräte (60-80% des Traffics) sollen NICHT das volle Desktop-Foto für
// einen 400px-Slot laden. Galerie-Thumbnails bleiben einspaltig (kein Eintrag).
// Geschrieben wird site/lib/responsive-widths.json → <Pic> liest das automatisch.
const RESPONSIVE_SRCS = [
  // Vollbild-Heroes (sizes ~100vw)
  "/fotos/gedeckter-tisch-mit-schnitzelteller-und-wein-landhaus-schend.jpg",
  "/fotos/maar-blick-mit-kindern-landhaus-schend.jpg",
  "/pakete/eifel-2.jpg",
  "/pakete/paket-a-0.jpg", "/pakete/paket-a-1.jpg",
  "/pakete/paket-b-0.jpg", "/pakete/paket-b-1.jpg", "/pakete/paket-b-2.jpg",
  // Zimmer-Detail-Heroes (room.gallery[0])
  "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg",
  "/fotos/suite-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
  // Große Split-Sektionen (sizes ~50vw Desktop / 100vw Mobil)
  "/fotos/restaurant-speisesaal-mit-buffet-landhaus-schend.jpg",
  "/fotos/festsaal-50er-geburtstag-schwarz-gold-landhaus-schend-vulkaneifel.jpg",
  "/fotos/landhaus-schend-zeichnung-innenhof-historisch.jpg",
  "/fotos/festtafel-am-fenster-mit-gartenblick-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-rosen-landhaus-schend-vulkaneifel.jpg",
];
const LADDER = [640, 1024, 1536, 1920];
const respWidths = {};
let respMade = 0;
for (const url of RESPONSIVE_SRCS) {
  const src = path.join(ROOT, "public", url);
  if (!fs.existsSync(src)) { console.warn("responsive: fehlt", url); continue; }
  let meta;
  try { meta = await sharp(src).metadata(); } catch { continue; }
  const intrinsic = meta.width ?? 0;
  // Nie hochskalieren: nur Breiten < Original; wenn Original kleiner als die
  // größte Stufe, intrinsische Breite als oberste Stufe ergänzen.
  const widths = LADDER.filter((w) => w < intrinsic);
  if (intrinsic && widths[widths.length - 1] !== intrinsic && intrinsic <= LADDER[LADDER.length - 1]) widths.push(intrinsic);
  const base = src.replace(RASTER, "");
  for (const w of widths) {
    try {
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${base}-${w}.webp`);
      respMade++;
    } catch (e) { console.warn("responsive skip", url, w, String(e).slice(0, 40)); }
  }
  if (widths.length) respWidths[url] = widths;
}
fs.writeFileSync(path.join(ROOT, "site/lib/responsive-widths.json"), JSON.stringify(respWidths, null, 0));
console.log(`Responsive: ${respMade} Breiten-Dateien für ${Object.keys(respWidths).length} Bilder -> responsive-widths.json`);

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
