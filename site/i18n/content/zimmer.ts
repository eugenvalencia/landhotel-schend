// Lokalisierte Zimmer-Inhalte. Struktur (slug/gallery/priceFrom/maxPersons) + Preis-ZAHLEN
// aus lib/rooms.ts; hier nur übersetzbarer Text. DE wird aus rooms.ts abgeleitet
// → keine Dopplung, deutsche Ausgabe bleibt inhaltsgleich.
import {
  ROOM_INTRO,
  ROOM_AUSSTATTUNG,
  HAUS_SONSTIGES,
  EXTRAS,
  ROOM_RATES,
  ROOM_TYPES,
  type RoomType,
} from "../../lib/rooms";
import type { Locale } from "../index";

export type RateText = { title: string; sub: string; unit: string; halfboard: string; features: string[] };
export type RoomTypeText = {
  type: string;
  priceLabel: string;
  priceNote?: string;
  bed: string;
  hint: string;
  description: string;
  amenities: string[];
};

// ---- DE: direkt aus rooms.ts ----
const deRates: RateText[] = ROOM_RATES.map((r) => ({
  title: r.title,
  sub: r.sub,
  unit: r.unit,
  halfboard: r.halfboard,
  features: r.features,
}));
const deTypes: Record<string, RoomTypeText> = Object.fromEntries(
  ROOM_TYPES.map((r) => [
    r.slug,
    { type: r.type, priceLabel: r.priceLabel, priceNote: r.priceNote, bed: r.bed, hint: r.hint, description: r.description, amenities: r.amenities },
  ]),
);

// ---- Übersetzte Listen + Raten + Typen ----
interface ZimmerLists {
  intro: string[];
  ausstattung: string[];
  sonstiges: string[];
  extras: string[];
  rates: RateText[];
  types: Record<string, RoomTypeText>;
}

