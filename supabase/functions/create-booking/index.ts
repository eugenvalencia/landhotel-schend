// Server-side booking creation. Validates inputs, recomputes pricing from DB,
// rejects overlapping bookings, and inserts with payment_status = 'pending'.
// Public endpoint (anonymous reservations allowed) — uses service role internally.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isISODate = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

const nightsBetween = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = await req.json().catch(() => null);
    if (!body) return json(400, { error: "Invalid request" });

    const {
      room_id,
      check_in,
      check_out,
      guest_name,
      guest_email,
      guest_phone,
      extras: extrasIn,
      notes,
    } = body as Record<string, unknown>;

    // Basic input validation
    if (typeof room_id !== "string" || room_id.length < 10) return json(400, { error: "Invalid request" });
    if (!isISODate(check_in) || !isISODate(check_out)) return json(400, { error: "Invalid request" });
    if (check_in >= check_out) return json(400, { error: "Invalid request" });
    if (typeof guest_name !== "string" || guest_name.trim().length < 2 || guest_name.length > 120) return json(400, { error: "Invalid request" });
    if (typeof guest_email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email) || guest_email.length > 255) return json(400, { error: "Invalid request" });
    if (typeof guest_phone !== "string" || guest_phone.trim().length < 5 || guest_phone.length > 40) return json(400, { error: "Invalid request" });
    const extraIds: string[] = Array.isArray(extrasIn)
      ? (extrasIn as unknown[]).filter((x) => typeof x === "string") as string[]
      : [];
    const safeNotes = typeof notes === "string" ? notes.slice(0, 2000) : null;

    const nights = nightsBetween(check_in, check_out);
    if (nights <= 0 || nights > 60) return json(400, { error: "Invalid request" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Load room and verify it's active
    const { data: room, error: roomErr } = await admin
      .from("rooms")
      .select("id,price_per_night,status")
      .eq("id", room_id)
      .maybeSingle();
    if (roomErr || !room || room.status !== "aktiv") return json(400, { error: "Room not available" });

    // Check for overlap
    const { data: overlapping, error: overlapErr } = await admin
      .from("bookings")
      .select("id")
      .eq("room_id", room_id)
      .neq("payment_status", "cancelled")
      .lt("check_in", check_out)
      .gt("check_out", check_in)
      .limit(1);
    if (overlapErr) {
      console.error("overlap check failed", overlapErr);
      return json(500, { error: "Internal error" });
    }
    if (overlapping && overlapping.length > 0) return json(409, { error: "Dates not available" });

    // Server-side price computation
    let extrasPayload: Array<{ id: string; name: string; price: number; per_night: boolean }> = [];
    let extrasTotal = 0;
    if (extraIds.length > 0) {
      const { data: extrasRows, error: extrasErr } = await admin
        .from("extras")
        .select("id,name,price,per_night,active")
        .in("id", extraIds);
      if (extrasErr) {
        console.error("extras load failed", extrasErr);
        return json(500, { error: "Internal error" });
      }
      const active = (extrasRows ?? []).filter((e) => e.active);
      extrasPayload = active.map((e) => ({
        id: e.id,
        name: e.name,
        price: Number(e.price),
        per_night: !!e.per_night,
      }));
      extrasTotal = extrasPayload.reduce(
        (sum, e) => sum + (e.per_night ? e.price * nights : e.price),
        0,
      );
    }

    const roomTotal = Number(room.price_per_night) * nights;
    const totalPrice = Math.round((roomTotal + extrasTotal) * 100) / 100;

    // Insert guest (best effort)
    await admin
      .from("guests")
      .insert({ name: guest_name.trim(), email: guest_email.trim(), phone: guest_phone.trim() });

    const yymmdd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const booking_number = `LHS-${yymmdd}-${rand}`;

    const { data: inserted, error: insErr } = await admin
      .from("bookings")
      .insert({
        booking_number,
        room_id,
        guest_name: guest_name.trim(),
        guest_email: guest_email.trim(),
        guest_phone: guest_phone.trim(),
        check_in,
        check_out,
        total_price: totalPrice,
        extras: extrasPayload,
        booking_type: "online",
        payment_status: "pending",
        notes: safeNotes && safeNotes.trim().length ? safeNotes : null,
      })
      .select("booking_number,total_price")
      .single();

    if (insErr) {
      console.error("booking insert failed", insErr);
      return json(500, { error: "Internal error" });
    }

    return json(200, {
      booking_number: inserted.booking_number,
      total_price: inserted.total_price,
      extras: extrasPayload,
      nights,
      room_total: roomTotal,
      extras_total: extrasTotal,
    });
  } catch (e) {
    console.error("create-booking error", e);
    return json(500, { error: "Internal error" });
  }
});
