import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, PhoneIncoming, Mic, Clock } from "lucide-react";
import DemoBanner from "../DemoBanner";

const MOCK_CALLS = [
  { id: 1, time: "Heute 22:48", duration: "2:14", from: "+49 162 …", outcome: "Buchung", note: "Doppelzimmer Komfort, 17.–19.06., Frau Schmitt-Lehmann" },
  { id: 2, time: "Heute 21:12", duration: "1:08", from: "+49 178 …", outcome: "Frage",   note: "Hund erlaubt? — bestaetigt, Brockenhinweis gegeben" },
  { id: 3, time: "Heute 20:32", duration: "3:22", from: "+49 151 …", outcome: "Buchung", note: "Einzelzimmer 24.07., Geschaeftsreisender, Rechnung an Firma" },
  { id: 4, time: "Heute 19:50", duration: "0:42", from: "+49 174 …", outcome: "Verweis", note: "Hochzeitsfeier — an Inh. weitergeleitet (Eugen, SMS gesendet)" },
  { id: 5, time: "Gestern 23:11", duration: "1:55", from: "+49 160 …", outcome: "Buchung", note: "Doppelzimmer Standard, Spontan, fuer morgen" },
];

export default function DemoVoiceTab() {
  return (
    <div>
      <DemoBanner description="Vapi-basierter deutscher Telefon-Concierge. Nimmt Anrufe ausserhalb der Theken-Zeiten an, bucht direkt oder verweist an dich." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-secondary" /> Telefon-KI
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            24/7-Empfang. Antworten in deutscher Mundart, kann buchen, vermitteln, Notfall-Eskalation.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />Aktiv</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Anrufe heute</p><PhoneIncoming className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">12</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Buchungen</p></div>
          <p className="text-2xl font-bold">5</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Avg. Gespraech</p><Clock className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">1:52</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Eskaliert</p><Mic className="h-4 w-4 text-secondary" /></div>
          <p className="text-2xl font-bold">1</p>
        </CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Anrufprotokoll heute / gestern</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {MOCK_CALLS.map((c) => (
              <li key={c.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.from}</span>
                    <Badge variant="outline" className="text-[10px]">{c.outcome}</Badge>
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
    </div>
  );
}
