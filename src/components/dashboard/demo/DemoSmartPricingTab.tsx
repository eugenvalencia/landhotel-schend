import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, Calendar, Euro, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface PricingDay {
  date: string; // ISO
  weekday: string;
  basePrice: number;
  suggestedPrice: number;
  reason: string;
  occupancyForecast: number; // %
  signals: string[];
}

const ROOM_TYPE = "Doppelzimmer Standard (Standardpreis 95 €)";

// 30 Tage Vorschlag generieren — mit Deko-Saisonalität, Wochenend-Boost, Eifel-Events
function buildSuggestions(): PricingDay[] {
  const today = new Date(2026, 4, 15); // 15.05.2026
  const days: PricingDay[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today.getTime() + i * 86400000);
    const dow = d.getDay();
    const dom = d.getDate();
    const month = d.getMonth();

    const weekday = d.toLocaleDateString("de-DE", { weekday: "short" });
    const base = 95;
    const isFr = dow === 5;
    const isSa = dow === 6;
    const isWeekend = isFr || isSa;
    const isBridge = (month === 4 && dom === 14) || (month === 4 && dom === 25); // Christi Himmelfahrt + Wochen-Brücke
    const isMaifeier = (month === 4 && (dom === 30 || dom === 31)); // Schalkenmehrener Maarfest Ende Mai (fiktiv)

    let factor = 1.0;
    const signals: string[] = [];

    if (isWeekend) { factor += 0.15; signals.push("Wochenende"); }
    if (isBridge)  { factor += 0.20; signals.push("Brückentag"); }
    if (isMaifeier) { factor += 0.25; signals.push("Maarfest Schalkenmehren"); }
    if (dow === 1 || dow === 2) { factor -= 0.05; signals.push("Mo/Di schwach"); }

    // Vorjahres-Belegung simulieren
    const baseOcc = isWeekend ? 78 : (dow === 0 ? 50 : 55);
    const occupancyForecast = Math.min(95, baseOcc + (isBridge ? 15 : 0) + (isMaifeier ? 18 : 0));

    let reason = "Normaltarif";
    if (signals.length > 0) reason = signals.join(" + ");

    const suggested = Math.round((base * factor) / 5) * 5; // auf 5€ runden

    days.push({
      date: d.toISOString().slice(0, 10),
      weekday: `${weekday} ${dom.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}`,
      basePrice: base,
      suggestedPrice: suggested,
      reason,
      occupancyForecast,
      signals,
    });
  }
  return days;
}

export default function DemoSmartPricingTab() {
  const days = useMemo(buildSuggestions, []);

  const totals = useMemo(() => {
    const delta = days.reduce((s, d) => s + (d.suggestedPrice - d.basePrice), 0);
    const above = days.filter((d) => d.suggestedPrice > d.basePrice).length;
    const below = days.filter((d) => d.suggestedPrice < d.basePrice).length;
    return { delta, above, below };
  }, [days]);

  return (
    <div>
      <DemoBanner description="KI-gestützter Preisvorschlag pro Tag — kombiniert Vorjahres-Auslastung, Wochentag, Feiertage, Brückentage und lokale Eifel-Events. 1-Klick übernehmen oder ignorieren." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" /> Smart-Pricing
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Vorschlag für die nächsten 30 Tage · {ROOM_TYPE}
          </p>
        </div>
        <Button className="gap-2" variant="default">
          <Sparkles className="h-4 w-4" /> Alle Vorschläge übernehmen
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <CompactStat label="Mehrertrag-Potenzial" value={`+${totals.delta} €`} icon={Euro} color="text-emerald-600" />
        <CompactStat label="Anheben empfohlen" value={`${totals.above} Tage`} icon={TrendingUp} />
        <CompactStat label="Senken empfohlen" value={`${totals.below} Tage`} icon={Calendar} />
        <CompactStat label="Basisrate" value="95 €" icon={Euro} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tagesempfehlungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-xs text-muted-foreground text-left">
                  <th className="font-medium py-2 px-2">Tag</th>
                  <th className="font-medium py-2 px-2">Standard</th>
                  <th className="font-medium py-2 px-2">Empfehlung</th>
                  <th className="font-medium py-2 px-2">Δ</th>
                  <th className="font-medium py-2 px-2">Belegungs-Prognose</th>
                  <th className="font-medium py-2 px-2">Signale</th>
                  <th className="font-medium py-2 px-2 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => {
                  const diff = d.suggestedPrice - d.basePrice;
                  const isUp = diff > 0;
                  const isDown = diff < 0;
                  return (
                    <tr key={d.date} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-2 font-medium whitespace-nowrap">{d.weekday}</td>
                      <td className="py-2 px-2 tabular-nums text-muted-foreground">{d.basePrice} €</td>
                      <td className="py-2 px-2 tabular-nums font-semibold">{d.suggestedPrice} €</td>
                      <td className={"py-2 px-2 tabular-nums font-medium " + (isUp ? "text-emerald-600" : isDown ? "text-rose-600" : "text-muted-foreground")}>
                        {isUp ? "+" : ""}{diff} €
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className={
                                "h-full " + (d.occupancyForecast >= 70 ? "bg-emerald-500" : d.occupancyForecast >= 40 ? "bg-amber-500" : "bg-rose-500")
                              }
                              style={{ width: `${d.occupancyForecast}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums">{d.occupancyForecast}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {d.signals.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {d.signals.map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="opacity-60">—</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          <Check className="h-3 w-3" /> Übernehmen
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card mt-4 bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">So funktioniert's:</strong> Der Algorithmus kombiniert
          Vorjahres-Belegung am gleichen Wochentag, Saison-Muster, deutsche Feiertage + Brückentage
          und kuratierte lokale Events (Maarfest, Wein-Wochenende Daun, …). Du behältst die volle
          Kontrolle — Vorschläge werden nie automatisch live geschaltet.
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
