import { supabase } from "@/integrations/supabase/client";

// Löst die transaktionale Gast-Mail über die Edge Function `notify-schend` aus:
//   - "request"      = Eingangsbestätigung direkt nach der Buchungsanfrage
//   - "confirmation" = verbindliche Bestätigung, wenn das Hotel die Anfrage bestätigt
//
// Bewusst CLIENT-seitig getriggert (statt DB-Trigger/pg_net): nutzt den ohnehin
// öffentlichen anon-/User-JWT der laufenden Session → kein service_role-Key, keine
// DB-GUCs nötig. Strikt FIRE-AND-FORGET + best-effort: eine fehlende Mail darf
// weder die Buchung noch die Bestätigung blockieren.
export type BookingEmailKind = "request" | "confirmation";

export function notifyBooking(bookingId: string, kind: BookingEmailKind): void {
  void supabase.functions
    .invoke("notify-schend", { body: { booking_id: bookingId, kind } })
    .then(({ error }) => {
      if (error) console.warn(`[notify-booking] ${kind} fehlgeschlagen:`, error.message);
    })
    .catch((e) => console.warn(`[notify-booking] ${kind} Ausnahme:`, e));
}
