// Zimmer-TYP-Daten für die öffentlichen SSG-Seiten.
// Statisch aus vorhandenen Code-Quellen zusammengeführt (KEINE Erfindung):
//   - Typen + Preise + Kurz-Hint: src/components/SiteHeader.tsx (ROOMS_MEGA)
//   - Beschreibungen: src/pages/RoomDetail.tsx (TYPE_DESCRIPTIONS)
//   - Galerien: src/lib/photos.ts (SCHEND_ROOM_GALLERY)
//   - Ausstattung: FAQ („Dusche/WC, Telefon, TV, WLAN, Safe")
// Die Live-Verfügbarkeit/Buchung pro Einzelzimmer bleibt Sache des Buchungs-
// Flows (Supabase) — die Marketing-Seiten zeigen die Typen.
import { galleryForRoomType } from "./photos";

export type RoomType = {
  slug: string;
  type: string;
  galleryKey: string;
  priceFrom: number;
  priceLabel: string;
  maxPersons: number;
  bed: string;
  hint: string;
  description: string;
  amenities: string[];
  gallery: string[];
};

const BASE_AMENITIES = [
  "Balkon oder Terrasse",
  "Dusche/WC",
  "Kostenfreies WLAN",
  "Flat-TV",
  "Safe",
  "Telefon",
  "Großes Frühstücksbuffet inklusive",
];

export const ROOM_TYPES: RoomType[] = [
  {
    slug: "einzelzimmer",
    type: "Einzelzimmer",
    galleryKey: "Einzelzimmer",
    priceFrom: 65,
    priceLabel: "ab 65 €",
    maxPersons: 1,
    bed: "Einzelbett",
    hint: "Gemütlich für Reisende",
    description:
      "Gemütliches Einzelzimmer mit Blick auf die Vulkaneifel. Ideal für Geschäftsreisende und Solo-Urlauber. Inklusive Frühstücksbuffet und kostenlosem WLAN.",
    amenities: BASE_AMENITIES,
    gallery: galleryForRoomType("Einzelzimmer"),
  },
  {
    slug: "doppelzimmer-standard",
    type: "Doppelzimmer Standard",
    galleryKey: "Doppelzimmer Standard",
    priceFrom: 95,
    priceLabel: "ab 95 €",
    maxPersons: 2,
    bed: "Doppelbett",
    hint: "Komfort mit Doppelbett und Balkon",
    description:
      "Komfortables Doppelzimmer mit Doppelbett, Balkon und Eifel-Blick. Liebevoll eingerichtet mit allem, was Sie für einen erholsamen Aufenthalt brauchen.",
    amenities: BASE_AMENITIES,
    gallery: galleryForRoomType("Doppelzimmer Standard"),
  },
  {
    slug: "doppelzimmer-komfort",
    type: "Doppelzimmer Komfort",
    galleryKey: "Doppelzimmer Komfort",
    priceFrom: 105,
    priceLabel: "ab 105 €",
    maxPersons: 2,
    bed: "Zwei Einzelbetten",
    hint: "Geräumig mit Terrasse",
    description:
      "Geräumiges Komfort-Zimmer mit zwei Einzelbetten und großzügiger Terrasse. Perfekt für Freunde oder Paare, die mehr Platz wünschen.",
    amenities: BASE_AMENITIES,
    gallery: galleryForRoomType("Doppelzimmer Komfort"),
  },
  {
    slug: "familienzimmer",
    type: "Familienzimmer",
    galleryKey: "Familienzimmer",
    priceFrom: 145,
    priceLabel: "ab 145 €",
    maxPersons: 4,
    bed: "Doppelbett + Zusatzbetten",
    hint: "Bis 4 Personen",
    description:
      "Großes Familienzimmer für bis zu 4 Personen, mit kindgerechter Ausstattung und viel Platz zum Wohlfühlen.",
    amenities: [...BASE_AMENITIES, "Platz für bis zu 4 Personen", "Kindgerechte Ausstattung"],
    gallery: galleryForRoomType("Familienzimmer"),
  },
  {
    slug: "suiten",
    type: "Junior Suite & Eifel-Suite",
    galleryKey: "Junior Suite",
    priceFrom: 165,
    priceLabel: "ab 165 €",
    maxPersons: 2,
    bed: "Kingsize-Bett",
    hint: "Wohnbereich und Panoramablick",
    description:
      "Elegante Junior Suite mit Kingsize-Bett, Sitzecke und Premium-Ausstattung — und unsere Eifel-Suite mit eigenem Wohnbereich und Panoramablick. Ein Hauch von Luxus inmitten der Vulkaneifel.",
    amenities: [...BASE_AMENITIES, "Separater Wohnbereich / Sitzecke", "Panoramablick"],
    gallery: galleryForRoomType("Junior Suite"),
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
      description: `${r.priceLabel} pro Nacht inkl. Frühstücksbuffet`,
      availability: "https://schema.org/InStock",
    },
  };
}