const lists: Record<Locale, ZimmerLists> = {
  de: { intro: ROOM_INTRO, ausstattung: ROOM_AUSSTATTUNG, sonstiges: HAUS_SONSTIGES, extras: EXTRAS, rates: deRates, types: deTypes },

  en: {
    intro: [
      "Feel at home in our comfortable double rooms. If needed, the room can also be used by a single guest.",
      "Generous family rooms give children and parents alike room to breathe.",
      "A feel-good atmosphere for families, couples and solo travellers. Spacious and modern, our 19 comfort rooms and 2 family rooms offer ideal conditions to relax. Many double rooms offer a view of the wonderful natural landscape from a balcony or terrace — and, after an extensive day out, the comforts of a well-appointed bathroom.",
      "Wi-Fi is available, as are telephone and satellite TV or shower and WC. Our double and family rooms are all non-smoking and, on request, equipped with extra children's beds. Children up to 2 years stay free, up to 12 years at a 50 % discount, in their parents' room.",
    ],
    ausstattung: ["Non-smoking room", "Telephone, satellite TV", "Mostly balcony/terrace", "Shower/WC", "Wi-Fi", "Modern, comfortable furnishings"],
    sonstiges: ["Breakfast or half board", "Massages on request"],
    extras: [
      "Child discount in parents' room: up to 2 years free",
      "Child discount in parents' room: up to 12 years 50 % off",
      "Dogs on request: 15 €/day",
      "Bathrobe hire 5 €",
    ],
    rates: [
      { title: "Double room", sub: "", unit: "per person/night", halfboard: "Half board plus 23 € per person/day", features: ["Comfortable country-house room", "Non-smoking room", "Shower/WC, telephone, TV, Wi-Fi, safe", "Mostly balcony/terrace"] },
      { title: "Family room", sub: "", unit: "per night", halfboard: "Half board plus 23 € per person/day", features: ["Use by 2 people possible – from 130 €", "Two separate rooms with a shared bathroom, 4 beds", "No balcony", "Non-smoking room", "Shower/WC, telephone, TV, Wi-Fi, safe"] },
      { title: "Double room", sub: "Single occupancy", unit: "per person/night", halfboard: "Half board plus 23 € per person/day", features: ["Comfortable country-house room", "Non-smoking room", "Shower/WC, telephone, TV, Wi-Fi, safe", "Mostly balcony/terrace"] },
    ],
    types: {
      doppelzimmer: {
        type: "Double room",
        priceLabel: "from 57 € per person/night",
        priceNote: "For single occupancy from 80 € per night",
        bed: "Double bed",
        hint: "Comfortable — also for single occupancy",
        description:
          "Feel at home in our comfortable double rooms — modern, mostly with a balcony or terrace and a view of the wonderful Volcanic Eifel landscape. If needed, the room can also be booked for single occupancy (from 80 € per night). All rooms are non-smoking.",
        amenities: ["Comfortable country-house room", "Non-smoking room", "Shower/WC", "Telephone & satellite TV", "Free Wi-Fi", "Safe", "Large breakfast included", "Half board on request (plus 23 €/person/day)", "Mostly balcony or terrace"],
      },
      familienzimmer: {
        type: "Family room",
        priceLabel: "from 170 € per night",
        priceNote: "Use by 2 people possible – from 130 €",
        bed: "Two separate rooms, 4 beds",
        hint: "Two separate rooms with a shared bathroom — no balcony",
        description:
          "Generous family rooms with two separate rooms and a shared bathroom give children and parents alike room to breathe — four beds, no balcony. We have two family rooms — equipped with extra children's beds on request. Children up to 2 years stay free, up to 12 years at a 50 % discount in their parents' room. Use by just 2 people is also possible (from 130 €).",
        amenities: ["Comfortable country-house room", "Non-smoking room", "Shower/WC", "Telephone & satellite TV", "Free Wi-Fi", "Safe", "Large breakfast included", "Half board on request (plus 23 €/person/day)", "Two separate rooms with a shared bathroom", "Four beds", "No balcony/terrace", "Extra children's beds on request"],
      },
    },
  },

  fr: {
    intro: [
      "Sentez-vous comme chez vous dans nos chambres doubles confortables. Au besoin, la chambre peut aussi être occupée par une seule personne.",
      "De spacieuses chambres familiales offrent aux enfants comme aux parents de l'espace.",
      "Une ambiance chaleureuse pour les familles, les couples et les voyageurs en solo. Spacieuses et modernes, nos 19 chambres confort et 2 chambres familiales offrent des conditions idéales pour se détendre. De nombreuses chambres doubles offrent, depuis le balcon ou la terrasse, la vue sur le magnifique paysage naturel — et, après une longue excursion, le confort d'une belle salle de bains.",
      "Une connexion Wi-Fi est à votre disposition, tout comme le téléphone et la TV satellite ou la douche et les WC. Nos chambres doubles et familiales sont toutes non-fumeurs et, sur demande, équipées de lits d'enfant supplémentaires. Les enfants jusqu'à 2 ans logent gratuitement, jusqu'à 12 ans avec une réduction de 50 %, dans la chambre des parents.",
    ],
    ausstattung: ["Chambre non-fumeurs", "Téléphone, TV satellite", "Balcon/terrasse pour la plupart", "Douche/WC", "Wi-Fi", "Équipement moderne et confortable"],
    sonstiges: ["Petit-déjeuner ou demi-pension", "Massages sur demande"],
    extras: [
      "Réduction enfant dans la chambre des parents : jusqu'à 2 ans gratuit",
      "Réduction enfant dans la chambre des parents : jusqu'à 12 ans 50 % de réduction",
      "Chiens sur demande : 15 €/jour",
      "Location peignoir 5 €",
    ],
    rates: [
      { title: "Chambre double", sub: "", unit: "par personne/nuit", halfboard: "Demi-pension + 23 € par personne/jour", features: ["Chambre de charme confortable", "Chambre non-fumeurs", "Douche/WC, téléphone, TV, Wi-Fi, coffre-fort", "Balcon/terrasse pour la plupart"] },
      { title: "Chambre familiale", sub: "", unit: "par nuit", halfboard: "Demi-pension + 23 € par personne/jour", features: ["Utilisation à 2 personnes possible – à partir de 130 €", "Deux pièces séparées avec salle de bains commune, 4 couchages", "Sans balcon", "Chambre non-fumeurs", "Douche/WC, téléphone, TV, Wi-Fi, coffre-fort"] },
      { title: "Chambre double", sub: "Occupation simple", unit: "par personne/nuit", halfboard: "Demi-pension + 23 € par personne/jour", features: ["Chambre de charme confortable", "Chambre non-fumeurs", "Douche/WC, téléphone, TV, Wi-Fi, coffre-fort", "Balcon/terrasse pour la plupart"] },
    ],
    types: {
      doppelzimmer: {
        type: "Chambre double",
        priceLabel: "à partir de 57 € par personne/nuit",
        priceNote: "En occupation simple à partir de 80 € par nuit",
        bed: "Lit double",
        hint: "Confortable — aussi en occupation simple",
        description:
          "Sentez-vous comme chez vous dans nos chambres doubles confortables — modernes, le plus souvent avec balcon ou terrasse et vue sur le magnifique paysage de l'Eifel volcanique. Au besoin, la chambre peut aussi être réservée en occupation simple (à partir de 80 € par nuit). Toutes les chambres sont non-fumeurs.",
        amenities: ["Chambre de charme confortable", "Chambre non-fumeurs", "Douche/WC", "Téléphone & TV satellite", "Wi-Fi gratuit", "Coffre-fort", "Grand petit-déjeuner inclus", "Demi-pension sur demande (+ 23 €/personne/jour)", "Balcon ou terrasse pour la plupart"],
      },
      familienzimmer: {
        type: "Chambre familiale",
        priceLabel: "à partir de 170 € par nuit",
        priceNote: "Utilisation à 2 personnes possible – à partir de 130 €",
        bed: "Deux pièces séparées, 4 couchages",
        hint: "Deux pièces séparées avec salle de bains commune — sans balcon",
        description:
          "De spacieuses chambres familiales avec deux pièces séparées et une salle de bains commune offrent aux enfants comme aux parents de l'espace — quatre couchages, sans balcon. Nous avons deux chambres familiales — équipées sur demande de lits d'enfant supplémentaires. Les enfants jusqu'à 2 ans logent gratuitement, jusqu'à 12 ans avec une réduction de 50 % dans la chambre des parents. Une utilisation à 2 personnes seulement est également possible (à partir de 130 €).",
        amenities: ["Chambre de charme confortable", "Chambre non-fumeurs", "Douche/WC", "Téléphone & TV satellite", "Wi-Fi gratuit", "Coffre-fort", "Grand petit-déjeuner inclus", "Demi-pension sur demande (+ 23 €/personne/jour)", "Deux pièces séparées avec salle de bains commune", "Quatre couchages", "Sans balcon/terrasse", "Lits d'enfant supplémentaires sur demande"],
      },
    },
  },

  nl: {
    intro: [
      "Voel u thuis in onze comfortabele tweepersoonskamers. Indien gewenst kan de kamer ook door één persoon worden gebruikt.",
      "Ruime familiekamers bieden kinderen én ouders bewegingsvrijheid.",
      "Een behaaglijke sfeer voor gezinnen, stellen en alleenreizigers. Ruim en modern ingericht bieden onze 19 comfort- en 2 familiekamers ideale omstandigheden om te ontspannen. Veel tweepersoonskamers bieden vanaf het balkon of terras uitzicht op het prachtige natuurlandschap — en na een uitgebreide excursie het comfort van een mooie badkamer.",
      "Een wifi-aansluiting staat net als telefoon en satelliet-tv of douche en wc tot uw beschikking. Onze tweepersoons- en familiekamers zijn allemaal rookvrij en op verzoek voorzien van extra kinderbedjes. Kinderen tot 2 jaar overnachten gratis, tot 12 jaar met 50 % korting, op de kamer van de ouders.",
    ],
    ausstattung: ["Rookvrije kamer", "Telefoon, satelliet-tv", "Merendeels balkon/terras", "Douche/wc", "Wifi", "Moderne, comfortabele inrichting"],
    sonstiges: ["Ontbijt of halfpension", "Massages op aanvraag"],
    extras: [
      "Kinderkorting op de ouderkamer: tot 2 jaar gratis",
      "Kinderkorting op de ouderkamer: tot 12 jaar 50 % korting",
      "Honden op aanvraag: 15 €/dag",
      "Badjas huren 5 €",
    ],
    rates: [
      { title: "Tweepersoonskamer", sub: "", unit: "per persoon/nacht", halfboard: "Halfpension + 23 € per persoon/dag", features: ["Comfortabele landhuiskamer", "Rookvrije kamer", "Douche/wc, telefoon, tv, wifi, kluis", "Merendeels balkon/terras"] },
      { title: "Familiekamer", sub: "", unit: "per nacht", halfboard: "Halfpension + 23 € per persoon/dag", features: ["Gebruik door 2 personen mogelijk – vanaf 130 €", "Twee gescheiden kamers met gedeelde badkamer, 4 slaapplaatsen", "Zonder balkon", "Rookvrije kamer", "Douche/wc, telefoon, tv, wifi, kluis"] },
      { title: "Tweepersoonskamer", sub: "Eenpersoonsgebruik", unit: "per persoon/nacht", halfboard: "Halfpension + 23 € per persoon/dag", features: ["Comfortabele landhuiskamer", "Rookvrije kamer", "Douche/wc, telefoon, tv, wifi, kluis", "Merendeels balkon/terras"] },
    ],
    types: {
      doppelzimmer: {
        type: "Tweepersoonskamer",
        priceLabel: "vanaf 57 € per persoon/nacht",
        priceNote: "Voor eenpersoonsgebruik vanaf 80 € per nacht",
        bed: "Tweepersoonsbed",
        hint: "Comfortabel — ook voor eenpersoonsgebruik",
        description:
          "Voel u thuis in onze comfortabele tweepersoonskamers — modern ingericht, merendeels met balkon of terras en uitzicht op het prachtige landschap van de Vulkaneifel. Indien gewenst kan de kamer ook voor eenpersoonsgebruik worden geboekt (vanaf 80 € per nacht). Alle kamers zijn rookvrij.",
        amenities: ["Comfortabele landhuiskamer", "Rookvrije kamer", "Douche/wc", "Telefoon & satelliet-tv", "Gratis wifi", "Kluis", "Groot ontbijt inbegrepen", "Halfpension op verzoek (+ 23 €/persoon/dag)", "Merendeels balkon of terras"],
      },
      familienzimmer: {
        type: "Familiekamer",
        priceLabel: "vanaf 170 € per nacht",
        priceNote: "Gebruik door 2 personen mogelijk – vanaf 130 €",
        bed: "Twee gescheiden kamers, 4 slaapplaatsen",
        hint: "Twee gescheiden kamers met gedeelde badkamer — zonder balkon",
        description:
          "Ruime familiekamers met twee gescheiden kamers en een gedeelde badkamer bieden kinderen én ouders bewegingsvrijheid — vier slaapplaatsen, zonder balkon. Wij hebben twee familiekamers — op verzoek voorzien van extra kinderbedjes. Kinderen tot 2 jaar overnachten gratis, tot 12 jaar met 50 % korting op de kamer van de ouders. Een gebruik door slechts 2 personen is eveneens mogelijk (vanaf 130 €).",
        amenities: ["Comfortabele landhuiskamer", "Rookvrije kamer", "Douche/wc", "Telefoon & satelliet-tv", "Gratis wifi", "Kluis", "Groot ontbijt inbegrepen", "Halfpension op verzoek (+ 23 €/persoon/dag)", "Twee gescheiden kamers met gedeelde badkamer", "Vier slaapplaatsen", "Zonder balkon/terras", "Extra kinderbedjes op verzoek"],
      },
    },
  },
};

