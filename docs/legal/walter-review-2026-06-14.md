# Rechts-Vollprüfung Website Landhaus Schend

**Prüfer:** Walter (Legal/Compliance, Conexa Digital) — KI-Jurist, Fokus deutsches Recht
**Datum:** 2026-06-14
**Mandant:** Eugen Beimler (Inhaber Landhaus Schend), via Eugen Neifer (Conexa Digital)
**Auftrag:** Vollprüfung „von A bis Z" mit dem Ziel: keine Abmahn-Angriffsfläche.
**Live-Domain:** landhaus-schend.de · Vorschau: schend.conexadigital.eu

> 🤖 KI-generierte Rechtsanalyse, vom Team von Conexa Digital. **Dies ersetzt keine Rechtsberatung durch einen zugelassenen Rechtsanwalt.** Die mit „MENSCH-ANWALT" markierten Punkte (Abschnitt 9) brauchen vor Go-Live eine menschliche Freigabe.

---

## 0. Architektur-Hinweis (wichtig für die Umsetzung)

Die Website besteht aus **zwei** technischen Schichten unter derselben Domain:

| Schicht | Pfade | Quelle |
|---|---|---|
| **Astro (öffentlich, SSG)** = die eigentliche Gäste-Website | `/`, `/zimmer`, `/restaurant`, `/impressum`, `/datenschutz`, `/agb`, `/barrierefreiheit`, `/faq` … | `site/` |
| **React-SPA (`/_saas/`)** = Buchung + Dashboard | `/booking`, `/login`, `/dashboard`, `/operator`, `/confirmation/*` | `src/` |

**Konsequenz für jede Text-Korrektur:** Die Rechtstexte existieren **dreifach** — `site/pages/*.astro` (LIVE), `src/pages/*.tsx` (im SPA gerendert) und `docs/legal/*.md/.html/.pdf` (Quell-Archiv). Eine Änderung muss in **allen** gepflegt werden, sonst driftet es. Die Astro-Fassung ist die maßgebliche Live-Fassung.

---

## 1. Executive Summary — Gesamt-Risikobild

Die Seite ist **technisch datenschutzfreundlich gebaut** (kein Google-Analytics, keine Tracking-Cookies, Fonts self-hosted, Google-Maps nur per 2-Klick) — das ist die halbe Miete und nimmt die häufigsten Abmahn-Anlässe von vornherein weg. Es gibt aber **mehrere konkrete Abmahn-Risiken**, vor allem zwei harte (Impressum-Gesetzesstand + Datenschutz-Transparenz beim Buchungs-Datenfluss) und einige UWG-Punkte.

### Top-Risiken (priorisiert)

| # | Befund | Gesetz | Risiko |
|---|---|---|---|
| **H1** | Impressum nennt **§ 5 TMG** (seit 14.05.2024 abgelöst durch **§ 5 DDG**) | DDG | **HOCH** — Klassiker für Abmahnungen |
| **H2** | Datenschutz nennt für die Buchung **nur Supabase** — tatsächlich fließen die Gäste-Daten zusätzlich an **n8n (Conexa, Hetzner)**, werden dort **per KI (Anthropic) qualifiziert**, und es geht eine Mail über **Resend** raus. Weder n8n/Conexa als Buchungs-Verarbeiter, noch Resend, noch die KI-Qualifizierung sind transparent gemacht. | Art. 13, 28 DSGVO | **HOCH** |
| **H3** | Buchungsformular hat **keinen Datenschutz-Hinweis / kein Pflichtfeld-Häkchen / keinen Link zur Datenschutzerklärung** am Absende-Punkt | Art. 13 DSGVO | **HOCH** |
| **M1** | Datenschutz nennt für die Karte **OpenStreetMap** — eingebunden ist tatsächlich **Google Maps** (per 2-Klick). Falsche Angabe. | Art. 13 DSGVO | **MITTEL** |
| **M2** | „Cookie-Banner" (nur im React-SPA, nicht auf der Astro-Seite) ist **funktionslos/irreführend**: Button „Alle auswählen", obwohl es nichts einzuwilligen gibt; setzt nur seinen eigenen Schlüssel. | § 25 TDDDG / UWG (Dark-Pattern) | **MITTEL** |
| **M3** | § 9 Datenschutz behauptet „**keine automatisierte Entscheidungsfindung**" — gleichzeitig qualifiziert eine KI die Anfrage. Wording-Konflikt. | Art. 22 DSGVO | **MITTEL** |
| **M4** | UWG-Claims: „**Tripadvisor Nr. 1**" / „Nr. 1 in Immerath", „**Bestpreis**", Footer-Sammel-Rating „**4,3 Ø · 277 Bewertungen**" (Mischung zweier Portale) | § 5 UWG | **MITTEL** |
| **M5** | „**3-Sterne-Superior**" / Schema `starRating: 3 Superior` — DEHOGA-Klassifizierung muss gültig/aktuell sein | § 5 UWG | **MITTEL** |
| **N1** | Datenschutz erwähnt **Auth-Session / Kundenkonto / Mehrsprachigkeit (DE/EN/FR/NL)** — auf der öffentlichen Astro-Seite gibt es kein Login und nur DE. Beschreibt Dinge, die (öffentlich) nicht existieren. | Art. 13 (Überbestimmtheit) | **NIEDRIG** |
| **N2** | Footer „**Powered by CONEXA DIGITAL**" mit Logo+Link — rechtlich zulässig, aber Stealth-SaaS-Konflikt | — (UWG nein) | **NIEDRIG** |
| **N3** | Barrierefreiheits-Seite enthält **Selbstverpflichtungen** (jährliche Prüfung, 10-Werktage-Antwort), die eingehalten werden müssen | BFSG | **NIEDRIG** |

