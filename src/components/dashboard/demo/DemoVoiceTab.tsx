import { useState } from "react";
import { activateOnKey } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneIncoming, Mic, Clock, AlertTriangle } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface Call {
  id: number;
  time: string;
  duration: string;
  from: string;
  outcome: string;
  note: string;
  transcript: { who: "Gast" | "Agent"; text: string }[];
  outcomeDetail?: string;
}

const CALLS: Call[] = [
  {
    id: 1, time: "Heute 22:48", duration: "2:14", from: "+49 162 442…", outcome: "Buchung",
    note: "Doppelzimmer Komfort, 17.–19.06., Frau Schmitt-Lehmann",
    outcomeDetail: "Buchung LSC26-1071 angelegt, Bestaetigung versandt",
    transcript: [
      { who: "Agent", text: "Guten Abend, Landhaus Schend, Conexa-Service. Wie kann ich helfen?" },
      { who: "Gast",  text: "Ja, ich wollte fragen ob bei Ihnen noch was frei ist Mitte Juni, fuer zwei Naechte." },
      { who: "Agent", text: "Sehr gerne. Vom 17. bis 19. Juni — wir haben da noch Doppelzimmer Komfort frei, fuer 105 € die Nacht." },
      { who: "Gast",  text: "Das passt. Auf den Namen Schmitt-Lehmann, Julia. Telefon hatten Sie ja." },
      { who: "Agent", text: "Buche ich Ihnen direkt. Bestaetigung kommt per E-Mail an j.schmitt@…, ist das aktuell?" },
      { who: "Gast",  text: "Genau, ja." },
      { who: "Agent", text: "Erledigt. Buchungsnummer LSC26-1071. Wir freuen uns auf Sie. Schoenen Abend!" },
    ],
  },
  {
    id: 2, time: "Heute 21:12", duration: "1:08", from: "+49 178 551…", outcome: "Frage",
    note: "Hund erlaubt? — bestaetigt, Brockenhinweis gegeben",
    outcomeDetail: "Information gegeben, Gast bucht spaeter online",
    transcript: [
      { who: "Agent", text: "Landhaus Schend, guten Abend." },
      { who: "Gast",  text: "Hallo, kurze Frage: Hunde erlaubt bei Ihnen?" },
      { who: "Agent", text: "Ja, kleine bis mittlere Hunde sehr gerne, 15 € pro Nacht. Brocken sind im Aussenbereich erlaubt, im Restaurant nicht." },
      { who: "Gast",  text: "Super, dann buche ich. Danke!" },
    ],
  },
  {
    id: 3, time: "Heute 20:32", duration: "3:22", from: "+49 151 224…", outcome: "Buchung",
    note: "Einzelzimmer 24.07., Geschaeftsreisender, Rechnung an Firma",
    outcomeDetail: "Buchung LSC26-1072 angelegt, Firmen-Rechnungs-Vermerk gesetzt",
    transcript: [
      { who: "Agent", text: "Landhaus Schend." },
      { who: "Gast",  text: "Ich brauche ein Einzelzimmer am 24.07. fuer eine Nacht, geschaeftlich." },
      { who: "Agent", text: "24. auf 25.07., ein Einzelzimmer ist verfuegbar — 65 €." },
      { who: "Gast",  text: "Rechnung bitte an die Firma, Krause GmbH, Adresse ist hinterlegt." },
      { who: "Agent", text: "Habe ich notiert. Rechnungs-Adresse aus Ihrem Profil uebernommen, gehen so." },
    ],
  },
  {
    id: 4, time: "Heute 19:50", duration: "0:42", from: "+49 174 880…", outcome: "Verweis",
    note: "Hochzeitsfeier — an Inh. weitergeleitet (Eugen, SMS gesendet)",
    transcript: [
      { who: "Agent", text: "Landhaus Schend, guten Abend." },
      { who: "Gast",  text: "Wir suchen eine Location fuer 65 Personen, Hochzeit September." },
      { who: "Agent", text: "Bei Eventgroessen wie dieser meldet sich der Inhaber persoenlich bei Ihnen — ich gebe Ihre Nummer weiter. Geht das in Ordnung?" },
      { who: "Gast",  text: "Ja sehr gerne." },
      { who: "Agent", text: "Wird heute Abend zurueckgerufen oder morgen frueh, je nachdem wann er Zeit hat." },
    ],
  },
  {
    id: 5, time: "Gestern 23:11", duration: "1:55", from: "+49 160 772…", outcome: "Buchung",
    note: "Doppelzimmer Standard, Spontan fuer morgen",
    outcomeDetail: "Buchung LSC26-1054 angelegt, Anreise heute",
    transcript: [
      { who: "Agent", text: "Landhaus Schend." },
      { who: "Gast",  text: "Spontan-Anfrage: morgen Anreise, zwei Naechte, brauche ein Doppelzimmer." },
      { who: "Agent", text: "Wir haben noch ein Doppelzimmer Standard frei, 95 € die Nacht." },
      { who: "Gast",  text: "Ich nehme es." },
    ],
  },
];

