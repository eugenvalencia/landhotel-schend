// Edge Function: notify-schend
// Wird nach erfolgreichem INSERT in bookings aufgerufen (Trigger oder RPC-Erweiterung).
// Sendet Payload an n8n-Webhook → n8n qualifiziert via Claude + benachrichtigt Inhaber.
//
// Aufruf-Pfad:
//   POST /functions/v1/notify-schend
//   Body: { booking_id: string }
//
// ENV (in Supabase Dashboard setzen):
//   N8N_WEBHOOK_URL      = https://n8n.conexadigital.eu/webhook/landhaus-schend-lead
//   N8N_WEBHOOK_SECRET   = <shared secret zwischen Edge Function und n8n>
//   SUPABASE_URL         = (auto)
//   SUPABASE_SERVICE_ROLE_KEY = (auto)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL")!;
const N8N_WEBHOOK_SECRET = Deno.env.get("N8N_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface BookingPayload {
  booking_id: string;
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

  // Payload an n8n — preferred_language ist Top-Level damit der Prompt es leicht findet
  const payload = {
    source: "landhaus-schend.de",
    booking_id: booking.id,
    booking_number: booking.booking_number,
    preferred_language: booking.preferred_language, // 'de' | 'en' | 'fr' | 'nl' | null
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
    extras: booking.extras ?? [],
    notes: booking.notes ?? "",
    total_price: booking.total_price,
    created_at: booking.created_at,
  };

  // POST an n8n
  let n8nStatus = 0;
  let n8nResponse = "";
  try {
    const r = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
    });
    n8nStatus = r.status;
    n8nResponse = await r.text();
  } catch (e) {
    n8nStatus = -1;
    n8nResponse = String(e);
  }

  // Audit-Log in bookings.notes ergänzen wäre invasiv — wir nutzen optional eine Tabelle "webhook_log"
  // Wenn nicht vorhanden, einfach via console.log (Supabase-Logs reichen für MVP)
  console.log(
    JSON.stringify({
      booking_id: booking.id,
      n8n_status: n8nStatus,
      ts: new Date().toISOString(),
    }),
  );

  return new Response(
    JSON.stringify({ ok: n8nStatus >= 200 && n8nStatus < 300, n8n_status: n8nStatus }),
    { headers: { "Content-Type": "application/json" } },
  );
});