**Positiv vorab festgehalten (keine Abmahngefahr):**
- Kein Google Analytics / gtag / Tag Manager / Facebook-Pixel / Hotjar / Matomo (im Build verifiziert).
- Fonts **self-hosted** (kein Google-Fonts-CDN → kein IP-Leak, das ist DER aktuelle Abmahn-Klassiker, und er ist hier vermieden).
- Google-Maps lädt **erst nach Klick** (2-Klick-Lösung) → ohne Zustimmung keine IP an Google.
- **Kein** Link zur abgeschalteten EU-OS-/ODR-Plattform (seit 20.07.2025 ein Abmahn-Anlass) — korrekt entfernt.
- **Keine** Online-Zahlung (kein Stripe/PayPal/Kreditkarte) — Datenschutz/AGB enthalten konsequent keinen Zahlungsdienstleister. Korrekt.
- Pflicht-Verbraucherhinweis nach § 36 VSBG vorhanden und richtig formuliert.

---

## 2. Impressum (`site/pages/impressum.astro`)

### IST-Zustand
- Z. 13: `<h2>Angaben gemäß § 5 TMG</h2>`
- Z. 15-20: Eugen Beimler, Landhaus Schend, Hauptstraße 9, 54552 Immerath, Deutschland
- Z. 26-28: Tel `+49 6573 306`, Fax `+49 6573 99815`, E-Mail `info@landhaus-schend.de`
- Z. 35-36: USt-ID `DE322739324`
- Z. 42: Aufsichtsbehörde „Verbandsgemeindeverwaltung Daun"
- Z. 46: Verantwortlich nach **§ 18 Abs. 2 MStV**
- Z. 57-58: § 36 VSBG — keine Teilnahme an Streitbeilegung (korrekt)
- Z. 65-66: Haftung „gemäß § 7 Abs. 1 TMG … §§ 8 bis 10 TMG"

### Befund + Gesetz
1. **§ 5 TMG ist veraltet (HOCH, H1).** Seit 14.05.2024 gilt das **Digitale-Dienste-Gesetz (DDG)**; die Impressumspflicht steht jetzt in **§ 5 DDG**. Auch die Haftungs-Paragraphen §§ 7, 8-10 TMG sind ins DDG gewandert (§§ 7, 8-10 DDG; teils Verweis auf DSA). Veraltete Gesetzeszitate sind ein dokumentierter Abmahn-Anlass.
2. **Aufsichtsbehörde (Z. 40-43):** Für einen Beherbergungs-/Gastronomiebetrieb ist die Angabe einer „Aufsichtsbehörde" nur Pflicht, wenn die Tätigkeit einer **Zulassung** bedarf (§ 5 Abs. 1 Nr. 3 DDG). Gaststätten-/Beherbergungsgewerbe ist erlaubnis-/anzeigepflichtig nach GastG bzw. landesrechtlich → die Angabe ist zulässig und eher schützend. Die zuständige Behörde sollte aber faktisch stimmen (Gaststättenerlaubnis läuft i. d. R. über die Verbandsgemeinde/Kreisverwaltung). **MENSCH-ANWALT bzw. Mandant bestätigt die korrekte Behörde.**
3. **§ 18 Abs. 2 MStV (Z. 46):** Nur nötig, wenn **journalistisch-redaktionelle Inhalte** anboten werden. Ein Hotel mit Marketing-Texten fällt i. d. R. NICHT darunter. Die Angabe schadet nicht, ist aber überflüssig. Belassen ist unkritisch.
4. **Fax in der Haftungswelt:** unkritisch.
5. **USt-ID:** vorhanden und plausibel formatiert (DE + 9 Ziffern). **Nicht erfinden — Mandant hat sie geliefert, bleibt unverändert.**

### Korrektur-Neutext (einsetzbar)

Ersetze Z. 13:
```astro
<h2>Angaben gemäß § 5 DDG</h2>
```

Ersetze den Haftungs-Block (Z. 63-74) durch:
```astro
<section>
  <h2>Haftung für Inhalte</h2>
  <p>
    Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
    den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
    jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
    oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
    allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
    ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
    entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
  </p>
</section>
```

**Optional** (Klarstellung Behörde), falls Gaststättenerlaubnis über die Kreisverwaltung läuft — vom Mandanten bestätigen lassen:
```astro
<section>
  <h2>Aufsichtsbehörde</h2>
  <p>Zuständige Behörde für die Gaststättenerlaubnis:<br />
  Kreisverwaltung Vulkaneifel, Mainzer Straße 25, 54550 Daun</p>
</section>
```

→ **Gleiche § 5 TMG → § 5 DDG-Korrektur auch in `src/pages/Impressum.tsx` (Z. 21, 75-76) und `docs/legal/impressum.md` (Z. 3, 38).**

