# SEO/GEO-Verifikation gegen Live — 2026-06-21 (Abend)

Lauf gegen **https://schend.conexadigital.eu** (claude-seo seo-schema + seo-geo).
Persistiert, weil der vorige Lauf mit `/clear` verloren ging. Funde noch NICHT
abgearbeitet (Eugen hat auf Domain-Umzug umgeschwenkt — später ergänzen).

> Hinweis: Alle @id/canonical zeigen korrekt auf `landhaus-schend.de` (Cutover-Ziel),
> nicht auf die Preview-Domain. Das ist Absicht, **kein Fehler**.

## P1 — Blocker
- **`/gastronomie/` → 404.** Echte Restaurant-Seite ist `/restaurant/`. Prüfen ob
  noch interne Links / Sitemap / Nav auf `/gastronomie/` zeigen (alte Seite hatte
  „GASTRONOMIE" im Menü → mögliche tote externe Links / Redirect anlegen).

## P2 — echte Schema-Fehler (würden Rich-Results-Validator failen)
- **Home · Hotel · checkinTime/checkoutTime:** `"T15:00"` / `"T11:00"` ist kein
  gültiges ISO-8601. → `"15:00"` / `"11:00"`.
- **Home · Hotel · starRating.additionalType:`"Superior"`** ist ungültig
  (erwartet URL). + `bestRating`/`worstRating` fehlen. → `additionalType` raus,
  „Superior" in `name`, `bestRating:"5"`/`worstRating:"1"` ergänzen.
- **Home · Review ×3 (Booking/Tripadvisor/HRS):** `author` = `Organization`
  (Google verlangt `Person`), `datePublished`+`reviewBody` fehlen. Das sind
  Plattform-Scores → korrekt als **EIN `AggregateRating`** abbilden statt 3 Reviews.
- **`/restaurant/` · Restaurant @id:** `…/restaurant#restaurant` (ohne Slash) vs.
  Canonical `…/restaurant/` und `hasMenu …/restaurant/#menu` (mit Slash). Hotel
  `containsPlace` referenziert die Slash-lose Variante → 2 IRIs für 1 Entität.
  → überall auf `…/restaurant/#restaurant` normalisieren.
- **`/en/restaurant/` (+fr/nl) · Restaurant @id pro Sprache** (`/en/restaurant/#restaurant`)
  erzeugt Duplikat-Entität. Physisches Restaurant = 1 Ding → über alle Sprachen
  denselben @id `…/restaurant/#restaurant`, `inLanguage` zum Unterscheiden.

## P3 — Kleinkram
- Home · Hotel potentialAction urlTemplate `…/anfrage` ohne Slash (Restaurant hat ihn).
- EntryPoint actionPlatform nutzt `http://schema.org/…` statt `https://`.
- inLanguage uneinheitlich (`de-DE` vs `en`) — auf eine Form vereinheitlichen.
- `/zimmer/` ItemList HotelRoom-Items ohne @id (Graph-Merge mit Detailseite verschenkt).
- `/pakete/` Product „Zimmer ohne Paket" ohne offers → minimal-Offer oder `@type: Service`.
- `/zimmer/doppelzimmer/` HotelRoom.url ohne Trailing-Slash.

## INFO
- FAQPage liefert seit 08/2023 keine Google-Rich-Results mehr (nur Gov/Health),
  aber valide + wertvoll für GEO/LLM-Zitate. Markup sauber. Kein Handlungsbedarf.

## Was sauber validiert
Hotel (address/geo/starRating/priceRange/telephone/image/amenities/checkin etc.),
Restaurant (servesCuisine/openingHours/acceptsReservations/hasMenu/ReserveAction),
BreadcrumbList überall, FAQPage-Q&A wohlgeformt, ImageGallery, TouristDestination,
AboutPage→#hotel/#organization, HotelRoom-Detail, Paket-Product mit Offer,
Organization.sameAs (FB/IG/Booking/Tripadvisor), `/anfrage/` korrekt noindex+schemafrei.

## GEO-Agent
Lief noch (fortsetzbar). Bei Wiederaufnahme: robots.txt/llms.txt-Tiefe,
Passage-Citability, hreflang über 4 Sprachen prüfen. robots.txt `Sitemap:`-Zeile
zeigt auf `landhaus-schend.de` (Cutover-konsistent).
