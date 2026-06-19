// Cloudflare Pages Function — nimmt die Buchungs-ANFRAGE vom Formular (/anfrage)
// entgegen und schickt EINE E-Mail an das Hotel (über Resend). Keine Datenbank,
// kein Supabase, keine Speicherung — reine Weiterleitung. Schend bearbeitet die
// Anfrage danach selbst.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY  (Secret, Pflicht)         — API-Key von resend.com
//   INQUIRY_TO      (optional)                 — Empfänger; Default = Test-Postfach
//   INQUIRY_FROM    (optional)                 — Absender (verifizierte Domain bei Resend)

interface Env {
  RESEND_API_KEY?: string;
  INQUIRY_TO?: string;
  INQUIRY_FROM?: string;
}

interface Room { kategorie?: string; anzahl?: number }
interface Payload {
  name?: string; street?: string; city?: string; email?: string; phone?: string;
  persons?: number; paket?: string; rooms?: Room[]; zimmer?: string;
  checkin?: string; checkout?: string; message?: string;
  halbpension?: boolean; kinderbett?: boolean; hund?: boolean;
  datenschutz?: boolean; company?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

// Eingaben kappen — Defense gegen aufgeblähte Payloads / Missbrauch.
const clamp = (s: unknown, max: number) => String(s ?? "").trim().slice(0, max);
const clampInt = (n: unknown, min: number, max: number) => {
  const v = Math.trunc(Number(n));
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;
};
const ALLOWED_KATEGORIEN = new Set(["Doppelzimmer", "Doppelzimmer Einzelnutzung", "Familienzimmer"]);
const ALLOWED_ZIMMER = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "mehr"]);

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context;

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Spam-Honeypot: ausgefüllt = Bot → "ok" vortäuschen, aber NICHT senden.
  if (body.company && String(body.company).trim() !== "") return json({ ok: true });

  // Validierung + Längen-Limits (das Formular validiert zusätzlich clientseitig).
  const name = clamp(body.name, 120);
  const email = clamp(body.email, 254);
  const phone = clamp(body.phone, 40);
  const street = clamp(body.street, 160);
  const city = clamp(body.city, 120);
  const message = clamp(body.message, 2000);
  const paket = clamp(body.paket, 120) || "Zimmer ohne Paket";
  const checkin = clamp(body.checkin, 10);
  const checkout = clamp(body.checkout, 10);
  const persons = clampInt(body.persons, 1, 99);
  const zimmer = ALLOWED_ZIMMER.has(String(body.zimmer)) ? String(body.zimmer) : "1";
  // E-Mail (auch reply_to): ≤254, genau ein @, keine Whitespaces/Zeilenumbrüche.
  const emailOk = email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Zimmer: nur erlaubte Kategorien, max 3, Anzahl 1–5.
  const rooms = (Array.isArray(body.rooms) ? body.rooms : [])
    .filter((r) => r && ALLOWED_KATEGORIEN.has(String(r.kategorie)))
    .slice(0, 3)
    .map((r) => ({ kategorie: String(r.kategorie), anzahl: clampInt(r.anzahl, 1, 5) }));

  // Datenschutz-Einwilligung ist PFLICHT (DSGVO) — ohne sie keine Verarbeitung/Versand,
  // auch nicht bei direktem API-Aufruf (nicht nur clientseitig).
  if (!name || !emailOk || !phone || !checkin || !checkout || rooms.length === 0 || body.datenschutz !== true) {
    return json({ ok: false, error: "validation" }, 422);
  }

  if (!env.RESEND_API_KEY) {
    // Ohne Key kann nicht gesendet werden — ehrlicher Fehler statt Schein-Erfolg.
    // Status 200 mit ok:false: Cloudflare überdeckt 5xx-Antworten der Function mit
    // einer eigenen Fehlerseite, dann käme die Ursache nie beim Client an.
    return json({ ok: false, error: "mail_not_configured" });
  }

  const to = env.INQUIRY_TO || "e.neifer@outlook.de";
  const from = env.INQUIRY_FROM || "Landhaus Schend Anfrage <buchung@landhaus-schend.de>";

  const zimmerStr = rooms
    .map((r) => `${r.kategorie}${r.anzahl > 1 ? ` × ${r.anzahl}` : ""}`)
    .join(", ");
  const extras = [
    body.halbpension ? "Halbpension (zzgl. 23 €/P./Tag)" : null,
    body.kinderbett ? "Zusätzliches Kinderbett" : null,
    body.hund ? "Reise mit Hund (15 €/Tag)" : null,
  ].filter(Boolean) as string[];

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Adresse", [street, city].filter(Boolean).join(", ") || "—"],
    ["E-Mail", email],
    ["Telefon", phone],
    ["Personen", String(persons)],
    ["Paket", paket],
    ["Zimmerwunsch", zimmerStr || "—"],
    ["Anzahl Zimmer", zimmer === "mehr" ? "mehr (bitte klären)" : `${zimmer} Zimmer`],
    ["Anreise", checkin],
    ["Abreise", checkout],
    ["Extras", extras.length ? extras.join(", ") : "—"],
    ["Nachricht", message || "—"],
    ["Datenschutz akzeptiert", body.datenschutz ? "Ja" : "—"],
  ];

  const subject = `Neue Buchungsanfrage – ${name} (${checkin} → ${checkout})`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;max-width:560px">
  <h2 style="font-family:Georgia,serif;color:#9a7b3f;margin:0 0 4px">Landhaus Schend — neue Buchungsanfrage</h2>
  <p style="color:#666;margin:0 0 16px">Unverbindliche Anfrage über die Website. Bitte Verfügbarkeit prüfen und dem Gast direkt antworten (Antwort geht an die Gast-E-Mail).</p>
  <table cellpadding="6" style="border-collapse:collapse;font-size:14px;width:100%">
    ${rows.map(([k, v]) => `<tr><td style="color:#888;vertical-align:top;white-space:nowrap;padding-right:12px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
  </table>
  <p style="color:#aaa;font-size:12px;margin-top:18px">Gesendet über das Anfrageformular von landhaus-schend.de — keine verbindliche Buchung, keine Preiszusage.</p>
</div>`;
  const text =
    `Landhaus Schend — neue Buchungsanfrage (unverbindlich)\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nAntwort geht an die Gast-E-Mail.`;

  // Eingangsbestätigung an den GAST (Schend-Stil) — eigene, gäste-freundliche Kopie.
  const guestRows = rows.filter(([k]) => k !== "Datenschutz akzeptiert" && k !== "Name");
  const guestSubject = "Ihre Anfrage beim Landhaus Schend – wir haben sie erhalten";
  const guestHtml = `<div style="font-family:Georgia,'Times New Roman',serif;color:#2b2b2b;max-width:560px;line-height:1.6">
  <h2 style="font-family:Georgia,serif;color:#9a7b3f;margin:0 0 2px">Landhaus Schend</h2>
  <p style="color:#9a7b3f;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 18px">Hotel · Restaurant · Vulkaneifel</p>
  <p>Guten Tag ${esc(name)},</p>
  <p>vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns persönlich bei Ihnen, sobald wir die Verfügbarkeit für Ihren Wunschzeitraum geprüft haben. Dies ist eine automatische Eingangsbestätigung – noch keine verbindliche Buchung.</p>
  <p style="margin:18px 0 6px;font-weight:bold;color:#9a7b3f">Ihre Angaben im Überblick</p>
  <table cellpadding="6" style="border-collapse:collapse;font-size:14px;width:100%;font-family:Arial,Helvetica,sans-serif">
    ${guestRows.map(([k, v]) => `<tr><td style="color:#888;vertical-align:top;white-space:nowrap;padding-right:12px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
  </table>
  <p style="margin-top:18px">Haben Sie Fragen oder möchten Sie etwas ergänzen? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: <a href="tel:+4965731306" style="color:#9a7b3f">+49 6573 306</a>.</p>
  <p style="margin-top:18px">Herzliche Grüße<br><strong>Ihr Team vom Landhaus Schend</strong></p>
  <p style="color:#aaa;font-size:12px;margin-top:20px;border-top:1px solid #eee;padding-top:12px">
    Landhaus Schend · Hotel - Restaurant · Hauptstraße 9 · 54552 Immerath · Vulkaneifel<br>
    Tel. +49 6573 306 · info@landhaus-schend.de · landhaus-schend.de
  </p>
</div>`;
  const guestText =
    `Landhaus Schend – Eingangsbestätigung Ihrer Anfrage\n\n` +
    `Guten Tag ${name},\n\n` +
    `vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns persönlich, sobald wir die Verfügbarkeit geprüft haben. ` +
    `Dies ist eine automatische Eingangsbestätigung – noch keine verbindliche Buchung.\n\n` +
    `Ihre Angaben:\n` +
    guestRows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nHerzliche Grüße\nIhr Team vom Landhaus Schend\n` +
    `Hauptstraße 9 · 54552 Immerath · Vulkaneifel · Tel. +49 6573 306`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, html, text, tags: [{ name: "type", value: "inquiry" }] }),
    });
    if (r.status >= 200 && r.status < 300) {
      // Best-effort-Kopie an den Gast — darf die erfolgreiche Hotel-Mail NICHT kippen.
      // Hinweis: liefert an beliebige Gäste erst, sobald die Absender-Domain bei Resend
      // verifiziert ist. Mit dem Test-Absender onboarding@resend.dev geht die Kopie nur
      // an die Resend-Konto-Adresse (nicht an fremde Gäste).
      try {
        const cr = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({ from, to: [email], reply_to: "info@landhaus-schend.de", subject: guestSubject, html: guestHtml, text: guestText, tags: [{ name: "type", value: "inquiry_copy" }] }),
        });
        if (cr.status < 200 || cr.status >= 300) console.error("inquiry guest_copy_failed", cr.status, await cr.text().catch(() => ""));
      } catch (e) {
        console.error("inquiry guest_copy_exception", e);
      }
      return json({ ok: true });
    }
    // Detail NUR server-seitig (Cloudflare-Logs) — nie an den Client leaken.
    const detail = await r.text().catch(() => "");
    console.error("inquiry send_failed", r.status, detail);
    return json({ ok: false, error: "send_failed", reason: r.status >= 500 ? "temporary" : "permanent" });
  } catch (e) {
    console.error("inquiry send_exception", e);
    return json({ ok: false, error: "send_exception" });
  }
};