---

## 3. Datenschutzerklärung (`site/pages/datenschutz.astro`)

Die Erklärung ist umfangreich und in weiten Teilen sauber (Verantwortlicher, Betroffenenrechte, Aufsichtsbehörde RLP, Rechtsgrundlagen, Speicherdauern). Es gibt aber **Abweichungen zwischen dem, was beschrieben ist, und dem, was technisch passiert** — und das ist das eigentliche Datenschutz-Risiko, weil Transparenzpflicht (Art. 13) Wahrheit verlangt.

### IST vs. WIRKLICHKEIT — die kritischen Lücken

**a) Buchungs-Datenfluss zu kurz beschrieben (HOCH, H2)**
- Datenschutz Z. 276: „**Empfänger:** Supabase … als Auftragsverarbeiter." — das ist unvollständig.
- Tatsächlicher Fluss (verifiziert in `supabase/functions/notify-schend/index.ts`): Nach dem Speichern in Supabase geht die Buchung **(1)** an einen **n8n-Webhook `n8n.conexadigital.eu`** (Z. 14, 60-67) — betrieben von Conexa auf Hetzner — wo sie laut Code-Kommentar „**n8n qualifiziert + benachrichtigt den Inhaber**" und „**Owner-Qualifikation via Claude**" (Z. 2-3, 203). **(2)** Es geht eine Bestätigungs-Mail an den Gast über **Resend** (`api.resend.com`, Z. 81-100), eine US-Firma.
- **An den Gast übermittelt werden** (n8n-Payload, Z. 164-184): Name, E-Mail, Telefon, An-/Abreise, Zimmer, Extras, Freitext-Notizen, Gesamtpreis. Das ist ein **voller personenbezogener Datensatz**, der an Conexa/Hetzner **und** Resend geht — beide fehlen in der Buchungs-Empfängerliste.

**b) Karte falsch deklariert (MITTEL, M1)**
- Datenschutz Z. 142-148 (§ 6 e): „Karten … über **OpenStreetMap**".
- Eingebunden ist tatsächlich **Google Maps** (`LocationSection.astro` Z. 11 `MAP_SRC = google.com/maps?...output=embed`, Z. 146-154 lädt einen Google-`iframe`). Immerhin per 2-Klick → ohne Klick keine Datenübertragung. Aber die Deklaration nennt den falschen Anbieter und verschweigt den USA-Transfer von Google.

**c) KI-Qualifizierung der Buchung nicht abgedeckt + Widerspruch zu § 9 (MITTEL, M3)**
- § 6 g (Z. 197-208) beschreibt KI nur für **Content-Generierung** („Heute gut für…"-Tipps), ausdrücklich „**keine personenbezogenen Gäste-Daten**".
- Tatsächlich qualifiziert Claude die **eingehende Buchung** (also sehr wohl Gäste-Daten). § 9 (Z. 309-314) sagt zugleich „keine automatisierte Entscheidungsfindung". Das ist konsistent zu halten: KI darf assistieren, die **Entscheidung trifft ein Mensch** — genau das muss dann auch so beschrieben sein.

**d) Überbestimmte Beschreibungen (NIEDRIG, N1)**
- Z. 224-231 / 287-294: „Auth-Session", „Kundenkonto", „Sprach-/Theme-Präferenz DE/EN/FR/NL". Auf der **öffentlichen Astro-Seite** gibt es kein Login (nur im versteckten SaaS-Dashboard) und derzeit nur **Deutsch** (Header: EN/FR/NL „bald"). Eine Datenschutzerklärung darf Dinge nennen, die im Hintergrund existieren — aber sie sollte nicht Funktionen behaupten, die der Besucher gar nicht erreicht. **Stealth-Konflikt:** Login/Konto verweist faktisch auf die SaaS-Schicht.

**e) Cookie-Consent-Status-Cookie beschrieben, aber auf der Astro-Seite nicht vorhanden**
- Z. 219-222 nennt `schend_cookie_consent_v1`. Dieser Schlüssel wird **nur im React-SPA** (`src/components/CookieBanner.tsx`) gesetzt, **nicht** auf der öffentlichen Astro-Seite. Beschreibt also (für den öffentlichen Besucher) etwas Nicht-Existentes.

### Lösung des Stealth-↔-Transparenz-Konflikts

DSGVO verlangt **neutrale Nennung der Dienstleister** (Name + Rolle + Land + Rechtsgrundlage). Sie verlangt **nicht**, dass man das eigene Produkt/die SaaS bewirbt. Lösung: Conexa als **technischer Auftragsverarbeiter (Hosting/Tooling)** neutral nennen — ohne „SaaS-Plattform für Hotels" o. Ä. Das erfüllt Art. 13, ohne das Geheimnis zu lüften. **Conexa Digital steht ohnehin bereits in der Erklärung** (§ 6 a, f, g) — die SaaS-Story ist dort nicht erzählt, das ist der richtige Ton; er muss nur auf den Buchungs- und Resend-Pfad erweitert werden.

### Korrektur-Neutexte (einsetzbar)

