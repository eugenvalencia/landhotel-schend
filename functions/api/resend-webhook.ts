// Cloudflare Pages Function — Resend meldet hier zurückgekommene Mails.
//
// ── Warum es das gibt ───────────────────────────────────────────────────────
// Am 13.08.2026 kam die Eingangsbestätigung an einen Gast nicht an: SEIN
// Mailserver lehnte ab (550 5.7.1). Die Anfrage lag im Postfach des Hotels,
// der Gast wusste sechs Tage lang nicht, ob sie angekommen ist — und NIEMAND
// hat es bemerkt. Der Fehler war sichtbar, aber nur im Resend-Protokoll, in
// das niemand schaut.
//
// Dieser Endpunkt verhindert den Ausfall nicht. Er sorgt dafür, dass das Hotel
// ihn ERFÄHRT — mit der Adresse des Gastes, damit jemand anrufen kann.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   RESEND_WEBHOOK_SECRET  (Secret, PFLICHT)  — »whsec_…« aus Resend → Webhooks
//   RESEND_API_KEY         (Secret, PFLICHT)  — derselbe Key wie in inquiry.ts
//   INQUIRY_TO             (PFLICHT)          — Postfach des Hotels
//   INQUIRY_FROM           (optional)         — Absender, Default wie in inquiry.ts
//   ALERT_CC               (optional)         — wer die Warnung MITBEKOMMT,
//                                               kommagetrennt. Gedacht für uns
//                                               (Conexa): das Hotel ruft im
//                                               Ernstfall ohnehin an — dann
//                                               wissen wir schon Bescheid,
//                                               statt beim Anruf zu raten.

interface Env {
  RESEND_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  INQUIRY_TO?: string;
  INQUIRY_FROM?: string;
  ALERT_CC?: string;
  // NUR für die Messung (scripts/pruefe-resend-webhook.mjs): zeigt auf einen
  // lokalen Nachbau von Resend, damit die Prüfung den echten Inhalt der
  // Warn-Mail lesen kann, OHNE eine Mail ans Hotel auszulösen. In Cloudflare
  // ist die Variable nicht gesetzt — dann gilt api.resend.com.
  RESEND_API_BASE?: string;
}

interface ResendEvent {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    created_at?: string;
    from?: string;
    to?: string[] | string;
    subject?: string;
    tags?: Record<string, string>;
    bounce?: { type?: string; subType?: string; message?: string };
    failed?: { reason?: string };
  };
}

// Nur diese zwei Ereignisse bedeuten »der Gast hat nichts bekommen«:
//   email.bounced — der Empfänger-Server hat abgelehnt (der Fall vom 13.08.)
//   email.failed  — Resend konnte gar nicht erst zustellen
// ⛔ NICHT dabei: email.delivery_delayed (Resend versucht weiter, ein Alarm wäre
// meistens falsch) und email.complained (angekommen, nur unerwünscht).
const ALARM_EREIGNISSE = new Set(["email.bounced", "email.failed"]);

const TOLERANZ_MS = 5 * 60 * 1000; // Svix-Standard gegen Wiedereinspielung

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

// ── Signaturprüfung (Svix-Verfahren, das Resend verwendet) ──────────────────
// Signiert wird »<id>.<zeitstempel>.<roher Rumpf>« mit HMAC-SHA256; der
// Schlüssel ist der base64-Teil hinter »whsec_«. Der Kopf trägt eine durch
// Leerzeichen getrennte Liste »v1,<base64>« — bei einem Schlüsselwechsel sind
// kurzzeitig zwei gültig, deshalb wird jede Fassung geprüft.
//
// ⚠ Ohne diese Prüfung könnte JEDER eine Mail ins Hotelpostfach auslösen,
// indem er einen erfundenen Bounce an diese Adresse schickt.
const b64ToBytes = (b64: string): Uint8Array<ArrayBuffer> => {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const bytesToB64 = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)));

