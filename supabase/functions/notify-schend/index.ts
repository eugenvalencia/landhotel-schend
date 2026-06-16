// Edge Function: notify-schend
// Wird nach erfolgreichem INSERT in bookings vom Postgres-Trigger asynchron aufgerufen.
// Macht zwei Dinge PARALLEL und unabhängig voneinander:
//   1. Interne Buchungs-Benachrichtigung an den Inhaber via Resend — KEINE KI,
//      keine externe Qualifizierung. Gast-Daten bleiben auf der EU-Resend-Strecke;
//      es findet keinerlei KI-Verarbeitung der Anfrage statt.
//   2. Direkt-Bestätigungsmail an den Gast via Resend (DSGVO-konform via EU-Region)
//
// Fehler in einem Pfad sollen den anderen Pfad NICHT blockieren.
//
// Aufruf-Pfad:
//   POST /functions/v1/notify-schend
//   Body: { booking_id: string }
//
// ENV (in Supabase Dashboard setzen):
//   RESEND_API_KEY            = re_xxxxxxxxxxxx  (https://resend.com/api-keys)
//   RESEND_FROM_EMAIL         = buchung@landhaus-schend.de  (verifizierte Sender-Domain)
//   OWNER_NOTIFY_EMAIL        = info@landhaus-schend.de  (Postfach für interne Buchungs-Alerts)
//   SUPABASE_URL              = (auto)
//   SUPABASE_SERVICE_ROLE_KEY = (auto)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderBookingEmail, renderCancellationEmail } from "../_shared/booking-email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "buchung@landhaus-schend.de";
const OWNER_NOTIFY_EMAIL = Deno.env.get("OWNER_NOTIFY_EMAIL") ?? "info@landhaus-schend.de";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS: Diese Function wird seit dem Umstieg auf Client-Trigger (DB-Trigger in
// Migration 20260604180000 entfernt) vom Browser aufgerufen — sowohl von der
// öffentlichen Gast-Buchung als auch vom Rezeptions-Board. Statt offenem "*"
// reflektieren wir nur bekannte Origins (Live-Domain, Vorschau, Cloudflare-Preview,
// lokales Dev) — Defense-in-Depth zusätzlich zum notify_token unten.
const ALLOWED_ORIGINS = [
  "https://landhaus-schend.de",
  "https://www.landhaus-schend.de",
  "https://schend.conexadigital.eu",
];
function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allow =
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+\.landhotel-schend\.pages\.dev$/.test(origin) ||
    /^http:\/\/localhost(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allow ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// Konstantzeit-Vergleich für den notify_token (kein early-return-Timing-Leak).
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Öffentliche Basis-URL für den Storno-Link in den Mails (z. B. https://landhaus-schend.de).
const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://landhaus-schend.de";

// notify-schend kennt vier Mail-Arten. Die Storno-Arten nutzen ein eigenes Template.
type NotifyKind = "request" | "confirmation" | "cancellation" | "cancellation_request";
interface RenderedEmail { subject: string; html: string; text: string; language: string; fromName: string; replyTo: string; }

interface BookingPayload {
  booking_id: string;
  // Pro-Buchung-Geheimnis (von create_booking an den Gast zurückgegeben bzw. vom
  // eingeloggten Hotel per RLS gelesen). Pflicht — ohne korrekten Token kein Versand.
  token?: string;
  // request | confirmation | cancellation | cancellation_request
  kind?: NotifyKind;
}

interface BranchResult {
  ok: boolean;
  status: number;
  detail?: string;
}

// Interne Buchungs-Benachrichtigung an den Inhaber — reiner Resend-Versand an das
// Hotel-Postfach. KEINE KI, kein externer Qualifizierungs-Dienst: die Gast-Daten
// werden ausschließlich an das Hotel selbst zugestellt. Reply-To = Gast, damit der
// Inhaber direkt aus der Mail antworten kann.
async function notifyOwner(args: {
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  extras: Array<{ name: string; price: number; per_night: boolean }>;
  totalPrice: number;
  notes: string;
  language: string | null;
}): Promise<BranchResult> {
  if (!RESEND_API_KEY) return { ok: false, status: 0, detail: "RESEND_API_KEY not configured" };
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
  const extrasTxt = args.extras.length
    ? args.extras.map((e) => `${e.name} (${e.price} €${e.per_night ? "/Nacht" : ""})`).join(", ")
    : "—";
  const rows: Array<[string, string]> = [
    ["Buchungsnummer", args.bookingNumber],
    ["Gast", args.guestName],
    ["E-Mail", args.guestEmail],
    ["Telefon", args.guestPhone || "—"],
    ["Zimmer", args.roomName],
    ["Anreise", args.checkIn],
    ["Abreise", args.checkOut],
    ["Nächte", String(args.nights)],
    ["Extras", extrasTxt],
    ["Gesamt", `${args.totalPrice} €`],
    ["Sprache", (args.language || "de").toUpperCase()],
    ["Notiz", args.notes || "—"],
  ];
  const html = `<h2 style="font-family:Arial,sans-serif">Neue Buchungsanfrage #${esc(args.bookingNumber)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
</table>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#666">Die Anfrage liegt auch im Rezeptions-Board. Auf diese E-Mail antworten geht direkt an den Gast.</p>`;
  const text = `Neue Buchungsanfrage #${args.bookingNumber}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Landhaus Schend Buchung <${RESEND_FROM_EMAIL}>`,
        to: [OWNER_NOTIFY_EMAIL],
        reply_to: args.guestEmail,
        subject: `Neue Buchungsanfrage #${args.bookingNumber} — ${args.guestName}`,
        html,
        text,
        tags: [{ name: "type", value: "owner-alert" }],
      }),
    });
    return { ok: r.status >= 200 && r.status < 300, status: r.status, detail: await r.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: -1, detail: String(e) };
  }
}

