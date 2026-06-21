// Lokalisierte Paket-Inhalte. Struktur (slug/cover/gallery) + Preis-ZAHLEN kommen
// aus lib/pakete.ts; hier nur übersetzbarer Text + Preis-WORTE. DE wird direkt aus
// PAKETE abgeleitet → keine Dopplung, deutsche Ausgabe bleibt byte-gleich.
import { PAKETE, type Paket } from "../../lib/pakete";
import type { Locale } from "../index";

type PaketText = {
  title: string;
  intro: string;
  highlights: string[];
  details?: string;
  price?: string;
  priceSingle?: string;
  priceNote?: string;
  /** Beschreibender Bild-Alt-Text fürs Cover (Motiv, nicht Titel/Quote). */
  coverAlt?: string;
};

// Beschreibende Cover-Alt-Texte (DE) — Motiv aus bekanntem Paket-Inhalt, kein Titel.
const deCoverAlt: Record<string, string> = {
  "eifler-wandertage": "Wanderweg durch die herbstliche Vulkaneifel-Landschaft rund um das Landhaus Schend",
  "rad-erlebnisse": "Radweg entlang eines Eifelmaars Richtung Moseltal — Maare-Mosel-Radweg in der Vulkaneifel",
  "erholung-entschleunigung": "Blick über ein Eifelmaar von der Sonnenterrasse des Landhauses Schend",
  "eifelgold-weissdornhecken": "Gelbe Ginsterblüte im Immerather Kraterkessel der Vulkaneifel",
  "bunt-sind-schon-die-waelder": "Bunt verfärbter Eifeler Mischwald im Herbst nahe Immerath",
  "zimmer-ohne-paket": "Doppelzimmer mit Doppelbett und Holzboden im Landhaus Schend",
};

// DE = exakt aus den Original-Daten (+ beschreibender Cover-Alt-Text).
const de: Record<string, PaketText> = Object.fromEntries(
  PAKETE.map((p) => [
    p.slug,
    {
      title: p.title,
      intro: p.intro,
      highlights: p.highlights,
      details: p.details,
      price: p.price,
      priceSingle: p.priceSingle,
      priceNote: p.priceNote,
      coverAlt: deCoverAlt[p.slug],
    },
  ]),
);