/** Preis-Karten je Locale (Preis + href bleiben aus rooms.ts). */
export function ratesFor(locale: Locale) {
  return ROOM_RATES.map((r, i) => ({ ...r, ...lists[locale].rates[i] }));
}
/** Zimmertypen je Locale (slug/gallery/priceFrom/maxPersons bleiben). */
export function roomTypesFor(locale: Locale): RoomType[] {
  return ROOM_TYPES.map((r) => ({ ...r, ...lists[locale].types[r.slug] }));
}
export function findRoomFor(slug: string, locale: Locale): RoomType | undefined {
  const base = ROOM_TYPES.find((r) => r.slug === slug);
  return base ? { ...base, ...lists[locale].types[slug] } : undefined;
}
export const introFor = (l: Locale) => lists[l].intro;
export const ausstattungFor = (l: Locale) => lists[l].ausstattung;
export const sonstigesFor = (l: Locale) => lists[l].sonstiges;
export const extrasFor = (l: Locale) => lists[l].extras;

// ---- Seiten-Chrome ----
export interface ZimmerChrome {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  inklFruehstueck: string;
  beispielHinweis: string;
  ausstattungH2: string;
  sonstigesH2: string;
  extrasH2: string;
  anfragenCta: string;
  mehrZumZimmer: string;
  unverbindlichAnfragen: string;
  altSuffix: string;
  backToAll: string;
  detailEyebrow: string;
  detailTitleSuffix: string;
  occupancyLabel: string;
  occupancyUpTo: string;
  personSg: string;
  personPl: string;
  bedLabel: string;
  ausstattungDetailH2: string;
  ansichtLabel: string;
  beispielHinweisDetail: string;
  commissionNote: string;
  breadcrumbHome: string;
  breadcrumbList: string;
  schemaPersonsUnit: string;
  schemaOfferBreakfast: string;
  faqHeading: string;
  // Hub-Spoke-Anker (kontextuelle interne Links), lokalisiert.
  linkRestaurant: string;
  linkRegion: string;
  linkPakete: string;
  linkGalerie: string;
  linkOtherRoom: Record<string, string>; // slug → Anker zum jeweils anderen Zimmertyp
}

