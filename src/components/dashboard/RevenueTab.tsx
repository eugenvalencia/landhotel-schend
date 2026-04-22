import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function RevenueTab() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("bookings").select("*").then(({ data }) => setBookings(data ?? []));
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
      const key = b.check_in.slice(0, 7);
      if (!data[key]) return;
      if (b.booking_type === "intern") data[key].intern += Number(b.total_price);
      else data[key].online += Number(b.total_price);
    });
    return Object.values(data);
  }, [bookings]);

  const total = monthly.reduce((s, m) => s + m.online + m.intern, 0);

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monatsumsatz (letzte 6 Monate)</CardTitle>
          <p className="text-sm text-muted-foreground">Gesamt: {eur(total)}</p>
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
