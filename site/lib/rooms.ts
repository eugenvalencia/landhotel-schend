// Zimmer-Daten — AUTHORITATIV von der echten Hotel-Seite landhaus-schend.de/zimmer
// (Screenshots Eugen 2026-06-03) + Auskunft Karin/Schend.
// WICHTIG: Das Hotel hat KEINE Einzelzimmer und KEINE Suiten. Es gibt genau zwei
// Zimmer-Arten: Doppelzimmer (auch zur Einzelnutzung gegen Aufpreis) und 2 Familien-
// zimmer. 19 Komfort- + 2 Familienzimmer = 21.
import { galleryForRoomType } from "./photos";

export type RoomType = {
  slug: string;
  type: string;
  priceFrom: number;
  priceLabel: string;
  priceNote?: string;
  maxPersons: number;
  bed: string;
  hint: string;
  description: string;
  amenities: string[];
  gallery: string[];
};

// Intro-Text 1:1 von der Original-Seite.
export const ROOM_INTRO = [
  "Fühlen Sie sich wie zuhause in unseren komfortablen Doppelzimmern. Bei Bedarf kann das Zimmer auch als Einzelperson genutzt werden.",
  "Großzügige Familienzimmer bieten Kindern wie Eltern Freiraum.",
  "Wohlfühl-Ambiente für Familien, Paare und Einzelreisende. Großzügig und modern eingerichtet bieten unsere 19 Komfort- und 2 Familienzimmer optimale Voraussetzungen, zu entspannen. Viele Doppelzimmer bieten von Balkon oder Terrasse aus den Blick in die wunderbare Naturlandschaft — und nach einer ausgiebigen Ausflugtour die Annehmlichkeiten eines komfortablen Bades.",
  "Ein WLAN-Anschluss steht Ihnen ebenso zur Verfügung wie Telefon und Sat-TV oder Dusche und WC. Unsere Doppel- und Familienzimmer sind alle Nichtraucherzimmer und auf Wunsch ausgestattet mit zusätzlichen Kinderbetten. Bis 2 Jahre übernachten Kinder kostenlos, bis 12 Jahre um 50 % ermäßigt, im Elternzimmer.",
];

export const ROOM_AUSSTATTUNG = [
  "Nichtraucherzimmer",
  "Telefon, Sat-TV",
  "überwiegend Balkon/Terrasse",
  "Dusche/WC",
  "WLAN",
  "moderne, komfortable Ausstattung",
];

export const HAUS_SONSTIGES = ["Frühstück oder Halbpension", "Massagen auf Anfrage"];

export const EXTRAS = [
  "Kinderermäßigung im Elternzimmer: bis 2 Jahre kostenlos",
  "Kinderermäßigung im Elternzimmer: bis 12 Jahre 50 % Ermäßigung",
  "Hunde auf Anfrage: 15 €/Tag",
  "Verleih Bademantel 5 €",
];

// Die drei Preis-Karten — exakt wie auf der Original-Seite.
export const ROOM_RATES = [
  {
    title: "Doppelzimmer",
    sub: "",
    price: "ab 57 €",
    unit: "pro Person/Nacht",
    halfboard: "Halbpension zzgl. 23 € Person/Tag",
    features: ["komfortables Landhauszimmer", "Nichtraucherzimmer", "DU/WC, Telefon, TV, WLAN, Safe", "überwiegend Balkon/Terrasse"],
    href: "/zimmer/doppelzimmer",
  },
  {
    title: "Familienzimmer",
    sub: "",
    price: "ab 170 €",
    unit: "pro Nacht",
    halfboard: "Halbpension zzgl. 23 € Person/Tag",
    features: ["Nutzung mit 2 Personen möglich – ab 130 €", "zwei getrennte Räume mit gemeinsamem Bad, 4 Schlafplätze", "ohne Balkon", "Nichtraucherzimmer", "DU/WC, Telefon, TV, WLAN, Safe"],
    href: "/zimmer/familienzimmer",
  },
  {
    title: "Doppelzimmer",
    sub: "Einzelnutzung",
    price: "ab 80 €",
    unit: "pro Person/Nacht",
    halfboard: "Halbpension zzgl. 23 € Person/Tag",
    features: ["komfortables Landhauszimmer", "Nichtraucherzimmer", "DU/WC, Telefon, TV, WLAN, Safe", "überwiegend Balkon/Terrasse"],
    href: "/zimmer/doppelzimmer",
  },
];

