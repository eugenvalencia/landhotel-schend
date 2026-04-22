import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RefreshCw, Globe } from "lucide-react";

const channels = [
  { name: "Booking.com", status: "verbunden", color: "hsl(217 100% 50%)", commission: "15%", bookings30d: 18 },
  { name: "Airbnb", status: "verbunden", color: "hsl(0 80% 60%)", commission: "14%", bookings30d: 7 },
  { name: "Expedia", status: "verbunden", color: "hsl(45 100% 45%)", commission: "18%", bookings30d: 4 },
  { name: "HRS", status: "verbunden", color: "hsl(15 100% 50%)", commission: "13%", bookings30d: 3 },
];

const recent = [
  { source: "Booking.com", guest: "Sarah Klein", room: 7, dates: "24.04. – 27.04.", price: 315, time: "vor 12 Min." },
  { source: "Direkt", guest: "Markus Bauer", room: 12, dates: "30.04. – 03.05.", price: 501, time: "vor 38 Min." },
  { source: "Airbnb", guest: "Lisa Wagner", room: 3, dates: "25.04. – 26.04.", price: 95, time: "vor 1 Std." },
  { source: "Booking.com", guest: "Johann Probst", room: 15, dates: "01.05. – 04.05.", price: 432, time: "vor 2 Std." },
  { source: "Expedia", guest: "Familie Hoffmann", room: 18, dates: "10.05. – 14.05.", price: 540, time: "vor 3 Std." },
];

export default function ChannelManagerTab() {
  return (
    <div className="space-y-4">
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Alle Kanäle synchronisiert</div>
              <p className="text-xs text-muted-foreground mt-1">
                Verfügbarkeiten und Preise werden in Echtzeit auf alle Plattformen übertragen. Doppelbuchungen sind ausgeschlossen.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-success/10 border-success/30 text-success shrink-0">
            Letzte Sync: vor 5 Min.
          </Badge>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {channels.map((c) => (
          <Card key={c.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                  <span className="font-semibold text-sm">{c.name}</span>
                </div>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div className="flex justify-between"><span>Provision</span><span className="font-medium text-foreground">{c.commission}</span></div>
                <div className="flex justify-between"><span>Buchungen 30 T.</span><span className="font-medium text-foreground">{c.bookings30d}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Letzte Buchungen aus allen Kanälen</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{r.guest}</div>
                <div className="text-xs text-muted-foreground">Zimmer {r.room} · {r.dates}</div>
              </div>
              <Badge variant="outline" className="shrink-0">{r.source}</Badge>
              <div className="text-right shrink-0">
                <div className="font-semibold text-sm">{r.price} €</div>
                <div className="text-xs text-muted-foreground">{r.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
