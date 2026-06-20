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
}

export const zimmerChrome: Record<Locale, ZimmerChrome> = {
  de: {
    metaTitle: "Zimmer & Preise in der Vulkaneifel",
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
    detailTitleSuffix: "Zimmer im Landhaus Schend",
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
  },
  en: {
    metaTitle: "Rooms & rates in the Volcanic Eifel",
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
    detailTitleSuffix: "Room at Landhaus Schend",
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
  },
  fr: {
    metaTitle: "Chambres & tarifs dans l'Eifel volcanique",
    metaDescription:
      "Chambres doubles (à p. de 57 €/pers., aussi en occupation simple) & chambres familiales au Landhaus Schend, Immerath — petit-déjeuner inclus, situation calme dans l'Eifel volcanique.",
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
    detailTitleSuffix: "Chambre au Landhaus Schend",
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
  },
  nl: {
    metaTitle: "Kamers & tarieven in de Vulkaneifel",
    metaDescription:
      "Tweepersoonskamers (vanaf 57 €/pers., ook eenpersoonsgebruik) & familiekamers in Landhaus Schend, Immerath — ontbijt inbegrepen, rustige ligging in de Vulkaneifel.",
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
    detailTitleSuffix: "Kamer in Landhaus Schend",
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
  },
};
