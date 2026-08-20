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

// Stufe je Bild — Standard 80, Ausnahmen hier eintragen.
//
// ⚠ Die Stufe gehört HIERHIN, nicht in eine von Hand nachkomprimierte Einzeldatei:
// dieser Lauf überschreibt jede .webp-Kopie, eine Handkorrektur wäre beim nächsten
// `npm run images:webp` wieder weg.
//
// /hero/schend-hero-poster.jpg — Poster hinter dem Hero-Video und zugleich das
// LCP-Element. PageSpeed (Mobil, 20.08.2026) meldete dafür 96,3 KiB mit „höhere
// Komprimierung". Gemessen gegen die Quelle (PSNR/RMSE über alle Bildpunkte):
//   q80/effort4 = 98,6 KiB  (Stand vorher)
//   q80/effort6 = 94,1 KiB · 38,69 dB
//   q72/effort6 = 75,7 KiB · 37,15 dB   ← gewählt
//   q65/effort6 = 69,4 KiB · 36,40 dB
// Ab ~36 dB ist der Unterschied bei Fotos im 1:1-Vergleich nicht mehr auszumachen;
// der Ausschnittsvergleich q80/q72/q65 bestätigte das. q72 lässt Reserve nach oben
// und spart trotzdem 23 % — das Poster ist auf Mobil das Standbild (dort läuft das
// Video bewusst nicht) und wird per object-cover ohnehin hochskaliert.
// effort 6 (statt sharps Standard 4) kostet nur Rechenzeit im Build, keine Qualität.
const WEBP_OPTS = {
  "public/hero/schend-hero-poster.jpg": { quality: 72, effort: 6 },
};
const WEBP_STANDARD = { quality: 80 };

let made = 0, srcBytes = 0, webpBytes = 0;
for (const rel of IMG_DIRS) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!RASTER.test(f)) continue;
    const src = path.join(dir, f);
    const out = src.replace(RASTER, ".webp");
    try {
      await sharp(src).webp(WEBP_OPTS[`${rel}/${f}`] ?? WEBP_STANDARD).toFile(out);
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
  // Home-Zimmer-Karten (galleryForRoomType[idx]) — Familienzimmer-Karte lud sonst
  // das Vollbild (Lighthouse: ~111 KiB unnötig auf einem ~440px-Slot).
  "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg",
  // Große Split-Sektionen (sizes ~50vw Desktop / 100vw Mobil)
  "/fotos/restaurant-speisesaal-mit-buffet-landhaus-schend.jpg",
  "/fotos/festsaal-50er-geburtstag-schwarz-gold-landhaus-schend-vulkaneifel.jpg",
  "/fotos/landhaus-schend-zeichnung-innenhof-historisch.jpg",
  "/fotos/festtafel-am-fenster-mit-gartenblick-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-rosen-landhaus-schend-vulkaneifel.jpg",
];
// Breitenleiter. ⚠ Die Lücke 640 → 1024 war bis 21.08.2026 der teuerste Posten
// unter „Bildübermittlung verbessern": ein Telefon mit 412 CSS-px und Pixeldichte
// 1,75 braucht 721 echte Bildpunkte — 640 reicht nicht, also nahm der Browser
// 1024 und lud rund 60 % zu viel. Lighthouse (Mobil, lokal gemessen) wies das für
// drei Bilder mit zusammen 64 KiB aus.
//   Speisesaal      1024 = 62,7 KiB → 768 = 40,2 KiB
//   Doppelzimmer    1024 = 76,5 KiB → 768 = 50,1 KiB
//   Familienzimmer  1024 = 51,6 KiB → 768 = 32,6 KiB
// Dieselbe Lücke klafft ein Stück weiter oben: heutige Telefone mit Pixeldichte 3
// und 390 CSS-px brauchen 1170 Bildpunkte und bekamen bisher 1536 statt 1280
// (Speisesaal 117,5 statt 87,7 KiB). Beide Sprossen kosten nur Dateien im Build,
// keinen Bildpunkt Qualität — die Auflösung passt danach besser zum Gerät.
const LADDER = [640, 768, 1024, 1280, 1536, 1920];
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

// Bildmaße aus ALLEN Bildordnern.
//
// ⚠ Bis zum 20.08.2026 stand hier nur `public/fotos`. Die WebP-Kopien wurden
// über alle IMG_DIRS erzeugt, die MASSE aber nur für einen davon. Folge: jedes
// Bild aus /marquee, /pakete, /region und /hero ging ohne width/height raus,
// der Browser konnte keinen Platz reservieren, und Lighthouse meldete auf der
// Startseite 24 Bilder ohne Maße (Layout-Sprung / CLS).
// Zwei Listen für dieselbe Sache, und nur eine wurde gepflegt.
const dims = {};
for (const rel of IMG_DIRS) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  const url = "/" + rel.replace(/^public\//, "");
  for (const f of fs.readdirSync(dir)) {
    if (!RASTER.test(f)) continue;
    try { const m = await sharp(path.join(dir, f)).metadata(); dims[url + "/" + f] = [m.width, m.height]; }
    catch {}
  }
}
fs.writeFileSync(path.join(ROOT, "site/lib/foto-dims.json"), JSON.stringify(dims, null, 0));

const mb = (b) => (b / 1048576).toFixed(1) + " MB";
console.log(`WebP: ${made} Dateien  (${mb(srcBytes)} -> ${mb(webpBytes)}, -${Math.round((1 - webpBytes / srcBytes) * 100)}%)`);
console.log(`Bildmaße: ${Object.keys(dims).length} -> site/lib/foto-dims.json`);