// Zeichenweiser Vergleich mit fester Laufzeit — ein früher Abbruch verriete
// über die Antwortzeit, wie viele Zeichen schon stimmen.
function gleichLang(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signaturGueltig(
  secret: string,
  id: string,
  timestamp: string,
  rawBody: string,
  signatureHeader: string,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    b64ToBytes(secret.replace(/^whsec_/, "")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const erwartet = bytesToB64(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id + "." + timestamp + "." + rawBody)),
  );
  return signatureHeader
    .split(" ")
    .map((teil) => teil.split(",")[1] ?? "")
    .some((sig) => sig !== "" && gleichLang(sig, erwartet));
}

// ── Doppelte Zustellungen ───────────────────────────────────────────────────
// Svix stellt bei Zeitüberschreitung erneut zu. Ohne Gedächtnis bekäme das
// Hotel dieselbe Meldung mehrfach.
// ⚠ Wie die Bremse in inquiry.ts lebt der Speicher in EINER Worker-Instanz.
// Cloudflare hält je Rechenzentrum eigene — eine Wiederholung, die woanders
// landet, wird also durchgelassen. Eine doppelte Warnung ist der harmlosere
// Fehler als eine ausgebliebene; für Genauigkeit gehörte hier KV hin.
const gesehen = new Map<string, number>();
const GEDAECHTNIS_MS = 24 * 60 * 60 * 1000;

function schonBearbeitet(id: string, now: number): boolean {
  for (const [k, t] of gesehen) if (now - t > GEDAECHTNIS_MS) gesehen.delete(k);
  return gesehen.has(id);
}

