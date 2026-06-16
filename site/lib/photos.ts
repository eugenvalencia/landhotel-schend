// Bild-Registry — 1:1-Port aus src/lib/photos.ts. Alles self-hosted aus
// /public/fotos (SEO-Dateinamen, lokal optimiert). Framework-agnostisch
// (nur Strings) → von Astro-Seiten direkt nutzbar.

export const SCHEND_HEROES = [
  "/fotos/hotelfront-mit-rosen-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-blumenbeet-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-im-sommer-mit-blumenkaesten-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfront-mit-lichterketten-blaue-stunde-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelfassade-mit-terrasse-und-hortensien-landhaus-schend-vulkaneifel.jpg",
  "/fotos/gartenseite-mit-terrasse-landhaus-schend.jpg",
  "/fotos/hotelansicht-mit-terrasse-landhaus-schend.jpg",
];

const FAMILIENZIMMER_FOTOS = [
  "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-mit-kinderbetten-und-bad-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-schlafbereich-landhaus-schend-vulkaneifel.jpg",
  "/fotos/familienzimmer-wohnbereich-mit-tv-landhaus-schend-vulkaneifel.jpg",
];

// Doppelzimmer-Galerie. Reihenfolge: neue Profi-Fotos (Schend 11.06.2026) zuerst —
// helles Komfort-Zimmer → Landhaus-Klassiker → Eingang → modernes Bad —, danach die
// bisherigen echten Aufnahmen.
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

// Komfort-Variante — die beiden modernen Profi-Zimmer + Bad zuerst.
const DOPPELZIMMER_KOMFORT_FOTOS = [
  "/fotos/doppelzimmer-komfort-mit-sofa-und-holzlamellenwand-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-komfort-mit-doppelbett-und-holzboden-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-rundspiegel-landhaus-schend-vulkaneifel.jpg",
  "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-mit-holzbett-landhaus-schend-vulkaneifel.jpg",
  "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-led-rundspiegel-landhaus-schend-vulkaneifel.jpg",
];

export const SCHEND_ROOM_GALLERY: Record<string, string[]> = {
  // Echte Doppelzimmer-Fotos. Reihenfolge: neue Profi-Aufnahmen zuerst (siehe Consts oben).
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
  ],
  "Eifel-Suite": [
    "/fotos/suite-mit-sitzecke-landhaus-schend-vulkaneifel.jpg",
    "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
    "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
  ],
};

export const SCHEND_ROOM_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(SCHEND_ROOM_GALLERY).map(([k, v]) => [k, v[0]]),
);

export const SCHEND_RESTAURANT_GALLERY = [
  // Neue helle Speisesaal-Aufnahme (Schend 14.06.2026) als Leitbild zuerst.
  "/fotos/restaurant-speisesaal-mit-buffet-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-1-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-2-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-3-landhaus-schend.jpg",
  "/fotos/restaurant-panorama-4-landhaus-schend.jpg",
  "/fotos/eifeler-spezialitaet-gebratene-kloesse-in-rahmsauce-landhaus-schend.jpg",
];

export const SCHEND_RESTAURANT = SCHEND_RESTAURANT_GALLERY[0];

export const SCHEND_HAUS_GALLERY = [
  "/fotos/hotelfassade-mit-garten-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hotelgarten-mit-brunnen-landhaus-schend.jpg",
  "/fotos/eingang-mit-torbogen-und-hortensien-landhaus-schend.jpg",
  "/fotos/innenhof-mit-balkonen-landhaus-schend-vulkaneifel.jpg",
  "/fotos/sonnenterrasse-mit-hortensien-landhaus-schend-vulkaneifel.jpg",
  "/fotos/hoteleingang-mit-schneebaum-landhaus-schend-vulkaneifel.jpg",
];

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

export const galleryForRoomType = (type: string): string[] =>
  SCHEND_ROOM_GALLERY[type] ?? [SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0]];
