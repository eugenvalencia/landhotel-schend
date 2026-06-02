// Bild-Registry — VOLLSTÄNDIG self-hosted aus public/fotos.
// Keine Cross-Origin-Abhängigkeit mehr von der alten landhaus-schend.de (/pics/*):
// die /pics-Zimmer-/Haus-/Logo-Pfade lieferten HTML (tot) und hingen an einer Seite,
// die abgelöst wird. Alle Pfade jetzt lokal (/fotos/...), SEO-Dateinamen, optimiert.

export const SCHEND_HEROES = [
  "/fotos/hotelfront-mit-rosen-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-im-sommer-mit-blumenkaesten-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-lichterketten-blaue-stunde-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfassade-mit-terrasse-und-hortensien-landhotel-schend-vulkaneifel.jpg",
  "/fotos/gartenseite-mit-terrasse-landhotel-schend.jpg",
  "/fotos/hotelansicht-mit-terrasse-landhotel-schend.jpg",
];

// Echte lokale Familienzimmer-Fotos (Doppelbett) — laut Eugen praktisch dasselbe
// Zimmer wie das Doppelzimmer, daher als dessen Galerie genutzt. Hauptbild zuerst.
const FAMILIENZIMMER_FOTOS = [
  "/fotos/familienzimmer-doppelbett-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-nebenraum-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-schlafbereich-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-wohnbereich-mit-tv-landhotel-schend-vulkaneifel.jpg",
];

/**
 * Pro Zimmer-Typ eine Galerie — alle self-hosted. Wo für einen Typ nur wenige echte
 * Fotos existieren, ergänzen verwandte Zimmer-Fotos (statt toter /pics-Links).
 */
export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  "Einzelzimmer": [
    "/fotos/einzelzimmer-mit-bad-landhotel-schend-vulkaneifel.jpg",
  ],
  "Doppelzimmer": [
    "/fotos/doppelzimmer-mit-holzbett-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
  "Doppelzimmer Standard": [
    "/fotos/doppelzimmer-mit-holzbett-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
  "Komfort": [
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-mit-holzbett-landhotel-schend-vulkaneifel.jpg",
  ],
  "Doppelzimmer Komfort": [
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-mit-holzbett-landhotel-schend-vulkaneifel.jpg",
  ],
  "Familie": FAMILIENZIMMER_FOTOS,
  "Familienzimmer": FAMILIENZIMMER_FOTOS,
  "Junior Suite": [
    "/fotos/suite-mit-sitzecke-landhotel-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
  ],
  "Suite": [
    "/fotos/suite-mit-sitzecke-landhotel-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
  "Eifel-Suite": [
    "/fotos/suite-mit-sitzecke-landhotel-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
};

/** Legacy-Map für Code-Pfade die nur EIN Foto pro Typ wollen (z.B. Booking-Karten). */
export const SCHEND_ROOM_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(SCHEND_ROOM_GALLERY).map(([k, v]) => [k, v[0]]),
);

/** Restaurant: self-hosted Panorama-Stimmungen. */
export const SCHEND_RESTAURANT_GALLERY = [
  "/fotos/restaurant-panorama-1-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-2-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-3-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-4-landhotel-schend.jpg",
];

export const SCHEND_RESTAURANT = SCHEND_RESTAURANT_GALLERY[0];

/** Außenansichten / Haus-Atmosphäre — self-hosted. */
export const SCHEND_HAUS_GALLERY = [
  "/fotos/hotelfassade-mit-garten-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelgarten-mit-brunnen-landhotel-schend.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhotel-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhotel-schend-vulkaneifel.jpg",
  "/fotos/sonnenterrasse-mit-hortensien-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hoteleingang-mit-schneebaum-landhotel-schend-vulkaneifel.jpg",
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

// Self-hosted SVG-Logo (das alte /pics/logo_hell_footer.png war tot).
export const SCHEND_LOGO = "/schend-logo-white.svg";

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [photoForRoomType(type)];
