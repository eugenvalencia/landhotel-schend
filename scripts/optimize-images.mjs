// Optimizes all assets in src/assets/ and public/ in place.
// Run: node scripts/optimize-images.mjs
// Skips files that are already small enough.
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
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

  if (out.length >= before) {
    console.log(`  keep ${path} (already optimal)`);
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
