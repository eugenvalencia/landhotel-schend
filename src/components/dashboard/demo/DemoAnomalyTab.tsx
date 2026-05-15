import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert, AlertTriangle, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface Alert {
  id: string;
  severity: "hoch" | "mittel" | "info";
  title: string;
  body: string;
  time: string;
  evidence: { label: string; value: string }[];
  suggestedAction: string;
}

const ALERTS: Alert[] = [
  {
    id: "a1",
    severity: "hoch",
    title: "Verdaechtige Buchungs-Burst",
    body: "5 Buchungen vom selben IP-Block 195.181.xxx in 4 Min, alle mit unterschiedlichen Namen. Klassisches Stripe-Card-Test-Muster.",
    time: "Heute 11:18",
    evidence: [
      { label: "IP-Range", value: "195.181.0.0/16 (Hosting-Anbieter)" },
      { label: "Versuche", value: "5 in 4:08 min" },
      { label: "Karten",   value: "5× unterschiedlich, alle declined-then-success" },
      { label: "Betraege", value: "1× 65€, 2× 95€, 1× 105€, 1× 195€" },
      { label: "User-Agent","value": "Chrome 89 (veraltet) — Bot-Indikator" },
    ],
    suggestedAction: "5 Buchungen als 'cancelled' setzen, Refund triggern, IP-Block fuer 24h sperren, Stripe-Radar-Rule aktualisieren.",
  },
  {
    id: "a2",
    severity: "mittel",
    title: "Unueblich hoher Rabatt-Code-Einsatz",
    body: "Code „WANDERN26\" wurde 14× heute eingeloest, gestern 0×. Pruefen ob legitim verbreitet oder geleakt.",
    time: "Heute 09:42",
    evidence: [
      { label: "Code", value: "WANDERN26 (10% auf alle Buchungen)" },
      { label: "Heute", value: "14 Einloesungen" },
      { label: "Letzte 7 Tage", value: "0–2 Einloesungen/Tag" },
      { label: "Quellen", value: "Direct (8), Booking.com (4), unknown (2)" },
    ],
    suggestedAction: "Code-Reichweite pruefen (wo wurde er verteilt?), bei Verdacht auf Leak Code rotieren und neuen ausgeben.",
  },
  {
    id: "a3",
    severity: "info",
    title: "Stammgast-Trend",
    body: "3 Stammgaeste, die normalerweise im Mai gebucht haben, sind dieses Jahr nicht erschienen.",
    time: "Heute 06:10",
    evidence: [
      { label: "Gast 1", value: "Familie Hoffmann — Mai 2023, 2024, 2025 ja · 2026 nein" },
      { label: "Gast 2", value: "Klaus Meier — Mai 2024, 2025 ja · 2026 nein" },
      { label: "Gast 3", value: "Anna Becker — Mai 2025 ja · 2026 nein (hat aber Sep angefragt)" },
    ],
    suggestedAction: "Persoenliche E-Mail mit Sommerangebot oder Vorzugs-Preis fuer Spaetbucher senden — Vorlage kommt aus Nachrichten-Modul.",
  },
];

const CLEAR = [
  { check: "Doppelbuchungen Mai",        result: "0 gefunden" },
  { check: "Negative-Preis Posten",      result: "0 gefunden" },
  { check: "Login-Versuche / IP",        result: "im normalen Rahmen" },
  { check: "Telefon-KI Anrufdauer-Ausreisser", result: "keine" },
  { check: "Storno-Quote vs. Vorjahr",   result: "stabil (2.9%)" },
  { check: "Schwellenwerte Refund",      result: "alle unter 5%" },
];

function severityStyle(sev: string) {
  if (sev === "hoch")   return "border-rose-500/50 bg-rose-500/5";
  if (sev === "mittel") return "border-amber-500/50 bg-amber-500/5";
  return "border-sky-500/50 bg-sky-500/5";
}

function severityIcon(sev: string) {
  if (sev === "hoch")   return "text-rose-500";
  if (sev === "mittel") return "text-amber-500";
  return "text-sky-500";
}

export default function DemoAnomalyTab() {
  const [selected, setSelected] = useState<Alert | null>(null);

  return (
    <div>
      <DemoBanner description="ML-basierte Anomalie-Erkennung: erkennt Card-Testing, Doppelbuchungen, Preis-Tricks, ungewoehnliche Login-Muster. Lernt aus deinen Reaktionen." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-secondary" /> Anomalie-Watch
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Was heute auffaellig war — und was nicht. Klick auf einen Alert oeffnet Beweise.</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {ALERTS.map((a) => (
          <Card
            key={a.id}
            onClick={() => setSelected(a)}
            className={"shadow-card border cursor-pointer hover:shadow-elevated transition-shadow " + severityStyle(a.severity)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className={"h-4 w-4 mt-0.5 shrink-0 " + severityIcon(a.severity)} />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">{a.severity}</Badge>
                  <span className="font-medium text-sm">{a.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{a.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Routine-Checks heute</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {CLEAR.map((c) => (
              <li key={c.check} className="py-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-500" />{c.check}</span>
                <span className="text-xs text-muted-foreground">{c.result}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <AlertDetailDialog alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function AlertDetailDialog({ alert, onClose }: { alert: Alert | null; onClose: () => void }) {
  if (!alert) return null;
  return (
    <Dialog open={!!alert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={"h-5 w-5 " + severityIcon(alert.severity)} />
            <span>{alert.title}</span>
            <Badge variant="outline" className="text-[10px] uppercase ml-1">{alert.severity}</Badge>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground leading-relaxed">{alert.body}</p>

        <div className="border rounded-md bg-muted/30 p-3 space-y-1.5 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Beweise</p>
          {alert.evidence.map((e) => (
            <div key={e.label} className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-muted-foreground text-xs">{e.label}</span>
              <span className="font-mono text-xs">{e.value}</span>
            </div>
          ))}
        </div>

        <div className="border border-emerald-500/40 bg-emerald-500/5 rounded-md p-3 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-medium mb-1">
            Empfohlene Massnahme
          </p>
          <p className="text-muted-foreground leading-relaxed">{alert.suggestedAction}</p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Ignorieren</Button>
          <Button onClick={() => { window.alert("Demo-Modus: in produktiv wuerde jetzt die empfohlene Massnahme ausgefuehrt + im Audit-Log dokumentiert."); onClose(); }}>
            Massnahme uebernehmen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
