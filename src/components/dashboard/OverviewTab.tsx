import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { eur, formatDate, toISODate } from "@/lib/format";
import {
  TrendingUp, BedDouble, Euro, ArrowDownToLine, ArrowUpFromLine, Loader2,
  Cake, Clock, Sparkles, AlertTriangle, Users, Coffee, UtensilsCrossed,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";
import WeatherCard from "@/components/WeatherCard";
import OpenRequestsPanel from "@/components/dashboard/OpenRequestsPanel";

interface BookingRow {
  id: string;
  booking_number: string;
  guest_name: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
  booking_type: string;
  room_id: string;
  notes: string | null;
  extras: unknown;
  created_at: string;
}
interface RoomRow { id: string; name: string }
interface GuestRow { name: string; email: string | null; birthday: string | null; diet: string | null }

export default function OverviewTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      // Paged-Fetch fuer Buchungen
      const all: BookingRow[] = [];
      const pageSize = 1000;
      for (let page = 0; page < 50; page++) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
          .from("bookings")
          .select("id, booking_number, guest_name, guest_email, check_in, check_out, total_price, payment_status, booking_type, room_id, notes, extras, created_at")
          .order("check_in")
          .range(from, to);
        if (error) {
          if (page === 0) toast.error("Übersicht konnte nicht geladen werden");
          break;
        }
        if (!data || data.length === 0) break;
        all.push(...(data as BookingRow[]));
        if (data.length < pageSize) break;
      }
      const [{ data: r }, { data: g }] = await Promise.all([
        supabase.from("rooms").select("id, name"),
        (supabase as any).from("guests").select("name, email, birthday, diet"),
      ]);
      if (!active) return;
      setBookings(all);
      setRooms((r as RoomRow[] | null) ?? []);
      setGuests((g as GuestRow[] | null) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const m = useMemo(() => {
    const todayIso = toISODate(new Date());
    const now = new Date();
    const monthStart = toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
    const monthEnd = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const tomorrow = toISODate(new Date(now.getTime() + 86400000));
    // ISO-Woche: Montag-Start (getDay() 0=So..6=Sa → Montag-Offset). Kalender-Arithmetik
    // (new Date(y,m,d-n)) statt ms — DST-sicher.
    const wd = (now.getDay() + 6) % 7;                       // Mo=0 … So=6
    const Y = now.getFullYear(), M = now.getMonth(), D = now.getDate();
    const weekStart = toISODate(new Date(Y, M, D - wd));
    const lastWeekStart = toISODate(new Date(Y, M, D - wd - 7));
    const lastWeekEnd = toISODate(new Date(Y, M, D - wd - 1));
    const next14End = toISODate(new Date(now.getTime() + 14 * 86400000));
    const prevYearStart = toISODate(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()));
    const prevYearEnd = toISODate(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() + 14));

    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
    const guestMap = new Map<string, GuestRow>();
    guests.forEach((g) => g.email && guestMap.set(g.email.toLowerCase(), g));

    const validOnline = bookings.filter((b) => b.booking_type === "online" && b.payment_status !== "cancelled");

    // ---- Heutige Kennzahlen ----
    const inHouse = bookings.filter((b) => b.payment_status !== "cancelled" && b.check_in <= todayIso && b.check_out > todayIso);
    const arrivalsToday = bookings.filter((b) => b.payment_status !== "cancelled" && b.check_in === todayIso);
    const departuresToday = bookings.filter((b) => b.payment_status !== "cancelled" && b.check_out === todayIso);
    const arrivalsTomorrow = bookings.filter((b) => b.payment_status !== "cancelled" && b.check_in === tomorrow);
    const occupancy = rooms.length > 0 ? Math.round((inHouse.length / rooms.length) * 100) : 0;

    // ---- Umsatz ----
    const paid = validOnline.filter((b) => b.payment_status === "paid");
    const revToday = paid.filter((b) => toISODate(new Date(b.created_at)) === todayIso).reduce((s, b) => s + (Number(b.total_price) || 0), 0);
    const revMonth = paid.filter((b) => b.check_in >= monthStart && b.check_in <= monthEnd).reduce((s, b) => s + Number(b.total_price), 0);

    // ---- Pace nächste 14 Tage vs Vorjahres-Zeitraum ----
    const pace14 = validOnline.filter((b) => b.check_in >= todayIso && b.check_in <= next14End).length;
    const paceVj = validOnline.filter((b) => b.check_in >= prevYearStart && b.check_in <= prevYearEnd).length;
    const pacePct = paceVj > 0 ? Math.round(((pace14 - paceVj) / paceVj) * 100) : 0;

    // ---- Diese Woche vs letzte Woche ----
    const thisWeekBookings = validOnline.filter((b) => { const d = toISODate(new Date(b.created_at)); return d >= weekStart && d <= todayIso; }).length;
    const lastWeekBookings = validOnline.filter((b) => { const d = toISODate(new Date(b.created_at)); return d >= lastWeekStart && d <= lastWeekEnd; }).length;
    const weekDelta = lastWeekBookings > 0 ? Math.round(((thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100) : 0;

    // ---- Frühstück morgen ----
    const tomorrowInHouse = bookings.filter((b) => b.payment_status !== "cancelled" && b.check_in <= tomorrow && b.check_out > tomorrow);
    let breakfastCount = 0;
    let halfBoardCount = 0;
    const diets = new Map<string, number>();
    for (const b of tomorrowInHouse) {
      // Frühstück wenn Halbpension oder Frühstück in Extras
      const extras = Array.isArray(b.extras) ? (b.extras as Array<{ name?: string }>) : [];
      const hasHP = extras.some((e) => e?.name?.toLowerCase().includes("halbpens"));
      const hasFs = extras.some((e) => e?.name?.toLowerCase().includes("fruehst") || e?.name?.toLowerCase().includes("früh"));
      if (hasHP) { halfBoardCount++; breakfastCount++; }
      else if (hasFs) breakfastCount++;
      else breakfastCount++; // Standard: Frühstück inklusive

      // Diät aus Gast-Profil
      const g = b.guest_email ? guestMap.get(b.guest_email.toLowerCase()) : null;
      if (g?.diet) diets.set(g.diet, (diets.get(g.diet) ?? 0) + 1);
    }
    const dietList = Array.from(diets.entries()).map(([d, n]) => ({ diet: d, count: n }));

    // ---- Geburtstage in 30 Tagen ----
    const upcomingBirthdays = guests
      .filter((g) => !!g.birthday)
      .map((g) => {
        const bd = new Date(g.birthday as string);
        const thisYearBd = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
        const nextBd = thisYearBd < now ? new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate()) : thisYearBd;
        const days = Math.round((nextBd.getTime() - now.getTime()) / 86400000);
        const age = nextBd.getFullYear() - bd.getFullYear();
        return { name: g.name, email: g.email, days, age, dateLabel: nextBd.toLocaleDateString("de-DE", { day: "2-digit", month: "long" }) };
      })
      .filter((b) => b.days <= 30 && b.days >= 0)
      .sort((a, b) => a.days - b.days);

    // ---- Reaktivierungs-Kandidaten ----
    const guestLastStay = new Map<string, { date: string; spent: number; count: number }>();
    for (const b of validOnline) {
      const key = (b.guest_email || b.guest_name).toLowerCase();
      const co = b.check_out.slice(0, 10);
      const exist = guestLastStay.get(key);
      if (!exist || co > exist.date) {
        guestLastStay.set(key, {
          date: co,
          spent: (exist?.spent ?? 0) + Number(b.total_price),
          count: (exist?.count ?? 0) + 1,
        });
      } else {
        exist.spent += Number(b.total_price);
        exist.count += 1;
      }
    }
    const reaktivieren = bookings
      .filter((b) => b.payment_status !== "cancelled" && b.booking_type === "online")
      .reduce((acc, b) => {
        const key = (b.guest_email || b.guest_name).toLowerCase();
        if (!acc.has(key)) {
          const ls = guestLastStay.get(key);
          if (ls && ls.count >= 2) {
            const days = Math.round((now.getTime() - new Date(ls.date).getTime()) / 86400000);
            if (days >= 365) acc.set(key, { name: b.guest_name, email: b.guest_email, lastStay: ls.date, spent: ls.spent, count: ls.count, days });
          }
        }
        return acc;
      }, new Map<string, { name: string; email: string | null; lastStay: string; spent: number; count: number; days: number }>());
    const reaktivierenList = Array.from(reaktivieren.values()).sort((a, b) => b.spent - a.spent).slice(0, 5);

    // ---- Anreisen mit Gast-Profil anreichern ----
    const arrivalsEnriched = arrivalsToday.map((b) => ({
      ...b,
      room: roomMap[b.room_id]?.name ?? "Zimmer",
      guest: b.guest_email ? guestMap.get(b.guest_email.toLowerCase()) : null,
    }));
    const departuresEnriched = departuresToday.map((b) => ({
      ...b,
      room: roomMap[b.room_id]?.name ?? "Zimmer",
    }));
    const inHouseEnriched = inHouse.map((b) => ({
      ...b,
      room: roomMap[b.room_id]?.name ?? "Zimmer",
    }));

    // ---- Smart Alerts ----
    const alerts: { severity: "warn" | "info"; message: string }[] = [];
    const openPaymentsToday = departuresToday.filter((b) => b.payment_status === "pending");
    if (openPaymentsToday.length > 0) {
      alerts.push({ severity: "warn", message: `${openPaymentsToday.length} Abreise${openPaymentsToday.length === 1 ? "" : "n"} heute noch nicht bezahlt — beim Auschecken kassieren.` });
    }
    const bdNext7 = upcomingBirthdays.filter((b) => b.days <= 7);
    if (bdNext7.length > 0) {
      alerts.push({ severity: "info", message: `🎂 ${bdNext7[0].name} hat in ${bdNext7[0].days} Tag${bdNext7[0].days === 1 ? "" : "en"} Geburtstag — Karte vorbereiten.` });
    }
    if (arrivalsTomorrow.length > 0) {
      alerts.push({ severity: "info", message: `Morgen ${arrivalsTomorrow.length} Anreise${arrivalsTomorrow.length === 1 ? "" : "n"} — Zimmer rechtzeitig fertig.` });
    }

    return {
      todayIso, revToday, revMonth, occupancy, inHouseCount: inHouse.length, roomCount: rooms.length,
      pace14, paceVj, pacePct,
      thisWeekBookings, lastWeekBookings, weekDelta,
      breakfastCount, halfBoardCount, dietList, tomorrowInHouseCount: tomorrowInHouse.length,
      upcomingBirthdays, reaktivierenList,
      arrivalsEnriched, departuresEnriched, inHouseEnriched,
      alerts,
    };
  }, [bookings, rooms, guests]);

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="text-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
          Lade Daten …
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Offene Anfragen — höchste Priorität, ganz oben */}
      <OpenRequestsPanel />

      {/* Smart Alerts oben */}
      {m.alerts.length > 0 && (
        <div className="space-y-2">
          {m.alerts.map((a, i) => (
            <div
              key={i}
              className={
                "rounded-md border px-3 py-2 text-sm flex items-start gap-2 " +
                (a.severity === "warn"
                  ? "border-amber-500/50 bg-amber-500/5 text-amber-900 dark:text-amber-200"
                  : "border-sky-500/40 bg-sky-500/5 text-sky-900 dark:text-sky-200")
              }
            >
              {a.severity === "warn"
                ? <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                : <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />}
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wetter + Standort */}
      <WeatherCard defaultMode="gps" />

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Belegung jetzt"   value={`${m.occupancy}%`}      sub={`${m.inHouseCount} / ${m.roomCount} Zimmer`} icon={BedDouble} />
        <KpiCard label="Umsatz heute"     value={eur(m.revToday)}        sub="Neue Buchungen heute" icon={Euro} />
        <KpiCard label="Umsatz Monat"     value={eur(m.revMonth)}        sub="Bezahlte Buchungen" icon={TrendingUp} />
        <KpiCard
          label="Pace 14 Tage"
          value={`${m.pace14}`}
          sub={
            m.paceVj > 0
              ? `${m.pacePct >= 0 ? "▲ +" : "▼ "}${m.pacePct}% vs. Vorjahr`
              : "Anreisen kommend"
          }
          icon={CalendarClock}
          subColor={m.paceVj > 0 ? (m.pacePct >= 0 ? "text-emerald-600" : "text-rose-600") : ""}
        />
      </div>

      {/* Heute im Haus / Anreisen / Abreisen */}
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ArrowDownToLine className="h-3.5 w-3.5 text-emerald-500" /> Anreisen heute ({m.arrivalsEnriched.length})</CardTitle></CardHeader>
          <CardContent className="text-sm pt-0">
            {m.arrivalsEnriched.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Keine Anreisen heute</p>
            ) : (
              <ul className="space-y-1.5">
                {m.arrivalsEnriched.map((b) => (
                  <li key={b.id} className="flex items-start justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.guest_name}</div>
                      <div className="text-muted-foreground">{b.room}</div>
                      {b.guest?.diet && <div className="text-amber-600 text-[10px]">⚠ {b.guest.diet}</div>}
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      → {formatDate(b.check_out)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="h-3.5 w-3.5 text-secondary" /> Im Haus jetzt ({m.inHouseEnriched.length})</CardTitle></CardHeader>
          <CardContent className="text-sm pt-0">
            {m.inHouseEnriched.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Niemand im Haus</p>
            ) : (
              <ul className="space-y-1 max-h-48 overflow-y-auto">
                {m.inHouseEnriched.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate">{b.guest_name}</span>
                    <span className="text-muted-foreground shrink-0">{b.room}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ArrowUpFromLine className="h-3.5 w-3.5 text-amber-500" /> Abreisen heute ({m.departuresEnriched.length})</CardTitle></CardHeader>
          <CardContent className="text-sm pt-0">
            {m.departuresEnriched.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Keine Abreisen heute</p>
            ) : (
              <ul className="space-y-1.5">
                {m.departuresEnriched.map((b) => (
                  <li key={b.id} className="flex items-start justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.guest_name}</div>
                      <div className="text-muted-foreground">{b.room}</div>
                    </div>
                    {b.payment_status === "pending" ? (
                      <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] shrink-0">€ offen</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] shrink-0 text-emerald-600 border-emerald-600/40">bezahlt</Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights Row */}
      <div className="grid md:grid-cols-3 gap-3">
        {/* Frühstück morgen */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Coffee className="h-3.5 w-3.5 text-secondary" /> Frühstück morgen</CardTitle></CardHeader>
          <CardContent className="pt-0 text-sm space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display tabular-nums">{m.breakfastCount}</span>
              <span className="text-xs text-muted-foreground">Gedecke</span>
            </div>
            {m.halfBoardCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Davon <strong>{m.halfBoardCount}</strong> Halbpension (auch Abendessen)
              </div>
            )}
            {m.dietList.length > 0 && (
              <div className="space-y-1 pt-2 border-t">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <UtensilsCrossed className="h-3 w-3" /> Spezielle Wünsche
                </div>
                {m.dietList.map((d) => (
                  <div key={d.diet} className="flex justify-between text-xs">
                    <span className="text-amber-700 dark:text-amber-400">{d.diet}</span>
                    <span className="font-medium tabular-nums">{d.count}×</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geburtstage */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Cake className="h-3.5 w-3.5 text-secondary" /> Geburtstage 30 Tage</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {m.upcomingBirthdays.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Keine in den nächsten 30 Tagen</p>
            ) : (
              <ul className="space-y-1.5">
                {m.upcomingBirthdays.slice(0, 4).map((b) => (
                  <li key={b.name} className="flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.name}</div>
                      <div className="text-muted-foreground">{b.dateLabel} · wird {b.age}</div>
                    </div>
                    <Badge
                      className={
                        b.days <= 7
                          ? "bg-amber-500 hover:bg-amber-500 text-white text-[10px] shrink-0"
                          : "text-[10px] shrink-0"
                      }
                      variant={b.days <= 7 ? "default" : "outline"}
                    >
                      in {b.days} T.
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Reaktivierungs-Liste */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-rose-500" /> Reaktivierung</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {m.reaktivierenList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Alle Stammgäste sind aktiv</p>
            ) : (
              <ul className="space-y-1.5">
                {m.reaktivierenList.map((g) => (
                  <li key={g.name} className="flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{g.name}</div>
                      <div className="text-muted-foreground">{g.count} Aufenthalte · {eur(g.spent)}</div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      seit {Math.floor(g.days / 30)} Mo.
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {m.reaktivierenList.length > 0 && (
              <Button size="sm" variant="ghost" className="w-full mt-2 text-xs h-7">
                Reaktivierungs-Mail vorbereiten
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pace-Trend */}
      <Card className="shadow-card">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="font-medium">Wachstum</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-muted-foreground">Diese Woche neu: </span>
              <strong>{m.thisWeekBookings}</strong>
              {m.lastWeekBookings > 0 && (
                <span className={"ml-1 " + (m.weekDelta >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {m.weekDelta >= 0 ? "▲ +" : "▼ "}{m.weekDelta}%
                </span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Nächste 14 Tage: </span>
              <strong>{m.pace14}</strong> Anreisen
              {m.paceVj > 0 && (
                <span className={"ml-1 " + (m.pacePct >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {m.pacePct >= 0 ? "▲ +" : "▼ "}{m.pacePct}% vs. Vorjahr
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, subColor }: {
  label: string; value: string; sub: string; icon: React.ComponentType<{ className?: string }>; subColor?: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-secondary" />
        </div>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
        <p className={"text-[10px] mt-0.5 truncate " + (subColor ?? "text-muted-foreground")}>{sub}</p>
      </CardContent>
    </Card>
  );
}