**(c1) § 6 e — Karte ehrlich auf Google Maps umstellen** (ersetzt Z. 142-148):
```astro
<h3>e) Karten-Darstellung — Google Maps</h3>
<p>
  Zur Anfahrt-Darstellung binden wir <strong>Google Maps</strong> ein (Anbieter:
  Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; Mutterkonzern
  Google LLC, USA). Die Karte wird <strong>erst nach Ihrem ausdrücklichen Klick</strong>
  („Karte laden") geladen — vorher werden keine Daten an Google übertragen. Mit dem Laden
  werden u.&nbsp;a. Ihre IP-Adresse und das Nutzungsverhalten an Google übermittelt, auch
  in die USA. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Klick).
  Den USA-Transfer stützt Google auf den EU-US Data Privacy Framework bzw. EU-Standard­vertrags­klauseln.
  Sie können die Karte auch ungenutzt lassen — die vollständige Adresse steht als Text daneben.
</p>
```

**(c2) § 7 „Zimmer-Anfrage / Booking-Formular" — Empfängerliste vervollständigen** (ersetzt den `<strong>Empfänger:</strong>`-Satz, Z. 276):
```astro
<strong>Empfänger / Auftragsverarbeiter:</strong>
<ul>
  <li><strong>Supabase Inc.</strong> — Datenbank-Hosting (Server-Region Frankfurt/Deutschland), siehe Ziffer 6 b.</li>
  <li><strong>Conexa Digital</strong> (Inhaber Eugen Neifer) — technische Verarbeitung und Weiterleitung der Anfrage an unsere Rezeption; betrieben auf Server-Infrastruktur der <strong>Hetzner Online GmbH</strong> (Standort Deutschland) als Sub-Auftragsverarbeiter. Zur Vorsortierung eingehender Anfragen (z.&nbsp;B. Sprache, Vollständigkeit) wird ein KI-System (Anthropic, EU-Region) unterstützend eingesetzt; die <strong>Entscheidung über Ihre Buchung trifft ausschließlich ein Mensch</strong> (keine automatisierte Entscheidung i.&nbsp;S.&nbsp;v. Art. 22 DSGVO).</li>
  <li><strong>Resend</strong> (Resend Inc., USA; Versand über EU-Region) — Versand der Bestätigungs-E-Mail an Sie. Übermittelt werden Ihre E-Mail-Adresse und die Eckdaten Ihrer Anfrage. USA-Transfer gestützt auf EU-Standard­vertrags­klauseln.</li>
</ul>
<p>Mit allen genannten Dienstleistern bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO. Eine Weitergabe an sonstige Dritte erfolgt nicht.</p>
```

**(c3) § 6 g — KI-Absatz präzisieren** (Ergänzung am Ende von Z. 208):
```astro
<p class="mt-3">
  Daneben kann ein KI-System eingehende <em>Buchungs-Anfragen</em> technisch vorsortieren
  (z.&nbsp;B. nach Sprache und Vollständigkeit), um die Bearbeitung durch unsere Rezeption zu
  beschleunigen. Eine automatisierte Entscheidung mit rechtlicher Wirkung findet dabei nicht
  statt — über Annahme oder Ablehnung Ihrer Anfrage entscheidet stets ein Mensch.
</p>
```

**(c4) § 9 — Wording entschärfen** (ersetzt Z. 310-313):
```astro
<p>
  Eine ausschließlich automatisierte Entscheidung im Sinne von Art. 22 DSGVO (Entscheidung
  ohne menschliches Zutun mit rechtlicher Wirkung Ihnen gegenüber) findet nicht statt.
  Soweit KI-Systeme eingesetzt werden (siehe Ziffer 6 g), geschieht dies rein unterstützend;
  die abschließende Entscheidung trifft immer eine natürliche Person.
</p>
```

**(c5) § 7 Cookies — Consent-Cookie ehrlich beschreiben** (ersetzt Z. 219-222, da auf der öffentlichen Seite KEIN Cookie-Banner läuft — siehe Abschnitt 4):
```astro
<li>
  <strong>Theme-Präferenz</strong> (<code>theme</code>, localStorage) — speichert, ob Sie die
  Seite hell oder dunkel anzeigen. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG (technisch
  erforderlich für die von Ihnen gewählte Darstellung).
</li>
<li>
  <strong>Barrierefreiheits-Komfort</strong> (<code>schend_a11y_v1</code>, localStorage) —
  speichert Ihre Einstellungen zu Schriftgröße, Kontrast und reduzierter Bewegung.
  Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.
</li>
<li>
  <strong>Start-Animation</strong> (<code>schend_splash_done</code>, sessionStorage) — merkt
  sich für die Dauer Ihres Besuchs, dass die Begrüßungs-Animation bereits gezeigt wurde.
  Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.
</li>
```
(Die Punkte „Cookie-Consent-Status" und „Auth-Session" hier streichen, solange auf der öffentlichen Seite weder ein Consent-Banner noch ein Login existiert. Falls das Login öffentlich kommt, wieder aufnehmen.)

**(d) Open-Meteo:** bereits korrekt deklariert (§ 6 d) — keine Änderung nötig.

---

## 4. Cookies / Consent — Verdikt

