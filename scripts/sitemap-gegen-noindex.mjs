#!/usr/bin/env node
/**
 * sitemap-gegen-noindex.mjs — findet den Widerspruch zwischen dem, was die
 * Sitemap bei Google einreicht, und dem, was die Seiten selbst per Meta-Tag
 * sagen. Misst am GEBAUTEN Ergebnis (dist-astro), nicht an der Quelle.
 *
 * ⚠⚠ Warum es diesen Prüfer gibt
 *
 * Am 08.09.2026 gemessen: die Sitemap führte 76 URLs, davon trugen 8 ein
 * `noindex` — /anfrage/ und /bildnachweis/ in allen vier Sprachen. Die Sitemap
 * lädt Google ein, das Meta-Tag weist ihn ab. Die Search Console meldete das
 * als "Durch noindex-Tag ausgeschlossen: 28 Seiten, Überprüfung fehlgeschlagen".
 *
 * Der Filter, der das verhindern soll, steht in astro.config.mjs und ist eine
 * Namensliste. Eine Namensliste altert gegen das, was sie prüft: kommt eine
 * neue noindex-Seite dazu und wird dort vergessen, entsteht derselbe
 * Widerspruch neu — und niemand merkt es, weil der Bau grün bleibt.
 *
 * ⚠ Deshalb wird in BEIDE Richtungen gemessen. Nur eine Richtung zu prüfen
 *   hiesse, die halbe Lücke für Vollständigkeit zu halten:
 *
 *   A  URL steht in der Sitemap UND die Seite trägt noindex
 *      -> widersprüchliches Signal, das war der Befund vom 08.09.2026
 *   B  Seite ist indexierbar (kein noindex), fehlt aber in der Sitemap
 *      -> Google muss sie selbst finden; bei tiefen Seiten dauert das Wochen
 *
 *   node scripts/sitemap-gegen-noindex.mjs              prüft dist-astro
 *   node scripts/sitemap-gegen-noindex.mjs <verzeichnis>  prüft ein anderes
 *   node scripts/sitemap-gegen-noindex.mjs --selbsttest  prüft den Prüfer
 *
 * Rückgabewert 1, sobald ein Widerspruch der Richtung A gefunden wird —
 * damit taugt das Skript als Tor vor dem Ausrollen. Richtung B meldet, bricht
 * aber nicht ab: eine Seite bewusst aus der Sitemap zu lassen ist erlaubt.
 */
