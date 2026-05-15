import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, Building2, Receipt, Printer, FileSpreadsheet } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface Row {
  time: string;
  ref: string;
  description: string;
  method: "Bar" | "Karte" | "Überweisung" | "PayPal";
  amount: number;
}

const TODAY: Row[] = [
  { time: "08:14", ref: "LSC26-1031", description: "Abreise Lisa Sommerfeld",        method: "Karte",        amount: 285.00 },
  { time: "09:02", ref: "LSC26-1032", description: "Abreise Familie Schmitt-Lehmann", method: "Bar",          amount: 210.00 },
  { time: "09:48", ref: "LSC26-1033", description: "Abreise Sarah Köhler",            method: "Karte",        amount: 65.00 },
  { time: "11:12", ref: "BAR-2614",   description: "Bar-Verzehr Tisch 3",             method: "Bar",          amount: 28.50 },
  { time: "12:48", ref: "LSC26-1051", description: "Anzahlung Berger (Online vorab)",  method: "Überweisung",  amount: 142.50 },
  { time: "13:22", ref: "REST-2812",  description: "Mittagessen Tisch 5",             method: "Karte",        amount: 64.20 },
  { time: "14:00", ref: "BAR-2615",   description: "Café + Kuchen Tisch 1",           method: "Bar",          amount: 19.80 },
  { time: "16:30", ref: "LSC26-1063", description: "Online-Buchung Frank Wagner",     method: "PayPal",       amount: 195.00 },
];

export default function DemoCashBookTab() {
  const totals = TODAY.reduce(
    (acc, r) => {
      acc[r.method] = (acc[r.method] ?? 0) + r.amount;
      acc.gesamt += r.amount;
      return acc;
    },
    { Bar: 0, Karte: 0, Überweisung: 0, PayPal: 0, gesamt: 0 } as Record<string, number>,
  );

  // Mock-Kassenzähl-Differenz
  const kassenZaehl = 258.30; // was tatsächlich in der Kasse ist
  const sollBar = totals.Bar;
  const diff = kassenZaehl - sollBar;

  return (
    <div>
      <DemoBanner description="Tagesabschluss / Cash-Buch: alle Einnahmen heute nach Zahlungsart getrennt. Kassensturz-Differenz wird automatisch berechnet. Export für Steuerbüro per Klick." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Banknote className="h-5 w-5 text-secondary" /> Tagesabschluss
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Freitag, 15. Mai 2026 · Stand 16:42
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" /> Z-Bericht drucken</Button>
          <Button className="gap-2"><FileSpreadsheet className="h-4 w-4" /> An DATEV senden</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MethodCard label="Bar"          value={totals.Bar}         icon={Banknote}   color="text-emerald-600" />
        <MethodCard label="Karte"        value={totals.Karte}       icon={CreditCard} color="text-sky-600" />
        <MethodCard label="Überweisung"  value={totals.Überweisung} icon={Building2} />
        <MethodCard label="PayPal"       value={totals.PayPal}      icon={CreditCard} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-base">Buchungen heute ({TODAY.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground text-left">
                    <th className="font-medium py-2 px-2">Zeit</th>
                    <th className="font-medium py-2 px-2">Beleg</th>
                    <th className="font-medium py-2 px-2">Vorgang</th>
                    <th className="font-medium py-2 px-2">Methode</th>
                    <th className="font-medium py-2 px-2 text-right">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {TODAY.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2 text-xs text-muted-foreground tabular-nums">{r.time}</td>
                      <td className="py-2 px-2 font-mono text-xs text-secondary">{r.ref}</td>
                      <td className="py-2 px-2">{r.description}</td>
                      <td className="py-2 px-2">
                        <Badge variant="outline" className="text-[10px]">{r.method}</Badge>
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-medium">{r.amount.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td colSpan={4} className="py-2 px-2 text-right font-medium">Tages-Summe</td>
                    <td className="py-2 px-2 text-right tabular-nums font-semibold text-lg">{totals.gesamt.toFixed(2)} €</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4 text-secondary" /> Kassen-Sturz</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soll (Bar-Einnahmen)</span>
              <span className="font-medium tabular-nums">{sollBar.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anfangs-Bestand</span>
              <span className="font-medium tabular-nums">200,00 €</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Soll-Kasse</span>
              <span className="font-medium tabular-nums">{(sollBar + 200).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ist-Kasse (gezählt)</span>
              <span className="font-medium tabular-nums">{(kassenZaehl + 200).toFixed(2)} €</span>
            </div>
            <div className={"flex justify-between border-t pt-2 font-semibold " + (Math.abs(diff) < 0.5 ? "text-emerald-600" : "text-rose-600")}>
              <span>Differenz</span>
              <span className="tabular-nums">{diff >= 0 ? "+" : ""}{diff.toFixed(2)} €</span>
            </div>
            <Button size="sm" className="w-full mt-2">Kasse als gezählt markieren</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MethodCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color?: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={"h-3.5 w-3.5 " + (color ?? "text-secondary")} />
        </div>
        <p className={"text-lg font-semibold tabular-nums " + (color ?? "")}>{value.toFixed(2)} €</p>
      </CardContent>
    </Card>
  );
}
