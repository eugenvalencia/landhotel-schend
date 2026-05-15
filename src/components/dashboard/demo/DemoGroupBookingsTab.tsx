import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users2, Plus, Calendar, Euro, Utensils, Briefcase, Heart } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface GroupBooking {
  id: string;
  name: string;
  type: "Hochzeit" | "Firma" | "Familie" | "Reisegruppe";
  date_range: string;
  rooms: number;
  guests: number;
  total: number;
  status: "Anfrage" | "Angebot" | "Bestätigt" | "Anzahlung erhalten" | "Abgereist";
  contact: string;
  notes: string;
  rooms_detail: { room: string; guest: string }[];
}

const GROUPS: GroupBooking[] = [
  {
    id: "GR-2614",
    name: "Hochzeit Helmer / Becker",
    type: "Hochzeit",
    date_range: "14.09. – 15.09.2026",
    rooms: 12, guests: 24,
    total: 4860,
    status: "Angebot",
    contact: "Anna Helmer, +49 162 6678901",
    notes: "65 Pers. zur Feier, davon 24 übernachten. Standesamtliche Trauung Sa. 11 Uhr, Empfang Hof, Menü Saal.",
    rooms_detail: [
      { room: "Z. 1",  guest: "Helmer/Becker (Brautpaar)" },
      { room: "Z. 2",  guest: "Eltern Helmer" },
      { room: "Z. 4",  guest: "Eltern Becker" },
      { room: "Z. 5",  guest: "Trauzeugen" },
    ],
  },
  {
    id: "GR-2613",
    name: "Firma Krause GmbH — Strategie-Klausur",
    type: "Firma",
    date_range: "18.06. – 20.06.2026",
    rooms: 6, guests: 6,
    total: 1690,
    status: "Bestätigt",
    contact: "Holger Krause, h.krause@schend-demo.de",
    notes: "6 EZ-Belegung. Tagungsraum + Beamer + Mittagessen jeweils 12:30. Rechnung gesammelt an Firma.",
    rooms_detail: [],
  },
  {
    id: "GR-2612",
    name: "Familie Berger — Geburtstag Vater 70",
    type: "Familie",
    date_range: "11.07. – 13.07.2026",
    rooms: 5, guests: 12,
    total: 1380,
    status: "Anzahlung erhalten",
    contact: "Familie Berger",
    notes: "Festessen Samstag 19 Uhr im Saal. Kuchen für 14 Pers. zum Sonntags-Frühstück.",
    rooms_detail: [],
  },
  {
    id: "GR-2611",
    name: 'Wander-Gruppe „Eifel-Steiger"',
    type: "Reisegruppe",
    date_range: "03.10. – 05.10.2026",
    rooms: 8, guests: 16,
    total: 2280,
    status: "Anfrage",
    contact: "Tourismus-Verein Daun",
    notes: "Geführte Wanderung Manderscheider Burgen Sa, Maaren-Tour So. Lunchpaket gewünscht.",
    rooms_detail: [],
  },
];

const STATUS_STYLE: Record<GroupBooking["status"], string> = {
  "Anfrage": "bg-sky-500 hover:bg-sky-500 text-white",
  "Angebot": "bg-amber-500 hover:bg-amber-500 text-white",
  "Bestätigt": "bg-emerald-500 hover:bg-emerald-500 text-white",
  "Anzahlung erhalten": "bg-emerald-700 hover:bg-emerald-700 text-white",
  "Abgereist": "bg-muted text-muted-foreground",
};

const TYPE_ICON: Record<GroupBooking["type"], React.ComponentType<{ className?: string }>> = {
  Hochzeit: Heart,
  Firma: Briefcase,
  Familie: Users2,
  Reisegruppe: Calendar,
};