import { readFileSync, existsSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const F = { rot: "\x1b[31m", gruen: "\x1b[32m", gelb: "\x1b[33m", grau: "\x1b[90m", aus: "\x1b[0m" };

/**
 * Liest alle <loc>-Einträge aus einer Sitemap-Datei.
 * Bewusst NICHT über einen XML-Parser: die Datei ist maschinell erzeugt und
 * flach, und ein Parser mehr wäre eine Abhängigkeit mehr.
 */
function sitemapAdressen(datei) {
  if (!existsSync(datei)) return null;
  const roh = readFileSync(datei, "utf8");
  return [...roh.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

/**
 * Sammelt alle index.html unterhalb von <wurzel> und bildet sie auf ihren
 * Pfad ab ("/", "/en/zimmer/", …).
 *
 * ⚠ 404.html und die Seiten unterhalb von /dashboard, /login usw. bleiben
 *   aussen vor: sie sollen weder indexiert noch in der Sitemap stehen, sie
 *   wären in Richtung B also lauter Fehlalarm.
 */
const NICHT_OEFFENTLICH = /^\/(404|dashboard|login|booking-confirmation|confirmation)(\/|$)/;

function gebauteSeiten(wurzel) {
  const treffer = new Map();
  const gehe = (ordner) => {
    for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
      const voll = join(ordner, eintrag.name);
      if (eintrag.isDirectory()) gehe(voll);
      else if (eintrag.name === "index.html") {
        const rel = relative(wurzel, dirname(voll)).split(sep).filter(Boolean);
        treffer.set("/" + (rel.length ? rel.join("/") + "/" : ""), voll);
      }
    }
  };
  gehe(wurzel);
  return treffer;
}

/**
 * Trägt das HTML ein noindex?
 *
 * ⚠ Es zählt NUR das robots-Meta, und zwar dessen content-Wert. Ein blosses
 *   Vorkommen des Wortes "noindex" irgendwo im HTML (etwa in einem Text über
 *   Suchmaschinen, oder in einer eingebetteten Skript-Zeile) ist KEIN noindex.
 *   Genau daran scheitern naive Prüfer.
 */
function traegtNoindex(html) {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\bname\s*=\s*["']?robots["']?/i.test(tag)) continue;
    const inhalt = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (inhalt && /\bnoindex\b/i.test(inhalt[1])) return true;
  }
  return false;
}

/**
 * Der Hauptpfad. Gibt die Befunde zurück, statt sie zu drucken — nur so kann
 * der Selbsttest ihn wirklich aufrufen, statt eine zweite Fassung zu prüfen.
 */
export function pruefeVerzeichnis(bauOrdner) {
  const sitemapDatei = join(bauOrdner, "sitemap-0.xml");
  const adressen = sitemapAdressen(sitemapDatei);
  if (adressen === null) return { fehler: `Keine Sitemap unter ${sitemapDatei}` };

  const seiten = gebauteSeiten(bauOrdner);

  // Adresse -> Pfad ("https://host/en/zimmer/" -> "/en/zimmer/")
  const alsPfad = (u) => {
    try { return new URL(u).pathname; } catch { return u; }
  };

  const inSitemap = new Set(adressen.map(alsPfad));
  const widerspruch = []; // A: in Sitemap, aber noindex
  const luecke = [];      // B: indexierbar, aber nicht in Sitemap
  const ohneDatei = [];   // Sitemap nennt etwas, das gar nicht gebaut wurde

  for (const adresse of adressen) {
    const pfad = alsPfad(adresse);
    const datei = seiten.get(pfad);
    if (!datei) { ohneDatei.push(pfad); continue; }
    if (traegtNoindex(readFileSync(datei, "utf8"))) widerspruch.push(pfad);
  }

  for (const [pfad, datei] of seiten) {
    if (inSitemap.has(pfad)) continue;
    if (NICHT_OEFFENTLICH.test(pfad)) continue;
    if (traegtNoindex(readFileSync(datei, "utf8"))) continue; // zu Recht draussen
    luecke.push(pfad);
  }

  return {
    gesamtSitemap: adressen.length,
    gesamtGebaut: seiten.size,
    widerspruch: widerspruch.sort(),
    luecke: luecke.sort(),
    ohneDatei: ohneDatei.sort(),
  };
}

// ── Selbsttest ───────────────────────────────────────────────────────────────
// ⚠ Der Selbsttest baut ECHTE Dateien und ruft den ECHTEN Hauptpfad auf.
//   Er teilt sich mit dem Prüfer keine Konstante und kein Suchmuster — sonst
//   würde er nur bestätigen, dass eine Variable gleich sich selbst ist.
function selbsttest() {
  const ordner = mkdtempSync(join(tmpdir(), "sitemap-pruefer-"));
  const seite = (pfad, html) => {
    const ziel = join(ordner, ...pfad.split("/").filter(Boolean));
    mkdirSync(ziel, { recursive: true });
    writeFileSync(join(ziel, "index.html"), html, "utf8");
  };
  const MIT = `<html><head><meta name="robots" content="noindex, nofollow"><title>x</title></head><body>a</body></html>`;
  const OHNE = `<html><head><title>x</title></head><body>a</body></html>`;
  // Falle: das Wort steht im Fliesstext, aber es gibt kein robots-Meta.
  const KOEDER = `<html><head><title>x</title></head><body>Wir setzen kein noindex ein.</body></html>`;

  seite("/", OHNE);
  seite("/anfrage", MIT);        // A: steht gleich in der Sitemap -> Widerspruch
  seite("/zimmer", OHNE);        // sauber
  seite("/galerie", OHNE);       // B: fehlt in der Sitemap -> Lücke
  seite("/impressum", MIT);      // zu Recht draussen -> darf NICHT auffallen
  seite("/ueber-uns", KOEDER);   // darf NICHT als noindex gelten
  seite("/404", OHNE);           // nicht öffentlich -> darf NICHT auffallen

  const H = "https://beispiel.test";
  writeFileSync(
    join(ordner, "sitemap-0.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset>` +
      [`${H}/`, `${H}/anfrage/`, `${H}/zimmer/`, `${H}/ueber-uns/`, `${H}/gibtsnicht/`]
        .map((u) => `<url><loc>${u}</loc></url>`)
        .join("") +
      `</urlset>`,
    "utf8"
  );

  const e = pruefeVerzeichnis(ordner);
  const pruefungen = [
    ["Widerspruch findet /anfrage/", e.widerspruch.join(",") === "/anfrage/"],
    ["Widerspruch meldet /impressum/ NICHT (steht nicht in der Sitemap)", !e.widerspruch.includes("/impressum/")],
    ["Lücke findet /galerie/", e.luecke.includes("/galerie/")],
    ["Lücke meldet /impressum/ NICHT (trägt noindex)", !e.luecke.includes("/impressum/")],
    ["Lücke meldet /404/ NICHT (nicht öffentlich)", !e.luecke.includes("/404/")],
    ["Wort im Fliesstext gilt NICHT als noindex", !e.widerspruch.includes("/ueber-uns/")],
    ["fehlende Datei wird gemeldet", e.ohneDatei.includes("/gibtsnicht/")],
    ["Zählung Sitemap stimmt", e.gesamtSitemap === 5],
  ];

  // Mutationsprobe: schaltet man das robots-Meta ab, MUSS der Befund verschwinden.
  // Bleibt er, misst der Prüfer etwas anderes als das, was er zu messen behauptet.
  seite("/anfrage", OHNE);
  const nachMutation = pruefeVerzeichnis(ordner);
  pruefungen.push(["Mutation: ohne robots-Meta kein Widerspruch mehr", nachMutation.widerspruch.length === 0]);

  rmSync(ordner, { recursive: true, force: true });

  let alleGut = true;
  for (const [name, gut] of pruefungen) {
    console.log(`  ${gut ? F.gruen + "ok  " : F.rot + "FEHL"}${F.aus} ${name}`);
    if (!gut) alleGut = false;
  }
  console.log(`\n${alleGut ? F.gruen + "Selbsttest grün" : F.rot + "Selbsttest ROT"}${F.aus} — ${pruefungen.length} Prüfungen`);
  return alleGut;
}

// ── Aufruf ───────────────────────────────────────────────────────────────────
const istHauptlauf = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, "/")}`).href;
if (istHauptlauf) {
  if (process.argv.includes("--selbsttest")) {
    process.exit(selbsttest() ? 0 : 1);
  }

  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const bauOrdner = arg ? join(process.cwd(), arg) : join(WURZEL, "dist-astro");

  if (!existsSync(bauOrdner)) {
    console.error(`${F.rot}Kein Bau-Ordner unter ${bauOrdner}${F.aus} — erst "npm run build".`);
    process.exit(2);
  }

  const e = pruefeVerzeichnis(bauOrdner);
  if (e.fehler) { console.error(`${F.rot}${e.fehler}${F.aus}`); process.exit(2); }

  console.log(`${F.grau}Sitemap: ${e.gesamtSitemap} Adressen · gebaut: ${e.gesamtGebaut} Seiten${F.aus}\n`);

  if (e.widerspruch.length) {
    console.log(`${F.rot}A — in der Sitemap, trägt aber noindex (${e.widerspruch.length}):${F.aus}`);
    for (const p of e.widerspruch) console.log(`     ${p}`);
    console.log(`${F.grau}     Entweder aus dem Sitemap-Filter in astro.config.mjs ausschliessen,\n     oder das noindex entfernen. Beides zugleich widerspricht sich.${F.aus}\n`);
  }

  if (e.ohneDatei.length) {
    console.log(`${F.rot}Sitemap nennt Adressen, die nicht gebaut wurden (${e.ohneDatei.length}):${F.aus}`);
    for (const p of e.ohneDatei) console.log(`     ${p}`);
    console.log("");
  }

  if (e.luecke.length) {
    console.log(`${F.gelb}B — indexierbar, fehlt aber in der Sitemap (${e.luecke.length}):${F.aus}`);
    for (const p of e.luecke) console.log(`     ${p}`);
    console.log(`${F.grau}     Kein Abbruch: eine Seite bewusst draussen zu lassen ist erlaubt.${F.aus}\n`);
  }

  if (!e.widerspruch.length && !e.luecke.length && !e.ohneDatei.length) {
    console.log(`${F.gruen}Kein Widerspruch.${F.aus} Sitemap und Meta-Tags sagen dasselbe.`);
  }

  process.exit(e.widerspruch.length || e.ohneDatei.length ? 1 : 0);
}
