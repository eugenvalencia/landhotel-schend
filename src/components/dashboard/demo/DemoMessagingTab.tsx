import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Mail, Send, Sparkles } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Channel = "E-Mail" | "WhatsApp" | "Booking.com";

interface Message {
  who: "Gast" | "Hotel";
  text: string;
  time: string;
}

interface Thread {
  id: number;
  guest: string;
  channel: Channel;
  subject: string;
  preview: string;
  unread: number;
  time: string;
  messages: Message[];
  aiSuggestion?: string;
}

const THREADS: Thread[] = [
  {
    id: 1, guest: "Familie Berger", channel: "E-Mail", subject: "Anreise Freitag — Fragen zu Halbpension",
    preview: "Vielen Dank! Wir kommen mit Hund Bruno …", unread: 0, time: "08:14",
    messages: [
      { who: "Hotel", text: "Liebe Familie Berger, herzlich willkommen vorab in der Vulkaneifel! Sie haben Doppelzimmer Komfort Nr. 14 fuer 15.–17.05. Anreise bis 22:00 moeglich, danach bitte Schluesselbox-Code anfragen.", time: "Do, 19:00" },
      { who: "Gast",  text: "Vielen Dank! Wir kommen mit Hund Bruno (kleiner Beagle, sehr ruhig). Halbpension waere super — geht das spontan dazu zu buchen?", time: "Fr, 07:48" },
      { who: "Hotel", text: "Selbstverstaendlich, Bruno ist herzlich willkommen (Hundedecke ist im Zimmer). Halbpension fuer beide Naechte 50€/Person, Anmeldung bitte heute Mittag — wir richten den Tisch direkt mit ein.", time: "Fr, 08:14" },
    ],
    aiSuggestion: "Vorschlag: kurze Bestaetigung + Hinweis dass Bruno in der Eifel super zum Wandern ist — Manderscheider Burgen sind hundefreundlich.",
  },
  {
    id: 2, guest: "Petra Wittmann", channel: "WhatsApp", subject: "Voraussichtliche Anreisezeit",
    preview: "Ich komme erst gegen 21 Uhr, bitte Tor offen", unread: 2, time: "10:42",
    messages: [
      { who: "Gast",  text: "Hallo, ich werde durch die Arbeit erst gegen 21 Uhr in Immerath ankommen. Geht das?", time: "10:39" },
      { who: "Gast",  text: "Ggf. koennen Sie das Tor zur Hofseite offen lassen?", time: "10:42" },
    ],
    aiSuggestion: "Antwort-Vorschlag: Ja, problemlos. Tor bleibt bis 22 Uhr auf, Schluessel in der gepolsterten Box rechts neben der Tuer (Code per SMS senden).",
  },
  {
    id: 3, guest: "Marcus Reuter", channel: "E-Mail", subject: "Geburtstag meiner Frau",
    preview: "Koennt ihr einen Strauss organisieren? …", unread: 1, time: "Gestern",
    messages: [
      { who: "Gast", text: "Hallo Eugen, wie immer freuen wir uns auf unseren Schend-Aufenthalt. Carla wird am 22.06. 65 — koenntet ihr einen kleinen Blumenstrauss aufs Zimmer stellen? Und vielleicht ein Stueck Kuchen zum Fruehstueck? Bezahlung gerne extra.", time: "Gestern 17:32" },
    ],
    aiSuggestion: "Vorschlag: Den Floristen in Manderscheid (Blumen Hahn) anrufen, 20€ Strauss bestellen. Kuchenstueck koennen wir selbst (Eifeler Kirschtorte). Antwort: alles geregelt.",
  },
  {
    id: 4, guest: "Lisa Sommerfeld", channel: "WhatsApp", subject: "Bewertung gegeben — Danke!",
    preview: "5 Sterne auf Google. Bis bald!", unread: 0, time: "Gestern",
    messages: [
      { who: "Hotel", text: "Liebe Frau Sommerfeld, vielen Dank fuer Ihren Besuch. Wir hoffen, der Aufenthalt hat Ihnen gefallen!", time: "Gestern 11:00" },
      { who: "Gast",  text: "5 Sterne auf Google. Bis bald! ❤️", time: "Gestern 14:20" },
    ],
  },
  {
    id: 5, guest: "Hochzeit Helmer/Becker", channel: "E-Mail", subject: "Angebot Hochzeitsfeier 14./15.09.",
    preview: "Wir freuen uns auf Ihr Angebot fuer 65 P.", unread: 1, time: "Mi",
    messages: [
      { who: "Gast", text: "Sehr geehrtes Schend-Team, wir planen unsere Hochzeit am 14./15.09. fuer ca. 65 Personen. Wir haetten gerne ein Komplett-Angebot inkl. Uebernachtung der Gaeste, 3-Gang-Menue und Saalmiete. Vielen Dank vorab.", time: "Mi 14:11" },
    ],
    aiSuggestion: "Vorschlag: Standard-Hochzeits-Pauschale 145€/P all-in, 12 Zimmer reservieren, persoenliches Beratungsgespraech vereinbaren. Eugen sollte hier direkt anrufen.",
  },
];

