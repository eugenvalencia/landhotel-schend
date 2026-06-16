# Go-Live-Runbook — Landhaus Schend, Hotel - Restaurant

> **Zweck:** Wenn Schend sagt „jetzt bitte live", muss der Umzug auf
> `landhaus-schend.de` sauber und in einem Rutsch laufen. Bis dahin: alles
> vorbereiten, testen, optimieren. Dieses Dokument ist die eine Quelle dafür.
>
> Stand: 2026-06-16 · Pflege: bei jeder Änderung am Backend/Cutover aktualisieren.

## 0 · Lage (wo stehen wir wirklich)

| | URL | liegt auf | Stand |
|---|---|---|---|
| **Vorschau** | `schend.conexadigital.eu` | Cloudflare Pages (Projekt `landhotel-schend`) | **neuer Build, voll funktional**, SaaS unter `/_saas/` erreichbar |
| **Echte Domain** | `landhaus-schend.de` | **alter Apache-Server** (Altbestand) | alte Seite, KEINE neue SaaS — Cutover noch offen (gewollt, erst nach Schends OK) |

**Mechanik:** Push auf `main` → GitHub Action `deploy-cloudflare.yml` baut `site/` (Astro)
+ `src/` (React-SaaS) und deployt nach Cloudflare Pages. `public/_redirects` leitet
`/booking`, `/login`, `/dashboard`, `/operator`, `/confirmation/*` per 200-Rewrite auf die
React-Shell `/_saas/`. **Eine Codebase, ein Deploy.** Push auf `main` betrifft NUR die
Cloudflare-Auslieferung — die alte `landhaus-schend.de` bleibt unberührt, bis DNS umgezogen wird.

---

## 1 · Backend-Deploy (P1-Sicherheitsfix) — REIHENFOLGE EINHALTEN

Commit `ec11237` enthält den IDOR-Fix (pro-Buchung-`notify_token`). Die drei Teile
(Migration / Client / Edge Function) müssen **in dieser Reihenfolge** live, sonst
entsteht ein Fenster, in dem Mails 403 bekommen:

**Schritt 1 — Migration (Spalte + create_booking gibt Token zurück, backfillt alt):**
```bash
cd c:/Projekte/landhotel-schend
supabase db push --project-ref eyplzqxikdznjiemzyoz
# alternativ: Migration 20260616120000_notify_token_idor_fix.sql im Supabase-Dashboard
#            unter Database → Migrations / SQL-Editor ausführen.
```
*Abwärtskompatibel:* alter Client/alte Function ignorieren das neue Feld → kein Bruch.

**Schritt 2 — Client pushen (sendet den Token):**
```bash
git push origin main      # löst deploy-cloudflare.yml aus (~1 Min)
```
*Auf altem Backend unkritisch:* die alte Function ignoriert den Token-Parameter.

**Schritt 3 — Edge Function deployen (erzwingt den Token + korrigierte Adresse):**
```bash
supabase functions deploy notify-schend --project-ref eyplzqxikdznjiemzyoz --no-verify-jwt
```
Ab jetzt gilt: **kein Token → kein Versand (403).** Da Client + create_booking schon
live Tokens liefern (Schritt 1+2), ist die Strecke lückenlos.

**Schritt 4 — Typen regenerieren (räumt vorbestehende tsc-Fehler auf):**
```bash
supabase gen types typescript --project-ref eyplzqxikdznjiemzyoz > src/integrations/supabase/types.ts
git add src/integrations/supabase/types.ts && git commit -m "chore: Supabase-Typen regeneriert (notify_token + RPCs)"
```

**Verifikation nach Deploy (Eugen, 2 Min):**
1. Auf `schend.conexadigital.eu/booking` eine Testbuchung mit EIGENER Mail abschicken →
   „Anfrage erhalten"-Mail muss ankommen, Owner-Alert ans Hotel-Postfach muss ankommen.
2. IDOR-Gegentest (optional, technisch): `notify-schend` mit fremder `booking_id` ohne
   Token aufrufen → muss **403** liefern, keine Mail.

---

## 2 · Supabase Quick-Wins (1-Klick im Dashboard, Eugen)

Aus dem Security-Advisor, kein Blocker, aber vor Live sauber:

- **Leaked-Password-Protection AN:** Dashboard → Authentication → Policies →
  „Leaked password protection" aktivieren (prüft Passwörter gegen HaveIBeenPwned).
- **`room-photos`-Bucket-Listing zu:** Dashboard → Storage → `room-photos` → Policies →
  die breite SELECT-Policy so eingrenzen, dass nur direkter Objekt-Zugriff (URL) geht,
  kein Auflisten aller Dateien. (Fotos bleiben über ihre URL sichtbar.)

---

## 3 · Walters Rechts-Tore (vor Schends Go-Live-Wort)

Volltext im Walter-Review (Session 16.06.). Verdichtet:

🔴 **BFSG-Status — der einzige echte materielle Punkt.**
Die Barrierefreiheitserklärung stützt sich auf die Kleinstunternehmer-Ausnahme
(§ 3 Abs. 3 BFSG). Die gilt für Dienstleister, ABER nur bei **< 10 Beschäftigten UND
≤ 2 Mio € Umsatz**. Eine Hotel-Site mit Online-Buchung fällt unter das BFSG.
**→ Eugen muss Beimler nach Kopfzahl (inkl. Teilzeit/Saison anteilig) + Jahresumsatz fragen.**
- Sicher drunter → Erklärung bleibt (Wording-Fix: § 16-BGG-Schlichtungsblock raus, der gilt
  nur für öffentliche Stellen; rein freiwillige Erklärung abgeben).
