// Bilder vom Original-Server des Landhaus Schend (landhaus-schend.de).
// HotelImage zeigt einen LS-Platzhalter, falls eine URL nicht erreichbar ist.

const BASE = "https://landhaus-schend.de/pics";

export const SCHEND_HEROES = [
  `${BASE}/01_startseite/b0_1.jpg`,
  `${BASE}/01_startseite/b0_2.jpg`,
  `${BASE}/01_startseite/b0_3.jpg`,
  `${BASE}/01_startseite/b0_4.jpg`,
  `${BASE}/01_startseite/b0_5.jpg`,
  `${BASE}/01_startseite/b0_6.jpg`,
  `${BASE}/01_startseite/b0_7.jpg`,
];

/**
 * Pro Zimmer-Typ eine Galerie mit verschiedenen Sichtrichtungen.
 * Reihenfolge: Hauptbild (Front), Detail-Winkel _a, Detail-Winkel _b, Außen/Lifestyle.
 * Wo der Server für einen Typ keine _b Variante hat, ziehen wir auf das passende Haus-Bild.
 */
export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  "Einzelzimmer": [
    `${BASE}/02_zimmer/b2_a.jpg`,
    `${BASE}/02_zimmer/b2_b.jpg`,
    `${BASE}/02_zimmer/b2_c.jpg`,
    `${BASE}/02_zimmer/b2_d.jpg`,
  ],
  "Doppelzimmer": [
    `${BASE}/02_zimmer/b1_1.jpg`,
    `${BASE}/02_zimmer/b1_1_a.jpg`,
    `${BASE}/02_zimmer/b1_1_b.jpg`,
    `${BASE}/03_haus/b1_3.jpg`,
  ],
  "Doppelzimmer Standard": [
    `${BASE}/02_zimmer/b1_1.jpg`,
    `${BASE}/02_zimmer/b1_1_a.jpg`,
    `${BASE}/02_zimmer/b1_1_b.jpg`,
    `${BASE}/03_haus/b1_3.jpg`,
  ],
  "Komfort": [
    `${BASE}/02_zimmer/b1_2.jpg`,
    `${BASE}/02_zimmer/b1_2_a.jpg`,
    `${BASE}/02_zimmer/b1_2_b.jpg`,
    `${BASE}/03_haus/b1_4.jpg`,
  ],
  "Doppelzimmer Komfort": [
    `${BASE}/02_zimmer/b1_2.jpg`,
    `${BASE}/02_zimmer/b1_2_a.jpg`,
    `${BASE}/02_zimmer/b1_2_b.jpg`,
    `${BASE}/03_haus/b1_4.jpg`,
  ],
  "Familie": [
    `${BASE}/02_zimmer/b1_3.jpg`,
    `${BASE}/02_zimmer/b1_3_a.jpg`,
    `${BASE}/02_zimmer/b1_3_b.jpg`,
    `${BASE}/03_haus/b1_2.jpg`,
  ],
  "Familienzimmer": [
    `${BASE}/02_zimmer/b1_3.jpg`,
    `${BASE}/02_zimmer/b1_3_a.jpg`,
    `${BASE}/02_zimmer/b1_3_b.jpg`,
    `${BASE}/03_haus/b1_2.jpg`,
  ],
  "Junior Suite": [
    `${BASE}/02_zimmer/b1_4.jpg`,
    `${BASE}/02_zimmer/b1_4_a.jpg`,
    `${BASE}/02_zimmer/b1_6.jpg`,
    `${BASE}/03_haus/b1_1.jpg`,
  ],
  "Suite": [
    `${BASE}/02_zimmer/b1_5.jpg`,
    `${BASE}/02_zimmer/b1_5_a.jpg`,
    `${BASE}/02_zimmer/b1_7.jpg`,
    `${BASE}/02_zimmer/b1_8.jpg`,
  ],
  "Eifel-Suite": [
    `${BASE}/02_zimmer/b1_5.jpg`,
    `${BASE}/02_zimmer/b1_5_a.jpg`,
    `${BASE}/02_zimmer/b1_7.jpg`,
    `${BASE}/02_zimmer/b1_8.jpg`,
  ],
};

/**
 * Legacy-Map fuer Code-Pfade die nur EIN Foto pro Typ wollen
 * (z.B. Vorschau in Booking-Karten).
 */
export const SCHEND_ROOM_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(SCHEND_ROOM_GALLERY).map(([k, v]) => [k, v[0]]),
);

/**
 * Restaurant: Innenraum, Terrasse, Theke, Saal — verschiedene Stimmungen
 * fuer die Magazin-Sektion + Marquee.
 */
export const SCHEND_RESTAURANT_GALLERY = [
  `${BASE}/04_gastro/b1_d1.jpg`,
  `${BASE}/04_gastro/b1_d2.jpg`,
  `${BASE}/04_gastro/b1_d3.jpg`,
  `${BASE}/04_gastro/b1_d4.jpg`,
  `${BASE}/04_gastro/b1_d5.jpg`,
];

export const SCHEND_RESTAURANT = SCHEND_RESTAURANT_GALLERY[0];

/**
 * Außenansichten / Haus-Atmosphäre
 */
export const SCHEND_HAUS_GALLERY = [
  `${BASE}/03_haus/b1_1.jpg`,
  `${BASE}/03_haus/b1_2.jpg`,
  `${BASE}/03_haus/b1_3.jpg`,
  `${BASE}/03_haus/b1_4.jpg`,
];

export const SCHEND_GALLERY = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `${BASE}/07_galerie/${n}.jpg`;
});

export const SCHEND_LOGO = `${BASE}/logo_hell_footer.png`;

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [photoForRoomType(type)];
