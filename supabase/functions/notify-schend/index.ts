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
import { renderBookingEmail, type EmailKind } from "../_shared/booking-email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "buchung@landhaus-schend.de";
const OWNER_NOTIFY_EMAIL = Deno.env.get("OWNER_NOTIFY_EMAIL") ?? "info@landhaus-schend.de";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS: Diese Function wird seit dem Umstieg auf Client-Trigger (DB-Trigger in
// Migration 20260604180000 entfernt) vom Browser aufgerufen — sowohl von der
// öffentlichen Gast-Buchung als auch vom Rezeptions-Board. Ohne diese Header
// blockt der Browser den Aufruf per CORS-Preflight und es geht KEINE Gast-Mail raus.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

interface BookingPayload {
  booking_id: string;
  // 'request' (default) = Eingangsbestätigung beim Insert
  // 'confirmation' = verbindliche Bestätigung, wenn das Hotel die Anfrage bestätigt
  kind?: EmailKind;
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
        from: `Landhotel Schend Buchung <${RESEND_FROM_EMAIL}>`,
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

async function sendGuestConfirmation(args: {
  guestEmail: string;
  payload: ReturnType<typeof renderBookingEmail>;
  kind: EmailKind;
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
          { name: "type", value: args.kind === "confirmation" ? "booking-confirmation" : "booking-request" },
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
  const kind: EmailKind = body.kind === "confirmation" ? "confirmation" : "request";

  // Booking laden inkl. Room + Extras + preferred_language
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_number, guest_name, guest_email, guest_phone,
      check_in, check_out, total_price, extras, notes, payment_status, created_at,
      preferred_language, notifications,
      rooms ( name, room_type, bed_description )
    `)
    .eq("id", body.booking_id)
    .single();

  if (error || !booking) {
    return new Response(`Booking not found: ${error?.message ?? "?"}`, { status: 404, headers: corsHeaders });
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

  // Gast-Email Payload rendern
  const emailPayload = renderBookingEmail({
    language: booking.preferred_language,
    kind,
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
  });

  // Parallel: Inhaber-Alert + Gast-Email. Beide Pfade sind voneinander unabhängig.
  // Der Inhaber-Alert geht nur bei einer NEUEN Anfrage raus; beim Bestätigen geht
  // ausschließlich die verbindliche Gast-Mail raus. KEINE KI im Spiel.
  const [ownerResult, mailResult] = await Promise.all([
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
      : Promise.resolve<BranchResult>({ ok: true, status: 0, detail: "owner alert skipped (confirmation)" }),
    sendGuestConfirmation({ guestEmail: booking.guest_email, payload: emailPayload, kind }),
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
