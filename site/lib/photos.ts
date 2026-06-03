// Bild-Registry — 1:1-Port aus src/lib/photos.ts. Alles self-hosted aus
// /public/fotos (SEO-Dateinamen, lokal optimiert). Framework-agnostisch
// (nur Strings) → von Astro-Seiten direkt nutzbar.

export const SCHEND_HEROES = [
  "/fotos/hotelfront-mit-rosen-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-im-sommer-mit-blumenkaesten-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-lichterketten-blaue-stunde-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelfassade-mit-terrasse-und-hortensien-landhotel-schend-vulkaneifel.jpg",
  "/fotos/gartenseite-mit-terrasse-landhotel-schend.jpg",
  "/fotos/hotelansicht-mit-terrasse-landhotel-schend.jpg",
];

const FAMILIENZIMMER_FOTOS = [
  "/fotos/familienzimmer-doppelbett-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-nebenraum-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-schlafbereich-landhotel-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-wohnbereich-mit-tv-landhotel-schend-vulkaneifel.jpg",
];

export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  "Einzelzimmer": ["/fotos/einzelzimmer-mit-bad-landhotel-schend-vulkaneifel.jpg"],
  "Doppelzimmer": [
    "/fotos/doppelzimmer-modern-mit-sofa-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-mit-holzbett-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
  "Doppelzimmer Standard": [
    "/fotos/doppelzimmer-modern-mit-sofa-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-bad-mit-ebenerdiger-dusche-landhotel-schend-vulkaneifel.jpg",
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
  ],
  "Eifel-Suite": [
    "/fotos/suite-mit-sitzecke-landhotel-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhotel-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhotel-schend-vulkaneifel.jpg",
  ],
};

export const SCHEND_ROOM_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(SCHEND_ROOM_GALLERY).map(([k, v]) => [k, v[0]]),
);

export const SCHEND_RESTAURANT_GALLERY = [
  "/fotos/restaurant-panorama-1-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-2-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-3-landhotel-schend.jpg",
  "/fotos/restaurant-panorama-4-landhotel-schend.jpg",
];

export const SCHEND_RESTAURANT = SCHEND_RESTAURANT_GALLERY[0];

export const SCHEND_HAUS_GALLERY = [
  "/fotos/hotelfassade-mit-garten-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hotelgarten-mit-brunnen-landhotel-schend.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhotel-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhotel-schend-vulkaneifel.jpg",
  "/fotos/sonnenterrasse-mit-hortensien-landhotel-schend-vulkaneifel.jpg",
  "/fotos/hoteleingang-mit-schneebaum-landhotel-schend-vulkaneifel.jpg",
];

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

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0]];
