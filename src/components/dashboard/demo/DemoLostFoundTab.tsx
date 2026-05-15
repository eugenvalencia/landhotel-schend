import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageSearch, Camera, MapPin, Mail, Truck, CheckCircle2, Archive, Plus } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Status = "neu" | "kontaktiert" | "versandt" | "abgeholt" | "archiviert";

interface Item {
  id: string;
  title: string;
  category: "Kleidung" | "Elektronik" | "Schmuck" | "Dokumente" | "Sonstiges" | "Kinder";
  found: string;
  location: string;
  finder: string;
  matchedGuest?: string;
  matchedStay?: string;
  status: Status;
  storage: string;
}

const ITEMS: Item[] = [
  {
    id: "LF-2026-058",
    title: "Schwarze Sonnenbrille (Ray-Ban Aviator)",
    category: "Sonstiges",
    found: "Heute, 11:30",
    location: "Zimmer 9 — Nachttisch",
    finder: "Reinigung (Marija)",
    matchedGuest: "Familie Hartmann",
    matchedStay: "11.05. – 14.05.2026",
    status: "neu",
    storage: "Schublade Rezeption A",
  },
  {
    id: "LF-2026-057",
    title: "Lila Wollschal",
    category: "Kleidung",
    found: "Heute, 09:15",
    location: "Frühstücksraum Stuhl 4",
    finder: "Empfang (Petra)",
    status: "neu",
    storage: "Schublade Rezeption A",
  },
  {
    id: "LF-2026-056",
    title: "Kinder-Teddy (braun, ohne Auge)",
    category: "Kinder",
    found: "Gestern, 19:00",
    location: "Zimmer 5",
    finder: "Reinigung (Anita)",
    matchedGuest: "Familie Schmitt-Lehmann",
    matchedStay: "12.05. – 14.05.2026",
    status: "kontaktiert",
    storage: "Schublade Rezeption A",
  },
  {
    id: "LF-2026-055",
    title: "iPhone Ladekabel (USB-C, lila)",
    category: "Elektronik",
    found: "Vor 2 Tagen",
    location: "Zimmer 11 — Steckdose Bett",
    finder: "Reinigung (Marija)",
    status: "archiviert",
    storage: "Sammelfach Elektronik",
  },
  {
    id: "LF-2026-054",
    title: "Goldene Ohrringe (Paar)",
    category: "Schmuck",
    found: "Vor 4 Tagen",
    location: "Bad Zimmer 14",
    finder: "Reinigung (Anita)",
    matchedGuest: "S. Köhler",
    matchedStay: "08.05. – 10.05.2026",
    status: "versandt",
    storage: "Tresor (Schmuck > 50 €)",
  },
  {
    id: "LF-2026-053",
    title: "Lederbrieftasche (Inhalt: 35 €, Foto)",
    category: "Dokumente",
    found: "Vor 6 Tagen",
    location: "Lobby Sessel",
    finder: "Gast (Herr Otte)",
    matchedGuest: "Lisa Sommerfeld",
    matchedStay: "06.05. – 08.05.2026",
    status: "abgeholt",
    storage: "Tresor",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  neu: "Neu",
  kontaktiert: "Gast informiert",
  versandt: "Versandt",
  abgeholt: "Abgeholt",
  archiviert: "Archiviert",
};

const STATUS_STYLE: Record<Status, string> = {
  neu: "bg-rose-500 hover:bg-rose-500 text-white",
  kontaktiert: "bg-sky-500 hover:bg-sky-500 text-white",
  versandt: "bg-amber-500 hover:bg-amber-500 text-white",
  abgeholt: "bg-emerald-500 hover:bg-emerald-500 text-white",
  archiviert: "bg-muted text-muted-foreground",
};

const CAT_STYLE: Record<Item["category"], string> = {
  Kleidung: "border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-300",
  Elektronik: "border-sky-500/30 text-sky-700 dark:text-sky-300",
  Schmuck: "border-amber-500/30 text-amber-700 dark:text-amber-400",
  Dokumente: "border-rose-500/30 text-rose-700 dark:text-rose-300",
  Sonstiges: "border-muted-foreground/30 text-muted-foreground",
  Kinder: "border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
};

export default function DemoLostFoundTab() {
  const [filter, setFilter] = useState<"alle" | "offen" | "versandt" | "abgeholt">("offen");

  const filtered = useMemo(() => {
    if (filter === "alle") return ITEMS;
    if (filter === "offen") return ITEMS.filter((i) => i.status === "neu" || i.status === "kontaktiert");
    if (filter === "versandt") return ITEMS.filter((i) => i.status === "versandt");
    return ITEMS.filter((i) => i.status === "abgeholt" || i.status === "archiviert");
  }, [filter]);

  const counts = {
    offen: ITEMS.filter((i) => i.status === "neu" || i.status === "kontaktiert").length,
    versandt: ITEMS.filter((i) => i.status === "versandt").length,
    erledigt: ITEMS.filter((i) => i.status === "abgeholt" || i.status === "archiviert").length,
  };

  return (
    <div>
      <DemoBanner description="Personal nimmt vergessene Sachen mit Foto + Zimmer auf, das System matcht automatisch gegen die letzten Buchungen und schlägt eine Kontakt-Mail mit Versand-Option vor." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-secondary" /> Lost &amp; Found
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Aktuell {ITEMS.length} Fundstücke · automatischer Gast-Match anhand Zimmer + Aufenthaltszeitraum
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Fundstück aufnehmen
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatBtn label="Offen"     value={counts.offen}     active={filter === "offen"}     onClick={() => setFilter("offen")}     color="text-rose-600" />
        <StatBtn label="Versandt"  value={counts.versandt}  active={filter === "versandt"}  onClick={() => setFilter("versandt")}  color="text-amber-600" />
        <StatBtn label="Erledigt"  value={counts.erledigt}  active={filter === "abgeholt"}  onClick={() => setFilter("abgeholt")}  color="text-emerald-600" />
        <StatBtn label="Alle"      value={ITEMS.length}     active={filter === "alle"}      onClick={() => setFilter("alle")} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{filtered.length} Fundstücke</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {filtered.map((i) => (
              <li key={i.id} className="py-3 flex items-start gap-3 hover:bg-muted/30 -mx-2 px-2 rounded">
                <div className="h-12 w-12 rounded-md bg-muted/60 flex items-center justify-center shrink-0 border">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{i.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="font-mono">{i.id}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {i.location}</span>
                        <span>·</span>
                        <span>{i.found}</span>
                        <span>·</span>
                        <span className="italic">{i.finder}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge className={"text-[10px] " + STATUS_STYLE[i.status]}>{STATUS_LABEL[i.status]}</Badge>
                      <Badge variant="outline" className={"text-[10px] " + CAT_STYLE[i.category]}>{i.category}</Badge>
                    </div>
                  </div>

                  {i.matchedGuest && (
                    <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>
                        Match: <strong className="text-foreground">{i.matchedGuest}</strong>{" "}
                        ({i.matchedStay})
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-muted-foreground mt-1.5">
                    Aufbewahrung: <span className="text-foreground">{i.storage}</span>
                  </div>

                  {(i.status === "neu" || i.status === "kontaktiert") && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {i.matchedGuest && (
                        <Button size="sm" className="h-7 text-xs gap-1.5">
                          <Mail className="h-3 w-3" /> {i.matchedGuest} anschreiben
                        </Button>
                      )}
                      {!i.matchedGuest && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                          <PackageSearch className="h-3 w-3" /> Gast suchen
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                        <Truck className="h-3 w-3" /> Versand vorbereiten
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5">
                        <Archive className="h-3 w-3" /> Archivieren
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-card mt-4 bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">DSGVO-Hinweis:</strong> Fundstücke werden nach 6 Monaten automatisch
          archiviert oder gespendet. Persönliche Dokumente werden separat gesichert und nur an verifizierte Eigentümer
          herausgegeben.
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