const en: Record<string, PaketText> = {
  "eifler-wandertage": {
    title: "Indulgent Eifel hiking days",
    intro:
      "Savour and unwind in the heart of the volcano. Our incomparable Volcanic Eifel holds countless myths and legends — trace them and experience the unique allure of this landscape.",
    highlights: [
      "4× overnight stay",
      "4× half board",
      "4× breakfast buffet",
      "2× packed provisions for your hiking day",
      "Modern, comfortable furnishings",
    ],
    details:
      "We pack your rucksack for it — with Eifel specialities and individual hiking tips. Back again, you enjoy restful sleep in the heart of the volcano.",
    price: "from 339 € pp",
    priceSingle: "Single occupancy from 399 €",
    priceNote: "Family room on request",
    coverAlt: "Hiking trail through the autumnal Volcanic Eifel landscape around Landhaus Schend",
  },
  "rad-erlebnisse": {
    title: "Eifel cycling adventures",
    intro:
      "Amid volcanoes and vines: the route of our three-day Eifel cycling adventures is exceptional. Past the maars — the crater lakes of extinct volcanoes — it leads down into the picturesque Mosel valley with its vineyards, always along the Maare-Mosel cycle path.",
    highlights: [
      "4× overnight stay",
      "4× half board",
      "4× breakfast buffet",
      "4× packed provisions for your cycling day",
      "Back or foot massage on request (plus 25 € per person)",
    ],
    details:
      "55 kilometres in total, the cycle path is easily explored in stages — thanks to gradients of no more than 3 %, it suits families too, who can hop onto the cyclist buses along the way. If you have technical trouble, our Landhaus repair service helps out.",
    price: "from 349 € pp",
    priceSingle: "Single occupancy from 409 €",
    priceNote: "Family room on request",
    coverAlt: "Cycle path past an Eifel maar towards the Mosel valley — the Maare-Mosel cycle route in the Volcanic Eifel",
  },
  "erholung-entschleunigung": {
    title: "Days of rest and deceleration",
    intro:
      "Do you simply want to switch off and treat yourself all round? Then our three days of relaxation are just right for you. Unwind with soothing treatments and special massages.",
    highlights: [
      "3× overnight stay",
      "3× half board",
      "3× breakfast buffet",
      "1× welcome drink",
    ],
    details:
      "Discover the healing power of Eifel bee honey and hot basalt stones of volcanic origin, and enjoy a deeply relaxing, grounding Ayurvedic foot massage.",
    price: "from 249 € pp",
    priceSingle: "Single occupancy from 319 €",
    priceNote: "Family room on request",
    coverAlt: "View over an Eifel maar from the sun terrace of Landhaus Schend",
  },
  "eifelgold-weissdornhecken": {
    title: '"Eifelgold" and hawthorn hedges',
    intro:
      "Let yourself be captivated by the fascinating natural spectacle of the Eifel in May and June.",
    highlights: [
      "4× overnight stay",
      "4× half board",
      "4× breakfast buffet",
      "4× packed provisions for your hiking day",
      "Back or foot massage on request (plus 25 € per person)",
    ],
    details:
      'Enjoy the natural play of colours in yellow and white in the Immerath crater basin and admire the gorse blossom — our true "Eifelgold".',
    price: "from 379 € pp",
    priceSingle: "Single occupancy from 449 €",
    priceNote: "Family room on request",
    coverAlt: "Yellow gorse blossom in the Immerath crater basin of the Volcanic Eifel",
  },
  "bunt-sind-schon-die-waelder": {
    title: '"The forests are already colourful"',
    intro:
      "An old folk song already sings of the splendour of autumn's colours.",
    highlights: [
      "5× overnight stay",
      "5× half board",
      "5× breakfast buffet",
      "5× packed provisions for your hiking day",
      "1× welcome drink",
    ],
    details:
      "You can admire this natural spectacle straight from the breakfast table and experience it up close on an extensive hike through the region's many mixed forests.",
    price: "from 449 € pp",
    priceSingle: "Single occupancy from 519 €",
    priceNote: "Family room on request",
    coverAlt: "Eifel mixed forest in autumn colours near Immerath",
  },
  "zimmer-ohne-paket": {
    title: "Room without a package",
    intro:
      "Would you like to stay flexible? Enquire about one of our rooms without a package — entirely to your wishes.",
    highlights: [
      "Double room, family room or single occupancy",
      "Large breakfast buffet included",
      "Free Wi-Fi & parking at the house",
      "Half board on request (+23 € per person/day)",
    ],
    details:
      "Choose your dates freely and put together your stay individually — we take care of the rest.",
    coverAlt: "Double room with double bed and wooden floor at Landhaus Schend",
  },
};

