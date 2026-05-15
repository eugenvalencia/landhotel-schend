import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Coffee, Sun, ArrowDownToLine, ArrowUpFromLine, Cake, Wrench, Phone, Loader2,
} from "lucide-react";
import DemoBanner from "../DemoBanner";
import { supabase } from "@/integrations/supabase/client";
import { toISODate, formatDate } from "@/lib/format";

interface BookingShort {
  id: string;
  booking_number: string;
  guest_name: string;
  notes: string | null;
  check_in: string;
  check_out: string;
  payment_status: string;
  rooms?: { name: string; room_type: string } | null;
}

export default function DemoBriefingTab() {
  const [arrivals, setArrivals] = useState<BookingShort[]>([]);
  const [departures, setDepartures] = useState<BookingShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const today = toISODate(new Date());
      const [arr, dep] = await Promise.all([
        supabase.from("bookings")
          .select("id, booking_number, guest_name, notes, check_in, check_out, payment_status, rooms(name, room_type)")
          .eq("check_in", today)
          .neq("payment_status", "cancelled")
          .order("rooms(name)"),
        supabase.from("bookings")
          .select("id, booking_number, guest_name, notes, check_in, check_out, payment_status, rooms(name, room_type)")
          .eq("check_out", today)
          .neq("payment_status", "cancelled")
          .order("rooms(name)"),
      ]);
      if (!alive) return;
      setArrivals((arr.data as unknown as BookingShort[]) ?? []);
      setDepartures((dep.data as unknown as BookingShort[]) ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const todayLabel = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div>
      <DemoBanner description="Morgendliches Briefing fuers Team — wer kommt, wer geht, was ist heute besonders. Wird um 06:00 generiert und per E-Mail an alle Mitarbeiter gesendet." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Coffee className="h-5 w-5 text-secondary" /> Daily Briefing — {todayLabel}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generiert um 06:02 Uhr. Versandt an: eugen@…, theke@…, kueche@…
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Briefing wird zusammengestellt …
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Sun className="h-4 w-4 text-amber-500" /> Heute im Haus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <ArrowDownToLine className="h-3 w-3" /> Anreisen ({arrivals.length})
                </h4>
                {arrivals.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Keine Anreisen heute.</p>
                ) : (
                  <ul className="space-y-1 pl-3">
                    {arrivals.map((b) => (
                      <li key={b.id} className="text-sm">
                        <span className="text-muted-foreground">·</span>{" "}
                        <strong>{b.guest_name}</strong>{" "}
                        <span className="text-muted-foreground text-xs">
                          ({b.rooms?.name ?? "Zimmer"} · bis {formatDate(b.check_out)})
                        </span>
                        {b.notes && <span className="block text-xs text-muted-foreground italic ml-3">{b.notes}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <ArrowUpFromLine className="h-3 w-3" /> Abreisen ({departures.length})
                </h4>
                {departures.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Keine Abreisen heute.</p>
                ) : (
                  <ul className="space-y-1 pl-3">
                    {departures.map((b) => (
                      <li key={b.id} className="text-sm">
                        <span className="text-muted-foreground">·</span>{" "}
                        <strong>{b.guest_name}</strong>{" "}
                        <span className="text-muted-foreground text-xs">
                          ({b.rooms?.name ?? "Zimmer"} · {b.payment_status === "paid" ? "bezahlt" : "offen"})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Cake className="h-3 w-3" /> Besonderes
                </h4>
                <ul className="space-y-1 pl-3 text-sm">
                  <li>· <strong>Tisch 4</strong> Reservierung 19:30 fuer 6 Personen, Familie Wirth (Vegetarier)</li>
                  <li>· <strong>Hund</strong> bei Anreise — Decke ins Zimmer 14 vorbereiten</li>
                </ul>
              </section>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Wetter Vulkaneifel</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="text-2xl font-display">17 °C</div>
                <p className="text-muted-foreground text-xs">Sonnig, ab 14 Uhr leichte Wolken. Wind SW 14 km/h.</p>
                <p className="text-xs mt-2"><strong>Tipp fuer Gaeste:</strong> Manderscheid-Burgen-Pfad ideal.</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1.5"><Wrench className="h-3 w-3" /> Operations</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>· Muellabfuhr: Restmuell (gelbe Tonne)</p>
                <p>· Lieferung Eifeler Metzger: ca. 09:30</p>
                <p>· Wartung Spuelmaschine: morgen 11:00</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1.5"><Phone className="h-3 w-3" /> Notiz Telefon-KI</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground italic">
                5 Anrufe heute Nacht entgegengenommen — alle Buchungen in den Kalender uebernommen.
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
