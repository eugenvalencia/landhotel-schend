import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Mail, Smartphone, TrendingUp, CheckCircle2 } from "lucide-react";

const reviews = [
  { name: "Maria Weber", rating: 5, source: "Google", date: "vor 2 Tagen", text: "Wunderbarer Aufenthalt! Das Frühstück war hervorragend, die Eifeler Küche super. Wir kommen wieder!" },
  { name: "Thomas Schmidt", rating: 5, source: "Booking.com", date: "vor 5 Tagen", text: "Sehr familiäre Atmosphäre, herzliches Personal. Zimmer 7 ist eine Empfehlung." },
  { name: "Anna Becker", rating: 4, source: "Google", date: "vor 1 Woche", text: "Schöne Lage in der Eifel. Kleines Manko: WLAN könnte stärker sein." },
  { name: "Familie Hoffmann", rating: 5, source: "Booking.com", date: "vor 2 Wochen", text: "Perfekt für Familien. Kinder lieben die Umgebung, Eltern das gemütliche Kaminzimmer." },
  { name: "Klaus Meier", rating: 5, source: "Google", date: "vor 3 Wochen", text: "Echtes Vulkaneifel-Feeling. Abendessen im Restaurant: regional und lecker." },
];

export default function ReviewsTab() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  return (
    <div className="space-y-4">
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Automatische Review-Anfrage aktiv</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 Tage nach Check-out wird eine personalisierte Bitte um Bewertung per E-Mail und WhatsApp versendet.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Google Rating</div>
          <div className="text-2xl font-bold mt-1">9.2 <span className="text-sm text-success">+0.5</span></div>
          <div className="text-xs text-muted-foreground">vor 3 Monaten: 8.7</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> Ø Bewertung</div>
          <div className="text-2xl font-bold mt-1">{avg} / 5</div>
          <div className="text-xs text-muted-foreground">{reviews.length} aktuelle Bewertungen</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Antwortrate</div>
          <div className="text-2xl font-bold mt-1">94%</div>
          <div className="text-xs text-muted-foreground">Anfragen mit Bewertung</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Automatisierungs-Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
            <Mail className="h-4 w-4 text-secondary" />
            <span className="flex-1">Tag 2 nach Check-out · E-Mail mit Google-Link</span>
            <Badge variant="outline" className="bg-success/10 border-success/30 text-success">Aktiv</Badge>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
            <Smartphone className="h-4 w-4 text-secondary" />
            <span className="flex-1">Tag 3 nach Check-out · WhatsApp Erinnerung</span>
            <Badge variant="outline" className="bg-success/10 border-success/30 text-success">Aktiv</Badge>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
            <Mail className="h-4 w-4 text-secondary" />
            <span className="flex-1">Tag 7 · Letzte Erinnerung mit 5%-Gutschein für Folgebuchung</span>
            <Badge variant="outline" className="bg-success/10 border-success/30 text-success">Aktiv</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Aktuelle Bewertungen</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.source} · {r.date}</div>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? "fill-secondary text-secondary" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">„{r.text}"</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
