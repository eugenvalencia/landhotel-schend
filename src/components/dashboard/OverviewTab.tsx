import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { eur, formatDate, toISODate } from "@/lib/format";
import { TrendingUp, BedDouble, Calendar, Euro, ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";
import { toast } from "sonner";

type BookingRow = {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
};

type RoomRow = { id: string };

export default function OverviewTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const [bRes, rRes] = await Promise.all([
        supabase.from("bookings").select("id,guest_name,check_in,check_out,total_price,payment_status").order("check_in"),
        supabase.from("rooms").select("id"),
      ]);
      if (!active) return;
      if (bRes.error || rRes.error) {
        toast.error("Übersicht konnte nicht geladen werden");
      }
      setBookings((bRes.data as BookingRow[] | null) ?? []);
      setRooms((rRes.data as RoomRow[] | null) ?? []);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const { revenueToday, revenueMonth, activeBookings, occupancy, arrivalsToday, departuresToday } = useMemo(() => {
    const today = toISODate(new Date());
    const now = new Date();
    const monthStart = toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
    const monthEnd = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const paid = bookings.filter((b) => b.payment_status === "paid");
    const revToday = paid
      .filter((b) => b.check_in === today)
      .reduce((s, b) => s + Number(b.total_price), 0);
    const revMonth = paid
      .filter((b) => b.check_in >= monthStart && b.check_in <= monthEnd)
      .reduce((s, b) => s + Number(b.total_price), 0);
    const active = bookings.filter(
      (b) => b.check_in <= today && b.check_out > today && b.payment_status !== "cancelled",
    ).length;
    const occ = rooms.length > 0 ? Math.round((active / rooms.length) * 100) : 0;
    const arrivals = bookings.filter((b) => b.check_in === today && b.payment_status !== "cancelled");
    const departures = bookings.filter((b) => b.check_out === today && b.payment_status !== "cancelled");
    return {
      revenueToday: revToday,
      revenueMonth: revMonth,
      activeBookings: active,
      occupancy: occ,
      arrivalsToday: arrivals,
      departuresToday: departures,
    };
  }, [bookings, rooms]);

  const stats = [
    { label: "Umsatz heute", value: eur(revenueToday), icon: Euro },
    { label: "Umsatz Monat", value: eur(revenueMonth), icon: TrendingUp },
    { label: "Aktive Buchungen", value: String(activeBookings), icon: Calendar },
    { label: "Belegung", value: `${occupancy}%`, icon: BedDouble },
  ];

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-success" /> Anreisen heute
            </CardTitle>
          </CardHeader>
          <CardContent>
            {arrivalsToday.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Anreisen heute</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {arrivalsToday.map((b) => (
                  <li key={b.id} className="flex justify-between border-b pb-2 last:border-0">
                    <span>{b.guest_name}</span>
                    <span className="text-muted-foreground">
                      {formatDate(b.check_in)} → {formatDate(b.check_out)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpFromLine className="h-4 w-4 text-secondary" /> Abreisen heute
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departuresToday.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Abreisen heute</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {departuresToday.map((b) => (
                  <li key={b.id} className="flex justify-between border-b pb-2 last:border-0">
                    <span>{b.guest_name}</span>
                    <span className="text-muted-foreground">{formatDate(b.check_out)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
