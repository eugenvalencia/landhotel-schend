# Weihnachtsgenuss 2026 — Plan (Auftrag Eugen, 18.10.2026)

Vorlage: die gedruckte Weihnachtskarte des Hauses (zwei Fotos, Eugen).
Anlass: **Weihnachtsfeier am Samstag, 26.12.2026 — nur nach vorheriger
Reservierung.** Firmen können andere Termine buchen.

Reihenfolge: **planen → Vorschau → Eugens Freigabe → erst dann live.**
Die Seite ist abgenommen; ohne Freigabe wird nichts ausgerollt.

## 1. Was entsteht

| Teil | Ort | Zweck |
|---|---|---|
| Weihnachtsseite | `site/pages/weihnachten.astro` + `components/pages/WeihnachtenPage.astro` | Menükarte, Termin, Reservierungsweg, Firmenfeiern |
| Hero-Einstieg | `components/pages/HomePage.astro` | ein einziges neues Element, Klick → Weihnachtsseite |
| Menü-Daten | `site/lib/weihnachten.ts` | Gänge + Preise an EINER Stelle (Single Source) |

## 2. Die Karte, wörtlich übernommen

**Für den genussvollen Auftakt**
- Festtagssuppe — Rinderkraftbrühe mit verschiedenen Klößchen und Gemüsestreifen · 7,00 €
- Salat vom Buffet · 5,00 €

**Menü 1 — Vegetarischer Weihnachtsgenuss** · 15,50 €
gebackener Camembert auf Apfelrotkohl, dazu Rosmarinkartoffeln und Preiselbeeren

**Menü 2 — Weihnachtlicher Klassiker** · 24,50 €
zarte Rinderroulade mit traditionellen Klößen und aromatischem Rotkohl

**Menü 3 — Knuspriger Festtagsgenuss** · 19,50 €
knusprig gebratenes Hähnchenschnitzel mit feiner Preiselbeersauce,
Buttergemüse und goldbraunen Herzoginkartoffeln

**Menü 4 — Festliches aus dem Wasser** · 26,00 €
auf der Haut gebratenes Zanderfilet serviert mit cremigem Rahmwirsing
und Butterkartoffeln

**Süßer Abschluss** — weihnachtlicher Dessertteller · 8,50 €

Begrüßungstext der Karte: *„Freuen Sie sich auf festliche Köstlichkeiten,
liebevoll zubereitet und serviert. Bei unseren Weihnachtsmenüs ist für jeden
Geschmack etwas dabei."* — wird übernommen, nicht umgeschrieben.

⚠ Die Gänge sind **einzeln bepreist** (kein Festpreis-Menü). Der Gast stellt
zusammen. Die Seite muss das zeigen, sonst entsteht ein falscher Preiseindruck.

## 3. Gestaltung — 5 Hebel, kein Kitsch

1. **Echtes Foto, kein Stock:** `festlich-gedeckte-tafel-im-saal-…` bzw. der
   Festsaal. Keine erfundenen Weihnachtsbilder, keine KI-Bilder.
2. **Ton:** tiefes Nachtgrün/Anthrazit als Hintergrund der Menükarte, Gold
   (`#e8c37a`, derselbe Goldton wie der Hero-Stern) als einziger Akzent.
   Die Marken-Variablen bleiben unberührt.
3. **Typografie trägt:** die Schreibschrift der gedruckten Karte wird durch
   die vorhandene `font-display-italic` aufgenommen — eine Familie, kein
   fünfter Font.
4. **Zwei nachgezeichnete Zeichen** aus der Karte: Glocken und Ilexzweig als
   SVG (getract, nicht als Bild eingebunden) — dezent, je einmal.
5. **Ruhe:** keine Schneeanimation, kein Blinken. Bewegung nur als weiches
   Aufblenden beim Scrollen, wie auf den übrigen Seiten.

Pflicht: Kontrast an den Bildpunkten messen (≥ 4,5:1), Tippziele ≥ 44 px,
`prefers-reduced-motion` respektiert, Handy zuerst.

## 4. Hero-Einstieg — zwei Wege zur Wahl

**A — Gold-Band über den Knöpfen** (Empfehlung)
Schmale Leiste: „Weihnachtsgenuss · Sa 26.12.2026 · Menükarte ansehen →".
Gold auf dunklem Grund, eine Zeile hoch. Fällt auf, weil sie allein steht,
und schiebt auf dem Handy die Telefonnummer nicht aus dem Bild.

**B — Dritter Knopf neben den beiden** (Eugens Vorschlag)
Gleiche Form wie „Jetzt anfragen", in Gold. Auf dem Rechner gut; auf dem
Handy stehen die Knöpfe untereinander — drei Blöcke plus Telefonzeile
drücken den Abschluss unter die Kante. Messbar, nicht vermutet: wird vor
der Freigabe auf 390 × 844 px nachgewiesen.