### IST-Zustand
- **Öffentliche Astro-Seite:** **kein** Cookie-Banner (im gesamten `site/` und `dist-astro/` kein Consent-UI; nur die Datenschutz-Seite erwähnt einen). Gesetzt werden ausschließlich: `theme` (localStorage), `schend_a11y_v1` (localStorage), `schend_splash_done` (sessionStorage). Alle drei sind **funktional notwendig** für vom Nutzer gewählte Darstellung → kein Consent erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
- **React-SPA (`/booking` etc.):** zeigt einen `CookieBanner.tsx`, der **funktionslos** ist — er setzt nur `schend_cookie_consent_v1` und hat einen roten Button **„Alle auswählen"**, obwohl es gar keine einwilligungspflichtigen Cookies/Tracker gibt.

### Verdikt: **Es ist KEIN Cookie-Banner nötig** — und der vorhandene (im SPA) sollte ENTFERNT werden.

**Begründung:** Es laufen keine Analyse-, Marketing- oder Drittanbieter-Tracking-Technologien (im Build verifiziert: kein GA/gtag/Pixel/Hotjar/Matomo). Für rein technisch notwendige localStorage-Einträge braucht es nach § 25 Abs. 2 TDDDG **keine** Einwilligung. Ein Banner, der suggeriert man würde Cookies setzen und „Alle auswählen" anbietet, ist nicht nur überflüssig, sondern **selbst ein Risiko**:
- **Irreführung/Dark-Pattern (UWG, M2):** „Alle auswählen" ohne echte Wahl, ohne gleichwertigen „Ablehnen"-Button — genau das Muster, das Verbraucherschützer und Aufsichtsbehörden aktuell angreifen.
- **Selbstwiderspruch:** Der Banner behauptet eine Datenverarbeitung, die gar nicht stattfindet.

**To-do:** `CookieBanner` aus `src/App.tsx` entfernen (Import + Verwendung) und `src/components/CookieBanner.tsx` löschen. Die Google-Maps-2-Klick-Einwilligung bleibt davon unberührt (die ist die korrekte, einzelfallbezogene Einwilligung).

> **Wenn** später doch Tracking (z. B. GA4 — laut Memory bereitgelegt) eingebaut wird: dann ist ein **echtes** Consent-Banner mit gleichwertigem „Ablehnen", granularer Wahl und vorab-blockiertem Skript Pflicht. Bis dahin: kein Banner.

---

## 5. AGB (`site/pages/agb.astro`) — Empfehlung: schlank BEHALTEN

### Rechtlicher Rahmen
AGB sind in Deutschland **nicht gesetzlich vorgeschrieben** (anders als Impressum + Datenschutz). Für ein Hotel **ohne Online-Zahlung** sind sie **optional**. Es findet kein zahlungspflichtiger Online-Vertragsschluss statt → es gibt **keine** Pflicht zu Widerrufs-/Button-Lösung-/Verbraucher-Informationen nach §§ 312i ff. BGB für einen E-Commerce-Bestellprozess (den gibt es hier gar nicht — die Buchung ist eine unverbindliche Anfrage).

### Trade-off (ehrlich)
- **AGB entfernen:** Dann gilt für Storno/No-Show/verspätete Abreise das **dispositive Gesetzesrecht**. Bei No-Show kann der Hotelier die Vergütung abzüglich ersparter Aufwendungen verlangen (§ 537 BGB analog / BGH-Rechtsprechung zum Beherbergungsvertrag, üblich ~80-90 % bei Zimmer, ~30-40 % mit Verpflegung) — aber das ist **im Streit schwerer durchzusetzen** und für den Gast intransparent. Vorteil: keine AGB = keine fehlerhafte Klausel, die abgemahnt werden kann.
- **AGB behalten:** Klare, kommunizierte Stornostaffel + Check-in/out-Zeiten + Haftung. Schützt den Betrieb. Nachteil: AGB-Klauseln können bei Verstoß gegen §§ 305 ff. BGB **selbst** Abmahn-/Unwirksamkeits-Ziel sein.

### Meine Empfehlung: **schlank behalten** — der Schutz bei Storno/No-Show überwiegt; es genügt, drei AGB-Risiken zu entschärfen.