const ROOM_AMENITIES = [
  "Komfortables Landhauszimmer",
  "Nichtraucherzimmer",
  "Dusche/WC",
  "Telefon & Sat-TV",
  "Kostenfreies WLAN",
  "Safe",
  "Großes Frühstück inklusive",
  "Halbpension auf Wunsch (zzgl. 23 €/Person/Tag)",
];

// Zwei echte Zimmer-Detailseiten.
export const ROOM_TYPES: RoomType[] = [
  {
    slug: "doppelzimmer",
    type: "Doppelzimmer",
    priceFrom: 57,
    priceLabel: "ab 57 € pro Person/Nacht",
    priceNote: "Zur Einzelnutzung ab 80 € pro Nacht",
    maxPersons: 2,
    bed: "Doppelbett",
    hint: "Komfortabel — auch zur Einzelnutzung",
    description:
      "Fühlen Sie sich wie zuhause in unseren komfortablen Doppelzimmern — modern eingerichtet, überwiegend mit Balkon oder Terrasse und Blick in die wunderbare Vulkaneifel-Landschaft. Bei Bedarf kann das Zimmer auch zur Einzelnutzung gebucht werden (ab 80 € pro Nacht). Alle Zimmer sind Nichtraucherzimmer.",
    amenities: [...ROOM_AMENITIES, "Überwiegend Balkon oder Terrasse"],
    gallery: galleryForRoomType("Doppelzimmer Standard"),
  },
  {
    slug: "familienzimmer",
    type: "Familienzimmer",
    priceFrom: 170,
    priceLabel: "ab 170 € pro Nacht",
    priceNote: "Nutzung mit 2 Personen möglich – ab 130 €",
    maxPersons: 4,
    bed: "Zwei getrennte Zimmer, 4 Schlafplätze",
    hint: "Zwei getrennte Räume mit gemeinsamem Bad — ohne Balkon",
    description:
      "Großzügige Familienzimmer mit zwei getrennten Räumen und einem gemeinsamen Bad bieten Kindern wie Eltern Freiraum — vier Schlafplätze, ohne Balkon. Wir haben zwei Familienzimmer — auf Wunsch mit zusätzlichen Kinderbetten ausgestattet. Kinder bis 2 Jahre übernachten kostenlos, bis 12 Jahre um 50 % ermäßigt im Elternzimmer. Eine Nutzung mit nur 2 Personen ist ebenfalls möglich (ab 130 €).",
    amenities: [...ROOM_AMENITIES, "Zwei getrennte Räume mit gemeinsamem Bad", "Vier Schlafplätze", "Ohne Balkon/Terrasse", "Zusätzliche Kinderbetten auf Wunsch"],
    gallery: galleryForRoomType("Familienzimmer"),
  },
];

export const findRoom = (slug: string) => ROOM_TYPES.find((r) => r.slug === slug);

export function roomSchema(r: RoomType) {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: `${r.type} — Landhotel Schend`,
    description: r.description,
    url: `https://landhaus-schend.de/zimmer/${r.slug}`,
    image: r.gallery.map((g) => `https://landhaus-schend.de${g}`),
    occupancy: { "@type": "QuantitativeValue", maxValue: r.maxPersons, unitText: "Personen" },
    bed: { "@type": "BedDetails", typeOfBed: r.bed },
    amenityFeature: r.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    isPartOf: { "@id": "https://landhaus-schend.de/#hotel" },
    makesOffer: {
      "@type": "Offer",
      price: r.priceFrom,
      priceCurrency: "EUR",
      description: `${r.priceLabel}, inkl. Frühstücksbuffet`,
      availability: "https://schema.org/InStock",
    },
  };
}
