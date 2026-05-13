import paketA0 from "@/assets/paket-a-0.jpg";
import paketA1 from "@/assets/paket-a-1.jpg";
import paketA2 from "@/assets/paket-a-2.jpg";
import paketB0 from "@/assets/paket-b-0.jpg";
import paketB1 from "@/assets/paket-b-1.jpg";
import paketB2 from "@/assets/paket-b-2.jpg";

export type Paket = {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  intro: string;
  highlights: string[];
  details: string;
  price?: string;
};

export const PAKETE: Paket[] = [
  {
    slug: "eifler-wandertage",
    title: "Genussvolle Eifler Wandertage",
    cover: paketA0,
    gallery: [
      paketA0,
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    ],
    intro:
      "Erleben Sie die Vulkaneifel auf den schönsten Wanderwegen Deutschlands – mit Eifelsteig, Lieserpfad und unzähligen Themenrouten direkt vor unserer Haustür.",
    highlights: [
      "4 Übernachtungen inkl. großem Frühstücksbuffet",
      "3× Eifeler 3-Gang-Abendmenü im Landhaus Restaurant",
      "Wanderkarte & persönliche Tourenempfehlungen",
      "Lunchpaket für unterwegs",
      "Glas Eifeler Wein zur Begrüßung im Kaminzimmer",
    ],
    details:
      "Unser erfahrenes Team stellt Ihnen täglich passende Routen zusammen – ob gemütliche Tagestour rund um die Maare oder anspruchsvolle Etappen auf dem Eifelsteig. Nach dem Wandertag erwartet Sie ein liebevoll zubereitetes Abendmenü mit regionalen Zutaten und ein Glas Eifeler Wein im behaglichen Kaminzimmer.",
    price: "ab 359 € pro Person",
  },
  {
    slug: "rad-erlebnisse",
    title: "Eifler Rad-Erlebnisse",
    cover: paketA1,
    gallery: [
      paketA1,
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&q=80",
    ],
    intro:
      "Sattelfest durch die Vulkaneifel – Maare-Mosel-Radweg, Kylltal-Radweg und herausfordernde Mountainbike-Strecken starten direkt am Hotel.",
    highlights: [
      "3 Übernachtungen mit Frühstücksbuffet",
      "2× Eifeler Abendmenü",
      "Abschließbarer Fahrradraum mit Ladestation für E-Bikes",
      "Streckenkarten & GPX-Tracks",
      "Wäscheservice für Funktionsbekleidung",
    ],
    details:
      "Ob Genussradler oder ambitionierter Mountainbiker – unsere Empfehlungen reichen vom familienfreundlichen Maare-Mosel-Radweg bis zu knackigen Trails durch die Vulkaneifel. Nach der Tour locken eine Erfrischung auf der Sonnenterrasse und ein deftiges Eifeler Menü im Landhaus Restaurant.",
    price: "ab 279 € pro Person",
  },
  {
    slug: "erholung-entschleunigung",
    title: "Tage der Erholung und Entschleunigung",
    cover: paketA2,
    gallery: [
      paketA2,
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80",
    ],
    intro:
      "Einfach mal abschalten – ankommen, durchatmen und die wohltuende Stille der Eifel genießen.",
    highlights: [
      "3 Übernachtungen mit Frühstücksbuffet",
      "1× Candle-Light-Dinner zur Begrüßung",
      "Mehrgängiges Gourmet-Abendmenü mit Weinbegleitung",
      "Frische Blumen & Obstteller im Zimmer",
      "Spaziergangs-Empfehlungen rund um Schalkenmehren",
    ],
    details:
      "Dieses Paket ist eine Auszeit für Körper und Geist. Lassen Sie sich kulinarisch verwöhnen, genießen Sie ausgedehnte Spaziergänge durch die Vulkaneifel und finden Sie zur Ruhe – mit Blick in die sanften Hügel der Eifel.",
    price: "ab 319 € pro Person",
  },
  {
    slug: "eifelgold-weissdornhecken",
    title: '"Eifelgold" und Weißdornhecken',
    cover: paketB0,
    gallery: [
      paketB0,
      "https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    ],
    intro:
      "Frühling in der Vulkaneifel – wenn Ginster und Weißdorn die Landschaft in Gold und Weiß tauchen, beginnt die schönste Wanderzeit des Jahres.",
    highlights: [
      "5 Übernachtungen inkl. Halbpension",
      "Geführte Themenwanderung mit zertifiziertem Wanderführer",
      "Picknickkorb für eine Tagestour",
      "Eintritt in das Naturkundemuseum Daun",
      "Eifeler Tee & hausgemachter Kuchen am Nachmittag",
    ],
    details:
      "Ein Paket für Naturliebhaber: Erleben Sie die Eifel in voller Blüte, lernen Sie auf einer geführten Tour die Besonderheiten der Vulkanlandschaft kennen und genießen Sie täglich frische Eifeler Küche.",
    price: "ab 449 € pro Person",
  },
  {
    slug: "bunt-sind-schon-die-waelder",
    title: '"Bunt sind schon die Wälder"',
    cover: paketB1,
    gallery: [
      paketB1,
      "https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=1200&q=80",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80",
    ],
    intro:
      "Wenn sich die Wälder rund um die Eifelmaare bunt färben, beginnt die zauberhafteste Jahreszeit – Goldener Herbst zum Wandern, Genießen und Verweilen.",
    highlights: [
      "4 Übernachtungen mit Frühstücksbuffet",
      "3× Herbst-Menü mit saisonalen Spezialitäten",
      "Wanderkarte „Herbst rund um die Maare\"",
      "Wildgericht-Abend nach Wahl",
      "Halbpension auf Wunsch zubuchbar",
    ],
    details:
      "Goldenes Licht über den Maaren, dampfende Tassen Tee nach der Wanderung und herzhafte Wildgerichte am Abend – dieses Paket fängt die magische Atmosphäre des Eifel-Herbstes ein.",
    price: "ab 379 € pro Person",
  },
  {
    slug: "zimmer-ohne-paket",
    title: "Zimmer ohne Paket buchen",
    cover: paketB2,
    gallery: [
      paketB2,
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    ],
    intro:
      "Sie möchten flexibel bleiben? Buchen Sie eines unserer 21 Zimmer ohne Paket – ganz nach Ihren Wünschen.",
    highlights: [
      "Doppelzimmer, Familienzimmer oder Einzelnutzung",
      "Großes Frühstücksbuffet inklusive",
      "Kostenfreies WLAN & Parkplatz",
      "Kaminzimmer & Sonnenterrasse zur freien Nutzung",
      "Halbpension auf Wunsch zubuchbar",
    ],
    details:
      "Alle Zimmer verfügen über Balkon oder Terrasse mit Blick in die Vulkaneifel. Wählen Sie Ihren Zeitraum frei und stellen Sie sich Ihren Aufenthalt individuell zusammen – wir kümmern uns um den Rest.",
  },
];

export const findPaket = (slug: string) => PAKETE.find((p) => p.slug === slug);
