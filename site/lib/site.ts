// Zentrale, reale Stammdaten des Landhaus Schend (NAP + Nav).
// Single Source für Header/Footer/Layout — 1:1 aus der bestehenden App
// (index.html JSON-LD + SiteFooter/SiteHeader), damit nichts driftet.

export const ORIGIN = "https://landhaus-schend.de";
export const SITE_NAME = "Landhaus Schend";
// Sichtbarer Marken-Descriptor (Wortmarke-Subline, wie Logo „HOTEL | RESTAURANT").
export const SITE_DESCRIPTOR = "Hotel - Restaurant";
// Offizieller Name (mit Inhaber Beimler geklärt 15.06.) — Schema/legalName/Impressum.
export const LEGAL_NAME = "Landhaus Schend, Hotel - Restaurant";

// Social-Media-Profile (Footer-Icons). EINE Stelle zum Pflegen.
// Facebook: am 02.08.2026 auf Eugens Ansage auf das aktuell gepflegte Profil
// umgestellt (vorher „/Landhotel.Schend/").
// ⚠ Diese URL steht zusätzlich in den strukturierten Daten (`sameAs`) von
// HomePage.astro und RestaurantPage.astro. Wer nur hier ändert, hinterlässt
// dort einen Widerspruch — Google liest beide.
// Instagram = Platzhalter, bis der echte Handle feststeht.
export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=100008296860156",
  instagram: "https://www.instagram.com/landhaus_schend/",
} as const;

export const HOTEL = {
  name: "Landhaus Schend",
  phoneLabel: "+49 6573 306",
  phoneHref: "tel:+496573306",
  fax: "+49 6573 99815",
  email: "info@landhaus-schend.de",
  street: "Hauptstraße 9",
  zip: "54552",
  city: "Immerath",
  region: "Vulkaneifel",
} as const;

// Öffentliche Themen-Seiten als ECHTE URLs (DR-029 — eigene URL pro Thema,
// statt SPA-Anker). Menü-Reihenfolge wie auf der Original-Seite.
export const NAV = [
  { label: "Startseite", href: "/" },
  { label: "Zimmer", href: "/zimmer" },
  { label: "Pakete", href: "/pakete" },
  { label: "Gastronomie", href: "/restaurant" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Urlaubsregion", href: "/urlaubsregion" },
  { label: "Galerie", href: "/galerie" },
] as const;

export const LOCALES = ["de", "en", "fr", "nl"] as const;
