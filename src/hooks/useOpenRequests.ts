// Offene Buchungs-ANFRAGEN (request_status='angefragt') — die Dinge, die das
// Hotel noch bestätigen/ablehnen muss. Wird vom globalen Banner + dem
// Übersichts-Panel genutzt, damit Schend offene Anfragen von ÜBERALL sofort sieht.
//
// Aktualisierung: beim Mount, alle 30 s, bei Fenster-Fokus und sofort nach jeder
// Aktion (via window-Event), damit der Zähler überall synchron bleibt.

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type OpenRequest = {
  id: string;
  booking_number: string;
  guest_name: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  source: string | null;
};

const EVENT = "schend:requests-changed";

/** Nach Bestätigen/Ablehnen aufrufen — aktualisiert alle Anfrage-Anzeigen sofort. */
export const notifyRequestsChanged = () => window.dispatchEvent(new Event(EVENT));

export function useOpenRequests(pollMs = 30000) {
  const [requests, setRequests] = useState<OpenRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // `as any`: request_status/source sind in den (veralteten) generierten Typen
    // noch nicht enthalten — gleiches Muster wie anderswo im Dashboard.
    const { data, error } = await (supabase as any)
      .from("bookings")
      .select("id, booking_number, guest_name, guest_email, check_in, check_out, total_price, source")
      .eq("request_status", "angefragt")
      .neq("payment_status", "cancelled")
      .order("created_at", { ascending: false });
    if (!error) setRequests((data as OpenRequest[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const run = () => { if (active) refresh(); };
    run();
    const id = setInterval(run, pollMs);
    window.addEventListener("focus", run);
    window.addEventListener(EVENT, run);
    return () => {
      active = false;
      clearInterval(id);
      window.removeEventListener("focus", run);
      window.removeEventListener(EVENT, run);
    };
  }, [refresh, pollMs]);

  return { requests, count: requests.length, loading, refresh };
}
