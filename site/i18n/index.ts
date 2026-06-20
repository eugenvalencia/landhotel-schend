// Zentrale i18n-Schicht der Astro-Site.
// Echte Sprachpfade (SITE-COMPLIANCE § A0): DE = Root ("/zimmer"),
// EN/FR/NL = präfixiert ("/en/zimmer", "/fr/zimmer", "/nl/zimmer").
// Inhalt steht jeweils statisch im HTML — kein clientseitiges Umschalten.

export const LOCALES = ["de", "en", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";

// Anzeige im Sprach-Umschalter.
export const LOCALE_LABEL: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  nl: "Nederlands",
};
export const LOCALE_SHORT: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  fr: "FR",
  nl: "NL",
};
// <html lang> + hreflang-Code je Locale.
export const LOCALE_BCP47: Record<Locale, string> = {
  de: "de",
  en: "en",
  fr: "fr",
  nl: "nl",
};

function isLocale(seg: string | undefined): seg is Locale {
  return !!seg && (LOCALES as readonly string[]).includes(seg);
}

/** Normalisiert auf führenden Slash, ohne abschließenden Slash (außer Root). */
function clean(path: string): string {
  const p = "/" + String(path).replace(/^\/+/, "").replace(/\/+$/, "");
  return p === "/" ? "/" : p;
}

/**
 * Pfad einer (sprach-neutralen, deutschen) Route in einer Ziel-Locale.
 * DE bleibt unpräfixiert; sonst wird "/<locale>" vorangestellt.
 *   localizedPath("/zimmer", "en") -> "/en/zimmer"
 *   localizedPath("/", "fr")       -> "/fr"
 *   localizedPath("/zimmer", "de") -> "/zimmer"
 */
export function localizedPath(path: string, locale: Locale): string {
  const c = clean(path);
  if (locale === DEFAULT_LOCALE) return c;
  return c === "/" ? `/${locale}` : `/${locale}${c}`;
}

/** Liest die aktive Locale aus einem Pfad ("/en/zimmer" -> "en"). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/**
 * Entfernt das Locale-Präfix und liefert den sprach-neutralen (deutschen)
 * Basis-Pfad zurück ("/en/zimmer" -> "/zimmer", "/fr" -> "/").
 * Grundlage für den Sprach-Umschalter (gleiche Seite, andere Sprache).
 */
export function basePath(pathname: string): string {
  const segs = pathname.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
  if (isLocale(segs[0]) && segs[0] !== DEFAULT_LOCALE) {
    const rest = segs.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  const rest = segs.join("/");
  return rest ? `/${rest}` : "/";
}

/**
 * Alle hreflang-Alternates für eine Seite (voll-reziprok + x-default).
 * `origin` = absolute Basis (z. B. ORIGIN), `path` = sprach-neutraler Pfad.
 */
export function hreflangAlternates(
  origin: string,
  path: string,
): { hreflang: string; href: string }[] {
  const base = basePath(path);
  const list = LOCALES.map((loc) => ({
    hreflang: LOCALE_BCP47[loc],
    href: origin + localizedPath(base, loc),
  }));
  // x-default zeigt auf die Standardsprache (DE).
  list.push({ hreflang: "x-default", href: origin + localizedPath(base, DEFAULT_LOCALE) });
  return list;
}
