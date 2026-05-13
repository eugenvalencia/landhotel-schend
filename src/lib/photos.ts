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

export const SCHEND_ROOM_PHOTO: Record<string, string> = {
  "Einzelzimmer":           `${BASE}/02_zimmer/b2_a_t.jpg`,
  "Doppelzimmer":           `${BASE}/02_zimmer/b1_1.jpg`,
  "Doppelzimmer Standard":  `${BASE}/02_zimmer/b1_1.jpg`,
  "Komfort":                `${BASE}/02_zimmer/b1_2.jpg`,
  "Doppelzimmer Komfort":   `${BASE}/02_zimmer/b1_2.jpg`,
  "Familie":                `${BASE}/02_zimmer/b1_3.jpg`,
  "Familienzimmer":         `${BASE}/02_zimmer/b1_3.jpg`,
  "Junior Suite":           `${BASE}/02_zimmer/b1_4.jpg`,
  "Suite":                  `${BASE}/02_zimmer/b1_5.jpg`,
  "Eifel-Suite":            `${BASE}/02_zimmer/b1_5.jpg`,
};

export const SCHEND_RESTAURANT = `${BASE}/04_gastro/b1_d1.jpg`;

export const SCHEND_GALLERY = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `${BASE}/07_galerie/${n}_t.jpg`;
});

export const SCHEND_LOGO = `${BASE}/logo_hell_footer.png`;

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];
