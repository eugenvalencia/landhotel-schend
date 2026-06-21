# Schend — SEO/GEO-Audit & Umsetzung (21.06.2026)

Mehr-Agenten-Audit über alle 11 Seitentypen × 4 Sprachen (de/en/fr/nl):
**85 Befunde** (25 high / 35 med / 25 low). Basis war bereits stark (SSG,
voll-reziprokes hreflang + x-default, og:locale-Alternates, geo-Tags, per-Seite
JSON-LD-Slot, llms.txt, robots). Dieser Lauf schließt die Struktur-Lücken.

## ✅ Umgesetzt (dieser Batch) — Schema-/Technik-Backbone

Neuer zentraler Helfer `site/lib/schema.ts` (`breadcrumbLd`, `homeCrumb`, `itemListLd`).

- **BreadcrumbList** auf allen bisher fehlenden Seiten ergänzt: About, FAQ,
  Galerie, Region, Restaurant, Zimmer-Liste, Pakete-Liste (Detailseiten hatten sie
  schon). → SERP-Breadcrumb-Pfad in allen 4 Sprachen.
- **Primär-Schema auf bisher schema-stummen Seiten:**
  - Zimmer-Liste: `ItemList` von `HotelRoom` mit `Offer` (echte `priceFrom`).
  - Pakete-Liste: `ItemList` mit `Product`/`Offer` (lowPrice aus „ab …€").
  - Galerie: `ImageGallery` mit `ImageObject` (lokalisierte Captions + Maße).
  - Region: `TouristDestination` mit `geo`, `containedInPlace` (Vulkaneifel) und
    10 benannten `TouristAttraction` (Maare, Eifelsteig, Nürburgring …) → GEO-Gold.
- **Pakete-Detail:** `Product` + `Offer` (Preis/Verfügbarkeit/seller→#hotel) je
  bepreistem Paket. → Preis-Rich-Results.
- **Home:** Hotel-Knoten um `makesOffer` (ab 57 €/Person) ergänzt — Preis maschinenlesbar.
- **Restaurant:** `@id` je Sprache eindeutig (DE byte-gleich zur Home-Referenz),
  `servesCuisine` je Sprache lokalisiert, `sameAs` (FB/Booking/Tripadvisor),
  `potentialAction` (ReserveAction → /anfrage).
- **About:** Schema verweist jetzt per `@id` auf den reichen zentralen
  `#hotel`/`#organization`-Graph statt magerer Inline-Org.
- **Anfrage (noindex):** `localized={false}` → kein hreflang-Cluster mehr auf der
  nicht-indexierbaren Seite (verschmutzte den Sprach-Cluster).
- **Zimmer-Detail:** Meta-Description ≤160 Zeichen (eindeutiger Auszug statt 300–389-Z.-Fließtext).
- **FAQ:** eigene `@id`/`url` (entkoppelt vom Home-FAQ-Auszug).
- **i18n-Reste:** deutsches „(dorps)gaststätte" im NL-Text → „dorpsherberg/herberg"
  (ueber-uns + FAQ). DE „Dorfgaststätte" bleibt (korrektes deutsches Wort).

Build: `astro check` 0 Fehler, alle Schemata im Output verifiziert.

## ⬜ Offen — content-schwer, braucht echtes Material/je-Sprache-Texte

Bewusst NICHT automatisch generiert (Anti-Halluzination — echte Fakten/Beimler nötig):

1. **Interne Hub-Spoke-Links (med, ~7 Seiten).** About/FAQ/Galerie/Region/Restaurant/
   Zimmer-/Pakete-Listen sind teils Linksackgassen. Kontextuelle Links mit
   beschreibendem Anker je Sprache ergänzen (z. B. „Eifeler Küche im Restaurant"
   → /restaurant). Reine Redaktionsarbeit × 4 Sprachen.
2. **Bild-Alt-Texte beschreibend statt Titel-gleich (med).** Pakete-/Zimmer-/Region-
   Hero- und Galerie-Bilder nutzen oft `alt = Titel/H2`. Pro Bild echten, lokalisierten
   Alt-Text pflegen (Motiv beschreiben). Großer redaktioneller Umfang.
3. **GEO-Q&A-Blöcke (med).** Pro Seitentyp (Region/Restaurant/Zimmer/Pakete/About)
   eine kurze faktische FAQ-Sektion (sichtbar + FAQPage-JSON-LD) — LLMs zitieren
   direkte Antwortsätze. NUR mit belegten Fakten; **FAQ „Saison"** braucht Beimlers
   echte Aussage (offener Mensch-Gate).
4. **Title-Kerne lokal schärfen (med/low).** Ort „Immerath" in mehrere Title-Kerne
   (Home/Zimmer-Liste/Region/FAQ); FR-About-Description >160 kürzen; Zimmer-Detail-
   Title „Landhaus Schend" doppelt entschlacken.
5. **Restaurant-Detail (med/low).** `hasMenu`, FAQ-Block, H1 je Sprache lokalisieren
   (FR/NL bleibt H1 deutsch).
6. **Zimmer-Detail `isPartOf` (high, aber unkritisch).** HotelRoom verweist per
   `@id` auf `#hotel` (nur auf Home definiert). In der Praxis lösen Suchmaschinen
   `@id` site-weit auf; sauberer wäre ein Hotel-Stub im selben `@graph`.
7. **Plattform-Reviews → `aggregateRating`** (statt anonymer Einzel-Reviews) — nur
   mit belegbarer `ratingCount`; Walter-UWG-Gate beachten.

Quelle: Audit-Workflow `schend-seo-geo-audit` (11 Agenten, 21.06.2026).
