import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, ArrowUpRight, Sparkles, Mountain, Flower2, Beer, Coffee,
  Bike, Castle, Trees, Wine, Tractor, Footprints, ShieldAlert,
} from "lucide-react";

/**
 * Schend-eigene In-House-Services. Partner aus diesen Kategorien werden
 * innerhalb des Konflikt-Radius nicht empfohlen, damit das Hotel
 * keine direkten Konkurrenten promotet.
 */
const SCHEND_IN_HOUSE: PartnerCategory[] = ["restaurant", "breakfast", "bar"];
const CONFLICT_RADIUS_KM = 5;

type PartnerCategory =
  | "wellness" | "museum" | "outdoor" | "tasting" | "sport"
  | "restaurant" | "breakfast" | "bar" | "bike" | "experience" | "winery";

interface Partner {
  name: string;
  category: PartnerCategory;
  categoryLabel: string;
  distanceKm: number;
  blurb: string;
  discountPct: number;
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
}

/**
 * Echte Eifel-Partner im Umkreis von Schend (Immerath, Vulkaneifel).
 * Konditionen sind Mock-Daten fuer den Pilot — echte Vertraege folgen.
 */
const PARTNERS: Partner[] = [
  {
    name: "Vulkaneifel-Therme Bad Bertrich",
    category: "wellness",
    categoryLabel: "Wellness",
    distanceKm: 35,
    blurb: "Einzige natürliche Glaubersalzquelle Deutschlands — Tagesausflug für Entspannung pur.",
    discountPct: 15,
    icon: Flower2,
    url: "https://www.vulkaneifel-therme.de",
  },
  {
    name: "Wildpark Daun",
    category: "outdoor",
    categoryLabel: "Familie",
    distanceKm: 8,
    blurb: "50+ heimische Tierarten auf 50 Hektar — perfekt für Familien mit Kindern.",
    discountPct: 20,
    icon: Trees,
    url: "https://www.wild-und-erholungspark-daun.de",
  },
  {
    name: "Vulkanhaus Strohn",
    category: "museum",
    categoryLabel: "Erlebnis-Museum",
    distanceKm: 12,
    blurb: "Lavabombe-Highlight, Vulkangeschichte hautnah, ideal bei Regenwetter.",
    discountPct: 15,
    icon: Mountain,
    url: "https://www.vulkanhaus-strohn.de",
  },
  {
    name: "Eifeler Hochlandtropfen Brennerei",
    category: "tasting",
    categoryLabel: "Manufaktur",
    distanceKm: 15,
    blurb: "Geführte Verkostung — Eifel-Brände, Wacholder, Schlehenlikör.",
    discountPct: 15,
    icon: Wine,
    url: "https://www.eifeler-hochlandtropfen.de",
  },
  {
    name: "Reiterhof Hubertushof Daun",
    category: "sport",
    categoryLabel: "Reiten",
    distanceKm: 10,
    blurb: "Ausritte durch die Maarlandschaft — Anfänger bis Fortgeschrittene.",
    discountPct: 10,
    icon: Tractor,
    url: "",
  },
  {
    name: "Brauhaus zur Post Daun",
    category: "restaurant",
    categoryLabel: "Brauerei-Restaurant",
    distanceKm: 8,
    blurb: "Eigene Brauerei, Eifel-Spezialitäten, Live-Musik am Wochenende.",
    discountPct: 10,
    icon: Beer,
    url: "https://www.brauhaus-daun.de",
  },
  {
    name: "Maare-Mosel-Radweg Station Daun",
    category: "bike",
    categoryLabel: "E-Bike-Verleih",
    distanceKm: 8,
    blurb: "E-Bike pro Tag, Routenkarten inklusive — Fahrt bis zur Mosel.",
    discountPct: 15,
    icon: Bike,
    url: "",
  },
  {
    name: "Burgruine Manderscheid",
    category: "outdoor",
    categoryLabel: "Wahrzeichen",
    distanceKm: 18,
    blurb: "Mittelalter-Burgruine + Wanderung durch's Liesertal.",
    discountPct: 0,
    icon: Castle,
    url: "https://www.manderscheider-burgen.de",
  },
  // Beispiel-Partner der durch den Konflikt-Filter ausgeblendet wird:
  {
    name: "Café am Maar Immerath",
    category: "restaurant",
    categoryLabel: "Café",
    distanceKm: 1.2, // direkt am Maar — Konflikt mit Schend-Frühstück + Hotel-Café
    blurb: "Kuchen + Kaffee direkt am Immerather Maar.",
    discountPct: 10,
    icon: Coffee,
    url: "",
  },
];