export default function DemoGroupBookingsTab() {
  const [selected, setSelected] = useState<GroupBooking | null>(null);

  const totals = {
    confirmedRevenue: GROUPS.filter((g) => g.status === "Bestätigt" || g.status === "Anzahlung erhalten").reduce((s, g) => s + g.total, 0),
    pendingRevenue: GROUPS.filter((g) => g.status === "Anfrage" || g.status === "Angebot").reduce((s, g) => s + g.total, 0),
    rooms: GROUPS.reduce((s, g) => s + g.rooms, 0),
    guests: GROUPS.reduce((s, g) => s + g.guests, 0),
  };

  return (
    <div>
      <DemoBanner description="Gruppen-Buchungen für Hochzeiten, Firmen-Klausuren, Familienfeiern und Reisegruppen. Sammel-Rechnung oder pro Person, gemeinsame Diät-Pflege, Saal-Reservierung integriert." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Users2 className="h-5 w-5 text-secondary" /> Gruppen-Buchungen
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {GROUPS.length} aktive Gruppen — Klick auf eine Karte zeigt Details.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Neue Gruppe
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="shadow-card"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Bestätigt</p>
          <p className="text-lg font-semibold tabular-nums text-emerald-600">{totals.confirmedRevenue.toLocaleString("de-DE")} €</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">In Verhandlung</p>
          <p className="text-lg font-semibold tabular-nums text-amber-600">{totals.pendingRevenue.toLocaleString("de-DE")} €</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Zimmer gebucht</p>
          <p className="text-lg font-semibold tabular-nums">{totals.rooms}</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Gäste insgesamt</p>
          <p className="text-lg font-semibold tabular-nums">{totals.guests}</p>
        </CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {GROUPS.map((g) => {
          const Icon = TYPE_ICON[g.type];
          return (
            <Card
              key={g.id}
              className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => setSelected(g)}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="h-4 w-4 text-secondary shrink-0" />
                    <div className="font-medium truncate">{g.name}</div>
                  </div>
                  <Badge className={"text-[10px] shrink-0 " + STATUS_STYLE[g.status]}>{g.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span><Calendar className="h-3 w-3 inline mr-1" />{g.date_range}</span>
                  <span>{g.rooms} Zimmer · {g.guests} P.</span>
                </div>
                <div className="pt-2 border-t flex items-baseline justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">{g.id}</span>
                  <span className="text-base font-semibold tabular-nums">{g.total.toLocaleString("de-DE")} €</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GroupDialog group={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function GroupDialog({ group, onClose }: { group: GroupBooking | null; onClose: () => void }) {
  if (!group) return null;
  const Icon = TYPE_ICON[group.type];
  return (
    <Dialog open={!!group} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-secondary" />
            {group.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-xs text-muted-foreground">Zeitraum</span><div>{group.date_range}</div></div>
          <div><span className="text-xs text-muted-foreground">Status</span><div><Badge className={"text-[10px] " + STATUS_STYLE[group.status]}>{group.status}</Badge></div></div>
          <div><span className="text-xs text-muted-foreground">Zimmer</span><div>{group.rooms}</div></div>
          <div><span className="text-xs text-muted-foreground">Personen</span><div>{group.guests}</div></div>
          <div className="col-span-2"><span className="text-xs text-muted-foreground">Kontakt</span><div>{group.contact}</div></div>
        </div>

        <div className="rounded-md border p-3 text-sm bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">Notiz</div>
          <div>{group.notes}</div>
        </div>

        {group.rooms_detail.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Zimmer-Zuteilung (Auszug)</div>
            <ul className="space-y-1 text-sm">
              {group.rooms_detail.map((r, i) => (
                <li key={i} className="flex justify-between border-b pb-1 last:border-0">
                  <span>{r.room}</span>
                  <span className="text-muted-foreground">{r.guest}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t pt-3 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Gesamt-Volumen</span>
          <span className="text-2xl font-semibold tabular-nums">{group.total.toLocaleString("de-DE")} €</span>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" className="gap-2"><Utensils className="h-4 w-4" /> Menü-Plan</Button>
          <Button className="gap-2"><Euro className="h-4 w-4" /> Sammel-Rechnung</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
