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
  persons?: number; paket?: string; rooms?: Room[];
  checkin?: string; checkout?: string; message?: string;
  halbpension?: boolean; kinderbett?: boolean; hund?: boolean;
  datenschutz?: boolean; company?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

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

  // Minimal-Validierung (das Formular validiert zusätzlich clientseitig).
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const checkin = String(body.checkin ?? "").trim();
  const checkout = String(body.checkout ?? "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const rooms = Array.isArray(body.rooms) ? body.rooms : [];
  if (!name || !emailOk || !phone || !checkin || !checkout || rooms.length === 0) {
    return json({ ok: false, error: "validation" }, 422);
  }

  if (!env.RESEND_API_KEY) {
    // Ohne Key kann nicht gesendet werden — ehrlicher Fehler statt Schein-Erfolg.
    return json({ ok: false, error: "mail_not_configured" }, 503);
  }

  const to = env.INQUIRY_TO || "e.neifer@outlook.de";
  const from = env.INQUIRY_FROM || "Landhaus Schend Anfrage <buchung@landhaus-schend.de>";

  const zimmerStr = rooms
    .map((r) => `${r.kategorie ?? "?"}${r.anzahl && r.anzahl > 1 ? ` × ${r.anzahl}` : ""}`)
    .join(", ");
  const extras = [
    body.halbpension ? "Halbpension (zzgl. 23 €/P./Tag)" : null,
    body.kinderbett ? "Zusätzliches Kinderbett" : null,
    body.hund ? "Reise mit Hund (15 €/Tag)" : null,
  ].filter(Boolean) as string[];

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Adresse", [body.street, body.city].filter(Boolean).join(", ") || "—"],
    ["E-Mail", email],
    ["Telefon", phone],
    ["Personen", String(body.persons ?? "—")],
    ["Paket", String(body.paket ?? "Zimmer ohne Paket buchen")],
    ["Zimmerwunsch", zimmerStr || "—"],
    ["Anreise", checkin],
    ["Abreise", checkout],
    ["Extras", extras.length ? extras.join(", ") : "—"],
    ["Nachricht", String(body.message ?? "").trim() || "—"],
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

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, html, text, tags: [{ name: "type", value: "inquiry" }] }),
    });
    if (r.status >= 200 && r.status < 300) return json({ ok: true });
    return json({ ok: false, error: "send_failed", status: r.status }, 502);
  } catch {
    return json({ ok: false, error: "send_exception" }, 502);
  }
};
