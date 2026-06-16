// Bild-Registry — VOLLSTÄNDIG self-hosted aus public/fotos.
// Keine Cross-Origin-Abhängigkeit mehr von der alten landhaus-schend.de (/pics/*):
// die /pics-Zimmer-/Haus-/Logo-Pfade lieferten HTML (tot) und hingen an einer Seite,
// die abgelöst wird. Alle Pfade jetzt lokal (/fotos/...), SEO-Dateinamen, optimiert.

export const SCHEND_HEROES = [
  "/fotos/hotelfront-mit-rosen-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-im-sommer-mit-blumenkaesten-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-lichterketten-blaue-stunde-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfassade-mit-terrasse-und-hortensien-landhaus-schend-vulkaneifel.jpg",
  "/fotos/gartenseite-mit-terrasse-landhaus-schend.jpg",
  "/fotos/hotelansicht-mit-terrasse-landhaus-schend.jpg",
];

// Echte lokale Familienzimmer-Fotos (Doppelbett) — laut Eugen praktisch dasselbe
// Zimmer wie das Doppelzimmer, daher als dessen Galerie genutzt. Hauptbild zuerst.
const FAMILIENZIMMER_FOTOS = [
  "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg",
];

// Doppelzimmer-Galerie. Neue Profi-Fotos (Schend 11.06.2026) zuerst — helles
// Komfort-Zimmer → Landhaus-Klassiker → Eingang → modernes Bad —, dann die bisherigen.
const DOPPELZIMMER_FOTOS = [
  "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-doppelbett-und-kleiderschrank-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-eingang-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-dusche-waschbecken-und-wc-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-balkon-gelb-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-renoviert-mit-holzboden-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-modern-mit-holzboden-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-sofa-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhaus-schend-vulkaneifel.jpg",
];

// Komfort-Variante — moderne Profi-Zimmer + Bad zuerst.
const DOPPELZIMMER_KOMFORT_FOTOS = [
  "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg",
  "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-holzbett-landhaus-schend-vulkaneifel.jpg",
];

/**
 * Pro Zimmer-Typ eine Galerie — alle self-hosted. Wo für einen Typ nur wenige echte
 * Fotos existieren, ergänzen verwandte Zimmer-Fotos (statt toter /pics-Links).
 */
export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  "Doppelzimmer": DOPPELZIMMER_FOTOS,
  "Doppelzimmer Standard": DOPPELZIMMER_FOTOS,
  "Komfort": DOPPELZIMMER_KOMFORT_FOTOS,
  "Doppelzimmer Komfort": DOPPELZIMMER_KOMFORT_FOTOS,
  "Familie": FAMILIENZIMMER_FOTOS,
  "Familienzimmer": FAMILIENZIMMER_FOTOS,
  "Junior Suite": [
    "/fotos/suite-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
  ],
  "Suite": [
    "/fotos/suite-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
  ],
  "Eifel-Suite": [
    "/fotos/suite-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
  ],
};

/** Legacy-Map für Code-Pfade die nur EIN Foto pro Typ wollen (z.B. Booking-Karten). */
export const SCHEND_ROOM_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(SCHEND_ROOM_GALLERY).map(([k, v]) => [k, v[0]]),
);

/** Restaurant: self-hosted Panorama-Stimmungen. */
export const SCHEND_RESTAURANT_GALLERY = [
  "/fotos/restaurant-panorama-1-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-2-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-3-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-4-landhaus-schend.jpg",
];

export const SCHEND_RESTAURANT = SCHEND_RESTAURANT_GALLERY[0];

/** Außenansichten / Haus-Atmosphäre — self-hosted. */
export const SCHEND_HAUS_GALLERY = [
  "/fotos/hotelfassade-mit-garten-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelgarten-mit-brunnen-landhaus-schend.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhaus-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhaus-schend-vulkaneifel.jpg",
  "/fotos/sonnenterrasse-mit-hortensien-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hoteleingang-mit-schneebaum-landhaus-schend-vulkaneifel.jpg",
];

// Self-hosted (lokal optimiert aus 07_galerie, SEO-Dateinamen, Reihenfolge erhalten).
export const SCHEND_GALLERY = [
  "/fotos/hotelgarten-mit-brunnen-landhaus-schend.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhaus-schend-vulkaneifel.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhaus-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhaus-schend-vulkaneifel.jpg",
  "/fotos/landhaus-schend-schriftzug-fassade-landhaus-schend.jpg",
  "/fotos/winterlicher-innenhof-landhaus-schend.jpg",
  "/fotos/gartenseite-mit-terrasse-landhaus-schend.jpg",
  "/fotos/weihnachtsstimmung-im-schnee-landhaus-schend.jpg",
  "/fotos/fassade-mit-hotelschild-landhaus-schend.jpg",
  "/fotos/dorfansicht-immerath-landhaus-schend.jpg",
  "/fotos/radfahrer-am-radweg-landhaus-schend-vulkaneifel.jpg",
  "/fotos/wanderer-am-eifelmaar-landhaus-schend-vulkaneifel.jpg",
];

// Self-hosted SVG-Logo (das alte /pics/logo_hell_footer.png war tot).
export const SCHEND_LOGO = "/schend-logo-white.svg";

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [photoForRoomType(type)];
