import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, PartyPopper } from "lucide-react";

const rules = [
  { icon: TrendingDown, label: "Auslastung < 50%", change: "−10%", color: "text-destructive" },
  { icon: TrendingUp, label: "Auslastung > 80%", change: "+20%", color: "text-success" },
  { icon: Calendar, label: "Wochenende (Fr/Sa)", change: "+15%", color: "text-secondary" },
  { icon: PartyPopper, label: "Feiertage & Ferien", change: "+30%", color: "text-warning" },
];

const rooms = [
  { nr: 5, type: "Doppelzimmer Standard", base: 89, current: 102, reason: "+15% Wochenende" },
  { nr: 7, type: "Komfort-Doppel", base: 95, current: 105, reason: "+10% (>80% Auslastung diese Woche)" },
  { nr: 12, type: "Suite", base: 145, current: 167, reason: "+15% Wochenende" },
  { nr: 15, type: "Junior Suite", base: 125, current: 144, reason: "+15% Wochenende" },
  { nr: 18, type: "Familienzimmer", base: 135, current: 121, reason: "−10% (Auslastung < 50%)" },
];

export default function PricingTab() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-sm">Dynamische Preise</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preise werden automatisch nach Auslastung, Wochentag und Saison angepasst.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <span className="text-sm font-medium">{enabled ? "Aktiviert" : "Deaktiviert"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Aktive Preisregeln</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          {rules.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <r.icon className={`h-4 w-4 ${r.color}`} />
              <span className="flex-1 text-sm">{r.label}</span>
              <Badge variant="outline" className={`font-mono ${r.color}`}>{r.change}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Aktuelle Zimmerpreise (heute)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {rooms.map((r) => {
            const diff = r.current - r.base;
            const up = diff > 0;
            return (
              <div key={r.nr} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                <div className="min-w-0">
                  <div className="font-medium text-sm">Zimmer {r.nr} · {r.type}</div>
                  <div className="text-xs text-muted-foreground">{r.reason}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground line-through">{r.base} €</div>
                  <div className={`text-lg font-bold ${up ? "text-success" : "text-destructive"}`}>{r.current} €</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
