# Walter — Rechts-Memo Schend-Site (21.06.2026)

> Legal-Einschätzung, intern. Kein Ersatz für anwaltliche Endfreigabe vor dem
> echten Go-Live auf `landhaus-schend.de`. Bezug: Eugen-Auftrag „Punkt 2 —
> Resend-EU belegen + UWG-Freigabe ‚Nr. 1 in Immerath'".

## 1. UWG — „Nr. 1 in Immerath laut Tripadvisor" → ENTFERNT (erledigt)

**Befund.** Tripadvisor listet das Landhaus Schend als **„#1 of 1 B&Bs / Inns in
Immerath"** (Stand 06/2026, 4,0/5, 25 Bewertungen). Die Spitzenstellung besteht
also nur, weil das Haus in dieser Kategorie das **einzige** gelistete Objekt am
Ort ist.

**Bewertung (UWG §5 Irreführung / Spitzenstellungswerbung).** „Nr. 1"-Aussagen
sind nur zulässig bei einem **deutlichen, dauerhaften Vorsprung in einem realen
Wettbewerbsumfeld**. Bei „#1 von 1" fehlt jeder Wettbewerb — der
Durchschnittsverbraucher versteht „Nr. 1 in Immerath" aber als Vorsprung vor
mehreren Mitbewerbern. Eine **Alleinstellung als Spitzenstellung** darzustellen
ist irreführend; die Quellenangabe „laut Tripadvisor" heilt das nicht, weil sie
den Bezugspunkt („von 1") gerade verschweigt. **Risiko: Abmahnung durch
Mitbewerber/Wettbewerbsverband.**

**Maßnahme (umgesetzt).** Alle 8 Vorkommen (DE/EN/FR/NL, Hero-Zeile +
Tripadvisor-Karte) durch **reine, verifizierbare Fakten** ersetzt:
- Hero-Zeile: „Booking.com 8,7 · **4,0/5 auf Tripadvisor**"
- Tripadvisor-Karte: „**Sehr gut bewertet**" (Score 4,0/5 steht ohnehin auf der Karte)

**Empfehlung.** Bei der reinen Score-Darstellung bleiben — kein Superlativ.
Falls später echtes Material vorliegt (z. B. „bestbewertetes Hotel im Umkreis X km
laut Plattform Y, Stand Datum" **mit** archiviertem Beleg und realem Vergleichsfeld),
kann eine vorsichtige Spitzenstellung wieder geprüft werden. *Das ist meine
Empfehlung. Du entscheidest.*

## 2. Resend-EU-Region + AVV (Go-Live-Gate, dokumentiert)

Anfrage-PII (Name/Adresse/E-Mail/Tel.) läuft beim Versand über Resend.
Vor dem echten Go-Live zwingend:
1. Sende-Domain in Resend in der **EU-Region (`eu-west-1`, Irland)** anlegen —
   Region ist pro Domain fix.
2. **DPA/AVV** mit Resend ablegen (`resend.com/legal/dpa`); Eintrag im
   AVV-Anhang (`docs/legal/avv-schend.md`) gegen die reale Region prüfen.
3. Beleg (Region-Screenshot + DPA-Status) zu den Go-Live-Akten.

Schritt-für-Schritt + Einordnung: `docs/SECURITY-NEXT-STEPS.md` Punkt 2.
Solange `INQUIRY_FROM = onboarding@resend.dev` (Testmodus, nur an Konto-Mail),
verlässt **keine** echte Gast-PII das Konto Richtung Hotel — der EU-Region-Beleg
ist erst zum Domain-Cutover scharf, muss aber **vor** dem ersten echten
Gast-Versand stehen.

## 3. Offen — vor Go-Live menschlich zu klären

- **Gästestimmen (neu 21.06.).** 3 echte, wörtliche Bewertungen (Booking.com/
  eifel.de) sind jetzt sichtbar, attribuiert wie öffentlich angezeigt (Vorname +
  Plattform + Jahr), mit Link zur vollen Liste → keine irreführende Auswahl.
  **Persönlichkeitsrecht/Datenschutz:** öffentlich publizierte Reviews mit
  Vornamen-Attribution sind branchenüblich und vertretbar; **Beimler sollte die
  Verwendung kurz bestätigen** (ideal: kein voller Klarname → Anzeige „H. P. Klein"
  ggf. auf Vorname kürzen). Quelle ist im Code dokumentiert
  (`site/lib/guest-voices.ts`). **Bewusst NICHT** als Review-JSON-LD ausgezeichnet
  (Google verbietet Fremdplattform-Reviews als eigene Rich-Snippets).
- **Booking-Score 8,7.** Web-Stichprobe zeigte teils **8,6** (289 Bewertungen).
  Differenz 0,1 — Scores driften. **Vor Go-Live den Live-Wert auf Booking.com
  prüfen** und auf der Seite (Plattform-Karte + Hero-Zeile) angleichen.
- **DEHOGA-/Klassifizierungs-Aussagen** (3-Sterne-Superior etc.) wie gehabt nur
  mit gültigem Zertifikat — separat im 14.06.-Review behandelt.
