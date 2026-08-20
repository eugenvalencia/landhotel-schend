#!/usr/bin/env node
// Misst functions/api/resend-webhook.ts — den Melder, der dem Hotel sagt, wenn
// eine Gast-Bestätigung nicht angekommen ist.
//
// ── Wie hier gemessen wird ──────────────────────────────────────────────────
// 1. Der Prüfling läuft ECHT: `wrangler pages dev` startet dieselbe Function,
//    die Cloudflare später ausführt. Kein Nachbau der Logik.
// 2. Die Signaturen rechnet dieses Skript mit node:crypto (createHmac) — der
//    Prüfling rechnet mit WebCrypto (crypto.subtle). Zwei verschiedene
//    Implementierungen; ein gemeinsamer Denkfehler fällt damit auf.
// 3. Resend wird durch einen lokalen Nachbau ersetzt (RESEND_API_BASE). Damit
//    lässt sich der INHALT der Warn-Mail lesen, OHNE dass eine einzige Mail an
//    info@landhaus-schend.de rausgeht.
//
// ⚠ Gegenprobe in beide Richtungen: Es genügt nicht, dass echte Meldungen
// durchkommen — erfundene MÜSSEN abgewiesen werden. Deshalb sind Fall 2–4
// Mutationen (Signatur verdreht, Rumpf nachträglich geändert, Zeitstempel alt).
// Wären die grün, wäre die Prüfung wertlos.
//
// Aufruf:  node scripts/pruefe-resend-webhook.mjs

import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import process from "node:process";

const GEHEIMNIS = "whsec_" + Buffer.from("pruefgeheimnis-nur-fuer-die-messung").toString("base64");
const HOTEL = "postfach-des-hotels@example.invalid";
const GAST = "gast@example.invalid";
// Wer die Warnung mitbekommt (in der Wirklichkeit: info@conexadigital.eu).
// Eugen, 20.08.2026: »sollte bei Schend was nicht laufen, ruft er uns sowieso an«
// — dann wollen wir es vorher wissen, statt beim Anruf zu raten.
const MITLESER = "team-conexa@example.invalid";
const PORT_PRUEFLING = 8788;
const PORT_RESEND = 8799;

// ── Nachbau von Resend ──────────────────────────────────────────────────────
// Nimmt an, was der Prüfling senden will, und legt es ab. Der Schalter
// `antwortet` erlaubt, einen Ausfall von Resend nachzustellen.
let gesendet = [];
let resendAntwortet = true;
const resend = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (!resendAntwortet) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end('{"message":"nachgestellter Ausfall"}');
    }
    gesendet.push({ pfad: req.url, auth: req.headers.authorization, mail: JSON.parse(body) });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"id":"nachbau-' + gesendet.length + '"}');
  });
});

// ── Signatur nach dem Svix-Verfahren (unabhängig gerechnet) ─────────────────
function unterschreibe(id, timestamp, rumpf, geheimnis = GEHEIMNIS) {
  const key = Buffer.from(geheimnis.replace(/^whsec_/, ""), "base64");
  const sig = createHmac("sha256", key).update(`${id}.${timestamp}.${rumpf}`).digest("base64");
  return `v1,${sig}`;
}

const jetztSek = () => Math.floor(Date.now() / 1000);