export const zimmerChrome: Record<Locale, ZimmerChrome> = {
  de: {
    metaTitle: "Zimmer & Preise in Immerath, Vulkaneifel",
    metaDescription:
      "Doppelzimmer (ab 57 €/P., auch Einzelnutzung) & Familienzimmer im Landhaus Schend, Immerath — Frühstück inklusive, ruhige Lage in der Vulkaneifel.",
    eyebrow: "Unsere Zimmer",
    h1: "Zimmer & Preise",
    inklFruehstueck: "inkl. Frühstück",
    beispielHinweis:
      "Die gezeigten Zimmerfotos sind Beispielbilder — Ausstattung und Ansicht des tatsächlich zugewiesenen Zimmers können je nach Verfügbarkeit leicht abweichen.",
    ausstattungH2: "Zimmerausstattung",
    sonstigesH2: "Sonstiges",
    extrasH2: "Extras & Rabatte",
    anfragenCta: "Anfragen",
    mehrZumZimmer: "Mehr zum Zimmer →",
    unverbindlichAnfragen: "Unverbindlich anfragen",
    altSuffix: "im Landhaus Schend",
    backToAll: "Alle Zimmer",
    detailEyebrow: "Zimmer",
    detailTitleSuffix: "in Immerath, Vulkaneifel",
    occupancyLabel: "Belegung:",
    occupancyUpTo: "bis",
    personSg: "Person",
    personPl: "Personen",
    bedLabel: "Bett:",
    ausstattungDetailH2: "Ausstattung",
    ansichtLabel: "Ansicht",
    beispielHinweisDetail:
      "Die gezeigten Fotos sind Beispielbilder — Ausstattung und Ansicht des tatsächlich zugewiesenen Zimmers können je nach Verfügbarkeit leicht abweichen.",
    commissionNote: "Direktbuchung ist provisionsfrei — ohne Aufschlag eines Buchungsportals.",
    breadcrumbHome: "Startseite",
    breadcrumbList: "Zimmer & Preise",
    schemaPersonsUnit: "Personen",
    schemaOfferBreakfast: "inkl. Frühstücksbuffet",
    faqHeading: "Häufige Fragen zu diesem Zimmer",
    linkRestaurant: "Eifeler Landküche im Landhaus-Restaurant",
    linkRegion: "Wandern, Maare & Nürburgring in der Urlaubsregion",
    linkPakete: "Arrangements & Pauschalen ansehen",
    linkGalerie: "Bildergalerie vom Landhaus Schend",
    linkOtherRoom: { doppelzimmer: "Großzügige Familienzimmer für bis zu 4 Personen", familienzimmer: "Komfortables Doppelzimmer mit Balkon" },
  },
  en: {
    metaTitle: "Rooms & rates in Immerath, Volcanic Eifel",
    metaDescription:
      "Double rooms (from 57 €/pers., also single occupancy) & family rooms at Landhaus Schend, Immerath — breakfast included, quiet location in the Volcanic Eifel.",
    eyebrow: "Our rooms",
    h1: "Rooms & rates",
    inklFruehstueck: "incl. breakfast",
    beispielHinweis:
      "The room photos shown are example images — the furnishings and view of the room actually assigned may vary slightly depending on availability.",
    ausstattungH2: "Room amenities",
    sonstigesH2: "Other",
    extrasH2: "Extras & discounts",
    anfragenCta: "Enquire",
    mehrZumZimmer: "More about the room →",
    unverbindlichAnfragen: "Send a no-obligation enquiry",
    altSuffix: "at Landhaus Schend",
    backToAll: "All rooms",
    detailEyebrow: "Room",
    detailTitleSuffix: "in Immerath, Volcanic Eifel",
    occupancyLabel: "Occupancy:",
    occupancyUpTo: "up to",
    personSg: "person",
    personPl: "people",
    bedLabel: "Bed:",
    ausstattungDetailH2: "Amenities",
    ansichtLabel: "View",
    beispielHinweisDetail:
      "The photos shown are example images — the furnishings and view of the room actually assigned may vary slightly depending on availability.",
    commissionNote: "Booking direct is commission-free — without the surcharge of a booking portal.",
    breadcrumbHome: "Home",
    breadcrumbList: "Rooms & rates",
    schemaPersonsUnit: "people",
    schemaOfferBreakfast: "incl. breakfast buffet",
    faqHeading: "Frequently asked questions about this room",
    linkRestaurant: "Eifel country cuisine in the Landhaus restaurant",
    linkRegion: "Hiking, the maars & the Nürburgring in the holiday region",
    linkPakete: "View arrangements & packages",
    linkGalerie: "Photo gallery of Landhaus Schend",
    linkOtherRoom: { doppelzimmer: "Spacious family rooms for up to 4 people", familienzimmer: "Comfortable double room with balcony" },
  },
  fr: {
    metaTitle: "Chambres & tarifs à Immerath, Eifel volcanique",
    metaDescription:
      "Chambres doubles (dès 57 €/pers., aussi occupation simple) & chambres familiales au Landhaus Schend, Immerath — petit-déjeuner inclus, Eifel volcanique.",
    eyebrow: "Nos chambres",
    h1: "Chambres & tarifs",
    inklFruehstueck: "petit-déjeuner inclus",
    beispielHinweis:
      "Les photos de chambres présentées sont des exemples — l'équipement et la vue de la chambre réellement attribuée peuvent légèrement varier selon les disponibilités.",
    ausstattungH2: "Équipement des chambres",
    sonstigesH2: "Divers",
    extrasH2: "Extras & réductions",
    anfragenCta: "Demander",
    mehrZumZimmer: "En savoir plus sur la chambre →",
    unverbindlichAnfragen: "Demande sans engagement",
    altSuffix: "au Landhaus Schend",
    backToAll: "Toutes les chambres",
    detailEyebrow: "Chambre",
    detailTitleSuffix: "à Immerath, Eifel volcanique",
    occupancyLabel: "Occupation :",
    occupancyUpTo: "jusqu'à",
    personSg: "personne",
    personPl: "personnes",
    bedLabel: "Lit :",
    ausstattungDetailH2: "Équipement",
    ansichtLabel: "Vue",
    beispielHinweisDetail:
      "Les photos présentées sont des exemples — l'équipement et la vue de la chambre réellement attribuée peuvent légèrement varier selon les disponibilités.",
    commissionNote: "La réservation en direct est sans commission — sans le supplément d'un portail de réservation.",
    breadcrumbHome: "Accueil",
    breadcrumbList: "Chambres & tarifs",
    schemaPersonsUnit: "personnes",
    schemaOfferBreakfast: "petit-déjeuner buffet inclus",
    faqHeading: "Questions fréquentes sur cette chambre",
    linkRestaurant: "Cuisine régionale de l'Eifel au restaurant Landhaus",
    linkRegion: "Randonnée, les maars & le Nürburgring dans la région de vacances",
    linkPakete: "Voir les arrangements & forfaits",
    linkGalerie: "Galerie photos du Landhaus Schend",
    linkOtherRoom: { doppelzimmer: "Spacieuses chambres familiales jusqu'à 4 personnes", familienzimmer: "Chambre double confortable avec balcon" },
  },
  nl: {
    metaTitle: "Kamers & tarieven in Immerath, Vulkaneifel",
    metaDescription:
      "Tweepersoons- & familiekamers in Landhaus Schend, Immerath — vanaf 57 €/pers., ook eenpersoonsgebruik, ontbijt inbegrepen, rustige Vulkaneifel.",
    eyebrow: "Onze kamers",
    h1: "Kamers & tarieven",
    inklFruehstueck: "incl. ontbijt",
    beispielHinweis:
      "De getoonde kamerfoto's zijn voorbeeldbeelden — de inrichting en het uitzicht van de daadwerkelijk toegewezen kamer kunnen afhankelijk van de beschikbaarheid licht afwijken.",
    ausstattungH2: "Kameruitrusting",
    sonstigesH2: "Overig",
    extrasH2: "Extra's & kortingen",
    anfragenCta: "Aanvragen",
    mehrZumZimmer: "Meer over de kamer →",
    unverbindlichAnfragen: "Vrijblijvend aanvragen",
    altSuffix: "in Landhaus Schend",
    backToAll: "Alle kamers",
    detailEyebrow: "Kamer",
    detailTitleSuffix: "in Immerath, Vulkaneifel",
    occupancyLabel: "Bezetting:",
    occupancyUpTo: "tot",
    personSg: "persoon",
    personPl: "personen",
    bedLabel: "Bed:",
    ausstattungDetailH2: "Uitrusting",
    ansichtLabel: "Aanzicht",
    beispielHinweisDetail:
      "De getoonde foto's zijn voorbeeldbeelden — de inrichting en het uitzicht van de daadwerkelijk toegewezen kamer kunnen afhankelijk van de beschikbaarheid licht afwijken.",
    commissionNote: "Direct boeken is provisievrij — zonder toeslag van een boekingsportaal.",
    breadcrumbHome: "Startpagina",
    breadcrumbList: "Kamers & tarieven",
    schemaPersonsUnit: "personen",
    schemaOfferBreakfast: "incl. ontbijtbuffet",
    faqHeading: "Veelgestelde vragen over deze kamer",
    linkRestaurant: "Eifeler streekkeuken in het Landhaus-restaurant",
    linkRegion: "Wandelen, de maren & de Nürburgring in de vakantieregio",
    linkPakete: "Arrangementen & pakketten bekijken",
    linkGalerie: "Fotogalerij van Landhaus Schend",
    linkOtherRoom: { doppelzimmer: "Ruime familiekamers voor maximaal 4 personen", familienzimmer: "Comfortabele tweepersoonskamer met balkon" },
  },
};

