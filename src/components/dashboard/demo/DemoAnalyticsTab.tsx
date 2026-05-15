import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, Euro, Percent, CalendarDays, Loader2 } from "lucide-react";
import DemoBanner from "../DemoBanner";
import { supabase } from "@/integrations/supabase/client";

interface BookingRow {
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
}

const CHANNELS = [
  { name: "Direkt (Webseite + Telefon)", share: 62, color: "bg-emerald-500" },
  { name: "Booking.com",                 share: 22, color: "bg-blue-500" },
  { name: "HRS",                         share: 9,  color: "bg-amber-500" },
  { name: "Expedia",                     share: 4,  color: "bg-rose-500" },
  { name: "Walk-In",                     share: 3,  color: "bg-violet-500" },
];

const MONTH_LABELS = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export default function DemoAnalyticsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomCount, setRoomCount] = useState(16);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [b, r] = await Promise.all([
        supabase
          .from("bookings")
          .select("check_in, check_out, total_price, payment_status")
          .eq("booking_type", "online")
          .neq("payment_status", "cancelled"),
        supabase.from("rooms").select("id").eq("status", "aktiv"),
      ]);
      if (!alive) return;
      setBookings(((b.data ?? []) as unknown) as BookingRow[]);
      setRoomCount((r.data ?? []).length || 16);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    // 12-Monate-Verlauf: jeden Monat Occupancy/RevPAR/ADR
    const today = new Date();
    const months: { m: string; year: number; monthIdx: number; occ: number; revpar: number; adr: number; revenue: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const days = monthEnd.getDate();
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      let revenue = 0;
      let roomNights = 0;
      let bookingCount = 0;

      for (const bk of bookings) {
        // Overlap mit Monat?
        const ci = new Date(bk.check_in);
        const co = new Date(bk.check_out);
        if (co <= d || ci > monthEnd) continue;
        const overlapStart = ci < d ? d : ci;
        const overlapEnd = co > monthEnd ? new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + 1) : co;
        const nights = Math.max(0, Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 86400000));
        const totalNights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
        const portion = nights / totalNights;
        revenue += Number(bk.total_price) * portion;
        roomNights += nights;
        if (nights > 0) bookingCount += portion;
      }

      const capacity = days * roomCount;
      const occ = capacity > 0 ? Math.round((roomNights / capacity) * 100) : 0;
      const revpar = capacity > 0 ? Math.round(revenue / capacity) : 0;
      const adr = roomNights > 0 ? Math.round(revenue / roomNights) : 0;

      months.push({
        m: MONTH_LABELS[d.getMonth()],
        year: d.getFullYear(),
        monthIdx: d.getMonth(),
        occ, revpar, adr, revenue,
      });
    }

    const current = months[months.length - 1];
    const previous = months[months.length - 2] ?? current;

    // Pace next month — vereinfacht: Buchungen mit check_in im naechsten Monat
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const nextRoomNights = bookings.reduce((acc, bk) => {
      const ci = new Date(bk.check_in);
      const co = new Date(bk.check_out);
      if (co <= nextMonth || ci > nextMonthEnd) return acc;
      const overlapStart = ci < nextMonth ? nextMonth : ci;
      const overlapEnd = co > nextMonthEnd ? new Date(nextMonthEnd.getFullYear(), nextMonthEnd.getMonth(), nextMonthEnd.getDate() + 1) : co;
      return acc + Math.max(0, Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 86400000));
    }, 0);
    const nextCapacity = nextMonthEnd.getDate() * roomCount;
    const nextPace = nextCapacity > 0 ? Math.round((nextRoomNights / nextCapacity) * 100) : 0;

    return { months, current, previous, nextPace };
  }, [bookings, roomCount]);

  const maxOcc = Math.max(1, ...stats.months.map((m) => m.occ));

  return (
    <div>
      <DemoBanner description="RevPAR / ADR / Occupancy ueber 12 Monate, Channel-Mix, Pace gegenueber Vorjahr. Aktualisiert sich live aus den Buchungsdaten." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <LineChart className="h-5 w-5 text-secondary" /> Revenue & Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Performance-Indikatoren auf einen Blick.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Lade Performance-Daten …
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <CompactStat
              label={`RevPAR ${MONTH_LABELS[stats.current.monthIdx]}`}
              value={stats.current.revpar + " €"}
              icon={Euro}
              delta={diffPct(stats.current.revpar, stats.previous.revpar)}
            />
            <CompactStat
              label={`ADR ${MONTH_LABELS[stats.current.monthIdx]}`}
              value={stats.current.adr + " €"}
              icon={TrendingUp}
              delta={diffPct(stats.current.adr, stats.previous.adr)}
            />
            <CompactStat
              label="Occupancy"
              value={stats.current.occ + "%"}
              icon={Percent}
              delta={diffPp(stats.current.occ, stats.previous.occ)}
            />
            <CompactStat
              label="Pace naechster Monat"
              value={stats.nextPace + "%"}
              icon={CalendarDays}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">Belegung 12 Monate</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-40">
                  {stats.months.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                      <span className="text-[10px] tabular-nums text-muted-foreground">{m.occ}</span>
                      <div
                        className={"w-full rounded-t " + (i === stats.months.length - 1 ? "bg-secondary" : "bg-secondary/60")}
                        style={{ height: `${(m.occ / maxOcc) * 100}%` }}
                        title={`${m.m} ${m.year}: ${m.occ}%`}
                      />
                      <span className="text-[10px] text-muted-foreground">{m.m}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">Channel-Mix</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {CHANNELS.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{c.name}</span>
                      <span className="font-medium tabular-nums">{c.share}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${c.color}`} style={{ width: `${c.share}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function diffPct(a: number, b: number): string {
  if (!b) return "";
  const pct = Math.round(((a - b) / b) * 100);
  return (pct >= 0 ? "+" : "") + pct + "% vs. Vormonat";
}
function diffPp(a: number, b: number): string {
  return (a >= b ? "+" : "") + (a - b) + " pp vs. Vormonat";
}

function CompactStat({ label, value, icon: Icon, delta }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; delta?: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-secondary" />
        </div>
        <p className="text-lg font-semibold">{value}</p>
        {delta && (
          <p className={"text-[10px] mt-0.5 " + (delta.startsWith("+") ? "text-emerald-600" : "text-rose-600")}>{delta}</p>
        )}
      </CardContent>
    </Card>
  );
}
