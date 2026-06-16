// Pakete-Daten — Inhalte 1:1 nach der echten Landhaus-Schend-Seite (Texte,
// Leistungen, Preise originalgetreu). KEINE erfundenen Zusätze. Bilder liegen
// als statische Dateien unter /public/pakete.

export type Paket = {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  intro: string;
  highlights: string[];
  details?: string;
  price?: string;        // kompakt (Badge/Karte), z.B. "ab 339 € p. P."
  priceSingle?: string;  // Einzelnutzung, z.B. "Einzelnutzung ab 399 €"
  priceNote?: string;    // z.B. "Familienzimmer auf Anfrage"
};

export const PAKETE: Paket[] = [
  {
    slug: "eifler-wandertage",
    title: "Genussvolle Eifler Wandertage",
    cover: "/pakete/paket-a-0.jpg",
    gallery: ["/pakete/paket-a-0.jpg", "/pakete/eifel-1.jpg", "/pakete/eifel-2.jpg"],
    intro:
      "Genießen und entspannen inmitten des Vulkans. Unsere unvergleichliche Vulkaneifel birgt zahllose Mythen und Legenden — spüren Sie ihnen nach und erleben Sie den unvergleichlichen Reiz dieser Landschaft.",
    highlights: [
      "4× Übernachtung",
      "4× Halbpension",
      "4× Frühstücksbuffet",
      "2× Proviant für den Wandertag",
      "Moderne, komfortable Ausstattung",
    ],
    details:
      "Wir packen dafür Ihren Rucksack — mit Eifler Spezialitäten und individuellen Wandertipps. Wieder zurück, genießen Sie erholsamen Schlaf inmitten des Vulkans.",
    price: "ab 339 € p. P.",
    priceSingle: "Einzelnutzung ab 399 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "rad-erlebnisse",
    title: "Eifler Rad-Erlebnisse",
    cover: "/pakete/paket-a-1.jpg",
    gallery: ["/pakete/paket-a-1.jpg", "/pakete/paket-a-2.jpg", "/pakete/eifel-5.jpg"],
    intro:
      "Inmitten von Vulkanen und Weinreben: Die Streckenführung unserer dreitägigen Eifler Rad-Erlebnisse ist außergewöhnlich. Vorbei an Maaren, den Kraterseen erloschener Vulkane, führt sie hinab ins malerische Moseltal mit seinen Weinbergen — immer entlang des Maare-Mosel-Radwegs.",
    highlights: [
      "4× Übernachtung",
      "4× Halbpension",
      "4× Frühstücksbuffet",
      "4× Proviant für den Radlertag",
      "Rücken- oder Fußmassage auf Wunsch (zzgl. 25 € pro Person)",
    ],
    details:
      "Insgesamt 55 Kilometer lang, lässt sich der Radweg gut in Etappen erkunden — dank Steigungen von maximal 3 % auch für Familien, die unterwegs in Radler-Busse einsteigen können. Bei technischen Problemen hilft der Reparaturservice unseres Landhauses.",
    price: "ab 349 € p. P.",
    priceSingle: "Einzelnutzung ab 409 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "erholung-entschleunigung",
    title: "Tage der Erholung und Entschleunigung",
    cover: "/pakete/eifel-3.jpg",
    gallery: ["/pakete/eifel-3.jpg", "/pakete/eifel-4.jpg", "/fotos/sonnenterrasse-mit-hortensien-landhotel-schend-vulkaneifel.jpg"],
    intro:
      "Sie wollen einfach mal abschalten und es sich rundum gut gehen lassen? Dann sind unsere drei Tage der Erholung das Richtige für Sie. Entschleunigen Sie bei wohltuenden Anwendungen und speziellen Massagen.",
    highlights: [
      "3× Übernachtung",
      "3× Halbpension",
      "3× Frühstücksbuffet",
      "1× Willkommensgetränk",
    ],
    details:
      "Überzeugen Sie sich von der Heilkraft Eifler Bienenhonigs und heißer Basaltsteine vulkanischen Ursprungs und genießen Sie tiefenentspannt eine erdende ayurvedische Fußmassage.",
    price: "ab 249 € p. P.",
    priceSingle: "Einzelnutzung ab 319 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "eifelgold-weissdornhecken",
    title: '„Eifelgold" und Weißdornhecken',
    cover: "/pakete/paket-b-0.jpg",
    gallery: ["/pakete/paket-b-0.jpg", "/pakete/eifel-1.jpg", "/fotos/wanderer-am-eifelmaar-landhotel-schend-vulkaneifel.jpg"],
    intro:
      "Lassen Sie sich vom faszinierenden Naturschauspiel der Eifel im Mai und Juni begeistern.",
    highlights: [
      "4× Übernachtung",
      "4× Halbpension",
      "4× Frühstücksbuffet",
      "4× Proviant für den Wandertag",
      "Rücken- oder Fußmassage auf Wunsch (zzgl. 25 € pro Person)",
    ],
    details:
      "Genießen Sie das natürliche Farbenspiel in Gelb und Weiß im Immerather Kraterkessel und bewundern Sie die Ginsterblüte — unser echtes „Eifelgold\".",
    price: "ab 379 € p. P.",
    priceSingle: "Einzelnutzung ab 449 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "bunt-sind-schon-die-waelder",
    title: '„Bunt sind schon die Wälder"',
    cover: "/pakete/paket-b-1.jpg",
    gallery: ["/pakete/paket-b-1.jpg", "/pakete/eifel-2.jpg", "/region/eifel-1.jpg"],
    intro:
      "Bereits in einem alten Volkslied wird die Farbenpracht des Herbstes besungen.",
    highlights: [
      "5× Übernachtung",
      "5× Halbpension",
      "5× Frühstücksbuffet",
      "5× Proviant für den Wandertag",
      "1× Willkommensgetränk",
    ],
    details:
      "Schon vom Frühstückstisch aus können Sie dieses Naturschauspiel bewundern und bei einer ausgiebigen Wanderung durch die zahlreichen Mischwälder der Region ganz nah erleben.",
    price: "ab 449 € p. P.",
    priceSingle: "Einzelnutzung ab 519 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "zimmer-ohne-paket",
    title: "Zimmer ohne Paket buchen",
    cover: "/pakete/paket-b-2.jpg",
    gallery: ["/pakete/paket-b-2.jpg", "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhotel-schend-vulkaneifel.jpg", "/pakete/eifel-5.jpg"],
    intro:
      "Sie möchten flexibel bleiben? Buchen Sie eines unserer Zimmer ohne Paket — ganz nach Ihren Wünschen.",
    highlights: [
      "Doppelzimmer, Familienzimmer oder Einzelnutzung",
      "Großes Frühstücksbuffet inklusive",
      "Kostenfreies WLAN & Parkplatz am Haus",
      "Halbpension auf Wunsch (+23 € pro Person/Tag)",
    ],
    details:
      "Wählen Sie Ihren Zeitraum frei und stellen Sie sich Ihren Aufenthalt individuell zusammen — wir kümmern uns um den Rest.",
  },
];

export const findPaket = (slug: string) => PAKETE.find((p) => p.slug === slug);
