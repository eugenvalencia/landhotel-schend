import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Coffee, Wine, Flower2, Clock4, Check, Mail, Euro } from "lucide-react";
import DemoBanner from "../DemoBanner";

type OfferKind = "fruehstueck" | "upgrade" | "spa" | "spaeter" | "abendessen";

interface Suggestion {
  kind: OfferKind;
  label: string;
  price: string;
  acceptedRate: number;
  reasoning: string;
}

interface ArrivalRow {
  id: string;
  guest: string;
  room: string;
  arrival: string;
  tier: "Diamant" | "Gold" | "Standard";
  suggestions: Suggestion[];
}

const OFFER_ICON: Record<OfferKind, React.ComponentType<{ className?: string }>> = {
  fruehstueck: Coffee,
  upgrade: Sparkles,
  spa: Flower2,
  spaeter: Clock4,
  abendessen: Wine,
};

const ARRIVALS: ArrivalRow[] = [
  {
    id: "AR-1051",
    guest: "Familie Hartmann (Stammgast)",
    room: "Zimmer 9",
    arrival: "Heute, 16:00",
    tier: "Diamant",
    suggestions: [
      { kind: "abendessen", label: "3-Gänge-Eifel-Menü heute Abend für 2", price: "78 € statt 95 €", acceptedRate: 71, reasoning: "Buchten 4× zuvor Abendessen vor Ort." },
      { kind: "spa",         label: "Wellness-Gutschein Daun (2× 60 min)",  price: "120 €",         acceptedRate: 38, reasoning: "Anfrage 2024 nach Spa-Tipps, nie eingelöst." },
      { kind: "spaeter",     label: "Späterer Check-out bis 14 Uhr",        price: "kostenlos",     acceptedRate: 89, reasoning: "Hartmanns sind Diamant-Stammgäste." },
    ],
  },
  {
    id: "AR-1052",
    guest: "Herr Wessel (Geschäftlich)",
    room: "Zimmer 14",
    arrival: "Heute, 18:30",
    tier: "Standard",
    suggestions: [
      { kind: "fruehstueck", label: "Frühstück-Upgrade (Kontinental → Voll)", price: "+8 € / Tag", acceptedRate: 52, reasoning: "Geschäftsgäste nehmen Frühstück mit 60% Quote." },
      { kind: "spaeter",     label: "Check-out 13 Uhr",                       price: "10 €",        acceptedRate: 44, reasoning: "Standardtarif, Mi-Mo Anreise — viele wollen ausschlafen." },
    ],
  },
  {
    id: "AR-1053",
    guest: "S. Demir (Neugast, 1 Nacht)",
    room: "Zimmer 11",
    arrival: "Morgen, 15:30",
    tier: "Standard",
    suggestions: [
      { kind: "fruehstueck", label: "Frühstück hinzubuchen",                   price: "14 €",       acceptedRate: 67, reasoning: "Neugäste ohne Frühstück: 67% buchen nach." },
      { kind: "upgrade",     label: "Upgrade Zimmer 11 → Zimmer 5 (Eifelblick)", price: "+25 € / N", acceptedRate: 22, reasoning: "Zimmer 5 wäre morgen verfügbar." },
    ],
  },
  {
    id: "AR-1054",
    guest: "Engelhardt + Partnerin",
    room: "Zimmer 5",
    arrival: "Morgen, 17:00",
    tier: "Gold",
    suggestions: [
      { kind: "abendessen", label: "Wein-Pairing-Menü Sa.",                 price: "115 € / 2 Pers.", acceptedRate: 58, reasoning: "Engelhardt bestellt regelmäßig Pfalz-Wein im Restaurant." },
      { kind: "spa",        label: "Wellness-Wochenende-Paket",             price: "180 € / 2 Pers.", acceptedRate: 31, reasoning: "Gold-Tier, Hochzeitstag im Profil hinterlegt." },
    ],
  },
];

const TIER_STYLE: Record<ArrivalRow["tier"], string> = {
  Diamant: "bg-secondary text-secondary-foreground",
  Gold: "bg-amber-500 text-white",
  Standard: "bg-muted text-muted-foreground",
};

export default function DemoAutoUpsellTab() {
  const [accepted, setAccepted] = useState<Record<string, true>>({});

  const stats = useMemo(() => {
    const totalSuggestions = ARRIVALS.reduce((s, a) => s + a.suggestions.length, 0);
    const avgRate = Math.round(
      ARRIVALS.flatMap((a) => a.suggestions).reduce((s, x) => s + x.acceptedRate, 0) /
        Math.max(totalSuggestions, 1),
    );
    // Annahme: Durchschnitt 35 € pro angenommenem Up-Sell
    const expectedEur = Math.round((totalSuggestions * avgRate * 35) / 100);
    return { totalSuggestions, avgRate, expectedEur };
  }, []);

  const markAccept = (key: string) => setAccepted((s) => ({ ...s, [key]: true }));

  return (
    <div>
      <DemoBanner description="Personalisierte Up-Sell-Vorschläge pro Anreise — basierend auf Stammgast-Historie, Tier, Wetter und Auslastung. 1 Klick = E-Mail an Gast mit Akzeptier-Link." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Gift className="h-5 w-5 text-secondary" /> Auto-Up-Sell
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Anreisen heute + morgen · {ARRIVALS.length} Gäste, {stats.totalSuggestions} Vorschläge
          </p>
        </div>
        <Button className="gap-2">
          <Mail className="h-4 w-4" /> Alle empfohlenen versenden
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <CompactStat label="Vorschläge" value={`${stats.totalSuggestions}`} icon={Gift} />
        <CompactStat label="Ø Annahmequote" value={`${stats.avgRate}%`} icon={Sparkles} />
        <CompactStat label="Erwarteter Mehrumsatz" value={`+${stats.expectedEur} €`} icon={Euro} color="text-emerald-600" />
        <CompactStat label="Bereits angenommen" value={`${Object.keys(accepted).length}`} icon={Check} color="text-secondary" />
      </div>

      <div className="space-y-3">
        {ARRIVALS.map((a) => (
          <Card key={a.id} className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {a.guest}
                    <Badge className={"text-[10px] " + TIER_STYLE[a.tier]}>{a.tier}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.room} · Anreise {a.arrival}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid md:grid-cols-2 gap-2">
                {a.suggestions.map((s, idx) => {
                  const key = `${a.id}-${idx}`;
                  const Icon = OFFER_ICON[s.kind];
                  const isAccepted = accepted[key] === true;
                  return (
                    <div
                      key={key}
                      className={
                        "rounded-md border p-3 flex items-start gap-3 " +
                        (isAccepted ? "bg-emerald-500/5 border-emerald-500/40" : "bg-card")
                      }
                    >
                      <Icon className={"h-4 w-4 mt-0.5 " + (isAccepted ? "text-emerald-600" : "text-secondary")} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="tabular-nums font-medium text-foreground">{s.price}</span>
                          <span>·</span>
                          <span>{s.acceptedRate}% Annahme historisch</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 italic leading-relaxed">{s.reasoning}</div>
                        {!isAccepted && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={() => markAccept(key)}>
                              <Mail className="h-3 w-3" /> Vorschlag senden
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">Ablehnen</Button>
                          </div>
                        )}
                        {isAccepted && (
                          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Versendet — Gast hat den Akzeptier-Link
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
