// Echte Gästestimmen — KEINE erfundenen Zitate.
// Wörtlich übernommen aus den öffentlichen Bewertungsplattformen (Stand Juni 2026),
// attribuiert mit NUR Vornamen + Plattform + Jahr (Eugen-Direktive 21.06.,
// Persönlichkeitsrecht). Die volle,
// ungefilterte Bewertungsliste ist über die Plattform-Karten in derselben Sektion
// einen Klick entfernt (Booking.com / Tripadvisor / HRS / Google) — also keine
// irreführende Rosinen-Auswahl, sondern eine Auswahl mit Quelle.
//
// Quellen der hier zitierten Stimmen:
//   • Booking.com  — https://www.booking.com/reviews/de/hotel/landhaus-schend.de.html
//   • eifel.de     — https://www.eifel.de/go/unterkuenfte-kommentare/1151.html
//
// Verbatim-Texte bleiben im deutschen Original (Echtheit) — auch auf EN/FR/NL-Seiten.
// Vor echtem Go-Live: Beimler/Walter-Freigabe (Persönlichkeitsrecht/UWG).

export type GuestVoice = { text: string; name: string; source: string; year: string };

export const GUEST_VOICES: GuestVoice[] = [
  {
    text: "Sehr schönes und ruhig gelegenes Hotel. Das Zimmer war sehr sauber, das Personal immer freundlich, so soll es sein!",
    name: "Wolfgang",
    source: "Booking.com",
    year: "2026",
  },
  {
    text: "Super freundliche Gastgeber, das ganze Team war klasse. Schönes Frühstück, gutes Essen im Lokal.",
    name: "Marcel",
    source: "Booking.com",
    year: "2025",
  },
  {
    text: "Sehr sauber und sehr freundlich, man fühlt sich sehr wohl.",
    name: "Bärbel",
    source: "eifel.de",
    year: "2023",
  },
];
