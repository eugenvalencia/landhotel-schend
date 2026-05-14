import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, MapPin, Phone, ExternalLink, Search } from "lucide-react";

/**
 * Hyperlokaler Concierge — Vulkaneifel.
 *
 * Curated Tipps die das Schend-Team an Gäste rausgibt, ohne erst googeln zu
 * müssen. Wichtig: das hier ist kuratiert (nicht GPT-generiert), weil die
 * Gäste-Erwartung an ein Landhotel ist "wir wissen wo's gut ist", nicht
 * "wir spielen einen Roboter aus".
 *
 * Spätere Phase: per-Tenant editierbar im Operator-Mode + RAG-basierter
 * AI-Chat ("Was gibt es heute in 20 Min Umkreis?").
 */

type Category = "wandern" | "essen" | "kultur" | "events" | "praktisch";

interface ConciergeTip {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  body: string;
  distanceKm?: number;
  durationMin?: number;
  phone?: string;
  link?: string;
  tags?: string[];
}

const CATEGORY_LABEL: Record<Category, string> = {
  wandern: "Wandern & Natur",
  essen: "Essen & Trinken",
  kultur: "Kultur & Sehenswürdig",
  events: "Events 2026",
  praktisch: "Praktisch",
};

const TIPS: ConciergeTip[] = [
  {
    id: "t1",
    category: "wandern",
    title: "Manderscheider Burgen-Pfad",
    subtitle: "Romantische Doppelburg über der Liesertal-Schlucht",
    body: "Klassiker. Vom Schend in 15 Min nach Manderscheid, dort am Parkplatz Niederburg starten. Rundweg ca. 5 km, gemütliche 2 Std mit Fotostopps. Schöne Aussichtskanzel auf die Oberburg.",
    distanceKm: 12,
    durationMin: 15,
    tags: ["leicht", "fotogen", "auch bei Regen ok"],
  },
  {
    id: "t2",
    category: "wandern",
    title: "Maare-Mosel-Radweg (Daun → Bernkastel)",
    subtitle: "58 km bergab auf alter Bahntrasse",
    body: "E-Bike-Verleih in Daun am Bahnhof. Komplett bergab, daher auch für gemütliche Tour. Rückfahrt mit dem Radbus (Linie 300). In Wittlich aussteigen für die Hälfte.",
    distanceKm: 25,
    durationMin: 25,
    link: "https://www.maare-mosel-radweg.de",
    tags: ["Familie", "E-Bike empfohlen"],
  },
  {
    id: "t3",
    category: "wandern",
    title: "Geo-Pfad Pulvermaar",
    subtitle: "Tiefstes Trockenmaar Europas",
    body: "Rundweg 4 km, sehr angenehm im Schatten. Im Sommer kann man im Pulvermaar baden — eines der wenigen Maare die das erlauben. Liegewiese und kleiner Kiosk.",
    distanceKm: 18,
    durationMin: 20,
    tags: ["Sommer-Baden", "Familie", "barrierearm"],
  },
  {
    id: "t4",
    category: "essen",
    title: "Restaurant Saxlers Hof, Manderscheid",
    subtitle: "Regional, ehrlich, gehoben",
    body: "Wenn Gäste fragen wo man richtig gut isst. Reservierung empfohlen (auch werktags). Eifeler Wild im Herbst ist die Spezialität. Vegetarisch geht auch — vorab anrufen.",
    phone: "+49 6572 92920",
    distanceKm: 12,
    durationMin: 15,
    tags: ["Reservierung empfohlen", "regional"],
  },
  {
    id: "t5",
    category: "essen",
    title: "Brauerei Klosterbrauerei Himmerod",
    subtitle: "Trappistenbier im historischen Kloster",
    body: "Sonntags Klosterführung um 14:30, danach Bier im Klosterhof. Restaurant gut für eine ehrliche Brotzeit. Kein WLAN — bewusst.",
    distanceKm: 14,
    durationMin: 18,
    link: "https://www.himmerod.de",
    tags: ["Sonntag", "Kloster", "Bier"],
  },
  {
    id: "t6",
    category: "essen",
    title: "Mosella Stuben, Bernkastel-Kues",
    subtitle: "Riesling-Verkostung mit Blick auf die Mosel",
    body: "Wer einen Tagesausflug an die Mosel macht, sollte hier essen. Glas Riesling für 5–7€, mittags günstige Karte. Parkplatz P3 am Ortseingang.",
    distanceKm: 28,
    durationMin: 32,
    tags: ["Tagesausflug", "Wein"],
  },
  {
    id: "t7",
    category: "kultur",
    title: "Vulkanhaus Strohn",
    subtitle: "Geologie zum Anfassen, gut bei Regen",
    body: "Interaktives Museum, in 90 Min durch. Geologe Klaus führt Mittwochs 14 Uhr persönlich — sehr empfehlenswert. Eintritt 6€, Familien 14€.",
    distanceKm: 16,
    durationMin: 20,
    link: "https://www.vulkanhaus-strohn.de",
    tags: ["Schlecht-Wetter", "Familie", "lehrreich"],
  },
  {
    id: "t8",
    category: "kultur",
    title: "Maria Laach Benediktinerabtei",
    subtitle: "Romanisches Juwel am Laacher See",
    body: "Tagesausflug. Klosterkirche aus dem 11. Jh., direkt am Kratersee. Café im Klostergarten gut für Kuchen-Pause. Buchladen lohnt sich auch.",
    distanceKm: 42,
    durationMin: 48,
    tags: ["Tagesausflug", "Architektur"],
  },
  {
    id: "t9",
    category: "events",
    title: "Schalkenmehrener Maarfest",
    subtitle: "Letztes Juli-Wochenende",
    body: "Authentisch eifelig — kein Touristen-Spektakel. Lokale Band, Eifeler Spezialitäten, Lampions am Maar. Wenn Gäste im Sommer da sind unbedingt empfehlen.",
    tags: ["jährlich", "Sommer", "Einheimisch"],
  },
  {
    id: "t10",
    category: "events",
    title: "Daun Wein- und Genuss-Wochenende",
    subtitle: "Ende September",
    body: "Innenstadt komplett autofrei, Weinstände der Mosel- und Ahrwinzer, Live-Musik. Gut zu Fuß vom Bahnhof zu erreichen, also Auto stehen lassen.",
    tags: ["Herbst", "Wein"],
  },
  {
    id: "p1",
    category: "praktisch",
    title: "Apotheke Daun (Notdienst-Suche)",
    subtitle: "Nächste Apotheke in 12 Min",
    body: "Bei Notfall vor Anreise: dieselben Öffnungszeiten wie Banken. Notdienst-Apotheken-Wechsel jede Woche, aktuelle Liste hängt im Schend-Flur.",
    phone: "+49 6592 951810",
    link: "https://www.aponet.de",
  },
  {
    id: "p2",
    category: "praktisch",
    title: "Tankstelle Daun",
    subtitle: "Letzte Tanke vor Eifel-Querung",
    body: "24/7 mit Bistro. Wer Sonntag früh weiterfährt sollte hier nochmal voll machen — die nächste mit Diesel ist 28 km entfernt.",
    distanceKm: 11,
    durationMin: 14,
  },
];

