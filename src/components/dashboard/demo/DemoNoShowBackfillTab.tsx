import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarX2, Phone, Mail, AlertTriangle, Euro, Sparkles, CheckCircle2, Clock } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Status = "wartet" | "kontaktiert" | "verkauft" | "abgelaufen";

interface NoShow {
  id: string;
  guest: string;
  room: string;
  rate: number;
  noShowSince: string;
  contactTried: number;
  status: Status;
  suggestion: string;
  prospect?: string;
  prospectPhone?: string;
}

const NO_SHOWS: NoShow[] = [
  {
    id: "NS-1041",
    guest: "Familie Otte (3 Pers.)",
    room: "Zimmer 7",
    rate: 165,
    noShowSince: "Heute, 19:30 (1h 12min überfällig)",
    contactTried: 2,
    status: "wartet",
    suggestion: "Walk-in-Anfrage 18:45 von Herrn Bremer (Tel.) — bislang vertröstet, Zimmer noch verfügbar.",
    prospect: "Herr Bremer (Walk-in 18:45)",
    prospectPhone: "0171 88 22 401",
  },
  {
    id: "NS-1040",
    guest: "M. Hartwig (Solo)",
    room: "Zimmer 12",
    rate: 95,
    noShowSince: "Heute, 20:05 (37min überfällig)",
    contactTried: 1,
    status: "wartet",
    suggestion: "Booking.com-Anfrage 19:20: Paar sucht 1 Nacht. Antwort bisher offen.",
    prospect: "Frau Berg (Booking.com)",
  },
  {
    id: "NS-1039",
    guest: "S. Vlasov",
    room: "Zimmer 3",
    rate: 110,
    noShowSince: "Gestern, 22:00 (kein Storno)",
    contactTried: 3,
    status: "kontaktiert",
    suggestion: "Karte vorbelastet — Stornogebühr 50% berechnet, Zimmer ab 18:00 wieder frei.",
  },
  {
    id: "NS-1038",
    guest: "J. Brandt + Partner",
    room: "Zimmer 9",
    rate: 145,
    noShowSince: "Gestern, 20:00",
    contactTried: 2,
    status: "verkauft",
    suggestion: "Spontan-Anreise Paar Wieland aus Trier (über Eifel-Gastgeber) — 130 € statt 145 €.",
    prospect: "Paar Wieland",
  },
  {
    id: "NS-1037",
    guest: "T. Eichner (Geschäftlich)",
    room: "Zimmer 5",
    rate: 95,
    noShowSince: "Vor 2 Tagen",
    contactTried: 4,
    status: "abgelaufen",
    suggestion: "Niemand erreichbar, Zimmer leer geblieben — Verlust 95 €.",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  wartet: "Wartet auf Aktion",
  kontaktiert: "Storno-Gebühr berechnet",
  verkauft: "Erfolgreich nachverkauft",
  abgelaufen: "Verloren",
};

const STATUS_STYLE: Record<Status, string> = {
  wartet: "bg-rose-500 hover:bg-rose-500 text-white",
  kontaktiert: "bg-sky-500 hover:bg-sky-500 text-white",
  verkauft: "bg-emerald-500 hover:bg-emerald-500 text-white",
  abgelaufen: "bg-muted text-muted-foreground",
};

export default function DemoNoShowBackfillTab() {
  const [filter, setFilter] = useState<"alle" | Status>("wartet");

  const filtered = useMemo(
    () => (filter === "alle" ? NO_SHOWS : NO_SHOWS.filter((n) => n.status === filter)),
    [filter],
  );

  const stats = useMemo(() => {
    const wartet = NO_SHOWS.filter((n) => n.status === "wartet").length;
    const verkauft = NO_SHOWS.filter((n) => n.status === "verkauft");
    const verloren = NO_SHOWS.filter((n) => n.status === "abgelaufen");
    const rescuedEur = verkauft.reduce((s, n) => s + n.rate, 0);
    const lostEur = verloren.reduce((s, n) => s + n.rate, 0);
    return { wartet, rescuedEur, lostEur, verkauft: verkauft.length };
  }, []);

  return (
    <div>
      <DemoBanner description="Erkennt No-Shows in Echtzeit (Anreisetag, ohne Storno, ohne Anruf) und schlägt sofort Walk-in-Gäste oder Wartelisten-Anfragen vor — bevor das Zimmer für die Nacht verloren ist." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <CalendarX2 className="h-5 w-5 text-secondary" /> No-Show-Backfill
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Aktive No-Shows + automatische Vorschläge, wer das Zimmer noch heute nehmen könnte.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatBtn label="Akut offen"     value={`${stats.wartet}`}             active={filter === "wartet"}      onClick={() => setFilter("wartet")}      color="text-rose-600" icon={AlertTriangle} />
        <StatBtn label="Gerettet (30d)" value={`+${stats.rescuedEur} €`}      active={filter === "verkauft"}    onClick={() => setFilter("verkauft")}    color="text-emerald-600" icon={Euro} />
        <StatBtn label="Verloren (30d)" value={`−${stats.lostEur} €`}         active={filter === "abgelaufen"}  onClick={() => setFilter("abgelaufen")}  color="text-muted-foreground" icon={Clock} />
        <StatBtn label="Alle"           value={`${NO_SHOWS.length}`}          active={filter === "alle"}        onClick={() => setFilter("alle")} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{filtered.length} Vorgänge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((n) => (
            <div key={n.id} className="rounded-md border bg-card p-3 md:p-4 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {n.status === "verkauft" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : n.status === "abgelaufen" ? (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                    )}
                    {n.guest}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-mono">{n.id}</span>
                    <span>·</span>
                    <span>{n.room}</span>
                    <span>·</span>
                    <span className="tabular-nums">{n.rate} € / Nacht</span>
                    <span>·</span>
                    <span>{n.noShowSince}</span>
                  </div>
                </div>
                <Badge className={"text-[10px] " + STATUS_STYLE[n.status]}>{STATUS_LABEL[n.status]}</Badge>
              </div>

              <div className="rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                <span>{n.suggestion}</span>
              </div>

              {n.status === "wartet" && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {n.prospectPhone && (
                    <Button size="sm" variant="default" className="h-8 gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {n.prospect} anrufen
                    </Button>
                  )}
                  {!n.prospectPhone && n.prospect && (
                    <Button size="sm" variant="default" className="h-8 gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {n.prospect} anschreiben
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-8 gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Gast nochmal versuchen ({n.contactTried}×)
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    Stornogebühr berechnen
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card mt-4 bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">So funktioniert's:</strong> 30 Minuten nach geplanter
          Anreisezeit ohne Check-in markieren wir die Buchung als potenziellen No-Show. Parallel
          prüfen wir Walk-in-Listen, Booking-Anfragen der letzten 2 Stunden und Wartelisten —
          der Vorschlag erscheint direkt mit Telefon-Klick oder E-Mail-Vorlage.
        </CardContent>
      </Card>
    </div>
  );
}

function StatBtn({
  label, value, active, onClick, color, icon: Icon,
}: { label: string; value: string; active: boolean; onClick: () => void; color?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <Card
      onClick={onClick}
      className={"shadow-card cursor-pointer transition-all " + (active ? "ring-2 ring-secondary" : "hover:shadow-elevated")}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-3.5 w-3.5 text-secondary" />}
        </div>
        <p className={"text-xl font-semibold tabular-nums " + (color ?? "")}>{value}</p>
      </CardContent>
    </Card>
  );
}
