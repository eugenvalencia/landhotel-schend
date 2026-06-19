# Schend — Sicherheit & offene Schritte (Stand 18.06.2026)

Kontext: Die Gäste-Buchung ist auf eine schlanke **Anfrage** umgestellt
(`/anfrage` Astro-Seite → Cloudflare Pages Function `functions/api/inquiry.ts`
→ Resend-E-Mail). **Kein Supabase mehr im Gast-Pfad, keine DB-Speicherung.**
Live auf `schend.conexadigital.eu` (Vorschau).

## Security-Review-Ergebnis (18.06.)
**Gesamturteil: solide, kein kritischer Fund.** Kundendaten nicht öffentlich:
RLS auf allen PII-Tabellen, Schreiben nur über abgesicherte RPCs, kein Secret
im Client-Code, E-Mail-Felder escaped, HTTPS + Security-Header live.

Bereits umgesetzt (commit `97f7b6b`):
- Server-Feldlängen-Limits + Kategorie-Whitelist (max 3, Anzahl 1–5) + Personen-Clamp
- `reply_to` nur über geprüfte E-Mail (≤254, ein @, keine Whitespaces)
- Upstream-Fehler werden nicht mehr an den Client geleakt (nur Server-Logs)
- CSP (`frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'`) + `X-Frame-Options: DENY`

## OFFEN — braucht Eugen (Dashboard / Entscheidung)

### 1. ✅ Rate-Limiting am Anfrage-Endpunkt (HIGH) — ERLEDIGT 19.06.2026
Cloudflare-Durchsatzbegrenzungsregel **„Anfrage-Limit Schend"** live (Zone
`conexadigital.eu`, Free-Plan): `URI-Pfad ist gleich /api/inquiry`, Zählung pro
**IP**, Aktion **Blockieren**. Free-Plan kennt kein Hostname-Feld im Rate-Limit —
nicht nötig, da `/api/inquiry` nur auf der Schend-Seite existiert.
**Live verifiziert:** 20er-Beschuss (POST, ohne Mail-Auslösung) → erste Anfragen
`422`, danach `429 Too Many Requests` (17/20 geblockt). Ein echter Gast (1 Anfrage)
liegt weit unter dem Limit.
- Optional zusätzlich **Cloudflare Turnstile** (kostenloses CAPTCHA) vor dem
  Absenden — Site-Key + Secret-Key in CF anlegen, Widget ins Formular, Secret in
  der Function prüfen. (Bei Bedarf baue ich das ein, sobald die Keys da sind.)

### 2. ⬜ Resend-EU-Region + DSGVO (HIGH, Go-Live-Gate)
Anfrage-PII (Name/Adresse/Mail/Tel) geht über Resend. **Bestätigen, dass das
Resend-Konto die EU-Region nutzt.** Resend ist im Datenschutztext bereits als
Auftragsverarbeiter geführt; AVV (`docs/legal/avv-schend.md`) listet Resend.
Vor echtem Go-Live von Walter final prüfen lassen.

### 3. ⬜ Altes Supabase-Projekt (MEDIUM, Datenminimierung)
Projekt `eyplzqxikdznjiemzyoz` ist weiter **ACTIVE** und enthält die alten
`bookings`/`guests` (Gäste-PII). RLS schützt es, aber es wird vom neuen
Anfrage-Pfad nicht mehr gebraucht. **Entscheidung:** Projekt **pausieren** ODER
PII exportieren+leeren, sobald der Supabase-Buchungsweg endgültig abgelöst ist.
(Falls das Rezeptions-Dashboard noch genutzt werden soll → dokumentieren, dann
bleibt es bewusst aktiv.)

### 4. ⬜ Voll-CSP (MEDIUM, optional, getestet nachziehen)
Aktuell nur die risikolosen CSP-Direktiven. Eine vollständige
`script-src`/`style-src`/`connect-src`-CSP braucht einen Test gegen Inline-
Skripte (Splash/Theme) und evtl. Google-Maps-Embed — separater Schritt.

## E-Mail-Cutover-Checkliste (für `landhaus-schend.de`-Go-Live)
Aktueller Test-Stand: `INQUIRY_FROM = onboarding@resend.dev` (CF-Env, sendet nur
an die Resend-Konto-Mail `e.neifer@outlook.de`), `INQUIRY_TO` = Default
`e.neifer@outlook.de`, `RESEND_API_KEY` gesetzt (Konto `e.neifer@outlook.de`).

Beim Umzug auf die echte Domain:
1. `landhaus-schend.de` (oder `send.conexadigital.eu` als Zwischenlösung) in
   Resend verifizieren (DNS-Einträge).
2. In Cloudflare `INQUIRY_FROM` **löschen** → Code nimmt automatisch
   `buchung@landhaus-schend.de` (Standard im Code).
3. `INQUIRY_TO` auf **Schends echte Adresse** setzen.
4. Deploy → Anfragen gehen von der eigenen Domain ans Hotel.