const fr: Record<string, PaketText> = {
  "eifler-wandertage": {
    title: "Journées de randonnée gourmandes dans l'Eifel",
    intro:
      "Profitez et détendez-vous au cœur du volcan. Notre incomparable Eifel volcanique recèle d'innombrables mythes et légendes — partez sur leurs traces et découvrez le charme unique de ce paysage.",
    highlights: [
      "4 nuitées",
      "4 demi-pensions",
      "4 petits-déjeuners buffet",
      "2 en-cas pour la journée de randonnée",
      "Équipement moderne et confortable",
    ],
    details:
      "Nous préparons votre sac à dos — avec des spécialités de l'Eifel et des conseils de randonnée personnalisés. De retour, vous goûtez un sommeil réparateur au cœur du volcan.",
    price: "à partir de 339 € / pers.",
    priceSingle: "Occupation simple à partir de 399 €",
    priceNote: "Chambre familiale sur demande",
    coverAlt: "Sentier de randonnée à travers le paysage automnal de l'Eifel volcanique autour du Landhaus Schend",
  },
  "rad-erlebnisse": {
    title: "Aventures à vélo dans l'Eifel",
    intro:
      "Entre volcans et vignes : le tracé de nos aventures à vélo de trois jours dans l'Eifel est exceptionnel. Longeant les maars, les lacs de cratère de volcans éteints, il descend dans la pittoresque vallée de la Moselle et ses vignobles — toujours le long de la piste cyclable Maare-Mosel.",
    highlights: [
      "4 nuitées",
      "4 demi-pensions",
      "4 petits-déjeuners buffet",
      "4 en-cas pour la journée à vélo",
      "Massage du dos ou des pieds sur demande (+ 25 € par personne)",
    ],
    details:
      "Longue de 55 kilomètres au total, la piste se parcourt facilement par étapes — grâce à des pentes de 3 % maximum, elle convient aussi aux familles, qui peuvent monter en chemin dans les bus pour cyclistes. En cas de problème technique, le service de réparation de notre Landhaus vous dépanne.",
    price: "à partir de 349 € / pers.",
    priceSingle: "Occupation simple à partir de 409 €",
    priceNote: "Chambre familiale sur demande",
    coverAlt: "Piste cyclable longeant un maar de l'Eifel vers la vallée de la Moselle — la voie Maare-Mosel dans l'Eifel volcanique",
  },
  "erholung-entschleunigung": {
    title: "Jours de repos et de décélération",
    intro:
      "Vous souhaitez simplement décrocher et vous faire du bien ? Alors nos trois jours de détente sont faits pour vous. Décélérez grâce à des soins bienfaisants et des massages spéciaux.",
    highlights: [
      "3 nuitées",
      "3 demi-pensions",
      "3 petits-déjeuners buffet",
      "1 boisson de bienvenue",
    ],
    details:
      "Découvrez le pouvoir curatif du miel d'abeille de l'Eifel et des pierres de basalte chaudes d'origine volcanique, et savourez en pleine détente un massage des pieds ayurvédique ressourçant.",
    price: "à partir de 249 € / pers.",
    priceSingle: "Occupation simple à partir de 319 €",
    priceNote: "Chambre familiale sur demande",
    coverAlt: "Vue sur un maar de l'Eifel depuis la terrasse ensoleillée du Landhaus Schend",
  },
  "eifelgold-weissdornhecken": {
    title: "« Eifelgold » et haies d'aubépine",
    intro:
      "Laissez-vous séduire par le fascinant spectacle naturel de l'Eifel en mai et juin.",
    highlights: [
      "4 nuitées",
      "4 demi-pensions",
      "4 petits-déjeuners buffet",
      "4 en-cas pour la journée de randonnée",
      "Massage du dos ou des pieds sur demande (+ 25 € par personne)",
    ],
    details:
      "Savourez le jeu naturel des couleurs, jaune et blanc, dans la cuvette du cratère d'Immerath et admirez la floraison des genêts — notre véritable « Eifelgold ».",
    price: "à partir de 379 € / pers.",
    priceSingle: "Occupation simple à partir de 449 €",
    priceNote: "Chambre familiale sur demande",
    coverAlt: "Floraison jaune des genêts dans la cuvette du cratère d'Immerath, Eifel volcanique",
  },
  "bunt-sind-schon-die-waelder": {
    title: "« Les forêts se parent déjà de couleurs »",
    intro:
      "Une vieille chanson populaire célèbre déjà la splendeur des couleurs de l'automne.",
    highlights: [
      "5 nuitées",
      "5 demi-pensions",
      "5 petits-déjeuners buffet",
      "5 en-cas pour la journée de randonnée",
      "1 boisson de bienvenue",
    ],
    details:
      "Vous pouvez admirer ce spectacle naturel depuis la table du petit-déjeuner et le vivre de tout près lors d'une longue randonnée à travers les nombreuses forêts mixtes de la région.",
    price: "à partir de 449 € / pers.",
    priceSingle: "Occupation simple à partir de 519 €",
    priceNote: "Chambre familiale sur demande",
    coverAlt: "Forêt mixte de l'Eifel aux couleurs d'automne près d'Immerath",
  },
  "zimmer-ohne-paket": {
    title: "Chambre sans forfait",
    intro:
      "Vous souhaitez rester flexible ? Demandez l'une de nos chambres sans forfait — entièrement selon vos envies.",
    highlights: [
      "Chambre double, familiale ou occupation simple",
      "Grand petit-déjeuner buffet inclus",
      "Wi-Fi & parking gratuits sur place",
      "Demi-pension sur demande (+23 € par personne/jour)",
    ],
    details:
      "Choisissez librement vos dates et composez votre séjour à votre guise — nous nous occupons du reste.",
    coverAlt: "Chambre double avec lit double et parquet au Landhaus Schend",
  },
};

