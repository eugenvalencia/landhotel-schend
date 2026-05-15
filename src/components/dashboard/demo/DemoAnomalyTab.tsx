import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

const ALERTS = [
  {
    severity: "hoch",
    title: "Verdaechtige Buchungs-Burst",
    body: "5 Buchungen vom selben IP-Block 195.181.xxx in 4 Min, alle mit unterschiedlichen Namen. Klassischer Stripe-Card-Test-Versuch. Empfehlung: alle 5 ablehnen + IP-Block fuer 24 h sperren.",
    time: "Heute 11:18",
  },
  {
    severity: "mittel",
    title: "Unueblich hoher Rabatt-Code-Einsatz",
    body: 'Code „WANDERN26" wurde 14× heute eingeloest, gestern 0×. Pruefen ob legitim verbreitet oder geleakt.',
    time: "Heute 09:42",
  },
  {
    severity: "info",
    title: "Stammgast-Trend",
    body: "3 Stammgaeste, die normalerweise im Mai gebucht haben, sind dieses Jahr nicht erschienen. Vorschlag: persoenliche E-Mail mit Sommerangebot.",
    time: "Heute 06:10",
  },
];

const CLEAR = [
  { check: "Doppelbuchungen Mai",        result: "0 gefunden" },
  { check: "Negative-Preis Posten",      result: "0 gefunden" },
  { check: "Login-Versuche / IP",        result: "im normalen Rahmen" },
  { check: "Telefon-KI Anrufdauer-Ausreisser", result: "keine" },
];

function severityStyle(sev: string) {
  if (sev === "hoch")   return "border-rose-500/50 bg-rose-500/5";
  if (sev === "mittel") return "border-amber-500/50 bg-amber-500/5";
  return "border-sky-500/50 bg-sky-500/5";
}

export default function DemoAnomalyTab() {
  return (
    <div>
      <DemoBanner description="ML-basierte Anomalie-Erkennung: erkennt Card-Testing, Doppelbuchungen, Preis-Tricks, ungewoehnliche Login-Muster. Lernt aus deinen Reaktionen." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-secondary" /> Anomalie-Watch
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Was heute auffaellig war — und was nicht.</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {ALERTS.map((a) => (
          <Card key={a.title} className={"shadow-card border " + severityStyle(a.severity)}>
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className={"h-4 w-4 mt-0.5 shrink-0 " + (a.severity === "hoch" ? "text-rose-500" : a.severity === "mittel" ? "text-amber-500" : "text-sky-500")} />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">{a.severity}</Badge>
                  <span className="font-medium text-sm">{a.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{a.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Massnahme uebernehmen</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Ignorieren</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Routine-Checks heute</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {CLEAR.map((c) => (
              <li key={c.check} className="py-2.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-500" />{c.check}</span>
                <span className="text-xs text-muted-foreground">{c.result}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
