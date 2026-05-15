import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, Euro, Percent } from "lucide-react";
import DemoBanner from "../DemoBanner";

const MONTHS = [
  { m: "Nov", occ: 38, revpar: 32, adr: 84 },
  { m: "Dez", occ: 52, revpar: 51, adr: 98 },
  { m: "Jan", occ: 31, revpar: 24, adr: 78 },
  { m: "Feb", occ: 44, revpar: 38, adr: 86 },
  { m: "Mrz", occ: 58, revpar: 52, adr: 89 },
  { m: "Apr", occ: 71, revpar: 68, adr: 95 },
  { m: "Mai", occ: 78, revpar: 81, adr: 104 },
];

const CHANNELS = [
  { name: "Direkt (Webseite + Telefon)", share: 62, color: "bg-emerald-500" },
  { name: "Booking.com",                share: 22, color: "bg-blue-500" },
  { name: "HRS",                        share: 9,  color: "bg-amber-500" },
  { name: "Expedia",                    share: 4,  color: "bg-rose-500" },
  { name: "Walk-In",                    share: 3,  color: "bg-violet-500" },
];

export default function DemoAnalyticsTab() {
  const maxOcc = Math.max(...MONTHS.map((m) => m.occ));
  return (
    <div>
      <DemoBanner description="RevPAR / ADR / Occupancy ueber 12 Monate, Channel-Mix, Pace gegenueber Vorjahr. Aktualisiert sich live, exportierbar nach Excel." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <LineChart className="h-5 w-5 text-secondary" /> Revenue & Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Performance-Indikatoren auf einen Blick.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">RevPAR Mai</p><Euro className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">81 €</p>
          <p className="text-xs text-emerald-600 mt-0.5">+19% vs. Vj.</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">ADR Mai</p><TrendingUp className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">104 €</p>
          <p className="text-xs text-emerald-600 mt-0.5">+9% vs. Vj.</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Occupancy</p><Percent className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">78%</p>
          <p className="text-xs text-emerald-600 mt-0.5">+8 pp vs. Vj.</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Pace Juni</p></div>
          <p className="text-2xl font-bold">+12%</p>
          <p className="text-xs text-muted-foreground mt-0.5">36% gebucht, vor 4 Wo</p>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Belegung 12 Monate</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {MONTHS.map((m) => (
                <div key={m.m} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                  <div
                    className="w-full bg-secondary/80 rounded-t"
                    style={{ height: `${(m.occ / maxOcc) * 100}%` }}
                    title={`${m.m}: ${m.occ}%`}
                  />
                  <span className="text-[10px] text-muted-foreground">{m.m}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Channel-Mix</CardTitle></CardHeader>
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
    </div>
  );
}