// ---- Beschreibende Galerie-Alt-Texte je Foto-Pfad (Motiv aus Dateiname abgeleitet) ----
// Detail-Seite hängt den lokalisierten altSuffix ("im Landhaus Schend" …) selbst an.
// Fehlt ein Pfad → Detail-Seite fällt auf den generischen Alt zurück.
export const galleryAltFor: Record<Locale, Record<string, string>> = {
  de: {
    "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg": "Komfort-Doppelzimmer mit Sofa und Holzlamellenwand",
    "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg": "Komfort-Doppelzimmer mit Doppelbett und Holzboden",
    "/fotos/doppelzimmer-mit-doppelbett-und-kleiderschrank-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer mit Doppelbett und Kleiderschrank",
    "/fotos/doppelzimmer-eingang-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer-Eingang mit ebenerdiger Dusche",
    "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg": "Modernes Bad mit Walk-in-Dusche und Rundspiegel",
    "/fotos/doppelzimmer-bad-mit-dusche-waschbecken-und-wc-landhaus-schend-vulkaneifel.jpg": "Bad mit Dusche, Waschbecken und WC",
    "/fotos/doppelzimmer-mit-balkon-gelb-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer mit Balkon",
    "/fotos/doppelzimmer-renoviert-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Renoviertes Doppelzimmer mit Holzboden",
    "/fotos/doppelzimmer-modern-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Modernes Doppelzimmer mit Holzboden",
    "/fotos/doppelzimmer-mit-sitzecke-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer mit Sitzecke",
    "/fotos/doppelzimmer-mit-sofa-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer mit Sofa",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Doppelzimmer-Bad mit ebenerdiger Dusche",
    "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg": "Familienzimmer mit Doppelbett",
    "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg": "Familienzimmer mit getrenntem Nebenraum",
    "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg": "Familienzimmer mit Kinderbetten und Bad",
    "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg": "Schlafbereich des Familienzimmers",
    "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg": "Wohnbereich des Familienzimmers mit TV",
  },
  en: {
    "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg": "Comfort double room with sofa and wood-slat wall",
    "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg": "Comfort double room with double bed and wooden floor",
    "/fotos/doppelzimmer-mit-doppelbett-und-kleiderschrank-landhaus-schend-vulkaneifel.jpg": "Double room with double bed and wardrobe",
    "/fotos/doppelzimmer-eingang-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Double-room entrance with walk-in shower",
    "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg": "Modern bathroom with walk-in shower and round mirror",
    "/fotos/doppelzimmer-bad-mit-dusche-waschbecken-und-wc-landhaus-schend-vulkaneifel.jpg": "Bathroom with shower, basin and WC",
    "/fotos/doppelzimmer-mit-balkon-gelb-landhaus-schend-vulkaneifel.jpg": "Double room with balcony",
    "/fotos/doppelzimmer-renoviert-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Renovated double room with wooden floor",
    "/fotos/doppelzimmer-modern-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Modern double room with wooden floor",
    "/fotos/doppelzimmer-mit-sitzecke-landhaus-schend-vulkaneifel.jpg": "Double room with seating area",
    "/fotos/doppelzimmer-mit-sofa-landhaus-schend-vulkaneifel.jpg": "Double room with sofa",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Double-room bathroom with walk-in shower",
    "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg": "Family room with double bed",
    "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg": "Family room with separate adjoining room",
    "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg": "Family room with children's beds and bathroom",
    "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg": "Sleeping area of the family room",
    "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg": "Living area of the family room with TV",
  },
  fr: {
    "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg": "Chambre double confort avec canapé et paroi à lamelles de bois",
    "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg": "Chambre double confort avec lit double et parquet",
    "/fotos/doppelzimmer-mit-doppelbett-und-kleiderschrank-landhaus-schend-vulkaneifel.jpg": "Chambre double avec lit double et armoire",
    "/fotos/doppelzimmer-eingang-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Entrée de la chambre double avec douche de plain-pied",
    "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg": "Salle de bains moderne avec douche à l'italienne et miroir rond",
    "/fotos/doppelzimmer-bad-mit-dusche-waschbecken-und-wc-landhaus-schend-vulkaneifel.jpg": "Salle de bains avec douche, lavabo et WC",
    "/fotos/doppelzimmer-mit-balkon-gelb-landhaus-schend-vulkaneifel.jpg": "Chambre double avec balcon",
    "/fotos/doppelzimmer-renoviert-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Chambre double rénovée avec parquet",
    "/fotos/doppelzimmer-modern-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Chambre double moderne avec parquet",
    "/fotos/doppelzimmer-mit-sitzecke-landhaus-schend-vulkaneifel.jpg": "Chambre double avec coin salon",
    "/fotos/doppelzimmer-mit-sofa-landhaus-schend-vulkaneifel.jpg": "Chambre double avec canapé",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Salle de bains de la chambre double avec douche de plain-pied",
    "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg": "Chambre familiale avec lit double",
    "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg": "Chambre familiale avec pièce attenante séparée",
    "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg": "Chambre familiale avec lits d'enfant et salle de bains",
    "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg": "Coin nuit de la chambre familiale",
    "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg": "Coin salon de la chambre familiale avec TV",
  },
  nl: {
    "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg": "Comfort-tweepersoonskamer met bank en houten lamellenwand",
    "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg": "Comfort-tweepersoonskamer met tweepersoonsbed en houten vloer",
    "/fotos/doppelzimmer-mit-doppelbett-und-kleiderschrank-landhaus-schend-vulkaneifel.jpg": "Tweepersoonskamer met tweepersoonsbed en kledingkast",
    "/fotos/doppelzimmer-eingang-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Entree van de tweepersoonskamer met inloopdouche",
    "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg": "Moderne badkamer met inloopdouche en ronde spiegel",
    "/fotos/doppelzimmer-bad-mit-dusche-waschbecken-und-wc-landhaus-schend-vulkaneifel.jpg": "Badkamer met douche, wastafel en wc",
    "/fotos/doppelzimmer-mit-balkon-gelb-landhaus-schend-vulkaneifel.jpg": "Tweepersoonskamer met balkon",
    "/fotos/doppelzimmer-renoviert-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Gerenoveerde tweepersoonskamer met houten vloer",
    "/fotos/doppelzimmer-modern-mit-holzboden-landhaus-schend-vulkaneifel.jpg": "Moderne tweepersoonskamer met houten vloer",
    "/fotos/doppelzimmer-mit-sitzecke-landhaus-schend-vulkaneifel.jpg": "Tweepersoonskamer met zithoek",
    "/fotos/doppelzimmer-mit-sofa-landhaus-schend-vulkaneifel.jpg": "Tweepersoonskamer met bank",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg": "Badkamer van de tweepersoonskamer met inloopdouche",
    "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg": "Familiekamer met tweepersoonsbed",
    "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg": "Familiekamer met aparte aangrenzende ruimte",
    "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg": "Familiekamer met kinderbedden en badkamer",
    "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg": "Slaapgedeelte van de familiekamer",
    "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg": "Woongedeelte van de familiekamer met tv",
  },
};

