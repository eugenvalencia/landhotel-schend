# Auftragsverarbeitungsvertrag (AVV) — Landhaus Schend ↔ Conexa Digital

> **ENTWURF — Stand: Juni 2026.** Nach Art. 28 DSGVO, abgeleitet aus der Conexa-AVV-Vorlage
> (`conexa-os/docs/legal/avv-template.md`), aber **auf die tatsächlichen Datenflüsse von
> Landhaus Schend zugeschnitten** (keine generischen Module, die hier nicht laufen).
>
> **Vor Unterzeichnung zwingend zu erledigen (Walter / Eugen):**
> 1. ⬜ Echte Anschriften beider Parteien einsetzen (Hotel + Conexa Digital).
> 2. ⬜ Anwaltliche Prüfung (Vorlage orientiert sich an DSK-/GDD-Mustern, ersetzt keine Beratung).
> 3. ⬜ Supabase-Region bestätigen (Frankfurt / eu-central-1) — für § 5 Drittland-Bewertung.
> 4. ⬜ Resend: EU-Region + DPF-/SCC-Grundlage bestätigen (Sender `buchung@landhaus-schend.de`).
> 5. ⬜ Verweis-Anlage TOMs (`conexa-toms.md`) auf den Schend-Stack anpassen
>    (Schend läuft auf **Supabase + Cloudflare + Resend**, NICHT auf Hetzner — siehe Anlage-Hinweis unten).
>
> **Bewusst NICHT enthalten** (weil im Schend-Buchungspfad nicht eingesetzt — Prinzip „AVV spiegelt die Realität"):
> KI-/LLM-Verarbeitung (Anthropic/Claude/DeepSeek), n8n-Workflows, Partner-Empfehlungs-Tool,
> Audit-Crawls, Online-Zahlung. Die Buchungs-/Stornostrecke ist KI-frei (Resend-Direktversand).

---

## Präambel

Zwischen

**Landhaus Schend, Inhaber Eugen Beimler, [Anschrift einsetzen]**
(nachfolgend „Verantwortlicher" / „Auftraggeber")

und

**Conexa Digital, Inhaber Eugen Neifer, [Anschrift einsetzen]**
(nachfolgend „Auftragsverarbeiter" / „AV")

wird im Rahmen des zwischen den Parteien geschlossenen Hauptvertrages über die Erbringung
digitaler Website-, Buchungs- und Versand-Leistungen folgender Auftragsverarbeitungsvertrag
nach Art. 28 DSGVO geschlossen.

## § 1 Gegenstand und Dauer

(1) Der AV verarbeitet personenbezogene Daten (insbesondere Gäste-Daten des Hotels) ausschließlich
im Auftrag und nach Weisung des Verantwortlichen.

(2) **Gegenstand der Verarbeitung** für Landhaus Schend umfasst:
- Hosting und Auslieferung der Hotel-Website (`landhaus-schend.de`)
- Verarbeitung von Buchungs-Anfragen und -Bestätigungen über die Website (Buchungsformular)
- Buchungs- und Belegungsverwaltung im Hotel-Backoffice (Rezeptions-Dashboard: Zimmer,
  Buchungen, Stornierungen, Kalender)
- Versand transaktionaler E-Mails an Gast und Inhaber (Buchungs-, Bestätigungs- und
  Stornierungs-Benachrichtigung)

(3) Die Verarbeitung erfolgt **ohne KI-/LLM-Komponente** und **ohne Online-Zahlung**
(Zahlung erfolgt ausschließlich vor Ort im Hotel).

(4) Die Laufzeit entspricht der des Hauptvertrages.

## § 2 Art und Zweck der Verarbeitung

Die Verarbeitungen erfolgen ausschließlich zur Erfüllung des Hauptvertrages — Betrieb von
Website, Buchungssystem und transaktionalem E-Mail-Versand des Hotels. Eine Nutzung der
Gäste-Daten für eigene Zwecke des AV ist **ausgeschlossen**. Eine Profilbildung oder eine
KI-gestützte Auswertung von Gäste-Daten findet **nicht** statt.

## § 3 Art der Daten und Kategorien betroffener Personen

(1) **Datenkategorien:**
- Stammdaten der Gäste: Name, E-Mail-Adresse, Telefonnummer
- Buchungs-/Aufenthaltsdaten: Anreise, Abreise, Zimmer, Personenzahl, Sonderwünsche/Notizen,
  gebuchte Zusatzleistungen, Buchungsnummer, Buchungs-/Stornostatus
- Kommunikationsinhalte: Eingaben aus dem Buchungsformular, Stornierungsgrund (optional)
- Authentifizierungsdaten der Hotel-Mitarbeiter: gehashtes Passwort, Session-Token (Backoffice-Login)
- Technische Daten: gekürzte/anonymisierte Server-Log-Daten

> **Keine** Zahlungs-/Kreditkartendaten (keine Online-Zahlung). **Keine** besonderen
> Datenkategorien nach Art. 9 DSGVO.

(2) **Betroffene Personen:**
- Gäste und Interessenten des Verantwortlichen
- Mitarbeiter des Verantwortlichen (Backoffice-Login)

## § 4 Pflichten des Auftragsverarbeiters

(1) Der AV verarbeitet personenbezogene Daten **ausschließlich** nach dokumentierten Weisungen
des Verantwortlichen im Rahmen dieses Vertrages.

(2) Der AV gewährleistet **technische und organisatorische Maßnahmen (TOMs)** nach Art. 32 DSGVO —
siehe Anlage 1.

(3) Der AV unterstützt den Verantwortlichen bei der Erfüllung von Betroffenenrechten
(Art. 12–23 DSGVO) und Meldepflichten (Art. 33/34 DSGVO).

(4) Der AV verpflichtet alle mit den Daten befassten Personen zur Vertraulichkeit.

(5) Der AV unterstützt den Verantwortlichen bei Datenschutz-Folgenabschätzungen (Art. 35) und
Konsultationen mit der Aufsichtsbehörde (Art. 36), soweit erforderlich.

(6) Nach Beendigung der Verarbeitung löscht oder gibt der AV alle personenbezogenen Daten nach
Wahl des Verantwortlichen zurück, sofern keine gesetzliche Aufbewahrungspflicht (z. B.
steuerliche Aufbewahrung der Buchungs-/Rechnungsdaten) entgegensteht. Stornierte Buchungen
bleiben als Datensatz zu Steuer-/Nachweiszwecken erhalten (markiert als storniert), bis die
gesetzliche Aufbewahrungsfrist abläuft.

## § 5 Sub-Auftragsverarbeiter

(1) Der Verantwortliche erteilt dem AV eine **allgemeine schriftliche Zustimmung** zur
Beauftragung folgender Sub-Auftragsverarbeiter (Stand bei Vertragsschluss):

| Sub-AV | Zweck | Standort | DSGVO-Grundlage |
|--------|-------|----------|-----------------|
| Supabase Inc. | Datenbank, Authentifizierung, Edge Functions (Buchungs-Backend) | EU (Frankfurt, eu-central-1) — *zu bestätigen* | AVV (Art. 28) + EU-SCC |
| Cloudflare, Inc. | Website-Hosting (Pages), CDN, DDoS-/WAF-Schutz | global (USA-Firma) | DPF-zertifiziert + EU-SCC |
| Resend (Plus Five Five, Inc.) | Versand transaktionaler E-Mails (Buchung/Bestätigung/Storno) | EU-Region; Anbieter USA | DPF/EU-SCC — *zu bestätigen* |

(2) Der AV informiert den Verantwortlichen **mindestens 30 Tage im Voraus** über jede Änderung
der Sub-AV-Liste. Der Verantwortliche kann aus berechtigten datenschutzrechtlichen Gründen
widersprechen; in diesem Fall ist eine einvernehmliche Lösung zu suchen, ggf. mit
Sonderkündigungsrecht.

(3) Bei Sub-AVs mit Bezug zu einem Drittland (insbesondere die in den USA ansässigen Anbieter
Cloudflare und Resend) stützt sich der Datentransfer auf Art. 45 DSGVO (Angemessenheitsbeschluss
EU-US Data Privacy Framework, sofern der jeweilige Anbieter zertifiziert ist) und/oder
Art. 46 Abs. 2 lit. c DSGVO (EU-Standarddatenschutzklauseln).

## § 6 Kontrollrechte des Verantwortlichen

Der Verantwortliche hat das Recht, sich nach vorheriger Anmeldung von der Einhaltung der TOMs zu
überzeugen — durch Vorlage einer aktuellen TOMs-Dokumentation, schriftliche Selbstauskunft des AV
oder Inspektion vor Ort nach Terminvereinbarung (max. einmal pro Jahr, bei begründetem Anlass
häufiger). Die Kosten für Vor-Ort-Inspektionen trägt der Verantwortliche, sofern keine
wesentlichen Verstöße festgestellt werden.

## § 7 Meldepflichten / Datenpannen

(1) Der AV unterrichtet den Verantwortlichen **unverzüglich, spätestens innerhalb von 24 Stunden**
nach Bekanntwerden über jede Verletzung des Schutzes personenbezogener Daten i. S. v. Art. 33 DSGVO.

(2) Die Meldung enthält mindestens die in Art. 33 Abs. 3 DSGVO genannten Informationen.

## § 8 Vergütung

Die Vergütung des AV für die Auftragsverarbeitung ist in der Gesamtvergütung des Hauptvertrages
enthalten. Zusätzlicher Aufwand (z. B. aufwändige Auskunfts-/Löschungs-Anfragen einzelner
Betroffener) wird nach Aufwand abgerechnet.

## § 9 Haftung und Schlussbestimmungen

(1) Die Haftung der Parteien richtet sich nach Art. 82 DSGVO sowie den allgemeinen Regelungen des
Hauptvertrages.

(2) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.

(3) Änderungen und Ergänzungen bedürfen der Textform.

(4) Es gilt deutsches Recht.

---

**Anlagen:**

1. **TOMs — Technische und Organisatorische Maßnahmen** (Art. 32 DSGVO).
   Es gelten die Conexa-TOMs (`conexa-os/docs/legal/conexa-toms.md`) mit folgender
   **Schend-spezifischer Maßgabe:** Der Buchungs-/Website-Betrieb von Landhaus Schend läuft auf
   **Supabase** (Datenbank, Auth, Edge Functions; Verschlüsselung at-rest auf Postgres-Ebene,
   in-transit TLS 1.2+, Passwort-Hashing Argon2id), **Cloudflare Pages** (Website-Auslieferung,
   TLS, DDoS/WAF) und **Resend** (E-Mail-Versand). Die in den Conexa-TOMs beschriebene
   Hetzner-Eigenhosting-Schicht kommt für Schend **nicht** zur Anwendung; die übrigen
   organisatorischen Maßnahmen (Least-Privilege, 2FA, Audit-Log, Backups, Mandanten-Trennung via
   Row-Level-Security) gelten unverändert.
2. Beauftragte Module (Hauptvertrag): Website-Hosting, Buchungssystem, transaktionaler E-Mail-Versand.

---

*Entwurf-Stand: Juni 2026. Vor Unterzeichnung anwaltlich prüfen lassen und die oben markierten
offenen Punkte schließen.*

**Unterschriften:**

___________________________
Verantwortlicher — Landhaus Schend (Eugen Beimler)

___________________________
Auftragsverarbeiter — Conexa Digital (Eugen Neifer)
