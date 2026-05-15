import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Send } from "lucide-react";
import DemoBanner from "../DemoBanner";

const THREADS = [
  { id: 1, guest: "Familie Berger", channel: "E-Mail", subject: "Anreise Freitag — Fragen zu Halbpension", last: "Vielen Dank! Wir kommen mit Hund Bruno …", unread: 0, time: "08:14" },
  { id: 2, guest: "Petra Wittmann", channel: "WhatsApp", subject: "Voraussichtliche Anreisezeit", last: "Ich komme erst gegen 21 Uhr, bitte Tor offen", unread: 2, time: "10:42" },
  { id: 3, guest: "Marcus Reuter", channel: "E-Mail", subject: "Geburtstag meiner Frau", last: "Koennt ihr einen Strauss organisieren? …", unread: 1, time: "Gestern" },
  { id: 4, guest: "Lisa Sommerfeld", channel: "WhatsApp", subject: "Bewertung gegeben — Danke!", last: "5 Sterne auf Google. Bis bald!", unread: 0, time: "Gestern" },
  { id: 5, guest: "Hochzeit Helmer/Becker", channel: "E-Mail", subject: "Angebot Hochzeitsfeier 14./15.09.", last: "Wir freuen uns auf Ihr Angebot fuer 65 P.", unread: 1, time: "Mi" },
];

const TEMPLATES = [
  "Anreise-Bestaetigung (DE)",
  "Pre-Stay 3-Tage vorher (DE)",
  "Check-out / Bewertungs-Bitte (DE)",
  "Rechnung als PDF (DE)",
  "Hund erlaubt — Bestaetigung (DE)",
];

export default function DemoMessagingTab() {
  return (
    <div>
      <DemoBanner description="Zentrale Inbox fuer E-Mail + WhatsApp Business + Booking.com Messaging. KI-Vorschlaege fuer Antworten, Vorlagen fuer wiederkehrende Faelle." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-secondary" /> Nachrichten
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Alle Gast-Konversationen an einem Ort.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Inbox ({THREADS.filter(t=>t.unread>0).length} ungelesen)</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {THREADS.map((t) => (
                <li key={t.id} className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={"font-medium " + (t.unread > 0 ? "" : "text-muted-foreground")}>{t.guest}</span>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        {t.channel === "WhatsApp" ? <MessageSquare className="h-2.5 w-2.5" /> : <Mail className="h-2.5 w-2.5" />}
                        {t.channel}
                      </Badge>
                      {t.unread > 0 && <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500">{t.unread}</Badge>}
                    </div>
                    <p className="text-sm mt-0.5 truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate italic">{t.last}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{t.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4 text-secondary" /> Vorlagen</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {TEMPLATES.map((t) => (
                <li key={t} className="hover:bg-muted/60 -mx-2 px-2 py-1.5 rounded cursor-pointer">
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground italic mt-4 leading-relaxed border-t pt-3">
              Vorlagen werden mit Gast-Daten + Anreisedatum automatisch personalisiert.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