### Risikoklauseln in der aktuellen Fassung
1. **§ 3 Abs. 4 (Z. 76-81)** nennt „Kreditkartengarantie" als mögliche Sicherheit. Das ist **nicht** dasselbe wie eine Online-Zahlung und damit zulässig — **aber** es kann mit dem Versprechen „keine Kreditkartendaten nötig" (Buchungsformular) kollidieren. Klarstellen oder streichen, um Widerspruch zu vermeiden.
2. **§ 4 Storno (Z. 105-110):** Staffel ist branchenüblich und durch den Nachweis-Vorbehalt (Abs. 4) AGB-fest gestaltet. **Belassen.** (Gut: „bis 14 Tage kostenfrei" ist gästefreundlich.)
3. **§ 8 Hausordnung (Z. 165-170):** dynamischer Verweis auf „jeweils aktuelle Hausordnung" — bei Verbrauchern grenzwertig (§ 308 Nr. 4 / § 307 BGB), weil einseitig änderbar. Entschärfen: die wesentlichen Punkte (Nachtruhe, Rauchverbot) direkt nennen, statt nur zu verweisen — ist bereits halb geschehen.
4. **§ 2 Abs. 1 „mündlich" (Z. 33-35):** Vertragsschluss auch mündlich — zulässig, aber für Beweiszwecke besser „in Textform". Kosmetik.

### Korrektur-Vorschlag § 3 Abs. 4 (ersetzt Z. 76-81):
```astro
<p>
  (4) <strong>Die Zahlung erfolgt vor Ort bei An- oder Abreise</strong> (bar, EC- oder
  Kreditkarte). Über die Website werden keine Online-Zahlungen, Anzahlungen oder
  Kreditkartendaten erhoben. Bei Gruppen- oder Sonderbuchungen kann das Hotel vor Anreise
  eine angemessene schriftliche Reservierungsbestätigung oder Anzahlung vereinbaren; dies
  wird dem Gast vorab gesondert mitgeteilt.
</p>
```

**Footer-Link:** Wenn AGB bleiben → Link bleibt. **Falls** der Mandant doch entfernen will: AGB-Seite löschen **und** den AGB-Link aus `SiteFooter.astro` (Z. 96) **und** aus der React-Footer-Variante entfernen, sonst toter/410-Link = eigener Mangel.

---

## 6. Barrierefreiheit (`site/pages/barrierefreiheit.astro`) + BFSG-Pflicht

### Fällt Schend überhaupt unter das BFSG?
Das **BFSG gilt seit 28.06.2025**. Es erfasst u. a. **Dienstleistungen im elektronischen Geschäftsverkehr** für Verbraucher. **Aber:** Es gibt eine **Kleinstunternehmen-Ausnahme** (§ 3 Abs. 3 BFSG) für Unternehmen mit **< 10 Beschäftigten UND ≤ 2 Mio. € Jahresumsatz** — diese sind bei **Dienstleistungen** vom BFSG **ausgenommen**.

- Ein familiengeführtes Landhotel mit 21 Zimmern liegt **wahrscheinlich** unter diesen Schwellen → dann besteht **keine** BFSG-Pflicht für die Website. **MENSCH-ANWALT / Mandant: Mitarbeiterzahl + Umsatz bestätigen.**
- **Wichtige Falle:** Die Kleinstunternehmen-Ausnahme gilt nur für **Dienstleistungen**, nicht für **Produkte**. Reine Hotelbuchung = Dienstleistung → Ausnahme greift. Solange kein Produkt-Online-Shop dazukommt, ist Schend voraussichtlich raus.

### Risiko der bestehenden Seite (NIEDRIG, N3)
Die Barrierefreiheits-Erklärung ist **freiwillig** (wenn die Ausnahme greift) — und enthält **Selbstverpflichtungen**, die dann bindend wirken können:
- Z. 57/64: „erstellt am 01. Juni 2026" + „erneute Überprüfung mindestens jährlich" → muss tatsächlich jährlich gemacht/datiert werden, sonst veraltet die eigene Erklärung sichtbar.
- Z. 85-87: „innerhalb von 10 Werktagen" Antwort → ein Versprechen, das man halten muss.
- Z. 9 `noindex={false}` → diese Seite ist **indexierbar** (anders als Impressum/Datenschutz/AGB). Inkonsistent, aber unkritisch.

### Empfehlung
- **Wenn Kleinstunternehmen-Ausnahme greift:** Seite ist **nicht erforderlich**. Zwei Optionen:
  1. **Behalten** als Goodwill/Qualitätssignal — dann die Selbstverpflichtungen **abschwächen** (siehe Neutext) und einen Satz ergänzen, dass die Erklärung freiwillig erfolgt.
  2. **Entfernen** (samt Footer-Link), um keine bindenden Zusagen zu machen. Für ein Hotel, das Wert auf Gäste-Service legt, würde ich **behalten + abschwächen** empfehlen.
- **Wenn die Ausnahme NICHT greift** (≥ 10 MA oder > 2 Mio. €): Seite ist **Pflicht** und muss inhaltlich + die Website technisch BFSG/EN 301 549 erfüllen. Dann ist die jetzige Eigenprüfungs-Erklärung der richtige Ansatz, aber die Website-Barrierefreiheit selbst gehört dann separat technisch auditiert.

### Korrektur-Neutext (Abschwächung der Selbstverpflichtung; Ergänzung am Anfang, nach Z. 18):
```astro
<p class="mt-3">
  Diese Erklärung geben wir freiwillig ab. Als familiengeführter Kleinbetrieb sind wir nach
  Einschätzung der gesetzlichen Schwellenwerte (§ 3 Abs. 3 BFSG) von der gesetzlichen
  Verpflichtung zur Barrierefreiheit unserer Website voraussichtlich ausgenommen; gleichwohl
  ist es uns ein Anliegen, möglichst vielen Gästen den Zugang zu erleichtern.
</p>
```
Und Z. 85-87 von „innerhalb von 10 Werktagen" zu „so schnell wie möglich, in der Regel innerhalb von zwei Wochen" lockern.

→ **Mensch-Anwalt entscheidet final über Pflicht ja/nein anhand der von Mandant gelieferten MA-/Umsatzzahlen.**

---

## 7. Footer / Conexa-Exposure (`site/components/SiteFooter.astro`)

### IST-Zustand
- Z. 81-90: **„Powered by [Diamant-Icon] CONEXA DIGITAL"** mit Link auf `conexadigital.eu` (target=_blank, rel=noopener).
- Z. 24-39: **Trust-Strip** „★★★★⯪ · **4,3 Ø · 277 Bewertungen**" mit Count-Up-Animation. Quelle laut Code-Kommentar (Z. 24-26): Booking.com 252 Bew. @ 8,7/10 (=4,35/5) + Tripadvisor 25 @ 4,0/5 → 277, gewichteter Ø ≈ 4,3.

### Befund
1. **„Powered by CONEXA DIGITAL" (NIEDRIG, N2):** Rechtlich **zulässig** — ein Web-Dienstleister darf neutral genannt/verlinkt werden, das ist keine Irreführung und keine Pflichtverletzung. **Kein Abmahn-Risiko.** Es ist aber eine **Geschäfts-Entscheidung** (Stealth-SaaS): Der Link macht neugierig und exponiert den Dienstleister. **Meine Empfehlung:** rechtlich kann es bleiben; wenn der Stealth-Charakter Priorität hat, entweder (a) den **Link entfernen** und nur unaufdringlichen Text lassen, oder (b) ganz weglassen. Aus reiner Abmahn-Sicht: irrelevant. Das ist eine Marketing-/Strategie-Frage für Roman/Eugen, kein Legal-Muss.
2. **Sammel-Rating „4,3 Ø · 277 Bewertungen" (MITTEL, M4):** Rating-Werbung ist nach BGH zulässig, **wenn** sie nachprüfbar und nicht irreführend ist. Risiken hier:
   - **Mischung zweier Portale** zu einem Durchschnitt ist methodisch angreifbar (unterschiedliche Skalen 10er vs. 5er, unterschiedliche Erhebung). Die Umrechnung 8,7/10 → 4,35/5 ist sauber, aber für den Verbraucher nicht erkennbar.
   - **Aktualität:** Die Zahlen (252/25/277) müssen zum Anzeigezeitpunkt stimmen. Sie sind hart codiert → veralten.
   - **Pflicht nach § 5b Abs. 3 UWG:** Bei Bewertungs-Werbung muss erkennbar sein, **ob und wie** sichergestellt wird, dass die Bewertungen von echten Gästen stammen. Bei Verlinkung auf Booking/Tripadvisor (deren Verifizierung) ist das erfüllbar, sollte aber benannt sein.

### Empfehlung Trust-Strip
- Entweder **portal-getrennt** ausweisen statt eines fiktiven Gesamt-Ø, z. B. „Booking.com 8,7/10 (252) · Tripadvisor 4,0/5 (25)" — beides verlinkt auf die Quelle.
- Oder den Gesamt-Ø **mit Quellenangabe** versehen: „Ø 4,3 aus 277 verifizierten Gästebewertungen auf Booking.com und Tripadvisor".
- **Zahlen vor Go-Live mit den Live-Portalen abgleichen** und idealerweise mit Datum versehen.

---

## 8. Weitere UWG-Funde (Inhalt der öffentlichen Seiten)

| Fundstelle | Claim | Bewertung |
|---|---|---|
| `index.astro` Z. 28, 74, 75; `faq.astro` Z. 28, 30 | „**Tripadvisor Nr. 1**" / „**Nr. 1 in Immerath**" | Spitzenstellungs-Behauptung (§ 5 UWG). Zulässig **nur wenn nachweisbar** und nicht irreführend. In einem sehr kleinen Ort kann „Nr. 1 in Immerath" wahr, aber bei nur 1-2 Betrieben **irreführend dürftig** sein. **Empfehlung:** belegbar machen („Platz 1 von X Unterkünften in Immerath, Stand MM/JJJJ, Quelle Tripadvisor") oder abschwächen zu „Top-bewertet". **MENSCH-ANWALT / Mandant: Beleg sichern.** |
| `faq.astro` Z. 28, 30; `index.astro` Z. 85 | „**Bestpreis**" / „der beste Preis" bei Direktbuchung | Preis-Spitzenstellung. Vertretbar im Sinne „provisionsfrei = günstigster Direktpreis", **aber** „Bestpreis" absolut behauptet ist angreifbar (Booking-Bestpreisklauseln sind kartellrechtlich tot, trotzdem Vorsicht). **Empfehlung:** umformulieren zu „**provisionsfrei — ohne Aufschlag eines Buchungsportals**" statt „Bestpreis". |
| `index.astro` Z. 64-66, 98, 109, 156-157, 196; `Layout.astro` Z. 40 | „**3-Sterne-Superior**", Schema `starRating 3 Superior` | Sterne-Klassifizierung = nur zulässig mit **gültiger DEHOGA-Klassifizierung**. Wenn die Klassifizierung ausgelaufen ist, ist „3 Sterne Superior" **irreführend (§ 5 UWG)** und gut abmahnbar. **MENSCH-ANWALT / Mandant: aktuelle DEHOGA-Urkunde + Gültigkeitsdatum bestätigen.** |
| `index.astro` Z. 66 | „Anno 1856" / „seit 1856" | Tradition-Claim — unkritisch, sofern faktisch korrekt. |

