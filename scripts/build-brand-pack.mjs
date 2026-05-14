// Build the Schend brand pack: combined logo (building drawing + wordmark
// + subtitle) in two layouts (horizontal, stacked), three colours
// (black, white, cream), exported as SVG / PNG / JPG and zipped for download.
//
// Text is converted to SVG paths via opentype.js so the result renders
// identically everywhere, regardless of which fonts the recipient has.
//
// Run: node scripts/build-brand-pack.mjs

import sharp from "sharp";
import opentype from "opentype.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const archiver = require("archiver"); // CJS-only, no default ESM export
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import path from "node:path";

// ─── Config ──────────────────────────────────────────────────────────────────

const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  cream: "#F1ECE5", // hsl(38 30% 92%) — Schend dark-mode foreground
};

const PNG_SIZES = [256, 512, 1024, 2048];
const JPG_SIZES = [1024, 2048];
const JPG_COLORS = ["black", "cream"]; // white-on-white JPG makes no sense

const BUILD_DIR = "dist/brand-pack/landhotel-schend-brand";
const ZIP_OUT_DIR = "D:/CONEXA DIGITAL/Hotel Schend/Brand Pack";
const ZIP_NAME = "landhotel-schend-brand-2026-05-14.zip";

// Source assets
const BUILDING_SVG_PATH = "public/schend-logo-black.svg";
const BUILDING_PNG_PATH = "D:/CONEXA DIGITAL/Hotel Schend/Logo/png/black/hotel-logo-black-2048.png";

// Fonts (parsed once)
const cormorantBuf = await readFile("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff");
const interBuf = await readFile("node_modules/@fontsource/inter/files/inter-latin-400-normal.woff");
const cormorant = opentype.parse(cormorantBuf.buffer.slice(cormorantBuf.byteOffset, cormorantBuf.byteOffset + cormorantBuf.byteLength));
const inter = opentype.parse(interBuf.buffer.slice(interBuf.byteOffset, interBuf.byteOffset + interBuf.byteLength));

console.log("Fonts loaded — Cormorant glyphs:", cormorant.glyphs.length, "Inter glyphs:", inter.glyphs.length);

// ─── Building drawing helpers ────────────────────────────────────────────────

const buildingSvgRaw = await readFile(BUILDING_SVG_PATH, "utf8");
const buildingPng2048 = await readFile(BUILDING_PNG_PATH);

/**
 * Re-render the building drawing in a given colour and return a base64-encoded
 * PNG data URI. We re-tint the source greyscale-on-transparent PNG by replacing
 * the colour channel via sharp's recombine pipeline.
 */
async function buildingDataUri(color, height = 1200) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Resize the black source PNG to the target height first so the colour
  // canvas underneath has matching dimensions for dest-in compositing.
  const resized = await sharp(buildingPng2048).resize({ height }).png().toBuffer();
  const meta = await sharp(resized).metadata();

  // Build a solid-colour canvas, then mask it with the resized building PNG:
  // dest-in keeps the canvas pixel only where the source PNG has alpha — i.e.
  // only the building shape stays, in the chosen colour, on transparent.
  const tinted = await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  })
    .composite([{ input: resized, blend: "dest-in" }])
    .png()
    .toBuffer();

  return {
    uri: `data:image/png;base64,${tinted.toString("base64")}`,
    width: meta.width,
    height: meta.height,
    aspectRatio: meta.width / meta.height,
  };
}

// ─── Text-to-path helper ─────────────────────────────────────────────────────

/**
 * Render text via opentype.js as an SVG <path> d= string. Letter-spacing in em.
 */
function textPath(font, text, x, y, fontSize, letterSpacingEm = 0) {
  if (letterSpacingEm === 0) {
    return font.getPath(text, x, y, fontSize).toPathData(2);
  }
  // opentype.js getPath doesn't support letter-spacing natively; render glyph
  // by glyph and advance the x cursor by glyph advance + tracking.
  let cursor = x;
  const tracking = letterSpacingEm * fontSize;
  const combined = new opentype.Path();
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const path = glyph.getPath(cursor, y, fontSize);
    combined.extend(path);
    cursor += (glyph.advanceWidth / font.unitsPerEm) * fontSize + tracking;
  }
  return { d: combined.toPathData(2), width: cursor - x };
}

function textWidth(font, text, fontSize, letterSpacingEm = 0) {
  let w = 0;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    w += (glyph.advanceWidth / font.unitsPerEm) * fontSize;
  }
  return w + letterSpacingEm * fontSize * (text.length - 1);
}

// ─── Layout: horizontal ──────────────────────────────────────────────────────

