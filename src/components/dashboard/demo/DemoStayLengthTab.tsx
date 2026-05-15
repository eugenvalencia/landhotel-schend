import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Moon, ArrowRight, Sparkles, Euro, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface Opportunity {
  id: string;
  guest: string;
  room: string;
  currentArrival: string;
  currentDeparture: string;
  currentNights: number;
  suggestedExtraNight?: string;
  suggestedEarlierArrival?: string;
  reason: string;
  upliftEur: number;
  occupancyAfterChange: string;
  confidence: "hoch" | "mittel" | "niedrig";
  template: string;
}

const OPPS: Opportunity[] = [
  {
    id: "OP-2026-21",
    guest: "Familie Hartmann (Stammgast, 8. Aufenthalt)",
    room: "Zimmer 9 (Suite)",
    currentArrival: "Fr. 22.05.",
    currentDeparture: "So. 24.05.",
    currentNights: 2,
    suggestedExtraNight: "+1 Nacht zum So. 25.05.",
    reason: "Mo. 25.05. ist Brückentag, Hartmanns kamen schon 2× sonntags an. Zimmer 9 ist Mo. frei.",
    upliftEur: 145,
    occupancyAfterChange: "Mo: 38% → 42%",
    confidence: "hoch",
    template: "Hallo Familie Hartmann, da Mo. der 25. ein Brückentag ist und Zimmer 9 für Sie noch verfügbar wäre — möchten Sie eine Nacht verlängern? Wir machen den Sonntag für 130 € statt 145 €.",
  },
  {
    id: "OP-2026-22",
    guest: "Herr Engelhardt + Frau",
    room: "Zimmer 5",
    currentArrival: "Sa. 23.05.",
    currentDeparture: "So. 24.05.",
    currentNights: 1,
    suggestedEarlierArrival: "Fr. 22.05. vorziehen",
    reason: "Zimmer 5 ist Fr. frei. Herr Engelhardt buchte schon 3× Wochenend-Doppelnächte. Mai-Wetter sieht gut aus.",
    upliftEur: 95,
    occupancyAfterChange: "Fr: 71% → 75%",
    confidence: "mittel",
    template: "Hallo Herr Engelhardt, da Sie schon einmal früher anreisen wollten — hätten Sie Interesse, am Freitag bereits zu starten? Zimmer ist verfügbar, Preis bleibt 95 €.",
  },
  {
    id: "OP-2026-23",
    guest: "S. Demir (Erst-Buchung über Booking.com)",
    room: "Zimmer 11",
    currentArrival: "Mi. 27.05.",
    currentDeparture: "Do. 28.05.",
    currentNights: 1,
    suggestedExtraNight: "+1 Nacht zum Fr. 29.05.",
    reason: "Eintägige Eifel-Reisen bringen meist negative Reviews. Zimmer 11 ist Do. + Fr. frei.",
    upliftEur: 110,
    occupancyAfterChange: "Do: 32% → 36%",
    confidence: "mittel",
    template: "Hallo Frau Demir, viele unserer Gäste verlängern für die Vulkaneifel-Tour einen Tag. Zimmer ist verfügbar — wollen Sie eine zweite Nacht hinzunehmen?",
  },
  {
    id: "OP-2026-24",
    guest: "Herr Wessel (Geschäftlich)",
    room: "Zimmer 14",
    currentArrival: "Di. 26.05.",
    currentDeparture: "Mi. 27.05.",
    currentNights: 1,
    suggestedExtraNight: "+1 Nacht (Mi → Do)",
    reason: "Schwacher Mi-Do-Belegung. Späterer Check-out oder Verlängerung würde sich auszahlen.",
    upliftEur: 75,
    occupancyAfterChange: "Mi: 28% → 32%",
    confidence: "niedrig",
    template: "Sehr geehrter Herr Wessel, falls Ihre Termine es zulassen — wir bieten Ihnen Mi. → Do. für 75 € (statt 95 €) an.",
  },
];

const CONF_STYLE: Record<Opportunity["confidence"], string> = {
  hoch: "text-emerald-600 border-emerald-500/40 bg-emerald-500/5",
  mittel: "text-amber-600 border-amber-500/40 bg-amber-500/5",
  niedrig: "text-muted-foreground",
};

export default function DemoStayLengthTab() {
  const [openId, setOpenId] = useState<string | null>(OPPS[0]?.id ?? null);

  const totals = useMemo(() => {
    const totalUplift = OPPS.reduce((s, o) => s + o.upliftEur, 0);
    const hoch = OPPS.filter((o) => o.confidence === "hoch").length;
    return { totalUplift, hoch };
  }, []);

  return (
    <div>
      <DemoBanner description="Erkennt Lücken zwischen bestätigten Buchungen und schlägt vor, welchen Gästen eine Verlängerung oder frühere Anreise wahrscheinlich passt — basierend auf Stammgast-Mustern, Brückentagen und Wetter." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-secondary" /> Aufenthalts-Optimum
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Vorschläge für längere oder vorgezogene Aufenthalte · {OPPS.length} aktiv
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Sparkles className="h-4 w-4" /> Vorschläge an Gäste verschicken
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <CompactStat label="Mehrumsatz-Potenzial" value={`+${totals.totalUplift} €`} icon={Euro} color="text-emerald-600" />
        <CompactStat label="Hoch-Wahrscheinlichkeit" value={`${totals.hoch} Gäste`} icon={Sparkles} />
        <CompactStat label="Durchschn. Aufenthalt" value="1,8 Nächte" icon={Moon} />
        <CompactStat label="Ziel-Aufenthalt" value="2,4 Nächte" icon={CalendarClock} color="text-secondary" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Vorschläge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {OPPS.map((o) => {
            const open = openId === o.id;
            return (
              <div
                key={o.id}
                className={"rounded-md border bg-card transition-shadow " + (open ? "shadow-elevated" : "hover:shadow-elevated")}
              >
                <button
                  onClick={() => setOpenId(open ? null : o.id)}
                  className="w-full text-left p-3 md:p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{o.guest}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{o.room}</span>
                      <span>·</span>
                      <span>{o.currentArrival} <ArrowRight className="inline h-3 w-3 mx-0.5" /> {o.currentDeparture}</span>
                      <span>·</span>
                      <span className="font-mono">{o.currentNights} N</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-semibold tabular-nums text-emerald-600">+{o.upliftEur} €</span>
                    <Badge variant="outline" className={"text-[10px] " + CONF_STYLE[o.confidence]}>{o.confidence}</Badge>
                  </div>
                </button>

                {open && (
                  <div className="px-4 pb-4 pt-0 space-y-3 border-t">
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Empfehlung</div>
                        <div className="text-sm font-medium">
                          {o.suggestedExtraNight ?? o.suggestedEarlierArrival}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Belegungs-Effekt</div>
                        <div className="text-sm font-medium">{o.occupancyAfterChange}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Warum dieser Gast?</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{o.reason}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Vorlage E-Mail / WhatsApp</div>
                      <div className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed italic">"{o.template}"</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Vorschlag verschicken
                      </Button>
                      <Button size="sm" variant="outline">Personalisieren</Button>
                      <Button size="sm" variant="ghost">Ignorieren</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function CompactStat({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color?: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-secondary" />
        </div>
        <p className={"text-lg font-semibold tabular-nums " + (color ?? "")}>{value}</p>
      </CardContent>
    </Card>
  );
}
