// Optimizes all assets in src/assets/ and public/ in place.
// Run: node scripts/optimize-images.mjs
// Skips files that are already small enough.
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 78;
const TARGET_SIZE_KB = 250;

const TARGETS = ["src/assets", "public"];
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(path)));
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      out.push(path);
    }
  }
  return out;
}

async function processFile(path) {
  const before = (await stat(path)).size;
  if (before < TARGET_SIZE_KB * 1024) {
    console.log(`  skip ${path} (${(before / 1024).toFixed(0)} KB — already small)`);
    return;
  }

  const buf = await readFile(path);
  const ext = extname(path).toLowerCase();
  let pipeline = sharp(buf, { failOn: "none" }).rotate();

  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let out;
  if (ext === ".png") {
    out = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true }).toBuffer();
  } else {
    out = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true }).toBuffer();
  }

  // ⚠⚠ 19.10.2026: Vorher stand hier `out.length >= before` — geschrieben wurde
  // also auch, wenn der neue Stand 200 Byte kleiner war. Beim ersten echten Lauf
  // bekamen so 20 Fotos ein zweites q78 übergebügelt für "−0 KB, −0%": reiner
  // Qualitätsverlust ohne Gegenwert. JPEG ist verlustbehaftet, jeder Durchgang
  // kostet. Unter MIN_GAIN bleibt die Datei, wie sie ist.
  const MIN_GAIN = 0.03;
  if (out.length >= before * (1 - MIN_GAIN)) {
    console.log(`  keep ${path} (${(before / 1024).toFixed(0)} KB — weniger als ${MIN_GAIN * 100} % Gewinn)`);
    return;
  }

  await writeFile(path, out);
  const saved = before - out.length;
  console.log(
    `  done ${path}: ${(before / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB ` +
      `(−${(saved / 1024).toFixed(0)} KB, −${Math.round((saved / before) * 100)}%)`,
  );
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of TARGETS) {
    // ⚠⚠ 19.10.2026: Hier starb der ganze Lauf. `src/assets` gibt es seit dem
    // Umbau auf `site/` nicht mehr — `readdir` warf ENOENT auf dem ERSTEN Ziel,
    // und `public/` kam nie dran. Deshalb lagen in `public/` 86 Bilder über
    // 300 KB (38,8 MB), obwohl dieses Werkzeug genau dagegen gebaut ist.
    // Ein Lauf, der am fehlenden Ordner stirbt, sieht im Protokoll aus wie ein
    // Lauf. Fehlende Ziele werden jetzt benannt und übersprungen.
    if (!existsSync(dir)) {
      console.log(`\nSkip ${dir} — Ordner gibt es nicht (kein Fehler, nur nichts zu tun).`);
      continue;
    }
    console.log(`\nScanning ${dir}…`);
    const files = await walk(dir);
    for (const f of files) {
      const before = (await stat(f)).size;
      totalBefore += before;
      await processFile(f);
      const after = (await stat(f)).size;
      totalAfter += after;
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024).toFixed(0)} KB → ${(totalAfter / 1024).toFixed(0)} KB ` +
      `(saved ${((totalBefore - totalAfter) / 1024).toFixed(0)} KB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