export default function HyperlocalConciergeTab() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    return TIPS.filter((t) => {
      if (filter !== "all" && t.category !== filter) return false;
      if (!s) return true;
      return (
        t.title.toLowerCase().includes(s) ||
        t.subtitle.toLowerCase().includes(s) ||
        t.body.toLowerCase().includes(s) ||
        (t.tags ?? []).some((tag) => tag.toLowerCase().includes(s))
      );
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display flex items-center gap-2">
          <Compass className="h-5 w-5 text-secondary" /> Concierge — Vulkaneifel
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Kuratierte Tipps in 30 Min Umkreis vom Hotel. Pflegen kann das Team
          jederzeit — gut zu wissen für spontane Gäste-Fragen am Tresen.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={'Suchen — z.B. „Regen", „Wein", „Familie"'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge
          variant={filter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilter("all")}
        >
          Alles
        </Badge>
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <Badge
            key={c}
            variant={filter === c ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter(c)}
          >
            {CATEGORY_LABEL[c]}
          </Badge>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{t.subtitle}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {CATEGORY_LABEL[t.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed">{t.body}</p>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {t.distanceKm !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {t.distanceKm} km
                    {t.durationMin !== undefined && ` · ${t.durationMin} min`}
                  </span>
                )}
                {t.phone && (
                  <a href={`tel:${t.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                    <Phone className="h-3 w-3" /> {t.phone}
                  </a>
                )}
                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" /> Website
                  </a>
                )}
              </div>

              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="shadow-card md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Kein Tipp gefunden — Suchbegriff anpassen oder Filter zurücksetzen.
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-card bg-muted/30 border-dashed">
        <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Geplant (später):</strong> Tipps per
          Operator-Mode editierbar, AI-Chat für Gäste-Fragen am Tresen, automatische
          Wetter-Empfehlung („Heute Regen — Vulkanhaus oder Klosterbrauerei?"),
          QR-Code-Karte im Zimmer.
        </CardContent>
      </Card>
    </div>
  );
}