const nl: Record<string, PaketText> = {
  "eifler-wandertage": {
    title: "Genietvolle Eifeler wandeldagen",
    intro:
      "Genieten en ontspannen midden in de vulkaan. Onze ongeëvenaarde Vulkaneifel herbergt talloze mythen en legenden — ga ze achterna en ervaar de unieke charme van dit landschap.",
    highlights: [
      "4× overnachting",
      "4× halfpension",
      "4× ontbijtbuffet",
      "2× proviand voor de wandeldag",
      "Moderne, comfortabele inrichting",
    ],
    details:
      "Wij pakken daarvoor uw rugzak — met Eifeler specialiteiten en persoonlijke wandeltips. Eenmaal terug geniet u van een verkwikkende slaap midden in de vulkaan.",
    price: "vanaf 339 € p.p.",
    priceSingle: "Eenpersoonsgebruik vanaf 399 €",
    priceNote: "Familiekamer op aanvraag",
    coverAlt: "Wandelpad door het herfstige landschap van de Vulkaaneifel rond Landhaus Schend",
  },
  "rad-erlebnisse": {
    title: "Eifeler fietsbelevenissen",
    intro:
      "Tussen vulkanen en wijnranken: de route van onze driedaagse Eifeler fietsbelevenissen is bijzonder. Langs de maren, de kratermeren van uitgedoofde vulkanen, voert ze omlaag het schilderachtige Moezeldal in met zijn wijngaarden — steeds langs het Maare-Mosel-fietspad.",
    highlights: [
      "4× overnachting",
      "4× halfpension",
      "4× ontbijtbuffet",
      "4× proviand voor de fietsdag",
      "Rug- of voetmassage op verzoek (+ 25 € per persoon)",
    ],
    details:
      "In totaal 55 kilometer lang laat het fietspad zich goed in etappes verkennen — dankzij hellingen van maximaal 3 % ook voor gezinnen, die onderweg in de fietsbussen kunnen stappen. Bij technische problemen helpt de reparatieservice van ons Landhaus.",
    price: "vanaf 349 € p.p.",
    priceSingle: "Eenpersoonsgebruik vanaf 409 €",
    priceNote: "Familiekamer op aanvraag",
    coverAlt: "Fietspad langs een Eifelmaar richting het Moezeldal — het Maare-Mosel-fietspad in de Vulkaaneifel",
  },
  "erholung-entschleunigung": {
    title: "Dagen van rust en onthaasting",
    intro:
      "Wilt u gewoon even helemaal uitschakelen en het uzelf goed laten gaan? Dan zijn onze drie dagen van ontspanning precies goed voor u. Onthaast met weldadige behandelingen en speciale massages.",
    highlights: [
      "3× overnachting",
      "3× halfpension",
      "3× ontbijtbuffet",
      "1× welkomstdrankje",
    ],
    details:
      "Overtuig uzelf van de helende kracht van Eifeler bijenhoning en hete basaltstenen van vulkanische oorsprong en geniet diep ontspannen van een aardende ayurvedische voetmassage.",
    price: "vanaf 249 € p.p.",
    priceSingle: "Eenpersoonsgebruik vanaf 319 €",
    priceNote: "Familiekamer op aanvraag",
    coverAlt: "Uitzicht over een Eifelmaar vanaf het zonneterras van Landhaus Schend",
  },
  "eifelgold-weissdornhecken": {
    title: "„Eifelgold\" en meidoornhagen",
    intro:
      "Laat u betoveren door het fascinerende natuurschouwspel van de Eifel in mei en juni.",
    highlights: [
      "4× overnachting",
      "4× halfpension",
      "4× ontbijtbuffet",
      "4× proviand voor de wandeldag",
      "Rug- of voetmassage op verzoek (+ 25 € per persoon)",
    ],
    details:
      "Geniet van het natuurlijke kleurenspel in geel en wit in de Immerather kraterketel en bewonder de brembloei — ons echte „Eifelgold\".",
    price: "vanaf 379 € p.p.",
    priceSingle: "Eenpersoonsgebruik vanaf 449 €",
    priceNote: "Familiekamer op aanvraag",
    coverAlt: "Gele brembloei in de Immerather kraterketel van de Vulkaaneifel",
  },
  "bunt-sind-schon-die-waelder": {
    title: "„Bont zijn de bossen al\"",
    intro:
      "Al in een oud volkslied wordt de kleurenpracht van de herfst bezongen.",
    highlights: [
      "5× overnachting",
      "5× halfpension",
      "5× ontbijtbuffet",
      "5× proviand voor de wandeldag",
      "1× welkomstdrankje",
    ],
    details:
      "Al vanaf de ontbijttafel kunt u dit natuurschouwspel bewonderen en het tijdens een uitgebreide wandeling door de talrijke gemengde bossen van de regio van heel dichtbij beleven.",
    price: "vanaf 449 € p.p.",
    priceSingle: "Eenpersoonsgebruik vanaf 519 €",
    priceNote: "Familiekamer op aanvraag",
    coverAlt: "Eifeler gemengd bos in herfstkleuren nabij Immerath",
  },
  "zimmer-ohne-paket": {
    title: "Kamer zonder pakket",
    intro:
      "Wilt u flexibel blijven? Vraag een van onze kamers zonder pakket aan — geheel naar uw wensen.",
    highlights: [
      "Tweepersoons-, familiekamer of eenpersoonsgebruik",
      "Groot ontbijtbuffet inbegrepen",
      "Gratis wifi & parkeerplaats bij het huis",
      "Halfpension op verzoek (+23 € per persoon/dag)",
    ],
    details:
      "Kies uw periode vrij en stel uw verblijf individueel samen — wij zorgen voor de rest.",
    coverAlt: "Tweepersoonskamer met tweepersoonsbed en houten vloer in Landhaus Schend",
  },
};