---

## 9. „Muss ein zugelassener Mensch-Anwalt final prüfen"-Liste

Ehrlich markiert — das geht über KI-Best-Practice hinaus und braucht menschliche/faktische Bestätigung:

1. **DEHOGA-Sterne-Klassifizierung** „3 Sterne Superior" — gültige, aktuelle Urkunde vorhanden? (UWG-Kern)
2. **„Tripadvisor/Booking Nr. 1 in Immerath"** — belegbar zum Anzeigezeitpunkt? Beleg archivieren.
3. **Footer-Rating 4,3 / 277** — Live-Zahlen + Methodik der Portal-Mischung; § 5b Abs. 3 UWG.
4. **BFSG-Pflicht ja/nein** — hängt an Mitarbeiterzahl (< 10) **und** Umsatz (≤ 2 Mio. €). Vom Mandanten bestätigen lassen.
5. **Zuständige Aufsichts-/Erlaubnisbehörde** im Impressum (Gaststättenerlaubnis) — faktisch korrekt?
6. **USt-ID** — Korrektheit (DE322739324) ist Mandantenangabe; bei Zweifel BZSt-Abgleich.
7. **AVV-Kette** — bestehen wirklich unterschriebene AVV mit Conexa, und im AVV Conexa↔Schend die Sub-AV-Freigabe für Hetzner, Supabase, Resend, Anthropic? (Datenschutz behauptet es — muss real existieren, sonst Art. 28-Verstoß.)
8. **AGB Storno-Staffel** gegen den konkreten Betriebsablauf gegenprüfen (Mensch-Anwalt für Inhaltskontrolle §§ 305 ff. BGB final).

