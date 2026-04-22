import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", umsatz: 18400 },
  { month: "Feb", umsatz: 21200 },
  { month: "Mär", umsatz: 26800 },
  { month: "Apr", umsatz: 31500 },
  { month: "Mai", umsatz: 38900 },
  { month: "Jun", umsatz: 42300 },
  { month: "Jul", umsatz: 47100 },
  { month: "Aug", umsatz: 49600 },
  { month: "Sep", umsatz: 39800 },
  { month: "Okt", umsatz: 32400 },
  { month: "Nov", umsatz: 24700 },
  { month: "Dez", umsatz: 28900 },
];

const topRooms = [
  { name: "Zi. 7 (Komfort)", buchungen: 142 },
  { name: "Zi. 12 (Suite)", buchungen: 128 },
  { name: "Zi. 3 (Doppel)", buchungen: 121 },
  { name: "Zi. 15 (Junior)", buchungen: 109 },
  { name: "Zi. 5 (Doppel)", buchungen: 96 },
];

const sources = [
  { name: "Direkt", value: 65, color: "hsl(var(--primary))" },
  { name: "Booking.com", value: 22, color: "hsl(var(--secondary))" },
  { name: "Airbnb", value: 8, color: "hsl(var(--success))" },
  { name: "Expedia", value: 5, color: "hsl(var(--warning))" },
];

const Stat = ({ icon: Icon, label, value, sub }: any) => (
  <Card>
    <CardContent className="p-4">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </CardContent>
  </Card>
);

export default function AnalyticsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Users} label="Auslastung heute" value="76%" sub="16 / 21 Zimmer" />
        <Stat icon={Calendar} label="Diese Woche" value="82%" sub="+6% vs. Vorjahr" />
        <Stat icon={BarChart3} label="Diesen Monat" value="68%" sub="Trend: steigend" />
        <Stat icon={TrendingUp} label="Ø Aufenthalt" value="2.8 N" sub="Zielwert: 2.5" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Umsatz-Entwicklung 2025</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("de-DE")} €`} />
                <Line type="monotone" dataKey="umsatz" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Buchungsquellen</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sources} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {sources.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Top 5 Zimmer (Buchungen YTD)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topRooms} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="buchungen" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">KPIs</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>Stornierungsrate</span><span className="font-semibold">4.2%</span></div>
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>Wiederkehrende Gäste</span><span className="font-semibold">38%</span></div>
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>Ø Buchungsvorlauf</span><span className="font-semibold">14 Tage</span></div>
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>Conversion Website</span><span className="font-semibold">7.8%</span></div>
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>RevPAR (Monat)</span><span className="font-semibold">71,40 €</span></div>
            <div className="flex justify-between p-2 rounded bg-muted/50"><span>ADR</span><span className="font-semibold">105,00 €</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
