import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, AlertTriangle, CheckCircle2, Clock, User } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Status = "offen" | "in_arbeit" | "wartet" | "erledigt";
type Priority = "hoch" | "normal" | "niedrig";
type Category = "Technik" | "Inventar" | "Reinigung" | "Sicherheit" | "Gast-Beschwerde";

interface Ticket {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: Status;
  location: string;
  reported_by: string;
  assignee: string | null;
  created: string;
  due?: string;
}

const TICKETS: Ticket[] = [
  { id: "T-2026-141", title: "Heizung in Z. 11 macht laute Geräusche", category: "Technik",       priority: "hoch",    status: "wartet",     location: "Zimmer 11",     reported_by: "Gast (Krause)",     assignee: "Techniker Klein",  created: "14.05. 22:14", due: "16.05. 11:00" },
  { id: "T-2026-140", title: "Duschvorhang Z. 5 ersetzen",             category: "Inventar",      priority: "normal",  status: "offen",      location: "Zimmer 5",      reported_by: "Reinigung",         assignee: null,               created: "15.05. 09:22" },
  { id: "T-2026-139", title: "Spülmaschine Küche, Wartung fällig",     category: "Technik",       priority: "normal",  status: "in_arbeit",  location: "Küche",         reported_by: "Inhaber",           assignee: "Techniker Klein",  created: "13.05. 14:30", due: "16.05." },
  { id: "T-2026-138", title: "Z. 14 Hunde-Reinigung nach Abreise",     category: "Reinigung",     priority: "normal",  status: "offen",      location: "Zimmer 14",     reported_by: "Empfang",           assignee: "Reinigung-Team",   created: "14.05. 18:00", due: "17.05." },
  { id: "T-2026-137", title: "Garage: Tor schliesst manchmal nicht",   category: "Sicherheit",    priority: "hoch",    status: "in_arbeit",  location: "Garage",        reported_by: "Inhaber",           assignee: "Eugen",            created: "12.05. 19:00" },
  { id: "T-2026-136", title: "WLAN in Z. 9 schwach",                   category: "Technik",       priority: "niedrig", status: "offen",      location: "Zimmer 9",      reported_by: "Gast (Berg)",       assignee: null,               created: "12.05. 11:45" },
  { id: "T-2026-135", title: "Brotbestellung Bäckerei umstellen",      category: "Inventar",      priority: "niedrig", status: "erledigt",   location: "Küche",         reported_by: "Küche",             assignee: "Empfang",          created: "11.05. 08:30" },
  { id: "T-2026-134", title: "Gast meldete laute Nachbarn (Z. 4)",     category: "Gast-Beschwerde", priority: "normal", status: "erledigt", location: "Zimmer 4 vs Z. 5", reported_by: "Gast (Sommerfeld)", assignee: "Empfang",        created: "11.05. 23:15" },
];

const STATUS_LABEL: Record<Status, string> = {
  offen: "Offen", in_arbeit: "In Arbeit", wartet: "Wartet auf Termin", erledigt: "Erledigt",
};
const STATUS_STYLE: Record<Status, string> = {
  offen: "bg-rose-500 hover:bg-rose-500 text-white",
  in_arbeit: "bg-amber-500 hover:bg-amber-500 text-white",
  wartet: "bg-sky-500 hover:bg-sky-500 text-white",
  erledigt: "bg-emerald-500 hover:bg-emerald-500 text-white",
};

const PRIO_STYLE: Record<Priority, string> = {
  hoch: "text-rose-600 border-rose-500/40",
  normal: "text-amber-600 border-amber-500/40",
  niedrig: "text-muted-foreground",
};

export default function DemoTicketsTab() {
  const [filter, setFilter] = useState<"alle" | "offen" | "in_arbeit" | "erledigt">("alle");

  const filtered = TICKETS.filter((t) => {
    if (filter === "alle") return true;
    if (filter === "offen") return t.status === "offen" || t.status === "wartet";
    if (filter === "in_arbeit") return t.status === "in_arbeit";
    return t.status === "erledigt";
  });

  const counts = {
    offen: TICKETS.filter((t) => t.status === "offen" || t.status === "wartet").length,
    in_arbeit: TICKETS.filter((t) => t.status === "in_arbeit").length,
    erledigt: TICKETS.filter((t) => t.status === "erledigt").length,
  };

  return (
    <div>
      <DemoBanner description="Service-Tickets für Defekte, Wartung, Inventar und Gast-Beschwerden. Personal sieht auf dem Handy was zu tun ist, mit Fotos vor/nach Reparatur." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Wrench className="h-5 w-5 text-secondary" /> Service-Tickets
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reparaturen, Wartung, Mängel — auf einen Blick.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Neues Ticket
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatBtn label="Offen"        value={counts.offen}     active={filter === "offen"}      onClick={() => setFilter("offen")}      color="text-rose-600" />
        <StatBtn label="In Arbeit"    value={counts.in_arbeit} active={filter === "in_arbeit"}  onClick={() => setFilter("in_arbeit")}  color="text-amber-600" />
        <StatBtn label="Erledigt"     value={counts.erledigt}  active={filter === "erledigt"}   onClick={() => setFilter("erledigt")}   color="text-emerald-600" />
        <StatBtn label="Alle"         value={TICKETS.length}   active={filter === "alle"}       onClick={() => setFilter("alle")} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">{filtered.length} Tickets</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {filtered.map((t) => (
              <li key={t.id} className="py-3 flex items-start justify-between gap-3 hover:bg-muted/30 -mx-2 px-2 rounded cursor-pointer">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {t.status === "erledigt"
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    : t.priority === "hoch"
                      ? <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      : <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{t.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap mt-0.5">
                      <span className="font-mono">{t.id}</span>
                      <span>{t.location}</span>
                      <span>· gemeldet von {t.reported_by} ({t.created})</span>
                      {t.due && <span className="text-amber-600">· fällig {t.due}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className={"text-[10px] " + STATUS_STYLE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
                  <Badge variant="outline" className={"text-[10px] " + PRIO_STYLE[t.priority]}>{t.priority}</Badge>
                  <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                  {t.assignee && (
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <User className="h-2.5 w-2.5" /> {t.assignee}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBtn({ label, value, active, onClick, color }: { label: string; value: number; active: boolean; onClick: () => void; color?: string }) {
  return (
    <Card
      onClick={onClick}
      className={"shadow-card cursor-pointer transition-all " + (active ? "ring-2 ring-secondary" : "hover:shadow-elevated")}
    >
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={"text-2xl font-semibold tabular-nums " + (color ?? "")}>{value}</p>
      </CardContent>
    </Card>
  );
}
