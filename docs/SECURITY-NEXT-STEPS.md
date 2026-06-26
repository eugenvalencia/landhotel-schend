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

**Konkret zu erledigen (Resend-Dashboard, beim Domain-Cutover Punkt 1 unten):**
1. **Region prüfen** — beim Hinzufügen der echten Sende-Domain in Resend die
   **Region `eu-west-1` (Irland)** wählen. Bestehende Domains zeigen die Region
   in den Domain-Einstellungen; ist sie `us-east-1`, Domain in der EU-Region neu
   anlegen (Region ist pro Domain fix, nicht nachträglich umstellbar).
2. **DPA/AVV mit Resend** — Resends Standard-DPA gilt
   (`resend.com/legal/dpa`); für die Akte Bestätigung/Signatur ablegen.
   Unser AVV-Anhang (`docs/legal/avv-schend.md`) führt Resend bereits als
   Sub-Auftragsverarbeiter — Eintrag gegen die reale Region abgleichen.
3. **Belegen** — Screenshot „Region = EU" + DPA-Status zu den Go-Live-Akten.
Walter-Memo dazu: `docs/legal/walter-review-2026-06-21.md`.

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

## E-Mail-Cutover-Checkliste (für `landhaus-schend.de`-Go-Live) — ✅ ERLEDIGT
**Stand 2026-06-26 (in Cloudflare-Pages-Env verifiziert):** Testmodus ist vorbei.
- `INQUIRY_FROM` = `Landhaus Schend <info@landhaus-schend.de>` (echte Domain, Klartext-Var)
- `INQUIRY_TO` = `info@landhaus-schend.de` (Hotel — **nicht** mehr der `e.neifer@outlook.de`-Default)
- `RESEND_API_KEY` = gesetzt (verschlüsseltes Secret)

→ Anfragen gehen live von der eigenen Domain ans Hotel. Der frühere
`onboarding@resend.dev`-Testmodus ist nicht mehr aktiv.

<details><summary>Historische Cutover-Schritte (abgehakt)</summary>

1. ✅ Domain in Resend verifiziert (DNS).
2. ✅ `INQUIRY_FROM` auf echte Domain gesetzt.
3. ✅ `INQUIRY_TO` auf Schends echte Adresse gesetzt.
4. ✅ Deploy — Anfragen gehen von eigener Domain ans Hotel.
</details>

## ⚠️ GEO/KI-Crawler-Check beim Domain-Cutover (Pflicht!)
Cloudflare blockt KI-Crawler **pro Zone** — der am 21.06. auf `conexadigital.eu`
gesetzte Fix zieht NICHT auf `landhaus-schend.de` mit. Auf der Zone der echten
Domain wiederholen:
1. **AI Crawl Control → „Verwaltete robots.txt" AUS** (sonst injiziert CF
   `Disallow: /` für GPTBot/ClaudeBot in die robots.txt).
2. **AI Crawl Control → Sicherheit → alle Crawler „nicht blockieren"** (sonst 403
   am Edge für ClaudeBot/PerplexityBot/ChatGPT-User).
3. **Verifizieren:** `curl -A "ClaudeBot/1.0" https://landhaus-schend.de/` → 200;
   `curl https://landhaus-schend.de/robots.txt` ohne CF-`Disallow` für AI-Bots.
Ohne diesen Schritt ist die gesamte GEO-Arbeit auf der echten Domain wirkungslos.
Hintergrund + Playbook: `conexa-os/docs/SEO-GEO-PLAYBOOK.md`.