- Drüber/grenzwertig → Buchungstool muss WCAG 2.1 AA geprüft werden (Tastatur, Kontraste,
  Formular-Labels, Fehlermeldungen) und der Text auf echte Konformität umgestellt.

🟠 **Resend EU-Region real bestätigen.** Die Datenschutzerklärung behauptet EU-Region +
SCC. Muss technisch stimmen (Resend-Dashboard → EU Data Residency) + AVV mit Resend in der
Akte. „Behauptung = Realität" (Eugen-Direktive).

🟠 **AVV-Kette muss existieren.** DSE nennt AVVs mit Conexa, Supabase, Resend, IONOS, Hetzner.
Diese Verträge müssen real vorliegen, bevor live geschaltet wird (Doku-Pflicht, Art. 28 DSGVO).

🟡 **Google-Fonts-Live-Check.** Vor Cutover 1× die deployte Seite im Netzwerk-Tab prüfen:
KEIN Request an `fonts.googleapis.com`/`fonts.gstatic.com` (größtes Abmahn-Massenrisiko).
Satoshi/Fonts sind self-hosted — bestätigen.

🟡 **Cookielose Analytics rechtlich ok** (§ 25 TDDDG, kein Consent-Banner nötig), solange
keine Cookies/kein Fingerprinting. Beim Einbau Tool namentlich in die DSE (Art. 6 Abs. 1 f).

🟡 **EU AI Act Art. 50** ab 02.08.2026 — heute irrelevant (KI ist aus dem Buchungspfad raus).
Falls je ein KI-Chatbot auf die Site kommt: „Sie sprechen mit einer KI" von Tag 1.

---

## 4 · Besucher & Klicks messen (cookielos, abmahnsicher)

- **Jetzt: Cloudflare Web Analytics** — kostenlos, cookielos (kein Banner), Seite liegt
  eh auf Cloudflare. Dashboard → Analytics → Web Analytics → Site hinzufügen, Snippet in
  `site/layouts/Layout.astro` einsetzen. Zeigt Besucher/Aufrufe/Quellen/Top-Seiten.
- **Standard für alle Conexa-Kunden: Plausible/Umami self-hosted (Hetzner)** — auch cookielos,
  mit Event-Tracking (z. B. „Buchen geklickt") + Funnel. Doctrine-konform (Self-Hosted-First).
- **Social→Site-Attribution:** UTM-Links auf jeden Post → in der Analytics sichtbar, welcher
  Post Besucher/Buchungen brachte. Native Insights (Instagram/Facebook) sind kostenlos.
- **Bezahlte Ads + bezahlte Analytics (AdUp/Dataslayer) = spätere, optionale Schicht** — am
  Anfang nicht nötig.

---

## 5 · DNS-Cutover `landhaus-schend.de` (NUR auf Schends ausdrückliches OK)

**Vorbedingungen:** Abschnitte 1–3 erledigt, Walters 🔴/🟠-Tore zu, Testbuchung auf der
Vorschau grün.

**⚠️ KRITISCH — E-Mail nicht abschießen:** `landhaus-schend.de` hat Postfächer
(`info@`, `buchung@`). Beim DNS-Umzug die bestehenden **MX-, SPF-, DKIM-, DMARC-Records
1:1 übernehmen**, sonst steht die Hotel-Mail still. Vor dem Umzug die aktuelle DNS-Zone
(beim jetzigen Anbieter/IONOS) komplett exportieren/abfotografieren.

**Ablauf (empfohlen — Domain-DNS zu Cloudflare):**
1. Cloudflare Pages → Projekt `landhotel-schend` → Custom domains → `landhaus-schend.de`
   **und** `www.landhaus-schend.de` hinzufügen.
2. Cloudflare zeigt die nötigen DNS-Ziele. Domain bei Cloudflare als Zone aufnehmen
   (Nameserver-Wechsel beim Registrar) ODER beim aktuellen Anbieter CNAME/A auf CF setzen.
3. **MX/SPF/DKIM/DMARC aus dem Export wieder eintragen** (Email-Schutz).
4. Propagation abwarten (Minuten–Stunden). `landhaus-schend.de` zeigt dann den neuen Build.
5. Verifizieren: Startseite neu, `/booking` lädt SaaS-Shell, Testbuchung grün, **Mail an
   info@landhaus-schend.de kommt noch an** (MX-Check).
6. `canonical` bleibt `landhaus-schend.de` (Memory `schend-domain-decision`) — korrekt.

**Rollback:** DNS-Records auf den alten Apache-Server zurücksetzen (Export aus Schritt 0).
Da die alte Seite bis zum erfolgreichen Cutover unangetastet bleibt, ist der Rückweg risikolos.

---

## 6 · Offene Punkte (server-sicher, nachziehbar)

- Kalender sperrt belegte Tage nicht visuell (Typ-zuerst-Flow). **Kein Datenverlust/keine
  Doppelbuchung** (server-seitiger Overlap-Check + „Belegt"-Anzeige + Submit-Sperre). Reine
  UX-Nachbesserung, falls gewünscht — bewusst kein Eingriff (Design eingefroren).
- Lösch-/Aufbewahrungskonzept für alte Buchungen/Gäste (DSGVO Art. 5 Speicherbegrenzung) —
  Konzept dokumentieren (Walter), Automatisierung später.
- `guests.diet` (Allergien = Art.-9-Daten): aktiver Buchungs-RPC füllt es NICHT; nur falls
  das Hotel es im Dashboard pflegt, in DSE als Art.-9-Verarbeitung deklarieren.