async function buildHorizontal(color) {
  const padding = 90;
  const buildingHeight = 380;
  const building = await buildingDataUri(color, buildingHeight * 2.4); // render at 2x for crispness
  const buildingWidth = buildingHeight * building.aspectRatio;
  const gap = 80;
  const textX = padding + buildingWidth + gap;

  const titleSize = 220;
  const subtitleSize = 52;
  const subtitleTracking = 0.18; // em

  const title = textPath(cormorant, "Landhotel Schend", textX, 0, titleSize, 0);
  const titleD = title.toPathData ? title.toPathData(2) : title; // string when no tracking
  const titleW = textWidth(cormorant, "Landhotel Schend", titleSize, 0);

  const subtitleStr = "IHR FAMILIENHOTEL IN IMMERATH  |  VULKANEIFEL";
  const subtitle = textPath(inter, subtitleStr, textX, 0, subtitleSize, subtitleTracking);
  const subtitleD = subtitle.d;
  const subtitleW = subtitle.width;

  const totalWidth = textX + Math.max(titleW, subtitleW) + padding;
  const totalHeight = padding + buildingHeight + padding;

  // Vertically centre the text block within the building height
  const textBlockHeight = titleSize + 60 + subtitleSize;
  const textTop = padding + (buildingHeight - textBlockHeight) / 2;
  const titleY = textTop + titleSize * 0.85; // baseline
  const subtitleY = titleY + subtitleSize * 0.6 + 70;

  // Re-issue title path at correct y
  const titleFinalD = cormorant.getPath("Landhotel Schend", textX, titleY, titleSize).toPathData(2);
  const subtitleFinal = textPath(inter, subtitleStr, textX, subtitleY, subtitleSize, subtitleTracking);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth.toFixed(0)} ${totalHeight.toFixed(0)}" width="${totalWidth.toFixed(0)}" height="${totalHeight.toFixed(0)}">
  <image href="${building.uri}" x="${padding}" y="${padding}" width="${buildingWidth.toFixed(0)}" height="${buildingHeight}" preserveAspectRatio="xMidYMid meet"/>
  <path d="${titleFinalD}" fill="${color}"/>
  <path d="${subtitleFinal.d}" fill="${color}"/>
</svg>`;
}

// ─── Layout: stacked ─────────────────────────────────────────────────────────

async function buildStacked(color) {
  const padding = 90;
  const buildingHeight = 360;
  const building = await buildingDataUri(color, buildingHeight * 2.4);
  const buildingWidth = buildingHeight * building.aspectRatio;

  const titleSize = 200;
  const subtitleSize = 48;
  const subtitleTracking = 0.18;

  const subtitleStr = "IHR FAMILIENHOTEL IN IMMERATH  |  VULKANEIFEL";

  const titleW = textWidth(cormorant, "Landhotel Schend", titleSize, 0);
  const subtitleW = textWidth(inter, subtitleStr, subtitleSize, subtitleTracking);

  const contentWidth = Math.max(buildingWidth, titleW, subtitleW);
  const totalWidth = contentWidth + padding * 2;
  const gap1 = 70; // building → title
  const gap2 = 50; // title → subtitle
  const totalHeight =
    padding + buildingHeight + gap1 + titleSize + gap2 + subtitleSize + padding;

  const buildingX = (totalWidth - buildingWidth) / 2;
  const titleX = (totalWidth - titleW) / 2;
  const subtitleX = (totalWidth - subtitleW) / 2;

  const titleY = padding + buildingHeight + gap1 + titleSize * 0.85;
  const subtitleY = titleY + gap2 + subtitleSize * 0.6;

  const titleD = cormorant.getPath("Landhotel Schend", titleX, titleY, titleSize).toPathData(2);
  const subtitleFinal = textPath(inter, subtitleStr, subtitleX, subtitleY, subtitleSize, subtitleTracking);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth.toFixed(0)} ${totalHeight.toFixed(0)}" width="${totalWidth.toFixed(0)}" height="${totalHeight.toFixed(0)}">
  <image href="${building.uri}" x="${buildingX.toFixed(1)}" y="${padding}" width="${buildingWidth.toFixed(0)}" height="${buildingHeight}" preserveAspectRatio="xMidYMid meet"/>
  <path d="${titleD}" fill="${color}"/>
  <path d="${subtitleFinal.d}" fill="${color}"/>
</svg>`;
}

// ─── Build pipeline ──────────────────────────────────────────────────────────

console.log(`Cleaning ${BUILD_DIR}…`);
if (existsSync(BUILD_DIR)) await rm(BUILD_DIR, { recursive: true });
await mkdir(BUILD_DIR, { recursive: true });

const layouts = [
  { name: "horizontal", build: buildHorizontal },
  { name: "stacked", build: buildStacked },
];

