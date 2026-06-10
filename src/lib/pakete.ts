import paketA0 from "@/assets/paket-a-0.jpg";
import paketA1 from "@/assets/paket-a-1.jpg";
import paketA2 from "@/assets/paket-a-2.jpg";
import paketB0 from "@/assets/paket-b-0.jpg";
import paketB1 from "@/assets/paket-b-1.jpg";
import paketB2 from "@/assets/paket-b-2.jpg";
import eifel1 from "@/assets/eifel-1.jpg";
import eifel2 from "@/assets/eifel-2.jpg";
import eifel3 from "@/assets/eifel-3.jpg";
import eifel4 from "@/assets/eifel-4.jpg";
import eifel5 from "@/assets/eifel-5.jpg";
import food0 from "@/assets/food-0.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";

// Inhalte 1:1 nach der echten Landhaus-Schend-Seite (Texte, Leistungen, Preise
// originalgetreu). KEINE erfundenen Zusätze. Spiegel von site/lib/pakete.ts.
export type Paket = {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  intro: string;
  highlights: string[];
  details: string;
  price?: string;        // kompakt (Badge/Karte), z.B. "ab 339 € p. P."
  priceSingle?: string;  // Einzelnutzung, z.B. "Einzelnutzung ab 399 €"
  priceNote?: string;    // z.B. "Familienzimmer auf Anfrage"
};

export const PAKETE: Paket[] = [
  {
    slug: "eifler-wandertage",
    title: "Genussvolle Eifler Wandertage",
    cover: paketA0,
    gallery: [paketA0, eifel1, eifel2],
    intro:
      "Genießen und entspannen inmitten des Vulkans. Unsere unvergleichliche Vulkaneifel birgt zahllose Mythen und Legenden — spüren Sie ihnen nach und erleben Sie den unvergleichlichen Reiz dieser Landschaft.",
    highlights: [
      "4× Übernachtung",
      "4× Halbpension",
      "4× Frühstücksbuffet",
      "1× Nutzung der hauseigenen Sauna",
      "2× Proviant für den Wandertag",
      "Moderne, komfortable Ausstattung",
    ],
    details:
      "Wir packen dafür Ihren Rucksack — mit Eifler Spezialitäten und individuellen Wandertipps. Wieder zurück, entspannen Sie in unserer Sauna und genießen erholsamen Schlaf inmitten des Vulkans.",
    price: "ab 339 € p. P.",
    priceSingle: "Einzelnutzung ab 399 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "rad-erlebnisse",
    title: "Eifler Rad-Erlebnisse",
    cover: paketA1,
    gallery: [paketA1, paketA2, eifel5],
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
      "Insgesamt 55 Kilometer lang, lässt sich der Radweg gut in Etappen erkunden — dank Steigungen von maximal 3 % auch für Familien, die unterwegs in Radler-Busse einsteigen können. Bei technischen Problemen hilft der Reparaturservice unseres Landhotels.",
    price: "ab 349 € p. P.",
    priceSingle: "Einzelnutzung ab 409 €",
    priceNote: "Familienzimmer auf Anfrage",
  },
  {
    slug: "erholung-entschleunigung",
    title: "Tage der Erholung und Entschleunigung",
    cover: eifel3,
    gallery: [eifel3, eifel4, food0],
    intro:
      "Sie wollen einfach mal abschalten und es sich rundum gut gehen lassen? Dann sind unsere drei Tage der Erholung das Richtige für Sie. Entschleunigen Sie bei einem Besuch in unserem Wellness mit Whirlpool, Sauna, Solarium und speziellen Massagen.",
    highlights: [
      "3× Übernachtung",
      "3× Halbpension",
      "3× Frühstücksbuffet",
      "1× Nutzung der hauseigenen Sauna",
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
    cover: paketB0,
    gallery: [paketB0, eifel1, food1],
    intro:
      "Lassen Sie sich vom faszinierenden Naturschauspiel der Eifel im Mai und Juni begeistern.",
    highlights: [
      "4× Übernachtung",
      "4× Halbpension",
      "4× Frühstücksbuffet",
      "4× Proviant für den Wandertag",
      "4× Nutzung der hauseigenen Sauna",
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
    cover: paketB1,
    gallery: [paketB1, eifel2, food2],
    intro:
      "Bereits in einem alten Volkslied wird die Farbenpracht des Herbstes besungen.",
    highlights: [
      "5× Übernachtung",
      "5× Halbpension",
      "5× Frühstücksbuffet",
      "2× Nutzung der hauseigenen Sauna",
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
    cover: paketB2,
    gallery: [paketB2, food3, eifel5],
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
