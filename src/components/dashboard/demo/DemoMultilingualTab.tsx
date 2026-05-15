import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Languages, Copy, Mail, Sparkles, Globe2 } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Lang = "de" | "en" | "nl" | "fr" | "it";

interface LangInfo {
  code: Lang;
  label: string;
  flag: string;
  arrivals30d: number;
}

const LANGS: LangInfo[] = [
  { code: "de", label: "Deutsch",      flag: "DE", arrivals30d: 78 },
  { code: "en", label: "English",      flag: "EN", arrivals30d: 12 },
  { code: "nl", label: "Nederlands",   flag: "NL", arrivals30d: 18 },
  { code: "fr", label: "Français",     flag: "FR", arrivals30d: 4 },
  { code: "it", label: "Italiano",     flag: "IT", arrivals30d: 2 },
];

interface ConciergeTip {
  category: string;
  translations: Record<Lang, { title: string; body: string }>;
}

const TIPS: ConciergeTip[] = [
  {
    category: "Wandern",
    translations: {
      de: {
        title: "Maar-Wanderweg ab Schalkenmehrener Maar",
        body: "8 km Rundweg um die drei Dauner Maare. Start am Wanderparkplatz, ca. 2,5 h. Festes Schuhwerk empfohlen. Auf halber Strecke Einkehr am Maarcafé.",
      },
      en: {
        title: "Maar Trail from Schalkenmehren Maar",
        body: "8 km loop around the three Daun maars. Start at the hiker's car park, approx. 2.5 h. Sturdy shoes recommended. Halfway stop at the Maar Café.",
      },
      nl: {
        title: "Maar-wandeling vanaf Schalkenmehrener Maar",
        body: "8 km rondwandeling rond de drie Dauner maren. Start bij de wandelparkeerplaats, ca. 2,5 uur. Stevige schoenen aanbevolen. Halverwege pauze in het Maar-Café.",
      },
      fr: {
        title: "Sentier des maars depuis Schalkenmehrener Maar",
        body: "Boucle de 8 km autour des trois maars de Daun. Départ au parking randonneurs, env. 2,5 h. Bonnes chaussures conseillées. Pause à mi-chemin au Maar-Café.",
      },
      it: {
        title: "Sentiero dei Maar da Schalkenmehrener Maar",
        body: "Anello di 8 km intorno ai tre Maar di Daun. Partenza dal parcheggio escursionisti, circa 2,5 h. Si consigliano scarponi solidi. A metà strada sosta al Maar-Café.",
      },
    },
  },
  {
    category: "Restaurant",
    translations: {
      de: {
        title: "Tipp für heute Abend",
        body: "Restaurant Schneider in Daun (5 Min. zu Fuß): regionale Eifel-Küche, am Wochenende reservieren. Brauhaus zur Post hat heute Live-Musik ab 19 Uhr.",
      },
      en: {
        title: "Tonight's recommendation",
        body: "Restaurant Schneider in Daun (5 min walk): regional Eifel cuisine, reservation needed on weekends. Brauhaus zur Post has live music tonight from 7 pm.",
      },
      nl: {
        title: "Aanbeveling voor vanavond",
        body: "Restaurant Schneider in Daun (5 min lopen): regionale Eifel-keuken, reserveer in het weekend. Brauhaus zur Post heeft vanavond live muziek vanaf 19u.",
      },
      fr: {
        title: "Recommandation pour ce soir",
        body: "Restaurant Schneider à Daun (5 min à pied) : cuisine régionale de l'Eifel, réservation conseillée le week-end. Musique live au Brauhaus zur Post dès 19h.",
      },
      it: {
        title: "Consiglio per stasera",
        body: "Ristorante Schneider a Daun (5 min a piedi): cucina regionale dell'Eifel, prenotazione consigliata nel weekend. Brauhaus zur Post: musica dal vivo dalle 19.",
      },
    },
  },
  {
    category: "Wellness",
    translations: {
      de: {
        title: "Vulkaneifel-Therme Bad Bertrich",
        body: "30 Min. Fahrt, einzige natürliche Glaubersalzquelle Deutschlands. Tageskarte 18,50 €, abends weniger voll. Saunabereich ab 16 Uhr.",
      },
      en: {
        title: "Vulkaneifel Spa Bad Bertrich",
        body: "30 min drive, Germany's only natural Glauber salt spring. Day ticket €18.50, quieter in the evening. Sauna area from 4 pm.",
      },
      nl: {
        title: "Vulkaneifel Therme Bad Bertrich",
        body: "30 min rijden, enige natuurlijke glauberzoutbron van Duitsland. Dagkaart €18,50, 's avonds rustiger. Sauna vanaf 16u.",
      },
      fr: {
        title: "Thermes Vulkaneifel Bad Bertrich",
        body: "30 min en voiture, seule source naturelle de sel de Glauber en Allemagne. Billet journée 18,50 €, plus calme le soir. Sauna dès 16h.",
      },
      it: {
        title: "Terme Vulkaneifel Bad Bertrich",
        body: "30 min in auto, unica sorgente naturale di sale di Glauber in Germania. Biglietto giornaliero 18,50 €, più tranquillo la sera. Sauna dalle 16.",
      },
    },
  },
];