export const paketeText: Record<Locale, Record<string, PaketText>> = { de, en, fr, nl };

/** Paket-Struktur (aus lib/pakete.ts) + lokalisierter, beschreibender Cover-Alt-Text. */
export type LocalizedPaket = Paket & { coverAlt?: string };

/** Sprachneutrale Struktur (slug/cover/gallery) + lokalisierter Text + Preise. */
export function paketeFor(locale: Locale): LocalizedPaket[] {
  return PAKETE.map((p) => ({ ...p, ...paketeText[locale][p.slug] }));
}
export function findPaketFor(slug: string, locale: Locale): LocalizedPaket | undefined {
  const base = PAKETE.find((p) => p.slug === slug);
  return base ? { ...base, ...paketeText[locale][slug] } : undefined;
}

// Seiten-Chrome (Beschriftungen) je Locale.
export interface PaketeChrome {
  listMetaTitle: string;
  listMetaDescription: string;
  listEyebrow: string;
  listH1: string;
  listIntro: string;
  detailsCta: string;
  backToAll: string;
  detailEyebrow: string;
  /** Kurzer, ortsbezogener Zusatz für den metaTitle-Kern der Detailseite (Kern < 60). */
  detailTitleSuffix: string;
  includedH2: string;
  impressionLabel: string;
  ctaInquire: string;
  commissionNote: string;
  breadcrumbHome: string;
  breadcrumbList: string;
  /** Hub-Spoke: Überschrift + kontextuelle Links auf thematisch nahe Seiten (Detail). */
  relatedH2: string;
  relatedRegion: string;
  relatedRooms: string;
  relatedRestaurant: string;
  /** GEO-Q&A auf der Übersichtsseite (eigene Fragen, andere Formulierung als /faq). */
  faqH2: string;
  faq: { q: string; a: string }[];
}