// Inhaber-Alert bei einer Gast-Stornierung bzw. gebührenpflichtigen Storno-Anfrage.
async function notifyOwnerCancellation(args: {
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomName: string;
  checkIn: string;
  checkOut: string;
  requested: boolean;
  feePct: number;
}): Promise<BranchResult> {
  if (!RESEND_API_KEY) return { ok: false, status: 0, detail: "RESEND_API_KEY not configured" };
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
  const titel = args.requested
    ? `Storno-ANFRAGE #${esc(args.bookingNumber)} (${args.feePct} % Pauschale) — im Board bestätigen`
    : `Stornierung #${esc(args.bookingNumber)} durch Gast`;
  const rows: Array<[string, string]> = [
    ["Buchungsnummer", args.bookingNumber],
    ["Gast", args.guestName],
    ["E-Mail", args.guestEmail],
    ["Telefon", args.guestPhone || "—"],
    ["Zimmer", args.roomName],
    ["Anreise", args.checkIn],
    ["Abreise", args.checkOut],
    ...(args.requested ? [["Stornopauschale", `${args.feePct} %`] as [string, string]] : []),
  ];
  const html = `<h2 style="font-family:Arial,sans-serif">${esc(titel)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
</table>
<p style="font-family:Arial,sans-serif;font-size:13px;color:${args.requested ? "#a33" : "#666"}">${args.requested ? "Bitte im Rezeptions-Board bestätigen oder ablehnen." : "Der Termin ist wieder frei."}</p>`;
  const text = `${titel}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Landhaus Schend Buchung <${RESEND_FROM_EMAIL}>`,
        to: [OWNER_NOTIFY_EMAIL],
        reply_to: args.guestEmail,
        subject: titel,
        html,
        text,
        tags: [{ name: "type", value: args.requested ? "owner-storno-request" : "owner-storno" }],
      }),
    });
    return { ok: r.status >= 200 && r.status < 300, status: r.status, detail: await r.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: -1, detail: String(e) };
  }
}

