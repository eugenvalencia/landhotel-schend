// Geteilte UI-Strings für die Chrome (Header, Footer, StickyCTA, Layout).
// `de` = EXAKT der aktuelle deutsche Text → deutsche Ausgabe bleibt unverändert.
// Seiten-Inhalte (Home, Zimmer, …) liegen in eigenen Content-Modulen, nicht hier.
import type { Locale } from "./index";

type L = Record<Locale, string>;

export const UI = {
  // — Navigation —
  nav_home: { de: "Startseite", en: "Home", fr: "Accueil", nl: "Home" },
  nav_rooms: { de: "Zimmer", en: "Rooms", fr: "Chambres", nl: "Kamers" },
  nav_pakete: { de: "Pakete", en: "Packages", fr: "Forfaits", nl: "Arrangementen" },
  nav_dining: { de: "Gastronomie", en: "Dining", fr: "Restaurant", nl: "Restaurant" },
  nav_about: { de: "Über uns", en: "About us", fr: "À propos", nl: "Over ons" },
  nav_region: { de: "Urlaubsregion", en: "The region", fr: "La région", nl: "De regio" },
  nav_gallery: { de: "Galerie", en: "Gallery", fr: "Galerie", nl: "Galerij" },
  nav_main_aria: { de: "Hauptnavigation", en: "Main navigation", fr: "Navigation principale", nl: "Hoofdnavigatie" },

  // — CTAs —
  cta_inquire: { de: "Anfragen", en: "Enquire", fr: "Demander", nl: "Aanvragen" },
  cta_call: { de: "Anrufen", en: "Call", fr: "Appeler", nl: "Bellen" },

  // — Header —
  brand_home_aria: { de: "Landhaus Schend — Startseite", en: "Landhaus Schend — Home", fr: "Landhaus Schend — Accueil", nl: "Landhaus Schend — Home" },
  call_hotel_aria: { de: "Hotel anrufen", en: "Call the hotel", fr: "Appeler l’hôtel", nl: "Het hotel bellen" },
  menu_open: { de: "Menü öffnen", en: "Open menu", fr: "Ouvrir le menu", nl: "Menu openen" },
  menu_close: { de: "Menü schließen", en: "Close menu", fr: "Fermer le menu", nl: "Menu sluiten" },
  theme_toggle: { de: "Hell-/Dunkelmodus umschalten", en: "Toggle light / dark mode", fr: "Basculer mode clair / sombre", nl: "Licht / donker wisselen" },
  theme_dark: { de: "Dunkelmodus", en: "Dark mode", fr: "Mode sombre", nl: "Donkere modus" },
  theme_light: { de: "Hellmodus", en: "Light mode", fr: "Mode clair", nl: "Lichte modus" },
  phone_subtitle: { de: "Direkt anrufen — wir sind für Sie da", en: "Call us directly — we’re here for you", fr: "Appelez-nous directement — nous sommes là pour vous", nl: "Bel ons direct — we zijn er voor u" },
  lang_label: { de: "Sprache", en: "Language", fr: "Langue", nl: "Taal" },

  // — Footer —
  footer_tagline: {
    de: "Ihr Familienhotel in der Vulkaneifel — herzlich geführt von Familie Beimler, mit hauseigener Eifeler Landküche, ideal für Ihren Kurzurlaub.",
    en: "Your family-run hotel in the Volcanic Eifel — warmly led by the Beimler family, with our own Eifel country kitchen, ideal for your short break.",
    fr: "Votre hôtel familial dans l’Eifel volcanique — tenu avec cœur par la famille Beimler, avec sa cuisine régionale de l’Eifel, idéal pour un court séjour.",
    nl: "Uw familiehotel in de Vulkaaneifel — met hart geleid door familie Beimler, met een eigen Eifeler streekkeuken, ideaal voor uw korte vakantie.",
  },
  footer_quicklinks: { de: "Quick Links", en: "Quick links", fr: "Liens rapides", nl: "Snelkoppelingen" },
  footer_ql_inquire: { de: "Zimmer anfragen", en: "Enquire about rooms", fr: "Demander une chambre", nl: "Kamer aanvragen" },
  footer_ql_faq: { de: "Häufige Fragen", en: "FAQ", fr: "Questions fréquentes", nl: "Veelgestelde vragen" },
  footer_contact: { de: "Kontakt", en: "Contact", fr: "Contact", nl: "Contact" },
  footer_legal_aria: { de: "Rechtliches", en: "Legal", fr: "Mentions légales", nl: "Juridisch" },
  footer_fb_aria: { de: "Landhaus Schend auf Facebook", en: "Landhaus Schend on Facebook", fr: "Landhaus Schend sur Facebook", nl: "Landhaus Schend op Facebook" },
  footer_ig_aria: { de: "Landhaus Schend auf Instagram", en: "Landhaus Schend on Instagram", fr: "Landhaus Schend sur Instagram", nl: "Landhaus Schend op Instagram" },

  // — Rechtstexte (Footer-Labels; Slugs bleiben gleich) —
  legal_imprint: { de: "Impressum", en: "Legal notice", fr: "Mentions légales", nl: "Colofon" },
  legal_privacy: { de: "Datenschutz", en: "Privacy", fr: "Confidentialité", nl: "Privacy" },
  legal_terms: { de: "AGB", en: "Terms", fr: "CGV", nl: "Voorwaarden" },
  legal_a11y: { de: "Barrierefreiheit", en: "Accessibility", fr: "Accessibilité", nl: "Toegankelijkheid" },
  legal_credits: { de: "Bildnachweis", en: "Image credits", fr: "Crédits photos", nl: "Fotoverantwoording" },

  // — StickyCTA —
  sticky_region_aria: { de: "Schnellaktion Anruf und Buchung", en: "Quick action: call and booking", fr: "Action rapide : appel et réservation", nl: "Snelactie: bellen en boeken" },
  sticky_call_aria: { de: "Hotel anrufen unter", en: "Call the hotel at", fr: "Appeler l’hôtel au", nl: "Bel het hotel op" },
  sticky_inquire_aria: { de: "Unverbindlich anfragen", en: "Make a non-binding enquiry", fr: "Demande sans engagement", nl: "Vrijblijvend aanvragen" },
  sticky_inquire_free_aria: { de: "Unverbindlich anfragen — provisionsfrei", en: "Make a non-binding enquiry — commission-free", fr: "Demande sans engagement — sans commission", nl: "Vrijblijvend aanvragen — provisievrij" },

  // — Allgemein —
  skip_to_content: { de: "Zum Inhalt springen", en: "Skip to content", fr: "Aller au contenu", nl: "Naar de inhoud" },
} satisfies Record<string, L>;

export type UIKey = keyof typeof UI;

/** Übersetzten Chrome-String holen (Fallback auf Deutsch). */
export function t(key: UIKey, locale: Locale): string {
  const entry = UI[key];
  return entry[locale] ?? entry.de;
}
