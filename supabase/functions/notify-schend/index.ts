// Edge Function: notify-schend
// Wird nach erfolgreichem INSERT in bookings vom Postgres-Trigger asynchron aufgerufen.
// Macht zwei Dinge PARALLEL und unabhängig voneinander:
//   1. Push an n8n-Webhook → n8n qualifiziert + benachrichtigt den Inhaber
//   2. Direkt-Bestätigungsmail an den Gast via Resend (DSGVO-konform via EU-Region)
//
// Fehler in einem Pfad sollen den anderen Pfad NICHT blockieren.
//
// Aufruf-Pfad:
//   POST /functions/v1/notify-schend
//   Body: { booking_id: string }
//
// ENV (in Supabase Dashboard setzen):
//   N8N_WEBHOOK_URL           = https://n8n.conexadigital.eu/webhook/landhaus-schend-lead
//   N8N_WEBHOOK_SECRET        = <shared secret zwischen Edge Function und n8n>
//   RESEND_API_KEY            = re_xxxxxxxxxxxx  (https://resend.com/api-keys)
//   RESEND_FROM_EMAIL         = buchung@landhaus-schend.de  (verifizierte Sender-Domain)
//   SUPABASE_URL              = (auto)
//   SUPABASE_SERVICE_ROLE_KEY = (auto)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderBookingEmail, type EmailKind } from "../_shared/booking-email.ts";

const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL") ?? "";
const N8N_WEBHOOK_SECRET = Deno.env.get("N8N_WEBHOOK_SECRET") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "buchung@landhaus-schend.de";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

async function pushToN8n(payload: unknown): Promise<BranchResult> {
  if (!N8N_WEBHOOK_URL) return { ok: false, status: 0, detail: "N8N_WEBHOOK_URL not configured" };
  try {
    const r = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
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
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: BookingPayload;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.booking_id) {
    return new Response("booking_id required", { status: 400 });
  }
  const kind: EmailKind = body.kind === "confirmation" ? "confirmation" : "request";

  // Booking laden inkl. Room + Extras + preferred_language
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_number, guest_name, guest_email, guest_phone,
      check_in, check_out, total_price, extras, notes, payment_status, created_at,
      preferred_language,
      rooms ( name, room_type, bed_description )
    `)
    .eq("id", body.booking_id)
    .single();

  if (error || !booking) {
    return new Response(`Booking not found: ${error?.message ?? "?"}`, { status: 404 });
  }

  // Nächte berechnen
  const ci = new Date(booking.check_in);
  const co = new Date(booking.check_out);
  const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86_400_000));

  // n8n-Payload (für Owner-Qualification über Claude)
  const room = booking.rooms as { name?: string; room_type?: string; bed_description?: string } | null;
  const extras = (booking.extras ?? []) as Array<{ name: string; price: number; per_night: boolean }>;

  const n8nPayload = {
    source: "landhaus-schend.de",
    booking_id: booking.id,
    booking_number: booking.booking_number,
    preferred_language: booking.preferred_language,
    guest: {
      name: booking.guest_name,
      email: booking.guest_email,
      phone: booking.guest_phone,
    },
    stay: {
      check_in: booking.check_in,
      check_out: booking.check_out,
      nights,
    },
    room: booking.rooms,
    extras,
    notes: booking.notes ?? "",
    total_price: booking.total_price,
    created_at: booking.created_at,
  };

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

  // Parallel: n8n + Gast-Email. Beide Pfade sind voneinander unabhängig.
  // n8n läuft nur bei einer NEUEN Anfrage (Owner-Qualifikation via Claude);
  // beim Bestätigen geht ausschließlich die verbindliche Gast-Mail raus.
  const [n8nResult, mailResult] = await Promise.all([
    kind === "request"
      ? pushToN8n(n8nPayload)
      : Promise.resolve<BranchResult>({ ok: true, status: 0, detail: "n8n skipped (confirmation)" }),
    sendGuestConfirmation({ guestEmail: booking.guest_email, payload: emailPayload, kind }),
  ]);

  console.log(
    JSON.stringify({
      booking_id: booking.id,
      booking_number: booking.booking_number,
      lang: emailPayload.language,
      n8n: { ok: n8nResult.ok, status: n8nResult.status },
      mail: { ok: mailResult.ok, status: mailResult.status, detail: mailResult.ok ? undefined : mailResult.detail?.slice(0, 200) },
      ts: new Date().toISOString(),
    }),
  );

  return new Response(
    JSON.stringify({
      ok: n8nResult.ok && mailResult.ok,
      n8n: { ok: n8nResult.ok, status: n8nResult.status },
      mail: { ok: mailResult.ok, status: mailResult.status },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