---

## 10. Umsetzungs-Checkliste (für Roman/Eugen)

> Reihenfolge = Risiko absteigend. Jede Textänderung in **allen drei** Fundstellen (Astro / React / docs-md).

**SOFORT (hoch):**
- [ ] **Impressum:** `§ 5 TMG` → `§ 5 DDG`; `§ 7 Abs. 1 TMG` → `§ 7 Abs. 1 DDG`; `§§ 8 bis 10 TMG` → `§§ 8 bis 10 DDG`. Dateien: `site/pages/impressum.astro` (Z. 13, 65-66), `src/pages/Impressum.tsx` (Z. 21, 75-76), `docs/legal/impressum.md` (Z. 3, 38).
- [ ] **Datenschutz § 7 Buchung:** Empfängerliste um **Conexa/Hetzner (+ KI-Vorsortierung, menschliche Entscheidung)** und **Resend** ergänzen → Neutext (c2). Datei: `site/pages/datenschutz.astro` Z. 276 (+ React/md-Pendants).
- [ ] **Datenschutz § 6 e:** OpenStreetMap → **Google Maps** (2-Klick, USA-Transfer) → Neutext (c1). Z. 142-148.
- [ ] **Buchungsformular:** Pflicht-Datenschutzhinweis + Link `/datenschutz` direkt am Absende-Button ergänzen (kein Tracking-Häkchen nötig, aber Transparenz-Hinweis). Datei: `src/pages/Booking.tsx` (Abschnitt 4, Submit, ~Z. 982-993). Vorschlag-Text: *„Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeiten. Details in unserer [Datenschutzerklärung](/datenschutz). Es entstehen keine Kosten, keine Online-Zahlung."*

**ZEITNAH (mittel):**
- [ ] **Cookie-Banner ENTFERNEN** (funktionslos/irreführend): `CookieBanner`-Import + Verwendung aus `src/App.tsx`, Datei `src/components/CookieBanner.tsx` löschen.
- [ ] **Datenschutz § 9** + **§ 6 g** KI-Wording konsistent machen → Neutexte (c3)+(c4).
- [ ] **Datenschutz § 7 Cookies:** Consent-/Auth-Cookie-Beschreibung an die öffentliche Realität anpassen (theme/a11y/splash) → Neutext (c5).
- [ ] **UWG:** „Bestpreis" → „provisionsfrei / ohne Portal-Aufschlag" (`faq.astro`, `index.astro`). „Nr. 1 in Immerath" belegen oder abschwächen.
- [ ] **Footer-Rating** portal-getrennt oder mit Quelle/Datum (`SiteFooter.astro` Z. 24-39).
- [ ] **DEHOGA-Sterne** verifizieren (sonst Claim entfernen).

**ENTSCHEIDUNG nötig (Mandant/Strategie):**
- [ ] **AGB:** behalten (empfohlen) + § 3 Abs. 4 / § 8 entschärfen → Neutext §3(4). Falls entfernen: Seite + Footer-Links (Astro + React) raus.
- [ ] **Barrierefreiheit:** BFSG-Pflicht klären → behalten+abschwächen (empfohlen) oder entfernen+Footer-Link.
- [ ] **„Powered by CONEXA DIGITAL":** rechtlich ok; Stealth-Strategie-Entscheidung (Link lassen / Link weg / ganz weg).
- [ ] **AVV-Kette** real prüfen/unterschreiben (Walter-Domäne, mit Conexa).

**KEINE AKTION nötig (bestätigt sauber):**
- Kein Tracking/Analytics, Fonts self-hosted, Google-Maps-2-Klick, kein EU-ODR-Link, kein Online-Payment, § 36 VSBG korrekt.

---

*Erstellt von Walter (Legal/Compliance, Conexa Digital), 2026-06-14. Keine Live-Seite wurde geändert — dieser Report enthält nur Analyse + Neutext-Drafts zur Freigabe.*
