// Real Landhotel Schend photos (served from landhaus-schend.de)
// If a URL fails, the <HotelImage> component falls back to a navy "LS" placeholder.

export const SCHEND_HEROES = [
  "https://landhaus-schend.de/pics/01_startseite/b0_1.jpg",
  "https://landhaus-schend.de/pics/01_startseite/b0_2.jpg",
  "https://landhaus-schend.de/pics/01_startseite/b0_3.jpg",
];

export const SCHEND_ROOM_PHOTO: Record<string, string> = {
  "Einzelzimmer": "https://landhaus-schend.de/pics/02_zimmer/b2_1_d.jpg",
  "Doppelzimmer Standard": "https://landhaus-schend.de/pics/02_zimmer/b2_2_d.jpg",
  "Doppelzimmer Komfort": "https://landhaus-schend.de/pics/02_zimmer/b2_1_d.jpg",
  "Familienzimmer": "https://landhaus-schend.de/pics/02_zimmer/b2_2_d.jpg",
  "Junior Suite": "https://landhaus-schend.de/pics/02_zimmer/b2_1_d.jpg",
  "Suite": "https://landhaus-schend.de/pics/02_zimmer/b2_2_d.jpg",
  "Eifel-Suite": "https://landhaus-schend.de/pics/02_zimmer/b2_2_d.jpg",
};

export const SCHEND_RESTAURANT = "https://landhaus-schend.de/pics/03_gastronomie/b3_1.jpg";

export const SCHEND_GALLERY = [
  "https://landhaus-schend.de/pics/06_galerie/b6_1.jpg",
  "https://landhaus-schend.de/pics/06_galerie/b6_2.jpg",
  "https://landhaus-schend.de/pics/06_galerie/b6_3.jpg",
  "https://landhaus-schend.de/pics/06_galerie/b6_4.jpg",
  "https://landhaus-schend.de/pics/06_galerie/b6_5.jpg",
  "https://landhaus-schend.de/pics/06_galerie/b6_6.jpg",
];

export const SCHEND_LOGO = "https://landhaus-schend.de/pics/logo_hell_footer.png";

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];