## 5. Recht (Walter ist nicht da — ich prüfe mit Fable 5.1)

- Preise sind **Endpreise inkl. MwSt.** — PAngV, muss dastehen.
- Satz zu Allergenen/Zusatzstoffen: Auskunft beim Servicepersonal (LMIV).
- **Keine** Verfügbarkeits- oder Buchungszusage. Die Seite nimmt **Anfragen**
  entgegen — es gibt kein Buchungssystem.
- Reservierungsschluss und Mindestpersonenzahl nur nennen, wenn Eugen sie
  bestätigt. Erfundene Fristen sind irreführend.

## 6. Sprachen

Zuerst **nur Deutsch** — wie die Dauerseiten (`localized={false}`, also kein
hreflang, keine toten Sprachlinks). EN/FR/NL folgen nach Freigabe der
deutschen Fassung, falls gewünscht.

## 7. Reihenfolge der Arbeit

1. Menü-Daten + Seite bauen, `npm run build` grün
2. Hero-Einstieg in der gewählten Form
3. Vorschau: gebaute Seite lokal, Bilder vom Handy- und Rechnerformat an Eugen
4. Kontrast, Tippziele, Rechtshinweise nachmessen und belegen
5. **Freigabe abwarten** → `git push origin main` löst den Live-Deploy aus
6. Nach dem 26.12.: Hero-Einstieg wieder entfernen (Termin in den Kalender)

## 8. Offen — geht an Eugen (Auswahlbox)

1. Hero: Gold-Band (A) oder dritter Knopf (B)
2. Preise vollständig zeigen oder nicht
3. Reservierungsweg + Reservierungsschluss
4. Firmen-Weihnachtsfeiern: wie prominent

---

# Nachtrag 18.10.2026 — gebaut, gemessen, Vorschau steht

**Vorschau A (Goldband):** https://vorschau-weihnachten.landhotel-schend.pages.dev/
**Vorschau B (dritter Knopf):** https://vorschau-weihnachten-b.landhotel-schend.pages.dev/
Die Weihnachtsseite selbst ist in beiden identisch: `/weihnachten/`.
Zwei eigene Pages-Zweige. **Live ist unberührt:** `landhaus-schend.de/weihnachten/`
gibt 404, die Live-Startseite nennt den Weihnachts-Einstieg nirgends (gemessen
mit `curl`, nicht angenommen).

## Was entstanden ist

| Datei | Inhalt |
|---|---|
| `site/lib/weihnachten.ts` | Karte + Termin + Schalter für den Hero-Einstieg |
| `site/components/pages/WeihnachtenPage.astro` | die Seite |
| `site/pages/weihnachten.astro` | Adresse `/weihnachten/` |
| `site/components/pages/HomePage.astro` | Hero-Einstieg, **nur auf Deutsch** |

## Gemessen, nicht vermutet

- `npm run build` grün, 95 Seiten, `/weihnachten/` in der Sitemap.
- Kein hreflang auf der Seite (richtig: sie gibt es nur auf Deutsch), der
  Sprachumschalter führt auf die jeweilige Sprach-Startseite statt ins Leere.
- Kontrast gegen die hellste Stelle des Verlaufs: Überschrift 17,7:1,
  Unterzeile 17,7:1, Goldzeile 10,5:1, Knopftext auf Gold 10,6:1 — Grenze 4,5:1.
- Tippziele: alle Knöpfe ≥ 56 px. Drei freistehende Verweise am Seitenende
  lagen bei 19 px und stehen jetzt auf 44 px.
- Drei JSON-LD-Blöcke lesen sauber: BreadcrumbList, FoodEvent, FAQPage.
  Die Preise im Schema kommen aus derselben Datei wie die sichtbare Karte
  (7 · 5 · 15,50 · 24,50 · 19,50 · 26 · 8,50).
- Kein Querlauf bei 390 px. Hell UND dunkel angesehen, beide tragen.
- **Korrektur meiner eigenen Behauptung:** Ich hatte in der Auswahlbox
  geschrieben, Variante B (dritter Knopf) drücke die Telefonnummer auf dem
  Handy unter die Kante. Nachgemessen stimmt das nicht: bei 390 × 844 px ist
  sie in **beiden** Varianten sichtbar (Unterkante 826 px), bei 360 × 640 px
  in **beiden** nicht (775 px). Der Platz entscheidet also nicht.

## Was offen bleibt

1. **Hero-Variante** — A (Goldband, trägt das Datum) oder B (dritter Knopf).
2. **Reservierungsschluss** — steht bewusst nirgends, bis Eugen ihn nennt.
3. **Uhrzeit der Feier** — ebenfalls nirgends genannt, weil unbekannt.
4. **Sprachen** — vorerst nur Deutsch.
5. **Nach dem 26.12.** — `HERO_EINSTIEG` in `site/lib/weihnachten.ts` auf
   `"aus"` stellen. Gehört in den Kalender.
