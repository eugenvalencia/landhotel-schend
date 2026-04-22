// Hero photos remain real Landhotel Schend images.
// All other images switched to curated Unsplash URLs that match each context.
// If any URL fails, <HotelImage> shows a navy "LS" placeholder.

export const SCHEND_HEROES = [
  "https://landhaus-schend.de/pics/01_startseite/b0_1.jpg",
  "https://landhaus-schend.de/pics/01_startseite/b0_2.jpg",
  "https://landhaus-schend.de/pics/01_startseite/b0_3.jpg",
];

export const SCHEND_ROOM_PHOTO: Record<string, string> = {
  "Einzelzimmer":           "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  "Doppelzimmer Standard":  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  "Doppelzimmer Komfort":   "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  "Familienzimmer":         "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
  "Junior Suite":           "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  "Suite":                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  "Eifel-Suite":            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
};

export const SCHEND_RESTAURANT =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80";

export const SCHEND_GALLERY = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80",
];

export const SCHEND_LOGO = "https://landhaus-schend.de/pics/logo_hell_footer.png";

export const photoForRoomType = (type: string): string =>
  SCHEND_ROOM_PHOTO[type] ?? SCHEND_HEROES[0];