async function sende({ rumpf, id = randomUUID(), ts = jetztSek(), signatur, koepfeWeglassen = false }) {
  const koepfe = { "Content-Type": "application/json" };
  if (!koepfeWeglassen) {
    koepfe["svix-id"] = id;
    koepfe["svix-timestamp"] = String(ts);
    koepfe["svix-signature"] = signatur ?? unterschreibe(id, ts, rumpf);
  }
  const r = await fetch(`http://127.0.0.1:${PORT_PRUEFLING}/api/resend-webhook`, {
    method: "POST",
    headers: koepfe,
    body: rumpf,
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

const ereignis = (typ, an, extra = {}) =>
  JSON.stringify({
    type: typ,
    created_at: "2026-08-13T09:12:00.000Z",
    data: {
      email_id: "abc-123",
      created_at: "2026-08-13T09:12:00.000Z",
      from: "Landhaus Schend <info@landhaus-schend.de>",
      to: Array.isArray(an) ? an : [an],
      subject: "Ihre Anfrage beim Landhaus Schend – wir haben sie erhalten",
      tags: { type: "inquiry_copy" },
      ...extra,
    },
  });

const BOUNCE = {
  bounce: {
    type: "Permanent",
    subType: "General",
    message: "550 5.7.1 XGEMAIL_0011 Command rejected",
  },
};

// ── Die Fälle ───────────────────────────────────────────────────────────────
const faelle = [
  {
    name: "1. Echte Meldung, Gast betroffen → Hotel wird gewarnt",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.bounced", GAST, BOUNCE) });
      if (r.status !== 200) return `Status ${r.status} statt 200 (${JSON.stringify(r.body)})`;
      if (gesendet.length !== 1) return `${gesendet.length} Mails statt genau 1`;
      const m = gesendet[0].mail;
      if (!m.to.includes(HOTEL)) return `Mail ging an ${JSON.stringify(m.to)} statt ans Hotel`;
      if (!m.subject.includes(GAST)) return `Betreff nennt die Gast-Adresse nicht: "${m.subject}"`;
      if (!m.text.includes("550 5.7.1")) return "Der Grund des Empfängers fehlt im Text";
      if (!m.text.includes(GAST)) return "Die Gast-Adresse fehlt im Text — das Hotel kann nichts suchen";
      if (!/anrufen|Anruf/i.test(m.text)) return "Keine Handlungsanweisung im Text";
      if (!m.html || !m.text) return "Es fehlt eine der beiden Fassungen (HTML/Klartext)";
      return null;
    },
  },
  {
    name: "2. MUTATION Signatur verdreht → muss abgewiesen werden",
    lauf: async () => {
      gesendet = [];
      const rumpf = ereignis("email.bounced", GAST, BOUNCE);
      const id = randomUUID(), ts = jetztSek();
      const echt = unterschreibe(id, ts, rumpf);
      // Ein einziges Zeichen der Signatur kippen.
      const kaputt = echt.slice(0, -2) + (echt.slice(-2, -1) === "A" ? "B" : "A") + echt.slice(-1);
      const r = await sende({ rumpf, id, ts, signatur: kaputt });
      if (r.status !== 401) return `Status ${r.status} statt 401 — eine gefälschte Meldung kam durch!`;
      if (gesendet.length !== 0) return "Es wurde trotz falscher Signatur gesendet!";
      return null;
    },
  },
  {
    name: "3. MUTATION Rumpf nach dem Unterschreiben geändert → muss abgewiesen werden",
    lauf: async () => {
      gesendet = [];
      const echterRumpf = ereignis("email.bounced", GAST, BOUNCE);
      const id = randomUUID(), ts = jetztSek();
      const signatur = unterschreibe(id, ts, echterRumpf);
      // Derselbe Schlüssel, dieselbe ID — nur der Inhalt ist ausgetauscht.
      const untergeschoben = ereignis("email.bounced", "opfer@example.invalid", BOUNCE);
      const r = await sende({ rumpf: untergeschoben, id, ts, signatur });
      if (r.status !== 401) return `Status ${r.status} statt 401 — der Inhalt wird nicht mitsigniert geprüft!`;
      if (gesendet.length !== 0) return "Es wurde mit untergeschobenem Inhalt gesendet!";
      return null;
    },
  },
  {
    name: "4. MUTATION Zeitstempel 10 Minuten alt → muss abgewiesen werden",
    lauf: async () => {
      gesendet = [];
      const rumpf = ereignis("email.bounced", GAST, BOUNCE);
      const r = await sende({ rumpf, ts: jetztSek() - 600 });
      if (r.status !== 401) return `Status ${r.status} statt 401 — eine alte Meldung ließe sich wiedereinspielen`;
      if (gesendet.length !== 0) return "Es wurde auf eine alte Meldung hin gesendet!";
      return null;
    },
  },
  {
    name: "5. MUTATION gar keine Signatur → muss abgewiesen werden",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.bounced", GAST, BOUNCE), koepfeWeglassen: true });
      if (r.status !== 401) return `Status ${r.status} statt 401 — der Endpunkt nimmt Unsigniertes an!`;
      if (gesendet.length !== 0) return "Es wurde ohne jede Signatur gesendet!";
      return null;
    },
  },
  {
    name: "6. SCHLEIFENBREMSE: das Hotelpostfach selbst prellt zurück → keine Mail",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.bounced", HOTEL, BOUNCE) });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (r.body.ignored !== "hotel_recipient") return `ignored="${r.body.ignored}" statt "hotel_recipient"`;
      if (gesendet.length !== 0) return "Es wurde ans Hotel geschrieben — das ist die Endlosschleife!";
      return null;
    },
  },
  {
    name: "7. Zugestellte Mail (email.delivered) → kein Alarm",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.delivered", GAST) });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (gesendet.length !== 0) return "Alarm bei einer ERFOLGREICH zugestellten Mail!";
      return null;
    },
  },
  {
    name: "8. Verzögerte Zustellung (delivery_delayed) → kein Alarm",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.delivery_delayed", GAST) });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (gesendet.length !== 0) return "Alarm bei einer nur verzögerten Mail — das wäre ein Fehlalarm";
      return null;
    },
  },
  {
    name: "9. email.failed (Resend kam nicht los) → Hotel wird gewarnt",
    lauf: async () => {
      gesendet = [];
      const r = await sende({
        rumpf: ereignis("email.failed", GAST, { failed: { reason: "Kontingent erschöpft" } }),
      });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (gesendet.length !== 1) return `${gesendet.length} Mails statt 1`;
      if (!gesendet[0].mail.text.includes("Kontingent erschöpft")) return "Der Grund fehlt im Text";
      return null;
    },
  },
  {
    name: "10. Dieselbe Meldung zweimal → das Hotel bekommt sie nur einmal",
    lauf: async () => {
      gesendet = [];
      const rumpf = ereignis("email.bounced", GAST, BOUNCE);
      const id = randomUUID(), ts = jetztSek();
      const signatur = unterschreibe(id, ts, rumpf);
      await sende({ rumpf, id, ts, signatur });
      const zweite = await sende({ rumpf, id, ts, signatur });
      if (zweite.body.ignored !== "duplicate") return `ignored="${zweite.body.ignored}" statt "duplicate"`;
      if (gesendet.length !== 1) return `${gesendet.length} Mails statt 1 — das Hotel würde doppelt gewarnt`;
      return null;
    },
  },
  {
    name: "11. Resend fällt beim Warnen aus → 500, damit wiederholt wird (Meldung nicht verloren)",
    lauf: async () => {
      gesendet = [];
      resendAntwortet = false;
      const rumpf = ereignis("email.bounced", GAST, BOUNCE);
      const id = randomUUID(), ts = jetztSek();
      const signatur = unterschreibe(id, ts, rumpf);
      const erste = await sende({ rumpf, id, ts, signatur });
      resendAntwortet = true;
      if (erste.status !== 500) return `Status ${erste.status} statt 500 — Svix würde nicht wiederholen`;
      // Die Wiederholung muss durchkommen: ein fehlgeschlagener Versand darf
      // NICHT ins Gedächtnis geschrieben worden sein.
      const zweite = await sende({ rumpf, id, ts, signatur });
      if (zweite.status !== 200) return `Wiederholung: Status ${zweite.status} statt 200`;
      if (gesendet.length !== 1) return `${gesendet.length} Mails statt 1 bei der Wiederholung`;
      return null;
    },
  },
  {
    name: "12. Falscher Schlüssel (anderes whsec_) → muss abgewiesen werden",
    lauf: async () => {
      gesendet = [];
      const rumpf = ereignis("email.bounced", GAST, BOUNCE);
      const id = randomUUID(), ts = jetztSek();
      const fremd = "whsec_" + Buffer.from("ein-ganz-anderes-geheimnis").toString("base64");
      const r = await sende({ rumpf, id, ts, signatur: unterschreibe(id, ts, rumpf, fremd) });
      if (r.status !== 401) return `Status ${r.status} statt 401 — der Schlüssel wird nicht wirklich geprüft!`;
      return null;
    },
  },
  {
    name: "13. Warnung geht an Hotel UND an uns, und sagt das auch",
    lauf: async () => {
      gesendet = [];
      const r = await sende({ rumpf: ereignis("email.bounced", GAST, BOUNCE) });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (gesendet.length !== 1) return `${gesendet.length} Mails statt genau 1`;
      const m = gesendet[0].mail;
      if (!m.to.includes(HOTEL)) return `Das Hotel fehlt unter den Empfängern: ${JSON.stringify(m.to)}`;
      if (!m.to.includes(MITLESER)) return `Wir stehen nicht in Kopie: ${JSON.stringify(m.to)}`;
      // Der Satz ist eine Zusage ans Hotel. Steht er drin, ohne dass wir
      // wirklich in Kopie sind, ist es eine Lüge — deshalb beides prüfen.
      if (!/Conexa Digital ist informiert/i.test(m.text))
        return "Der Hinweis, dass wir informiert sind, fehlt im Klartext";
      if (!/Conexa Digital ist informiert/i.test(m.html))
        return "Der Hinweis, dass wir informiert sind, fehlt in der HTML-Fassung";
      return null;
    },
  },
  {
    name: "14. SCHLEIFENBREMSE: die Warnung prellt bei UNS zurück → keine neue Warnung",
    lauf: async () => {
      gesendet = [];
      // Ohne diese Ausnahme wären wir selbst der »betroffene Gast« — und jede
      // zurückgekommene Warnung löste die nächste aus. Die Schleife wäre nur
      // eine Ecke länger als die über das Hotelpostfach.
      const r = await sende({ rumpf: ereignis("email.bounced", MITLESER, BOUNCE) });
      if (r.status !== 200) return `Status ${r.status} statt 200`;
      if (r.body.ignored !== "hotel_recipient") return `ignored="${r.body.ignored}" statt "hotel_recipient"`;
      if (gesendet.length !== 0) return "Es wurde erneut gewarnt — das ist die Schleife über uns!";
      return null;
    },
  },
];