interface UpcomingGuest {
  name: string;
  room: string;
  lang: Lang;
  arrival: string;
  status: "vorbereitet" | "fehlt";
}

const GUESTS: UpcomingGuest[] = [
  { name: "v. d. Berg, Familie", room: "Z. 5",  lang: "nl", arrival: "16.05.", status: "vorbereitet" },
  { name: "Thompson, John",      room: "Z. 11", lang: "en", arrival: "17.05.", status: "vorbereitet" },
  { name: "Rossi, Famiglia",     room: "Z. 9",  lang: "it", arrival: "18.05.", status: "fehlt" },
  { name: "Dupuis, M.",          room: "Z. 14", lang: "fr", arrival: "19.05.", status: "vorbereitet" },
  { name: "Janssen, Bart",       room: "Z. 7",  lang: "nl", arrival: "20.05.", status: "vorbereitet" },
];

export default function DemoMultilingualTab() {
  const [lang, setLang] = useState<Lang>("nl");
  const [openCategory, setOpenCategory] = useState<string | null>(TIPS[0]?.category ?? null);

  const totalForeignArrivals = useMemo(
    () => LANGS.filter((l) => l.code !== "de").reduce((s, l) => s + l.arrivals30d, 0),
    [],
  );

  return (
    <div>
      <DemoBanner description="Concierge-Tipps automatisch in der Muttersprache jedes Gastes. Sprache wird aus dem Gast-Profil gezogen (oder Buchungsplattform), Inhalte bleiben hyperlokal — keine Google-Translate-Standard-Texte." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Languages className="h-5 w-5 text-secondary" /> Sprach-Concierge
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            5 Sprachen aktiv · {totalForeignArrivals} ausländische Anreisen in den nächsten 30 Tagen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={
              "rounded-md border p-3 text-left transition-all " +
              (lang === l.code ? "ring-2 ring-secondary bg-secondary/5" : "hover:bg-muted/40")
            }
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground">{l.flag}</span>
              <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="font-medium text-sm">{l.label}</div>
            <div className="text-xs text-muted-foreground tabular-nums">{l.arrivals30d} Anreisen / 30d</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              Tipps in {LANGS.find((l) => l.code === lang)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TIPS.map((t) => {
              const tr = t.translations[lang];
              const open = openCategory === t.category;
              return (
                <div key={t.category} className="rounded-md border bg-card">
                  <button
                    onClick={() => setOpenCategory(open ? null : t.category)}
                    className="w-full text-left p-3 md:p-4 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{t.category}</div>
                      <div className="font-medium text-sm">{tr.title}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">{lang.toUpperCase()}</Badge>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 pt-0 space-y-2">
                      <div className="text-sm leading-relaxed text-muted-foreground">{tr.body}</div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Copy className="h-3 w-3" /> Text kopieren
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          <Mail className="h-3 w-3" /> An Gast senden
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Anreisen mit Fremdsprache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {GUESTS.map((g) => (
              <div key={g.name + g.arrival} className="flex items-center justify-between gap-2 text-sm py-1.5 border-b last:border-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">{g.name}</div>
                  <div className="text-[11px] text-muted-foreground">{g.room} · {g.arrival}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-[10px] font-mono">{g.lang.toUpperCase()}</Badge>
                  {g.status === "fehlt" ? (
                    <Badge className="text-[10px] bg-amber-500 hover:bg-amber-500 text-white">vorbereiten</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500 text-white">bereit</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