const grundKlartext = (ev: ResendEvent): string => {
  const b = ev.data?.bounce;
  if (ev.type === "email.failed") {
    return "Der Versand ist fehlgeschlagen. " + (ev.data?.failed?.reason ?? "Kein näherer Grund übermittelt.");
  }
  const art =
    b?.type === "Permanent"
      ? "Die Adresse nimmt dauerhaft nichts an — vermutlich ein Tippfehler oder ein gesperrtes Postfach."
      : b?.type === "Transient"
        ? "Ein vorübergehendes Problem beim Empfänger — der Server war voll oder nicht erreichbar."
        : "Der Grund ist unklar.";
  return b?.message ? art + " Meldung des Empfängers: „" + b.message + "“" : art;
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context;

  // Der rohe Rumpf — NICHT erst parsen und wieder ausgeben. Die Signatur gilt
  // Byte für Byte, jede Umformatierung macht sie ungültig.
  const rawBody = await request.text();

  const h = request.headers;
  // Resend sendet die Svix-Köpfe; neuere Fassungen zusätzlich unter den
  // herstellerneutralen Namen. Beide annehmen, sonst bricht es beim Wechsel.
  const id = h.get("svix-id") || h.get("webhook-id") || "";
  const timestamp = h.get("svix-timestamp") || h.get("webhook-timestamp") || "";
  const signature = h.get("svix-signature") || h.get("webhook-signature") || "";

  if (!env.RESEND_WEBHOOK_SECRET) {
    // Ohne Geheimnis kann nichts geprüft werden. Dann lieber ehrlich scheitern
    // als ungeprüfte Meldungen ans Hotel durchreichen — Resend wiederholt und
    // zeigt den Endpunkt im Dashboard als rot an.
    console.error("resend-webhook secret_missing");
    return json({ ok: false, error: "not_configured" }, 500);
  }
  if (!id || !timestamp || !signature) return json({ ok: false, error: "unsigned" }, 401);

  const now = Date.now();
  const tsMs = Number(timestamp) * 1000;
  if (!Number.isFinite(tsMs) || Math.abs(now - tsMs) > TOLERANZ_MS) {
    return json({ ok: false, error: "stale" }, 401);
  }

  let echt = false;
  try {
    echt = await signaturGueltig(env.RESEND_WEBHOOK_SECRET, id, timestamp, rawBody, signature);
  } catch (e) {
    console.error("resend-webhook signature_exception", e);
  }
  if (!echt) return json({ ok: false, error: "bad_signature" }, 401);

  // Ab hier ist die Meldung nachweislich von Resend.
  let ev: ResendEvent;
  try {
    ev = JSON.parse(rawBody);
  } catch {
    return json({ ok: true, ignored: "unparsable" });
  }

  if (!ALARM_EREIGNISSE.has(String(ev.type))) return json({ ok: true, ignored: ev.type ?? "unknown" });
  if (schonBearbeitet(id, now)) return json({ ok: true, ignored: "duplicate" });

  const empfaenger = (Array.isArray(ev.data?.to) ? ev.data?.to : [ev.data?.to])
    .filter(Boolean)
    .map((a) => String(a).trim());

  if (!env.RESEND_API_KEY || !env.INQUIRY_TO) {
    console.error("resend-webhook mail_not_configured");
    return json({ ok: false, error: "mail_not_configured" }, 500);
  }
  const hotel = env.INQUIRY_TO.trim().toLowerCase();
  const from = env.INQUIRY_FROM || "Landhaus Schend <info@landhaus-schend.de>";

  // Wer die Warnung mitbekommt. Leer, wenn ALERT_CC nicht gesetzt ist — dann
  // verhält sich der Melder wie vorher.
  const mitleser = (env.ALERT_CC || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  // ⚠ SCHLEIFENBREMSE — zugleich die Prüfung, ob überhaupt ein Gast betroffen ist.
  // Die Warnung unten geht ans Hotelpostfach. Käme SIE zurück, meldete Resend
  // erneut, wir schrieben erneut ans Hotel — endlos. Deshalb: Wenn der einzige
  // betroffene Empfänger das Hotel selbst ist, wird nichts verschickt.
  // (Und es wäre ohnehin sinnlos — wir schrieben an genau das Postfach, das
  // gerade nachweislich nichts annimmt.)
  //
  // ⚠⚠ Die Mitleser gehören in DIESELBE Ausnahme. Sonst reicht eine Warnung,
  // die bei UNS zurückprellt, um eine neue Warnung auszulösen — mit uns selbst
  // als vermeintlich betroffenem Gast. Die Schleife wäre nur eine Ecke länger.
  const ausgenommen = new Set([hotel, ...mitleser.map((a) => a.toLowerCase())]);
  const gaeste = empfaenger.filter((a) => !ausgenommen.has(a.toLowerCase()));
  if (gaeste.length === 0) {
    console.error("resend-webhook hotel_mailbox_bounced", ev.data?.email_id, grundKlartext(ev));
    gesehen.set(id, now);
    return json({ ok: true, ignored: "hotel_recipient" });
  }

  const adresse = gaeste.join(", ");
  const gesendetAm = ev.data?.created_at
    ? new Date(ev.data.created_at).toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" })
    : "unbekannt";
  const grund = grundKlartext(ev);

  const zeilen: Array<[string, string]> = [
    ["Adresse des Gastes", adresse],
    ["Betreff der Mail", ev.data?.subject || "—"],
    ["Gesendet am", gesendetAm],
    ["Was passiert ist", grund],
  ];

  // ⚠ Dieser Satz darf NUR erscheinen, wenn wir wirklich in Kopie sind. Sonst
  // stünde in der Mail ans Hotel eine Zusage, die niemand eingelöst hat.
  const mitgelesen = mitleser.length > 0;
  const hinweisHtml = mitgelesen
    ? `<p style="background:#f6f2e8;border-left:3px solid #9a7b3f;padding:10px 14px;margin:16px 0">
    <strong>Das Team von Conexa Digital ist informiert.</strong> Diese Nachricht ging zugleich an uns —
    Sie müssen uns nichts weiterleiten. Wenn Sie Fragen haben, rufen Sie einfach an.</p>`
    : "";
  const hinweisText = mitgelesen
    ? "\nDas Team von Conexa Digital ist informiert. Diese Nachricht ging zugleich\n" +
      "an uns — Sie muessen uns nichts weiterleiten.\n"
    : "";

  const subject = "Wichtig: Unsere E-Mail an " + adresse + " kam nicht an";
  const html = `<div style="font-family:Georgia,'Times New Roman',serif;color:#2b2b2b;max-width:560px;line-height:1.6">
  <h2 style="font-family:Georgia,serif;color:#9a7b3f;margin:0 0 2px">Landhaus Schend</h2>
  <p style="color:#9a7b3f;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 18px">Hinweis zum Anfrageformular</p>
  <p><strong>Eine E-Mail von Ihnen hat den Gast nicht erreicht.</strong></p>
  <p>Der Mailserver des Gastes hat sie abgelehnt. Der Gast weiß deshalb nicht, ob seine Anfrage bei Ihnen angekommen ist — <strong>seine Anfrage liegt aber in Ihrem Postfach</strong>.</p>
  <table cellpadding="6" style="border-collapse:collapse;font-size:14px;width:100%;font-family:Arial,Helvetica,sans-serif">
    ${zeilen.map(([k, v]) => `<tr><td style="color:#888;vertical-align:top;white-space:nowrap;padding-right:12px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
  </table>
  <p style="margin:18px 0 6px;font-weight:bold;color:#9a7b3f">Was jetzt zu tun ist</p>
  <p>Suchen Sie in Ihrem Postfach nach <strong>${esc(adresse)}</strong> — dort liegt die Buchungsanfrage mit Name und Telefonnummer. Ein kurzer Anruf klärt es.</p>
  ${hinweisHtml}
  <p style="font-family:Arial,Helvetica,sans-serif;color:#aaa;font-size:12px;margin-top:20px;border-top:1px solid #eee;padding-top:12px">
    Automatischer Hinweis der Website landhaus-schend.de. Er wird ausgelöst, sobald eine E-Mail zurückkommt — Sie müssen nichts einrichten.
  </p>
</div>`;
  const text =
    "Landhaus Schend — eine E-Mail hat den Gast nicht erreicht\n\n" +
    "Der Mailserver des Gastes hat sie abgelehnt. Der Gast weiß nicht, ob seine\n" +
    "Anfrage angekommen ist — seine Anfrage liegt aber in Ihrem Postfach.\n\n" +
    zeilen.map(([k, v]) => k + ": " + v).join("\n") +
    "\n\nWas jetzt zu tun ist:\n" +
    "Suchen Sie in Ihrem Postfach nach " + adresse + " — dort liegt die Buchungs-\n" +
    "anfrage mit Name und Telefonnummer. Ein kurzer Anruf klärt es.\n" +
    hinweisText +
    "\nAutomatischer Hinweis der Website landhaus-schend.de.";

  try {
    const r = await fetch((env.RESEND_API_BASE || "https://api.resend.com") + "/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.RESEND_API_KEY },
      body: JSON.stringify({
        from,
        // Das Hotel zuerst, dann die Mitleser. Eine Mail an alle statt zwei
        // getrennte: so sieht das Hotel im eigenen Postfach, wer noch Bescheid
        // weiß, und wir sehen denselben Wortlaut, den es bekommen hat.
        to: [env.INQUIRY_TO, ...mitleser],
        subject,
        html,
        text,
        // Markierung, damit im Resend-Protokoll auf einen Blick unterscheidbar
        // ist, was Gast-Mail war und was Warnung ans Hotel.
        tags: [{ name: "type", value: "bounce_alert" }],
      }),
    });
    if (r.status < 200 || r.status >= 300) {
      // Kein Erfolg vortäuschen: mit 500 wiederholt Svix die Zustellung, die
      // Meldung ist damit nicht verloren. Der Eintrag ins Gedächtnis erfolgt
      // erst NACH erfolgreichem Versand — sonst würde die Wiederholung verworfen.
      console.error("resend-webhook alert_send_failed", r.status, await r.text().catch(() => ""));
      return json({ ok: false, error: "alert_send_failed" }, 500);
    }
  } catch (e) {
    console.error("resend-webhook alert_send_exception", e);
    return json({ ok: false, error: "alert_send_exception" }, 500);
  }

  gesehen.set(id, now);
  return json({ ok: true, alerted: adresse });
};