for (const layout of layouts) {
  for (const [colorName, hex] of Object.entries(COLORS)) {
    console.log(`\n  ${layout.name}/${colorName}`);
    const svg = await layout.build(hex);

    // SVG
    const svgDir = path.join(BUILD_DIR, layout.name, "svg");
    await mkdir(svgDir, { recursive: true });
    const svgPath = path.join(svgDir, `schend-${layout.name}-${colorName}.svg`);
    await writeFile(svgPath, svg);
    console.log(`    SVG  ${svgPath}`);

    // PNGs
    const pngDir = path.join(BUILD_DIR, layout.name, "png");
    await mkdir(pngDir, { recursive: true });
    for (const sz of PNG_SIZES) {
      const out = path.join(pngDir, `schend-${layout.name}-${colorName}-${sz}.png`);
      await sharp(Buffer.from(svg), { density: 300 }).resize({ width: sz }).png().toFile(out);
      console.log(`    PNG  ${sz}px`);
    }

    // JPGs (skip white)
    if (JPG_COLORS.includes(colorName)) {
      const jpgDir = path.join(BUILD_DIR, layout.name, "jpg");
      await mkdir(jpgDir, { recursive: true });
      for (const sz of JPG_SIZES) {
        const out = path.join(jpgDir, `schend-${layout.name}-${colorName}-${sz}.jpg`);
        await sharp(Buffer.from(svg), { density: 300 })
          .resize({ width: sz })
          .flatten({ background: "#ffffff" })
          .jpeg({ quality: 92 })
          .toFile(out);
        console.log(`    JPG  ${sz}px`);
      }
    }
  }
}

// ─── README ──────────────────────────────────────────────────────────────────

const readme = `LANDHOTEL SCHEND — BRAND PACK
=============================

Generated: 2026-05-14
Source mark: handgezeichnete Skizze (potrace-vektorisiert), Cormorant Garamond 500 + Inter 400

KOMPLETTLOGO mit Wordmark "Landhotel Schend" und Subtitle
"IHR FAMILIENHOTEL IN IMMERATH | VULKANEIFEL", Schrift in Pfade umgewandelt — kein
Font muss installiert sein, das Logo sieht überall identisch aus.


ORDNERSTRUKTUR
--------------

horizontal/   Logo links, Text zwei Zeilen rechts daneben
              → für Briefkopf, Website-Header, breite Banner
stacked/      Logo oben zentriert, Text zentriert darunter
              → für Visitenkarten, Avatar, Square-Format Social Media


FORMATE
-------

svg/   Vektor, beliebig skalierbar — beste Wahl für Web + Druck
png/   Pixel mit transparentem Hintergrund, in 4 Größen (256/512/1024/2048 px breit)
jpg/   Mit weißem Hintergrund, 1024 + 2048 px breit — für E-Mail-Signatur, Office


FARBVARIANTEN
-------------

black   #000000   für helle Hintergründe (Briefkopf, Visitenkarte)
white   #FFFFFF   für dunkle Hintergründe (auf weiß unsichtbar — das ist korrekt)
cream   #F1ECE5   warme Cream-Farbe aus dem Dark-Mode-Theme der Website
                  → ideal für edle dunkle Hintergründe, premium look


VERWENDUNG NACH ZWECK
---------------------

Briefkopf / Visitenkarte         horizontal/svg/schend-horizontal-black.svg
                              oder horizontal/png/schend-horizontal-black-2048.png

E-Mail-Signatur                  horizontal/jpg/schend-horizontal-black-1024.jpg

Social-Media Profilbild (rund)   stacked/png/schend-stacked-cream-1024.png  (auf dunklem BG)
                              oder stacked/png/schend-stacked-black-1024.png

Social-Media Cover               horizontal/png/schend-horizontal-cream-2048.png

Beschilderung / Plakat           horizontal/svg/schend-horizontal-black.svg  (Vektor!)


HINWEISE
--------

- Alle SVG-Dateien sind verlustfrei beliebig skalierbar.
- White-Variante sieht auf weißem Hintergrund leer aus — das ist korrekt, sie ist
  für dunkle Hintergründe gedacht.
- Schrift ist in Pfade konvertiert: kein Font-Installations-Risiko, aber Text ist
  auch nicht mehr editierbar (für Schrift-Änderungen siehe building-only Logo
  im ursprünglichen Logo-Ordner und kombiniere neu).
- Cream-Variante: HSL(38 30% 92%) entspricht der Foreground-Farbe des
  Dark-Mode-Themes auf landhaus-schend.de.
`;

await writeFile(path.join(BUILD_DIR, "README.txt"), readme);
console.log("\nWrote README.txt");

// ─── Zip ─────────────────────────────────────────────────────────────────────

await mkdir(ZIP_OUT_DIR, { recursive: true });
const zipPath = path.join(ZIP_OUT_DIR, ZIP_NAME);
await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  output.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(output);
  archive.directory(BUILD_DIR, "landhotel-schend-brand");
  archive.finalize();
});

const { size } = await readFile(zipPath).then((b) => ({ size: b.length }));
console.log(`\nZip written: ${zipPath}`);
console.log(`Size: ${(size / 1024).toFixed(1)} KB`);
