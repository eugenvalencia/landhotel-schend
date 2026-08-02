#!/usr/bin/env node
/**
 * indexnow.mjs — meldet geänderte Seiten sofort an Bing (und damit an Yandex,
 * Seznam, Naver; Google nimmt an IndexNow NICHT teil).
 *
 * ⚠⚠ Warum das der schnellste Hebel ist
 *
 * Normalerweise wartet man, bis eine Suchmaschine von selbst vorbeischaut —
 * bei einer kleinen Hotelseite dauert das Tage bis Wochen. IndexNow dreht das
 * um: Die Seite meldet aktiv „diese URLs haben sich geändert". Bing holt sie
 * dann meist innerhalb von Minuten bis Stunden ab.
 *
 * ⚠ Es werden NUR Seiten gemeldet, die sich im letzten Commit tatsächlich
 * geändert haben — nicht alle 76. Wer bei jedem Deploy den ganzen Bestand
 * meldet, wird als Spam gewertet, und die Meldungen verlieren ihr Gewicht.
 *
 *   node scripts/indexnow.mjs           meldet, was der letzte Commit anfasste
 *   node scripts/indexnow.mjs --alle    meldet alle URLs (nur nach Umzug/Relaunch)
 *   node scripts/indexnow.mjs --probe   zeigt nur an, sendet nichts
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "landhaus-schend.de";
const KEY = "a53c3ab1cc07e0f56682744acc25fde5";
const SITEMAP = join(WURZEL, "dist-astro", "sitemap-0.xml");

const PROBE = process.argv.includes("--probe");
const ALLE = process.argv.includes("--alle");

const F = { rot: "\x1b[31m", gruen: "\x1b[32m", gelb: "\x1b[33m", grau: "\x1b[90m", aus: "\x1b[0m" };

function git(args) {
  try {
    return execFileSync("git", args, { cwd: WURZEL, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

/** Alle URLs aus der gebauten Sitemap — die ist die Wahrheit über das, was existiert. */
function alleUrls() {
  if (!existsSync(SITEMAP)) {
    console.error(`${F.rot}✗ ${SITEMAP} fehlt. Erst bauen: npm run build${F.aus}`);
    process.exit(1);
  }
  return [...readFileSync(SITEMAP, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/**
 * Welche Seiten hat der letzte Commit angefasst?
 *
 * Grobe, aber ehrliche Zuordnung: Wurde eine Inhaltsdatei geändert, gelten die
 * Seiten als betroffen, die sie speisen. Im Zweifel wird eine Seite ZU VIEL
 * gemeldet — das ist harmlos. Eine zu wenig zu melden wäre der eigentliche
 * Schaden, denn dann bleibt die Änderung unbemerkt liegen.
 */
function geaenderteUrls() {
  const dateien = git(["diff", "--name-only", "HEAD~1", "HEAD"]).split("\n").filter(Boolean);
  if (!dateien.length) return [];

  const urls = alleUrls();
  const treffer = new Set();

  const REGEL = [
    // ⚠ ^…$ ist Pflicht. Ohne Anker matcht /\/(en\/|fr\/|nl\/)?$/ JEDEN Pfad,
    // der auf „/" endet — also alle 76 Seiten. Genau das passierte im ersten
    // Probelauf: eine Änderung an HomePage.astro hätte den ganzen Bestand
    // gemeldet. Aufgefallen nur, weil --probe vor dem Senden zählt.
    [/i18n\/content\/home\.ts|pages\/HomePage\.astro/, /^\/(en\/|fr\/|nl\/)?$/],
    [/restaurant\.ts|RestaurantPage\.astro/, /\/restaurant\/$/],
    [/zimmer\.ts|ZimmerDetailPage\.astro/, /\/zimmer\//],
    [/pakete\.ts|Pakete\w*Page\.astro/, /\/pakete\//],
    [/urlaubsregion\.ts|RegionPage\.astro/, /\/urlaubsregion\/$/],
    [/ueber-uns\.ts|AboutPage\.astro/, /\/ueber-uns\/$/],
    [/galerie\.ts|GalleryPage\.astro/, /\/galerie\/$/],
    [/faq\.ts|FaqPage\.astro/, /\/faq\/$/],
    [/anfrage\.ts|AnfragePage\.astro/, /\/anfrage\/$/],
  ];

  for (const d of dateien) {
    for (const [datei, pfad] of REGEL) {
      if (datei.test(d)) urls.filter((u) => pfad.test(new URL(u).pathname)).forEach((u) => treffer.add(u));
    }
    // Layout, Kopf-/Fußbereich oder globales CSS betreffen alles.
    if (/Layout\.astro|SiteHeader|SiteFooter|global\.css/.test(d)) urls.forEach((u) => treffer.add(u));
  }
  return [...treffer];
}

const urls = ALLE ? alleUrls() : geaenderteUrls();

if (!urls.length) {
  console.log(`${F.grau}IndexNow: keine inhaltlich betroffenen Seiten im letzten Commit — nichts zu melden.${F.aus}`);
  process.exit(0);
}

// Bing nimmt maximal 10.000 pro Anfrage; hier nie relevant, aber Grenze respektieren.
const nutzlast = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) };

console.log(`${F.grau}IndexNow → ${urls.length} URL(s)${ALLE ? " (ALLE, --alle gesetzt)" : ""}:${F.aus}`);
for (const u of urls.slice(0, 12)) console.log(`   ${u.replace(`https://${HOST}`, "") || "/"}`);
if (urls.length > 12) console.log(`   ${F.grau}… und ${urls.length - 12} weitere${F.aus}`);

if (PROBE) {
  console.log(`${F.gelb}--probe: nichts gesendet.${F.aus}`);
  process.exit(0);
}

const antwort = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(nutzlast),
});

// 200 = angenommen, 202 = angenommen, Schlüssel wird noch geprüft.
if (antwort.status === 200 || antwort.status === 202) {
  console.log(`${F.gruen}✓ angenommen (HTTP ${antwort.status})${F.aus}`);
} else {
  // ⚠ Kein harter Abbruch: Ein fehlgeschlagener Ping darf den Deploy nicht
  // umwerfen — die Seite ist dann trotzdem live und wird regulär gefunden.
  console.log(`${F.gelb}⚠ IndexNow antwortete HTTP ${antwort.status} — Deploy läuft weiter.${F.aus}`);
  console.log(`${F.grau}  403 = Schlüsseldatei nicht erreichbar · 422 = URL passt nicht zum Host${F.aus}`);
}
