import { supabase } from "@/integrations/supabase/client";

// Löst die transaktionale Gast-Mail über die Edge Function `notify-schend` aus:
//   - "request"      = Eingangsbestätigung direkt nach der Buchungsanfrage
//   - "confirmation" = verbindliche Bestätigung, wenn das Hotel die Anfrage bestätigt
//
// Bewusst CLIENT-seitig getriggert (statt DB-Trigger/pg_net): nutzt den ohnehin
// öffentlichen anon-/User-JWT der laufenden Session → kein service_role-Key, keine
// DB-GUCs nötig. Strikt FIRE-AND-FORGET + best-effort: eine fehlende Mail darf
// weder die Buchung noch die Bestätigung blockieren.
//
// IDOR-Schutz: notify-schend sendet nur mit gültigem pro-Buchung-Token.
//   - Gast-Pfad ("request"): Token kommt aus dem create_booking-Rückgabewert und
//     wird hier explizit übergeben (anon kann ihn NICHT aus der DB lesen).
//   - Hotel-Pfad ("confirmation"): kein Token übergeben → wir lesen ihn per RLS aus
//     der eigenen Buchung (eingeloggter Tenant-Admin darf das).
export type BookingEmailKind = "request" | "confirmation" | "cancellation" | "cancellation_request";

export function notifyBooking(bookingId: string, kind: BookingEmailKind, token?: string): void {
  void (async () => {
    let notifyToken = token;
    if (!notifyToken) {
      const { data } = await supabase
        .from("bookings")
        .select("notify_token")
        .eq("id", bookingId)
        .single();
      notifyToken = (data as { notify_token?: string } | null)?.notify_token ?? undefined;
    }
    const { error } = await supabase.functions.invoke("notify-schend", {
      body: { booking_id: bookingId, kind, token: notifyToken },
    });
    if (error) console.warn(`[notify-booking] ${kind} fehlgeschlagen:`, error.message);
  })().catch((e) => console.warn(`[notify-booking] ${kind} Ausnahme:`, e));
}
