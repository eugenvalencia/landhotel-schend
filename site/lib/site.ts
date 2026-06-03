// Zentrale, reale Stammdaten des Landhotel Schend (NAP + Nav).
// Single Source für Header/Footer/Layout — 1:1 aus der bestehenden App
// (index.html JSON-LD + SiteFooter/SiteHeader), damit nichts driftet.

export const ORIGIN = "https://landhaus-schend.de";
export const SITE_NAME = "Landhotel Schend";

export const HOTEL = {
  name: "Landhotel Schend",
  phoneLabel: "+49 6573 306",
  phoneHref: "tel:+4965731306",
  fax: "+49 6573 99815",
  email: "info@landhaus-schend.de",
  street: "Hauptstraße 9",
  zip: "54552",
  city: "Immerath",
  region: "Vulkaneifel",
} as const;

// Öffentliche Themen-Seiten als ECHTE URLs (DR-029 — eigene URL pro Thema,
// statt SPA-Anker). /zimmer, /pakete, /restaurant folgen in Stufe 2.
export const NAV = [
  { label: "Startseite", href: "/" },
  { label: "Zimmer", href: "/zimmer" },
  { label: "Pakete", href: "/pakete" },
  { label: "Gastronomie", href: "/restaurant" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "FAQ", href: "/faq" },
] as const;

export const LOCALES = ["de", "en", "fr", "nl"] as const;