// ---- Zimmer-spezifische GEO-FAQ (eigene Formulierungen, andere @id als /faq) ----
// Antworten ausschließlich aus realen Fakten (lib/rooms.ts, EXTRAS, faq.ts).
export type ZimmerQA = { q: string; a: string };
export const roomFaqFor: Record<Locale, Record<string, ZimmerQA[]>> = {
  de: {
    doppelzimmer: [
      { q: "Hat das Doppelzimmer einen Balkon oder eine Terrasse?", a: "Die meisten unserer Doppelzimmer haben einen Balkon oder eine Terrasse mit Blick in die Vulkaneifel-Landschaft. Sagen Sie uns bei der Anfrage Bescheid, wenn Sie ein Zimmer mit Balkon möchten — wir berücksichtigen den Wunsch gern." },
      { q: "Ist das Frühstück im Preis enthalten?", a: "Ja, ein großes Frühstücksbuffet ist im Doppelzimmer-Preis ab 57 € pro Person/Nacht enthalten. Auf Wunsch buchen Sie zusätzlich Halbpension für 23 € pro Person und Tag." },
      { q: "Kann ich das Doppelzimmer alleine nutzen?", a: "Ja. Alleinreisende buchen das Doppelzimmer zur Einzelnutzung ab 80 € pro Nacht inklusive Frühstücksbuffet — so haben Sie deutlich mehr Platz als in einem klassischen Einzelzimmer." },
      { q: "Was kostet eine Übernachtung mit Kindern?", a: "Kinder bis 2 Jahre übernachten kostenlos, bis 12 Jahre um 50 % ermäßigt im Elternzimmer. Zusätzliche Kinderbetten stellen wir auf Wunsch bereit." },
    ],
    familienzimmer: [
      { q: "Wie ist das Familienzimmer aufgeteilt?", a: "Das Familienzimmer hat zwei getrennte Räume mit einem gemeinsamen Bad und vier Schlafplätzen — ideal für Eltern mit Kindern. Es hat keinen Balkon. Wir haben genau zwei Familienzimmer." },
      { q: "Was kostet das Familienzimmer?", a: "Das Familienzimmer kostet ab 170 € pro Nacht für bis zu 4 Personen. Eine Nutzung mit nur 2 Personen ist ab 130 € möglich. Das Frühstücksbuffet ist immer enthalten." },
      { q: "Gibt es eine Kinderermäßigung?", a: "Ja. Kinder bis 2 Jahre übernachten kostenlos, bis 12 Jahre um 50 % ermäßigt im Elternzimmer. Auf Wunsch statten wir das Zimmer mit zusätzlichen Kinderbetten aus." },
      { q: "Kann ich Halbpension dazubuchen?", a: "Ja, Halbpension ist auf Wunsch für 23 € pro Person und Tag buchbar — ein 3-Gang-Menü aus frischer Eifeler Landküche. Das Frühstücksbuffet ist im Übernachtungspreis bereits enthalten." },
    ],
  },
  en: {
    doppelzimmer: [
      { q: "Does the double room have a balcony or terrace?", a: "Most of our double rooms have a balcony or terrace with a view over the Volcanic Eifel landscape. Just let us know with your enquiry if you'd like a room with a balcony — we're happy to take your wish into account." },
      { q: "Is breakfast included in the price?", a: "Yes, a large breakfast buffet is included in the double-room rate from €57 per person/night. On request you can additionally book half board for €23 per person and day." },
      { q: "Can I use the double room on my own?", a: "Yes. Solo travellers book the double room for single use from €80 per night including the breakfast buffet — giving you considerably more space than a classic single room." },
      { q: "How much does a stay with children cost?", a: "Children up to 2 years stay free, up to 12 years at a 50 % discount in their parents' room. We provide extra children's beds on request." },
    ],
    familienzimmer: [
      { q: "How is the family room laid out?", a: "The family room has two separate rooms with a shared bathroom and four beds — ideal for parents with children. It has no balcony. We have exactly two family rooms." },
      { q: "How much does the family room cost?", a: "The family room costs from €170 per night for up to 4 people. Use by just 2 people is possible from €130. The breakfast buffet is always included." },
      { q: "Is there a discount for children?", a: "Yes. Children up to 2 years stay free, up to 12 years at a 50 % discount in their parents' room. On request we fit the room with extra children's beds." },
      { q: "Can I add half board?", a: "Yes, half board can be booked on request for €23 per person and day — a 3-course menu of fresh Eifel country cuisine. The breakfast buffet is already included in the room rate." },
    ],
  },
  fr: {
    doppelzimmer: [
      { q: "La chambre double a-t-elle un balcon ou une terrasse ?", a: "La plupart de nos chambres doubles ont un balcon ou une terrasse avec vue sur les paysages de l'Eifel volcanique. Précisez-le-nous lors de votre demande si vous souhaitez une chambre avec balcon — nous en tiendrons compte avec plaisir." },
      { q: "Le petit-déjeuner est-il compris dans le prix ?", a: "Oui, un grand petit-déjeuner buffet est compris dans le tarif de la chambre double à partir de 57 € par personne/nuit. Sur demande, vous pouvez ajouter la demi-pension pour 23 € par personne et par jour." },
      { q: "Puis-je occuper la chambre double seul(e) ?", a: "Oui. Les voyageurs seuls réservent la chambre double en usage individuel à partir de 80 € la nuit, petit-déjeuner buffet inclus — vous disposez ainsi de bien plus d'espace qu'une chambre simple classique." },
      { q: "Combien coûte un séjour avec des enfants ?", a: "Les enfants jusqu'à 2 ans séjournent gratuitement, jusqu'à 12 ans avec une réduction de 50 % dans la chambre des parents. Nous fournissons des lits d'enfant supplémentaires sur demande." },
    ],
    familienzimmer: [
      { q: "Comment la chambre familiale est-elle agencée ?", a: "La chambre familiale comprend deux pièces séparées avec une salle de bains commune et quatre couchages — idéale pour les parents avec enfants. Elle n'a pas de balcon. Nous avons exactement deux chambres familiales." },
      { q: "Combien coûte la chambre familiale ?", a: "La chambre familiale coûte à partir de 170 € la nuit pour 4 personnes maximum. Une utilisation par 2 personnes seulement est possible à partir de 130 €. Le petit-déjeuner buffet est toujours inclus." },
      { q: "Y a-t-il une réduction pour les enfants ?", a: "Oui. Les enfants jusqu'à 2 ans séjournent gratuitement, jusqu'à 12 ans avec une réduction de 50 % dans la chambre des parents. Sur demande, nous équipons la chambre de lits d'enfant supplémentaires." },
      { q: "Puis-je ajouter la demi-pension ?", a: "Oui, la demi-pension est disponible sur demande pour 23 € par personne et par jour — un menu 3 plats de cuisine fraîche de l'Eifel. Le petit-déjeuner buffet est déjà compris dans le tarif." },
    ],
  },
  nl: {
    doppelzimmer: [
      { q: "Heeft de tweepersoonskamer een balkon of terras?", a: "De meeste van onze tweepersoonskamers hebben een balkon of terras met uitzicht over het landschap van de Vulkaaneifel. Geef het bij uw aanvraag door als u een kamer met balkon wenst — we houden er graag rekening mee." },
      { q: "Is het ontbijt bij de prijs inbegrepen?", a: "Ja, een groot ontbijtbuffet is bij de prijs van de tweepersoonskamer vanaf € 57 per persoon/nacht inbegrepen. Op verzoek boekt u aanvullend halfpension voor € 23 per persoon en dag." },
      { q: "Kan ik de tweepersoonskamer alleen gebruiken?", a: "Ja. Alleenreizenden boeken de tweepersoonskamer voor eenpersoonsgebruik vanaf € 80 per nacht inclusief ontbijtbuffet — zo heeft u veel meer ruimte dan in een klassieke eenpersoonskamer." },
      { q: "Wat kost een overnachting met kinderen?", a: "Kinderen tot 2 jaar overnachten gratis, tot 12 jaar met 50 % korting op de kamer van de ouders. Extra kinderbedden plaatsen we op verzoek." },
    ],
    familienzimmer: [
      { q: "Hoe is de familiekamer ingedeeld?", a: "De familiekamer heeft twee aparte ruimtes met een gedeelde badkamer en vier slaapplaatsen — ideaal voor ouders met kinderen. De kamer heeft geen balkon. We hebben precies twee familiekamers." },
      { q: "Wat kost de familiekamer?", a: "De familiekamer kost vanaf € 170 per nacht voor maximaal 4 personen. Gebruik door slechts 2 personen is mogelijk vanaf € 130. Het ontbijtbuffet is altijd inbegrepen." },
      { q: "Is er kinderkorting?", a: "Ja. Kinderen tot 2 jaar overnachten gratis, tot 12 jaar met 50 % korting op de kamer van de ouders. Op verzoek voorzien we de kamer van extra kinderbedden." },
      { q: "Kan ik halfpension bijboeken?", a: "Ja, halfpension is op verzoek boekbaar voor € 23 per persoon en dag — een 3-gangenmenu uit de verse Eifeler streekkeuken. Het ontbijtbuffet is al bij de overnachtingsprijs inbegrepen." },
    ],
  },
};