function outcomeStyle(o: string) {
  if (o === "Buchung") return "border-emerald-500/40 text-emerald-700 dark:text-emerald-400";
  if (o === "Verweis") return "border-amber-500/40 text-amber-700 dark:text-amber-400";
  return "border-sky-500/40 text-sky-700 dark:text-sky-400";
}

export default function DemoVoiceTab() {
  const [selected, setSelected] = useState<Call | null>(null);

  return (
    <div>
      <DemoBanner description="Vapi-basierter deutscher Telefon-Concierge. Nimmt Anrufe ausserhalb der Theken-Zeiten an, bucht direkt oder verweist an dich." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-secondary" /> Telefon-KI
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            24/7-Empfang in deutscher Mundart. Klick auf einen Anruf zeigt das Transkript.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Aktiv
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <CompactStat label="Anrufe heute" value="12" icon={PhoneIncoming} />
        <CompactStat label="Buchungen" value="5" icon={PhoneCall} />
        <CompactStat label="Avg. Gespraech" value="1:52" icon={Clock} />
        <CompactStat label="Eskaliert" value="1" icon={AlertTriangle} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Anrufprotokoll heute / gestern</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {CALLS.map((c) => (
              <li
                key={c.id}
                onClick={() => setSelected(c)}
                onKeyDown={activateOnKey(() => setSelected(c))}
                role="button"
                tabIndex={0}
                className="py-3 flex items-start justify-between gap-4 text-sm cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.from}</span>
                    <Badge variant="outline" className={"text-[10px] " + outcomeStyle(c.outcome)}>
                      {c.outcome}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-0.5">{c.note}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap text-right">
                  <div>{c.time}</div>
                  <div className="font-mono">{c.duration}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <CallTranscriptDialog call={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CompactStat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-secondary" />
        </div>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function CallTranscriptDialog({ call, onClose }: { call: Call | null; onClose: () => void }) {
  if (!call) return null;
  return (
    <Dialog open={!!call} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-secondary" />
            <span>{call.from}</span>
            <Badge variant="outline" className={"text-[10px] " + outcomeStyle(call.outcome)}>{call.outcome}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="text-xs text-muted-foreground flex items-center gap-4 -mt-1 mb-1">
          <span>{call.time}</span>
          <span className="font-mono">{call.duration}</span>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {call.transcript.map((line, i) => (
            <div
              key={i}
              className={
                "flex " + (line.who === "Agent" ? "justify-start" : "justify-end")
              }
            >
              <div
                className={
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm " +
                  (line.who === "Agent"
                    ? "bg-muted text-foreground"
                    : "bg-secondary/15 text-foreground")
                }
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{line.who}</p>
                <p className="leading-relaxed">{line.text}</p>
              </div>
            </div>
          ))}
        </div>
        {call.outcomeDetail && (
          <div className="border-t pt-3 text-xs text-muted-foreground flex items-center gap-2">
            <Mic className="h-3 w-3" /> {call.outcomeDetail}
          </div>
        )}
        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>Schliessen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