export const paketeChrome: Record<Locale, PaketeChrome> = {
  de: {
    listMetaTitle: "Angebote & Pauschalen für die Eifel",
    listMetaDescription:
      "Wander-, Rad- und Genuss-Pauschalen im Landhaus Schend, Vulkaneifel — inkl. Frühstücksbuffet, Eifeler Abendmenü und Tourenempfehlungen. Provisionsfrei buchen.",
    listEyebrow: "Angebote & Pauschalen",
    listH1: "Pauschalen für Ihre Auszeit in der Eifel",
    listIntro:
      "Wandern, Radfahren oder einfach durchatmen — unsere Pauschalen verbinden Übernachtung, Eifeler Landküche und persönliche Empfehlungen zu einem stimmigen Aufenthalt.",
    detailsCta: "Details →",
    backToAll: "Alle Pauschalen",
    detailEyebrow: "Pauschale",
    detailTitleSuffix: "Pauschale Eifel",
    includedH2: "Im Paket enthalten",
    impressionLabel: "Eindruck",
    ctaInquire: "Jetzt anfragen",
    commissionNote: "Direktbuchung ist provisionsfrei — ohne Aufschlag eines Buchungsportals.",
    breadcrumbHome: "Startseite",
    breadcrumbList: "Pauschalen",
    relatedH2: "Passend zur Pauschale",
    relatedRegion: "Wandern, Maare & Touren in der Vulkaneifel",
    relatedRooms: "Unsere Zimmer ansehen",
    relatedRestaurant: "Eifeler Landküche im Restaurant",
    faqH2: "Gut zu wissen vor der Buchung",
    faq: [
      {
        q: "Ist das Frühstück in jeder Pauschale enthalten?",
        a: "Ja. In allen Pauschalen ist das Frühstücksbuffet mit frischen, regionalen Eifeler Produkten enthalten — die Wander- und Rad-Pauschalen ergänzen es zusätzlich um Halbpension mit einem 3-Gang-Menü aus der Eifeler Landküche.",
      },
      {
        q: "Wie anspruchsvoll ist die Strecke der Rad-Pauschale?",
        a: "Der Maare-Mosel-Radweg der Eifler Rad-Erlebnisse ist insgesamt 55 Kilometer lang und lässt sich gut in Etappen fahren. Mit Steigungen von maximal 3 % ist er auch für Familien geeignet, die unterwegs in die Radler-Busse einsteigen können.",
      },
      {
        q: "Kann ich auch ohne Pauschale übernachten?",
        a: "Ja. Mit „Zimmer ohne Paket“ wählen Sie Ihren Zeitraum frei — inklusive großem Frühstücksbuffet sowie kostenfreiem WLAN und Parkplatz am Haus. Halbpension lässt sich auf Wunsch für +23 € pro Person und Tag dazubuchen.",
      },
      {
        q: "Fällt bei der Buchung einer Pauschale Provision an?",
        a: "Nein. Wenn Sie direkt beim Landhaus Schend anfragen, buchen Sie provisionsfrei — ohne den Aufschlag eines Buchungsportals.",
      },
    ],
  },
  en: {
    listMetaTitle: "Offers & packages for the Eifel",
    listMetaDescription:
      "Hiking, cycling and indulgence packages at Landhaus Schend, Volcanic Eifel — incl. breakfast buffet, Eifel evening menu and route tips. Book commission-free.",
    listEyebrow: "Offers & packages",
    listH1: "Packages for your getaway in the Eifel",
    listIntro:
      "Hiking, cycling or simply breathing deeply — our packages combine an overnight stay, Eifel country cuisine and personal recommendations into a harmonious stay.",
    detailsCta: "Details →",
    backToAll: "All packages",
    detailEyebrow: "Package",
    detailTitleSuffix: "Eifel package",
    includedH2: "Included in the package",
    impressionLabel: "Impression",
    ctaInquire: "Enquire now",
    commissionNote: "Booking direct is commission-free — without the surcharge of a booking portal.",
    breadcrumbHome: "Home",
    breadcrumbList: "Packages",
    relatedH2: "To go with your package",
    relatedRegion: "Hiking, maars & tours in the Volcanic Eifel",
    relatedRooms: "See our rooms",
    relatedRestaurant: "Eifel country cuisine in the restaurant",
    faqH2: "Good to know before you book",
    faq: [
      {
        q: "Is breakfast included in every package?",
        a: "Yes. Every package includes the breakfast buffet with fresh, regional Eifel produce — and the hiking and cycling packages add half board on top, with a three-course menu of Eifel country cuisine.",
      },
      {
        q: "How demanding is the route of the cycling package?",
        a: "The Maare-Mosel cycle path of the Eifel cycling adventures is 55 kilometres in total and is easily ridden in stages. With gradients of no more than 3 %, it suits families too, who can hop onto the cyclist buses along the way.",
      },
      {
        q: "Can I stay without booking a package?",
        a: "Yes. With \"Room without a package\" you choose your dates freely — including the large breakfast buffet plus free Wi-Fi and parking at the house. Half board can be added on request for +23 € per person and day.",
      },
      {
        q: "Is there a commission when I book a package?",
        a: "No. When you enquire directly with Landhaus Schend, you book commission-free — without the surcharge of a booking portal.",
      },
    ],
  },
  fr: {
    listMetaTitle: "Offres & forfaits pour l'Eifel",
    listMetaDescription:
      "Forfaits randonnée, vélo et plaisir au Landhaus Schend, Eifel volcanique — petit-déjeuner buffet, menu du soir et conseils d'itinéraires. Sans commission.",
    listEyebrow: "Offres & forfaits",
    listH1: "Forfaits pour votre escapade dans l'Eifel",
    listIntro:
      "Randonnée, vélo ou simplement respirer à pleins poumons — nos forfaits réunissent l'hébergement, la cuisine régionale de l'Eifel et des recommandations personnalisées en un séjour harmonieux.",
    detailsCta: "Détails →",
    backToAll: "Tous les forfaits",
    detailEyebrow: "Forfait",
    detailTitleSuffix: "Forfait Eifel",
    includedH2: "Compris dans le forfait",
    impressionLabel: "Aperçu",
    ctaInquire: "Demander maintenant",
    commissionNote: "La réservation en direct est sans commission — sans le supplément d'un portail de réservation.",
    breadcrumbHome: "Accueil",
    breadcrumbList: "Forfaits",
    relatedH2: "Pour compléter votre forfait",
    relatedRegion: "Randonnée, maars & circuits dans l'Eifel volcanique",
    relatedRooms: "Voir nos chambres",
    relatedRestaurant: "La cuisine régionale de l'Eifel au restaurant",
    faqH2: "Bon à savoir avant de réserver",
    faq: [
      {
        q: "Le petit-déjeuner est-il compris dans chaque forfait ?",
        a: "Oui. Tous les forfaits incluent le petit-déjeuner buffet avec des produits régionaux frais de l'Eifel — et les forfaits randonnée et vélo y ajoutent la demi-pension, avec un menu trois plats de cuisine régionale de l'Eifel.",
      },
      {
        q: "Le parcours du forfait vélo est-il difficile ?",
        a: "La piste cyclable Maare-Mosel des aventures à vélo dans l'Eifel fait 55 kilomètres au total et se parcourt facilement par étapes. Avec des pentes de 3 % maximum, elle convient aussi aux familles, qui peuvent monter en chemin dans les bus pour cyclistes.",
      },
      {
        q: "Puis-je séjourner sans réserver de forfait ?",
        a: "Oui. Avec « Chambre sans forfait », vous choisissez librement vos dates — petit-déjeuner buffet, Wi-Fi et parking gratuits sur place inclus. La demi-pension peut être ajoutée sur demande pour +23 € par personne et par jour.",
      },
      {
        q: "Y a-t-il une commission lors de la réservation d'un forfait ?",
        a: "Non. En réservant directement auprès du Landhaus Schend, vous réservez sans commission — sans le supplément d'un portail de réservation.",
      },
    ],
  },
  nl: {
    listMetaTitle: "Aanbiedingen & arrangementen voor de Eifel",
    listMetaDescription:
      "Wandel-, fiets- en genietarrangementen in Landhaus Schend, Vulkaneifel — incl. ontbijtbuffet, Eifeler avondmenu en routetips. Boek provisievrij.",
    listEyebrow: "Aanbiedingen & arrangementen",
    listH1: "Arrangementen voor uw uitje in de Eifel",
    listIntro:
      "Wandelen, fietsen of gewoon diep ademhalen — onze arrangementen verbinden overnachting, Eifeler streekkeuken en persoonlijke aanbevelingen tot een harmonieus verblijf.",
    detailsCta: "Details →",
    backToAll: "Alle arrangementen",
    detailEyebrow: "Arrangement",
    detailTitleSuffix: "Arrangement Eifel",
    includedH2: "Inbegrepen in het arrangement",
    impressionLabel: "Impressie",
    ctaInquire: "Nu aanvragen",
    commissionNote: "Direct boeken is provisievrij — zonder toeslag van een boekingsportaal.",
    breadcrumbHome: "Startpagina",
    breadcrumbList: "Arrangementen",
    relatedH2: "Passend bij uw arrangement",
    relatedRegion: "Wandelen, maren & routes in de Vulkaaneifel",
    relatedRooms: "Bekijk onze kamers",
    relatedRestaurant: "Eifeler streekkeuken in het restaurant",
    faqH2: "Goed om te weten vóór het boeken",
    faq: [
      {
        q: "Is het ontbijt bij elk arrangement inbegrepen?",
        a: "Ja. Bij elk arrangement is het ontbijtbuffet met verse, regionale Eifeler producten inbegrepen — de wandel- en fietsarrangementen vullen dit bovendien aan met halfpension en een driegangenmenu uit de Eifeler streekkeuken.",
      },
      {
        q: "Hoe zwaar is de route van het fietsarrangement?",
        a: "Het Maare-Mosel-fietspad van de Eifeler fietsbelevenissen is in totaal 55 kilometer lang en laat zich goed in etappes fietsen. Dankzij hellingen van maximaal 3 % is het ook geschikt voor gezinnen, die onderweg in de fietsbussen kunnen stappen.",
      },
      {
        q: "Kan ik ook zonder arrangement overnachten?",
        a: "Ja. Met „Kamer zonder pakket\" kiest u uw periode vrij — inclusief groot ontbijtbuffet en gratis wifi en parkeerplaats bij het huis. Halfpension is op verzoek bij te boeken voor +23 € per persoon per dag.",
      },
      {
        q: "Betaal ik provisie bij het boeken van een arrangement?",
        a: "Nee. Als u rechtstreeks bij Landhaus Schend aanvraagt, boekt u provisievrij — zonder de toeslag van een boekingsportaal.",
      },
    ],
  },
};
