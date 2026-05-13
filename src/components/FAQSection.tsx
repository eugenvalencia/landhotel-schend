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
    q: "Gibt es eine Garage oder einen sicheren Stellplatz für Motorräder?",
    a: "Ja. Wir bieten kostenlose, videoüberwachte Parkplätze und genügend Motorrad-Stellplätze. Damit sind wir ein beliebtes Hotel für Motorradfahrer rund um den Nürburgring und die kurvenreichen Straßen der Vulkaneifel.",
  },
  {
    q: "Welche Wellness-Einrichtungen gibt es?",
    a: "Unseren Gästen steht ein Wellness-Bereich mit Sauna und Ruhezone zur Verfügung — ideal nach einer Wanderung auf dem Eifelsteig oder einer Radtour auf dem Maare-Mosel-Radweg.",
  },
  {
    q: "Ist Frühstück inklusive und wie sieht es aus?",
    a: "Ja, ein großes Frühstücksbuffet ist in allen Übernachtungspreisen inklusive. Es gibt frische, regionale Produkte aus der Eifel — herzhaft und süß — täglich von 8:00 bis 10:00 Uhr.",
  },
  {
    q: "Hat das Restaurant einen Ruhetag?",
    a: "Unser Landhaus Restaurant ist Montag bis Samstag von 17:30 bis 20:00 Uhr geöffnet. Sonntags servieren wir auch mittags von 12:00 bis 14:00 Uhr und abends von 17:30 bis 20:00 Uhr.",
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
    a: "Wir sind von März bis Oktober durchgehend für Sie da — das ist die Haupt-Saison in der Eifel mit dem schönsten Wander- und Radwetter. Außerhalb dieser Zeit (November bis Februar) machen wir Betriebsferien. Für Anfragen außerhalb der Saison rufen Sie uns gerne an.",
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
    <section id="faq" className="bg-background">
      <JsonLd id="faq" data={faqJsonLd} />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("faq.eyebrow", "Häufige Fragen")}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{t("faq.title", "Was Gäste oft fragen")}</h2>
          <p className="text-muted-foreground mt-3">
            {t("faq.intro", "Antworten zu Ausstattung, Anreise, Restaurant und Buchung — kurz auf den Punkt.")}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS_DE.map((f, i) => {
            const open = openIndex === i;
            return (
              <div key={f.q} className="rounded-xl border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="font-semibold text-base md:text-lg">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-secondary transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
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
                    <p className="px-4 md:px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
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
