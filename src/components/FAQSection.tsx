import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";

type FAQ = { q: string; a: string };

const FAQS_DE: FAQ[] = [
  {
    q: "Wo liegt das Landhotel Schend genau?",
    a: "Das Landhotel Schend liegt in der Hauptstraße 9, 54552 Immerath, mitten in der Vulkaneifel — eingebettet in die Kratermulde eines erloschenen Vulkans. Köln erreichen Sie in ca. 90 Minuten, Frankfurt in ca. 120 Minuten, den Nürburgring in ca. 45 Minuten.",
  },
  {
    q: "Wie viele Zimmer hat das Hotel und wie sind sie ausgestattet?",
    a: "Wir haben 21 Zimmer — 19 Komfortzimmer und 2 Familienzimmer. Alle sind Nichtraucherzimmer mit Dusche/WC, Telefon, TV, kostenfreiem WLAN und Safe. Die meisten verfügen über einen Balkon oder eine Terrasse mit Blick auf die Vulkaneifel.",
  },
  {
    q: "Gibt es Einzelzimmer?",
    a: "Klassische Einzelzimmer haben wir nicht. Alleinreisende buchen bei uns ein Doppelzimmer zur Einzelnutzung — ab 80 € pro Nacht inklusive großem Frühstücksbuffet. So haben Sie deutlich mehr Platz als in einem typischen Einzelzimmer.",
  },
  {
    q: "Gibt es einen Stellplatz für Motorräder?",
    a: "Eine abschließbare Motorradgarage haben wir nicht. Wir bieten aber kostenlose Parkplätze und genügend Motorrad-Stellplätze direkt im Hof — beliebt bei Fahrern rund um den Nürburgring und die kurvenreichen Straßen der Vulkaneifel.",
  },
  {
    q: "Bieten Sie Halbpension oder Vollpension an?",
    a: "Halbpension ist auf Wunsch buchbar (+23 € pro Person/Tag) — täglich frische Eifeler Landküche mit 3-Gang-Menü im Landhaus Restaurant. Das große Frühstücksbuffet mit regionalen Produkten ist in jedem Übernachtungspreis bereits enthalten. Vollpension auf Anfrage.",
  },
  {
    q: "Welche Erholungsmöglichkeiten gibt es im Haus?",
    a: "Unser behagliches Kaminzimmer, die Sonnenterrasse und das gemütliche Restaurant laden zum Verweilen ein. Im Haus gibt es zudem einen Sauna- und Ruhebereich mit Whirlpool. Die ruhige Lage in der Kratermulde der Vulkaneifel — fernab vom Großstadttrubel — sorgt von selbst für Erholung. Wanderwege, Maare und Radrouten direkt vor der Tür sind ideal zum Durchatmen.",
  },
  {
    q: "Gibt es eine Sauna oder einen Wellnessbereich?",
    a: "Ja, im Haus gibt es einen Sauna- und Ruhebereich mit Whirlpool. Die Nutzung stimmen wir gern individuell mit Ihnen ab — sprechen Sie uns bei der Buchung oder vor Ort einfach an.",
  },
  {
    q: "Ist Frühstück inklusive und wie sieht es aus?",
    a: "Ja, ein großes Frühstücksbuffet ist in allen Übernachtungspreisen inklusive. Es gibt frische, regionale Produkte aus der Eifel — herzhaft und süß — täglich von 8:00 bis 10:00 Uhr.",
  },
  {
    q: "Hat das Restaurant einen Ruhetag?",
    a: "Ja — Montag, Dienstag und Mittwoch sind Ruhetage. An diesen Tagen gibt es kein À-la-carte; unser Halbpensions-Menü können Hausgäste mit Voranmeldung erhalten (außer an Feiertagen). À-la-carte servieren wir Donnerstag bis Samstag von 17:30 bis 20:00 Uhr und sonntags von 12:00 bis 14:00 Uhr sowie 17:30 bis 20:00 Uhr. Unsere Speisekarte wechselt wöchentlich — das Wochenmenü geben wir morgens bekannt.",
  },
  {
    q: "Welche Küche serviert das Restaurant?",
    a: "Wir verwöhnen Sie mit Eifeler Landküche und internationalen Spezialitäten — frische, saisonale Zutaten, hauseigene Gerichte und frisch gezapftes Bitburger Bier. Eine separate Kinderkarte und eine Kinderspielecke sind vorhanden.",
  },
  {
    q: "Sind Hunde erlaubt?",
    a: "Hunde sind in unserer Dorfgaststätte willkommen. Im Restaurant-Hauptbereich und in den Zimmern bitten wir um Verständnis, dass Hunde nicht erlaubt sind.",
  },
  {
    q: "Was kostet eine Übernachtung?",
    a: "Doppelzimmer ab 57 € pro Person/Nacht inklusive Frühstücksbuffet. Doppelzimmer zur Einzelnutzung ab 80 €. Familienzimmer (4 Personen) ab 170 €. Halbpension auf Wunsch +23 € pro Person/Tag. Kinder bis 2 Jahre kostenfrei, bis 12 Jahre 50 % Rabatt.",
  },
  {
    q: "Welche Aktivitäten und Sehenswürdigkeiten gibt es in der Umgebung?",
    a: "Direkt an unserer Tür: Eifelsteig (Premium-Wanderweg), Maare-Mosel-Radweg, das Immerath-Maar (Kratersee), Schulmuseum Immerath. In der Nähe: Maarmuseum Manderscheid, Vulkanhaus Strohn, Wildpark Daun, Nürburgring, Mosel und Tagestouren nach Luxemburg und Belgien.",
  },
  {
    q: "Welche Maare können wir vom Hotel aus erwandern?",
    a: "Vom Hotel aus erreichen Sie das Immerath-Maar direkt zu Fuß. In rund 15–30 Autominuten erreichen Sie die drei berühmten Dauner Maare (Gemündener, Weinfelder, Schalkenmehrener Maar) sowie das Meerfelder Maar, das Pulvermaar und das Holzmaar. Die Rundwanderung über die Dauner Maare (ca. 9 km mit dem Dronketurm-Aussichtspunkt) ist eine der schönsten Eintages-Touren der Eifel.",
  },
  {
    q: "Welche Wanderwege starten direkt am Hotel?",
    a: "Der Premium-Wanderweg Eifelsteig (300 km von Aachen nach Trier in 15 Etappen) führt nahe am Hotel vorbei — wir liegen auf der Etappenstrecke Daun ↔ Manderscheid. Zusätzlich: der Maar-Pfad (zwei Tagesetappen ab Schalkenmehren) und unzählige Rundwege ab Immerath. Wir stellen kostenlos Wanderkarten und persönliche Tourenempfehlungen für jedes Niveau bereit.",
  },
  {
    q: "Sind wir nahe am Sternenpark Eifel / Nationalpark Eifel?",
    a: "Die Vulkaneifel ist ideal für Sternenbeobachtung. Der zertifizierte Sternenpark des Nationalpark Eifel (erster International Dark Sky Park Deutschlands) ist von uns aus in etwa 60–80 Min Fahrt erreichbar. Auch über Immerath gibt es bei klarem Himmel hervorragende Sicht auf die Milchstraße — wir helfen gerne mit Tipps für die besten Beobachtungsplätze.",
  },
  {
    q: "Warum direkt beim Hotel buchen statt über Booking.com?",
    a: "Bei Direktbuchung über unsere Website oder telefonisch unter +49 6573 306 zahlen Sie keine Vermittlungs-Provision. Sie bekommen unseren Bestpreis, sind im Sonderwunsch flexibler (Zimmer mit Balkon/Seite, frühe Anreise, Diät-Wünsche) und unterstützen direkt unser Familienunternehmen — statt 15–20 % an Online-Portale abgeben zu müssen.",
  },
  {
    q: "Können Sie Familien- oder Firmenfeiern ausrichten?",
    a: "Ja. Im eleganten Eichelbergzimmer können bis zu 70 Personen speisen, im behaglichen Kaminzimmer 35 Personen, in der Dorfgaststätte und auf der Sonnenterrasse jeweils 40 Personen. Wir stellen gerne ein individuelles Paket inklusive Menü oder Buffet zusammen — Geburtstage, Kommunion, Taufe, Hochzeit, Firmen-Events oder Weihnachtsfeier.",
  },
  {
    q: "Wann hat das Hotel Saison?",
    a: "Unsere aktuellen Öffnungs- und Saisonzeiten erfragen Sie am besten direkt bei uns — telefonisch unter +49 6573 306 oder per E-Mail an info@landhaus-schend.de. Wir geben Ihnen gern Auskunft und helfen bei der Planung Ihres Aufenthalts.",
  },
  {
    q: "Wie kann ich direkt buchen?",
    a: "Direkt über unsere Website (Button 'Jetzt buchen') oder telefonisch unter +49 6573 306. Direktbuchung ist provisionsfrei und damit für Sie der beste Preis.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS_DE.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="bg-gradient-to-b from-muted/15 via-background to-muted/15">
      <JsonLd id="faq" data={faqJsonLd} />
      <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl">
        <div className="text-center mb-14 md:mb-20">
          <p className="eyebrow">{t("faq.eyebrow", "Häufige Fragen")}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 text-balance leading-[1.05]">
            {t("faq.title", "Was Gäste oft fragen")}
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed text-pretty">
            {t("faq.intro", "Antworten zu Ausstattung, Anreise, Restaurant und Buchung — kurz auf den Punkt.")}
          </p>
        </div>

        <div className="border-t border-border/70">
          {FAQS_DE.map((f, i) => {
            const open = openIndex === i;
            return (
              <div key={f.q} className="border-b border-border/70">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-start justify-between gap-5 py-6 md:py-7 text-left group"
                >
                  <span className="font-display text-lg md:text-xl leading-snug text-balance pt-0.5 group-hover:text-secondary transition-colors">
                    {f.q}
                  </span>
                  <span className="shrink-0 mt-1.5">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-secondary transition-transform duration-300",
                        open && "rotate-180",
                      )}
                      strokeWidth={1.5}
                    />
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={cn(
                    "grid transition-all duration-300",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 pr-8 md:pr-10 text-foreground/85 leading-relaxed max-w-prose">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
