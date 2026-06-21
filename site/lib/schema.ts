// Wiederverwendbare JSON-LD-Bausteine (SEO/GEO) — sprach-bewusst.
// Pfade werden über localizedPath in die echte Sprach-URL übersetzt, damit
// Breadcrumb-/ItemList-Links genau die kanonische (Trailing-Slash-)URL treffen.
import { localizedPath, type Locale } from "../i18n";

const HOME_LABEL: Record<Locale, string> = {
  de: "Startseite",
  en: "Home",
  fr: "Accueil",
  nl: "Home",
};

export type Crumb = { name: string; path: string };

/** Erster Breadcrumb-Eintrag (Startseite) je Sprache. */
export function homeCrumb(lang: Locale): Crumb {
  return { name: HOME_LABEL[lang], path: "/" };
}

/** BreadcrumbList aus {name, path}-Items (path = sprach-neutral, z.B. "/zimmer"). */
export function breadcrumbLd(origin: string, lang: Locale, items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${origin}${localizedPath(it.path, lang)}`,
    })),
  };
}

export type ListEntry = { url: string; name: string; item?: unknown };

/** ItemList — geordnete Liste (Listen-/Übersichtsseiten). */
export function itemListLd(entries: ListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: e.url,
      name: e.name,
      ...(e.item ? { item: e.item } : {}),
    })),
  };
}
