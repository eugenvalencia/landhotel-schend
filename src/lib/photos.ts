// Bilder vom Original-Server des Landhotel Schend (Domain bleibt landhaus-schend.de).
// Cross-Origin auch in PROD: CF Pages hat keinen Reverse-Proxy für /pics/*,
// der SPA-Fallback in _redirects würde sonst alle Pics-Pfade auf index.html umlenken
// und HotelImage fiele auf den Unsplash-Default zurück.
// landhaus-schend.de liefert `Access-Control-Allow-Origin: *`, also OK.
// TODO: nach IONOS→Hetzner-Cutover BASE auf Hetzner-Pics-Endpoint umstellen.
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
// Echte lokale Zimmer-Fotos (self-hosted). Die Server-/pics-Zimmerbilder existieren
// nicht mehr (liefern HTML). Stammen vom Familienzimmer — laut Eugen praktisch dasselbe
// Zimmer wie das Doppelzimmer (Doppelbett), daher fuer beide Typen genutzt. Hauptbild zuerst.
const ECHTE_ZIMMER_FOTOS = [
  "/fotos/familienzimmer-doppelbett-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-nebenraum-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-schlafbereich-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-wohnbereich-mit-tv-landhotel-schend-vulkaneifel.jpg",
];

export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  "Einzelzimmer": [
    `${BASE}/02_zimmer/b2_a.jpg`,
    `${BASE}/02_zimmer/b2_b.jpg`,
    `${BASE}/02_zimmer/b2_c.jpg`,
    `${BASE}/02_zimmer/b2_d.jpg`,
  ],
  "Doppelzimmer": ECHTE_ZIMMER_FOTOS,
  "Doppelzimmer Standard": ECHTE_ZIMMER_FOTOS,
  "Komfort": ECHTE_ZIMMER_FOTOS,
  "Doppelzimmer Komfort": ECHTE_ZIMMER_FOTOS,
  "Familie": ECHTE_ZIMMER_FOTOS,
  "Familienzimmer": ECHTE_ZIMMER_FOTOS,
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
// Self-hosted (lokal optimiert aus dem Original-Server, b1_d5 war tot/HTML).
export const SCHEND_RESTAURANT_GALLERY = [
  "/fotos/restaurant-panorama-1-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-2-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-3-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-4-landhotel-schend.jpg",
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

// Self-hosted (lokal optimiert aus 07_galerie, SEO-Dateinamen, Reihenfolge erhalten).
export const SCHEND_GALLERY = [
  "/fotos/hotelgarten-mit-brunnen-landhotel-schend.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhotel-schend-vulkaneifel.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhotel-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhotel-schend-vulkaneifel.jpg",
  "/fotos/landhaus-schend-schriftzug-fassade-landhotel-schend.jpg",
  "/fotos/winterlicher-innenhof-landhotel-schend.jpg",
  "/fotos/gartenseite-mit-terrasse-landhotel-schend.jpg",
  "/fotos/weihnachtsstimmung-im-schnee-landhotel-schend.jpg",
  "/fotos/fassade-mit-hotelschild-landhotel-schend.jpg",
  "/fotos/dorfansicht-immerath-landhotel-schend.jpg",
  "/fotos/radfahrer-am-radweg-landhotel-schend-vulkaneifel.jpg",
  "/fotos/wanderer-am-eifelmaar-landhotel-schend-vulkaneifel.jpg",
];

export const SCHEND_LOGO = `${BASE}/logo_hell_footer.png`;

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [photoForRoomType(type)];