// ── Ablauf ──────────────────────────────────────────────────────────────────
async function warteAufPruefling(msMax = 90_000) {
  const bis = Date.now() + msMax;
  while (Date.now() < bis) {
    try {
      // Ein POST ohne Signatur muss 401 liefern — das ist der Beweis, dass die
      // Function wirklich antwortet. Ein offener Port allein genügt nicht.
      const r = await fetch(`http://127.0.0.1:${PORT_PRUEFLING}/api/resend-webhook`, {
        method: "POST",
        body: "{}",
      });
      if (r.status === 401 || r.status === 500) return true;
    } catch {
      /* noch nicht da */
    }
    await new Promise((r) => setTimeout(r, 700));
  }
  return false;
}

let kind;
try {
  await new Promise((r) => resend.listen(PORT_RESEND, "127.0.0.1", r));

  // ⚠ Nicht über `npx` starten: unter Windows/Git-Bash scheitert das an der
  // .cmd-Hülle ("Das System kann die angegebene Datei nicht finden"). Direkt
  // dasselbe Node und dieselbe wrangler-Datei nehmen, die auch npx aufriefe.
  kind = spawn(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "pages", "dev", "dist-astro",
      // ⚠ Ohne Angabe setzt wrangler das HEUTIGE Datum als Kompatibilitätsdatum
      // — die mitgelieferte Laufzeit (4.95.0) kann aber höchstens 2026-06-02
      // und startet dann gar nicht erst. Fest gesetzt, damit die Messung nicht
      // von der Uhr abhängt. Der Prüfling nutzt keine datumsabhängigen APIs.
      "--compatibility-date", "2026-06-02",
      "--port", String(PORT_PRUEFLING),
      "--ip", "127.0.0.1",
      "--binding", `RESEND_WEBHOOK_SECRET=${GEHEIMNIS}`,
      "--binding", "RESEND_API_KEY=pruefschluessel",
      "--binding", `INQUIRY_TO=${HOTEL}`,
      "--binding", "INQUIRY_FROM=Landhaus Schend <info@landhaus-schend.de>",
      "--binding", `ALERT_CC=${MITLESER}`,
      "--binding", `RESEND_API_BASE=http://127.0.0.1:${PORT_RESEND}`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let kindAusgabe = "";
  kind.stdout.on("data", (d) => (kindAusgabe += d));
  kind.stderr.on("data", (d) => (kindAusgabe += d));

  console.log("Starte den Prüfling (wrangler pages dev) …");
  if (!(await warteAufPruefling())) {
    console.error("\n⛔ Der Prüfling ist nicht hochgekommen. Ausgabe von wrangler:\n");
    console.error(kindAusgabe.slice(-3000));
    process.exitCode = 1;
  } else {
    console.log("Prüfling antwortet.\n");
    let fehler = 0;
    for (const f of faelle) {
      let ergebnis;
      try {
        ergebnis = await f.lauf();
      } catch (e) {
        ergebnis = `Ausnahme: ${e.message}`;
      }
      if (ergebnis) {
        fehler++;
        console.log(`  ✗ ${f.name}\n      → ${ergebnis}`);
      } else {
        console.log(`  ✓ ${f.name}`);
      }
    }
    console.log(`\n${faelle.length - fehler}/${faelle.length} bestanden, ${fehler} Fehler.`);
    process.exitCode = fehler === 0 ? 0 : 1;
  }
} finally {
  if (kind) kind.kill();
  resend.close();
  // ⚠ Windows: dem Prozess Zeit lassen, die Ausgabe wirklich rauszuschreiben,
  // sonst endet der Lauf still — siehe [[gotcha-schneller-ausfall-leert-die-warteschlange]].
  await new Promise((r) => setTimeout(r, 200));
}
