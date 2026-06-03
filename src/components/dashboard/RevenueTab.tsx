import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function RevenueTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("bookings")
      .select("id, check_in, total_price, payment_status, booking_type")
      .then(({ data, error }) => {
        // Fehler NICHT verschlucken — sonst zeigt der Chart still 0 € statt eines Problems.
        if (error) { setLoadError(error.message); return; }
        setLoadError(null);
        setBookings(data ?? []);
      });
  }, []);

  const monthly = useMemo(() => {
    const data: Record<string, { month: string; online: number; intern: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      data[key] = { month: d.toLocaleDateString("de-DE", { month: "short", year: "2-digit" }), online: 0, intern: 0 };
    }
    bookings.forEach((b) => {
      if (b.payment_status !== "paid") return;
      if (!b.check_in) return;                          // null-Guard: kein Crash bei .slice
      const key = b.check_in.slice(0, 7);
      if (!data[key]) return;
      const amount = Number(b.total_price) || 0;        // NaN-Guard
      if (b.booking_type === "intern") data[key].intern += amount;
      else data[key].online += amount;
    });
    return Object.values(data);
  }, [bookings]);

  const total = monthly.reduce((s, m) => s + m.online + m.intern, 0);

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monatsumsatz (letzte 6 Monate)</CardTitle>
          {loadError ? (
            <p className="text-sm text-destructive">Umsatzdaten konnten nicht geladen werden: {loadError}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Gesamt: {eur(total)}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}€`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(value: any) => eur(Number(value))}
                />
                <Bar dataKey="online" stackId="a" fill="hsl(var(--secondary))" name="Online" radius={[0, 0, 0, 0]} />
                <Bar dataKey="intern" stackId="a" fill="hsl(var(--cal-intern))" name="Intern" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