async function sendGuestConfirmation(args: {
  guestEmail: string;
  payload: RenderedEmail;
  mailTag: string;
}): Promise<BranchResult> {
  if (!RESEND_API_KEY) return { ok: false, status: 0, detail: "RESEND_API_KEY not configured" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${args.payload.fromName} <${RESEND_FROM_EMAIL}>`,
        to: [args.guestEmail],
        reply_to: args.payload.replyTo,
        subject: args.payload.subject,
        html: args.payload.html,
        text: args.payload.text,
        headers: { "Content-Language": args.payload.language },
        tags: [
          { name: "type", value: args.mailTag },
          { name: "lang", value: args.payload.language },
        ],
      }),
    });
    return { ok: r.status >= 200 && r.status < 300, status: r.status, detail: await r.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: -1, detail: String(e) };
  }
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  // CORS-Preflight (Browser schickt OPTIONS vor dem POST)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  let body: BookingPayload;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }
  if (!body.booking_id) {
    return new Response("booking_id required", { status: 400, headers: corsHeaders });
  }
  const allowedKinds = ["request", "confirmation", "cancellation", "cancellation_request"];
  const kind: NotifyKind = allowedKinds.includes(body.kind ?? "") ? (body.kind as NotifyKind) : "request";
  const isCancellation = kind === "cancellation" || kind === "cancellation_request";

  // Booking laden inkl. Room + Extras + preferred_language + notify_token
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_number, guest_name, guest_email, guest_phone,
      check_in, check_out, total_price, extras, notes, payment_status, created_at,
      preferred_language, notifications, notify_token, cancellation_fee_pct,
      rooms ( name, room_type, bed_description )
    `)
    .eq("id", body.booking_id)
    .single();

  if (error || !booking) {
    return new Response(`Booking not found: ${error?.message ?? "?"}`, { status: 404, headers: corsHeaders });
  }

  // ----- IDOR-Schutz -----
  // Nur senden, wenn der pro-Buchung-Token passt. Ohne diesen Nachweis darf niemand
  // fremde Gast-Mails oder verbindliche Bestätigungen auslösen — selbst wenn er eine
  // booking_id kennt. Die Antwort ist absichtlich generisch (kein PII-Leak, kein
  // Hinweis ob die Buchung existiert).
  const providedToken = typeof body.token === "string" ? body.token : "";
  const expectedToken = (booking as { notify_token?: string }).notify_token ?? "";
  if (!timingSafeEqual(providedToken, expectedToken)) {
    return new Response(
      JSON.stringify({ ok: false, error: "forbidden" }),
      { status: 403, headers: jsonHeaders },
    );
  }

  // Idempotenz: dieselbe Mail-Art nicht im Sekundentakt doppelt senden
  // (Doppelklick / Race / wiederholter Client-Trigger). Bewusster Resend
  // nach > 120 s bleibt möglich (z. B. „E-Mail erneut senden" im Dashboard).
  const sentMap = (booking.notifications ?? {}) as Record<string, string>;
  const lastSent = sentMap[kind] ? Date.parse(sentMap[kind]) : 0;
  if (lastSent && Date.now() - lastSent < 120_000) {
    return new Response(
      JSON.stringify({ ok: true, deduped: true, kind }),
      { headers: jsonHeaders },
    );
  }

  // Nächte berechnen
  const ci = new Date(booking.check_in);
  const co = new Date(booking.check_out);
  const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86_400_000));

  const room = booking.rooms as { name?: string; room_type?: string; bed_description?: string } | null;
  const extras = (booking.extras ?? []) as Array<{ name: string; price: number; per_night: boolean }>;

  // Gast-Email Payload rendern — Buchung/Bestätigung ODER Storno (separates Template).
  const cancelUrl = `${SITE_URL}/storno?b=${booking.id}&t=${encodeURIComponent(expectedToken)}`;
  const feePct = Number((booking as { cancellation_fee_pct?: number }).cancellation_fee_pct ?? 0);

  const emailPayload: RenderedEmail = isCancellation
    ? renderCancellationEmail({
        language: booking.preferred_language,
        kind: kind === "cancellation" ? "cancelled" : "requested",
        bookingNumber: booking.booking_number,
        guestName: booking.guest_name,
        roomName: room?.name ?? "Zimmer",
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        feePct,
      })
    : renderBookingEmail({
        language: booking.preferred_language,
        kind: kind === "confirmation" ? "confirmation" : "request",
        bookingNumber: booking.booking_number,
        guestName: booking.guest_name,
        roomName: room?.name ?? "Zimmer",
        roomType: room?.room_type ?? null,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        nights,
        extras,
        totalPrice: Number(booking.total_price ?? 0),
        notes: booking.notes ?? "",
        cancelUrl, // Storno-Button nur in Anfrage-/Bestätigungsmail
      });

  const mailTag = kind === "confirmation" ? "booking-confirmation"
    : kind === "cancellation" ? "booking-cancellation"
    : kind === "cancellation_request" ? "booking-cancellation-request"
    : "booking-request";

  // Inhaber-Alert: bei NEUER Anfrage (request) oder Storno/Storno-Anfrage. Bei der
  // verbindlichen Bestätigung (confirmation) kein Alert — die löst das Hotel selbst aus.
  const ownerAlert: Promise<BranchResult> =
    kind === "request"
      ? notifyOwner({
          bookingNumber: booking.booking_number,
          guestName: booking.guest_name,
          guestEmail: booking.guest_email,
          guestPhone: booking.guest_phone,
          roomName: room?.name ?? "Zimmer",
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          nights,
          extras,
          totalPrice: Number(booking.total_price ?? 0),
          notes: booking.notes ?? "",
          language: booking.preferred_language,
        })
      : isCancellation
        ? notifyOwnerCancellation({
            bookingNumber: booking.booking_number,
            guestName: booking.guest_name,
            guestEmail: booking.guest_email,
            guestPhone: booking.guest_phone,
            roomName: room?.name ?? "Zimmer",
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            requested: kind === "cancellation_request",
            feePct,
          })
        : Promise.resolve<BranchResult>({ ok: true, status: 0, detail: "owner alert skipped (confirmation)" });

  const [ownerResult, mailResult] = await Promise.all([
    ownerAlert,
    sendGuestConfirmation({ guestEmail: booking.guest_email, payload: emailPayload, mailTag }),
  ]);

  // Versand-Zeitstempel für die Idempotenz festhalten — nur wenn die Mail
  // wirklich rausging (fehlgeschlagene Sends dürfen erneut versucht werden).
  if (mailResult.ok) {
    await supabase
      .from("bookings")
      .update({ notifications: { ...sentMap, [kind]: new Date().toISOString() } })
      .eq("id", booking.id);
  }

  console.log(
    JSON.stringify({
      booking_id: booking.id,
      booking_number: booking.booking_number,
      lang: emailPayload.language,
      owner: { ok: ownerResult.ok, status: ownerResult.status },
      mail: { ok: mailResult.ok, status: mailResult.status, detail: mailResult.ok ? undefined : mailResult.detail?.slice(0, 200) },
      ts: new Date().toISOString(),
    }),
  );

  return new Response(
    JSON.stringify({
      ok: ownerResult.ok && mailResult.ok,
      owner: { ok: ownerResult.ok, status: ownerResult.status },
      mail: { ok: mailResult.ok, status: mailResult.status },
    }),
    { headers: jsonHeaders },
  );
});