const TEMPLATES = [
  { name: "Anreise-Bestaetigung (DE)", icon: "📩" },
  { name: "Pre-Stay 3-Tage vorher (DE)", icon: "👋" },
  { name: "Check-out / Bewertungs-Bitte (DE)", icon: "⭐" },
  { name: "Rechnung als PDF (DE)", icon: "🧾" },
  { name: "Hund erlaubt — Bestaetigung (DE)", icon: "🐕" },
];

function channelStyle(c: Channel) {
  if (c === "WhatsApp") return "border-emerald-500/40 text-emerald-700 dark:text-emerald-400";
  if (c === "Booking.com") return "border-blue-500/40 text-blue-700 dark:text-blue-400";
  return "border-amber-500/40 text-amber-700 dark:text-amber-400";
}

export default function DemoMessagingTab() {
  const [selected, setSelected] = useState<Thread | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return THREADS;
    return THREADS.filter(
      (t) => t.guest.toLowerCase().includes(s) || t.subject.toLowerCase().includes(s) || t.preview.toLowerCase().includes(s),
    );
  }, [search]);

  return (
    <div>
      <DemoBanner description="Zentrale Inbox fuer E-Mail + WhatsApp Business + Booking.com Messaging. KI-Vorschlaege fuer Antworten, Vorlagen fuer wiederkehrende Faelle." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-secondary" /> Nachrichten
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Alle Gast-Konversationen an einem Ort. Klick auf einen Thread oeffnet die Konversation.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Inbox ({THREADS.filter(t => t.unread > 0).length} ungelesen)</CardTitle>
            <Input
              placeholder="Suchen …"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48"
            />
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {filtered.map((t) => (
                <li
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={"font-medium " + (t.unread > 0 ? "" : "text-muted-foreground")}>{t.guest}</span>
                      <Badge variant="outline" className={"text-[10px] gap-1 " + channelStyle(t.channel)}>
                        {t.channel === "WhatsApp" ? <MessageSquare className="h-2.5 w-2.5" /> : <Mail className="h-2.5 w-2.5" />}
                        {t.channel}
                      </Badge>
                      {t.unread > 0 && <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500">{t.unread}</Badge>}
                    </div>
                    <p className="text-sm mt-0.5 truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate italic">{t.preview}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{t.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4 text-secondary" /> Vorlagen</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {TEMPLATES.map((t) => (
                <li
                  key={t.name}
                  onClick={() => alert(`Demo-Modus: in produktiv koennte hier "${t.name}" gestartet werden — Gast-Daten werden automatisch eingesetzt.`)}
                  className="hover:bg-muted/60 -mx-2 px-2 py-1.5 rounded cursor-pointer flex items-center gap-2"
                >
                  <span>{t.icon}</span>
                  <span>{t.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground italic mt-3 leading-relaxed border-t pt-3">
              Vorlagen werden mit Gast-Daten + Anreisedatum automatisch personalisiert.
            </p>
          </CardContent>
        </Card>
      </div>

      <ConversationDialog thread={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ConversationDialog({ thread, onClose }: { thread: Thread | null; onClose: () => void }) {
  const [reply, setReply] = useState("");
  if (!thread) return null;
  return (
    <Dialog open={!!thread} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{thread.guest}</span>
            <Badge variant="outline" className={"text-[10px] " + channelStyle(thread.channel)}>{thread.channel}</Badge>
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">{thread.subject}</p>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {thread.messages.map((m, i) => (
            <div key={i} className={"flex " + (m.who === "Hotel" ? "justify-start" : "justify-end")}>
              <div
                className={
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm " +
                  (m.who === "Hotel"
                    ? "bg-muted text-foreground"
                    : "bg-emerald-500/15 text-foreground")
                }
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{m.who} · {m.time}</p>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {thread.aiSuggestion && (
          <div className="border border-emerald-500/40 bg-emerald-500/5 rounded-md p-3 text-sm flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-medium mb-1">
                KI-Vorschlag
              </p>
              <p className="text-muted-foreground leading-relaxed">{thread.aiSuggestion}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Input
            placeholder="Antwort schreiben …"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            onClick={() => {
              alert("Demo-Modus: in produktiv waere die Antwort jetzt ueber " + thread.channel + " verschickt.");
              setReply("");
            }}
            disabled={!reply.trim()}
            className="gap-1"
          >
            <Send className="h-4 w-4" /> Senden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