/**
 * Konflikt-Filter: wenn Hotel die Kategorie als eigenen Service hat
 * UND der Partner innerhalb des Konflikt-Radius liegt, blenden wir ihn aus.
 */
function isConflict(p: Partner): boolean {
  return SCHEND_IN_HOUSE.includes(p.category) && p.distanceKm < CONFLICT_RADIUS_KM;
}

export default function PartnerRecommendations() {
  const { visible, hidden } = useMemo(() => {
    const v: Partner[] = [];
    const h: Partner[] = [];
    for (const p of PARTNERS) {
      if (isConflict(p)) h.push(p);
      else v.push(p);
    }
    return { visible: v, hidden: h };
  }, []);

  return (
    <section className="bg-background py-10 md:py-14">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Schend-Partner
          </p>
          <h3 className="font-display text-2xl md:text-3xl mt-3 text-balance leading-tight">
            Persönliche Tipps der Familie Schend
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Geprüfte Empfehlungen im Umkreis von 35 km — mit exklusiven Vorteilen für unsere Gäste.
            Einfach im Hotel den Schend-Code holen, vor Ort einlösen.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] tracking-[0.15em] uppercase shrink-0">
          Pilot · Anschauungs-Beispiel
        </Badge>
      </div>

      {/* Partner-Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((p) => (
          <PartnerCard key={p.name} partner={p} />
        ))}
      </div>

      {/* Konflikt-Filter Transparenz-Notiz */}
      {hidden.length > 0 && (
        <Card className="mt-5 border-dashed bg-muted/30">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">
                {hidden.length} {hidden.length === 1 ? "Partner" : "Partner"} durch Konflikt-Filter
                ausgeblendet:
              </span>{" "}
              {hidden.map((p) => `${p.name} (${p.distanceKm} km, ${p.categoryLabel})`).join(", ")}.
              <br />
              <span className="italic">
                Grund: Schend führt ein eigenes {SCHEND_IN_HOUSE.map(s =>
                  s === "restaurant" ? "Restaurant" : s === "breakfast" ? "Frühstück" : "Bar"
                ).join(" / ")}. Anbieter derselben Kategorie innerhalb von{" "}
                {CONFLICT_RADIUS_KM} km werden nicht empfohlen, damit das Hotel keine direkten
                Konkurrenten promotet. Anbieter im Tagesausflugs-Radius bleiben sichtbar
                (Beispiel: Brauhaus Daun 8 km).
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-[10px] text-muted-foreground mt-4 italic">
        Verlinkte Anbieter sind echt — Rabatt-Konditionen sind Mock-Daten für den Pilot.
        Echte Vereinbarungen folgen pro Partner.
      </p>
    </section>
  );
}

function PartnerCard({ partner: p }: { partner: Partner }) {
  const Icon = p.icon;
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        {/* Header-Streifen mit Icon + Kategorie + Rabatt */}
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="h-4 w-4 text-secondary shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
              {p.categoryLabel}
            </span>
          </div>
          {p.discountPct > 0 && (
            <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500 text-white shrink-0">
              −{p.discountPct}% für Schend-Gäste
            </Badge>
          )}
          {p.discountPct === 0 && (
            <Badge variant="outline" className="text-[10px] shrink-0">Schend-Tipp</Badge>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <h4 className="font-display text-lg md:text-xl text-balance leading-tight mb-1.5 group-hover:text-secondary transition-colors">
            {p.name}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            <span>{p.distanceKm} km von Schend</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{p.blurb}</p>

          {p.url ? (
            <Button asChild size="sm" variant="outline" className="w-full gap-1.5">
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                Ansehen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full gap-1.5" disabled>
              <Footprints className="h-3.5 w-3.5" />
              Termin im Hotel anfragen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
