import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import DemoMarker from "./DemoMarker";

type Status = "sauber" | "schmutzig" | "in_arbeit";

const initial: { nr: number; type: string; status: Status; staff?: string; checkout?: string }[] = [
  { nr: 1, type: "Einzelzimmer", status: "sauber" },
  { nr: 2, type: "Doppelzimmer Standard", status: "schmutzig", checkout: "heute 10:45" },
  { nr: 3, type: "Doppelzimmer Standard", status: "in_arbeit", staff: "Maria" },
  { nr: 4, type: "Doppelzimmer Standard", status: "sauber" },
  { nr: 5, type: "Doppelzimmer Standard", status: "schmutzig", checkout: "heute 11:00" },
  { nr: 6, type: "Komfort-Doppel", status: "sauber" },
  { nr: 7, type: "Komfort-Doppel", status: "in_arbeit", staff: "Elena" },
  { nr: 8, type: "Komfort-Doppel", status: "sauber" },
  { nr: 12, type: "Suite", status: "schmutzig", checkout: "heute 09:30" },
  { nr: 15, type: "Junior Suite", status: "sauber" },
  { nr: 18, type: "Familienzimmer", status: "in_arbeit", staff: "Sabine" },
];

const cfg = {
  sauber: { label: "Sauber", icon: CheckCircle2, cls: "bg-success/10 border-success/30 text-success" },
  schmutzig: { label: "Schmutzig", icon: AlertCircle, cls: "bg-destructive/10 border-destructive/30 text-destructive" },
  in_arbeit: { label: "In Arbeit", icon: Clock, cls: "bg-warning/10 border-warning/30 text-warning" },
};

export default function HousekeepingTab() {
  const [list, setList] = useState(initial);
  const counts = { sauber: 0, schmutzig: 0, in_arbeit: 0 };
  list.forEach((r) => counts[r.status]++);

  const markClean = (nr: number) => {
    setList((l) => l.map((r) => (r.nr === nr ? { ...r, status: "sauber" } : r)));
    toast.success(`Zimmer ${nr} als sauber markiert`);
  };
  const markCleaning = (nr: number) => {
    setList((l) => l.map((r) => (r.nr === nr ? { ...r, status: "in_arbeit", staff: "Maria" } : r)));
    toast.success(`Reinigung Zimmer ${nr} gestartet`);
  };

  return (
    <div className="space-y-4">
      <DemoMarker />
      <Card className="bg-secondary/5 border-secondary/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Mobile App für Reinigungspersonal</div>
            <p className="text-xs text-muted-foreground mt-1">
              Personal kann den Status direkt vom Smartphone aktualisieren. Nach jedem Check-out wird das Zimmer automatisch als „Schmutzig" markiert.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{counts.sauber}</div>
          <div className="text-xs text-muted-foreground mt-1">Sauber & bereit</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{counts.in_arbeit}</div>
          <div className="text-xs text-muted-foreground mt-1">In Reinigung</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{counts.schmutzig}</div>
          <div className="text-xs text-muted-foreground mt-1">Wartet auf Reinigung</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Zimmerstatus</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {list.map((r) => {
            const c = cfg[r.status];
            return (
              <div key={r.nr} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">Zimmer {r.nr} · {r.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.status === "schmutzig" && r.checkout && `Check-out ${r.checkout}`}
                    {r.status === "in_arbeit" && r.staff && `Reinigung durch ${r.staff}`}
                    {r.status === "sauber" && "Bezugsfertig"}
                  </div>
                </div>
                <Badge variant="outline" className={c.cls}>
                  <c.icon className="h-3 w-3 mr-1" /> {c.label}
                </Badge>
                <div className="flex gap-1">
                  {r.status === "schmutzig" && (
                    <Button size="sm" variant="outline" onClick={() => markCleaning(r.nr)}>Start</Button>
                  )}
                  {r.status !== "sauber" && (
                    <Button size="sm" onClick={() => markClean(r.nr)}>Als sauber</Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
