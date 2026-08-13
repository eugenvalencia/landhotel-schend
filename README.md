# Landhotel Schend — Kundenseite

3-Sterne-Superior Hotel in der Vulkaneifel, KMU-Erstreferenz für Conexa Digital.

- **Brand:** Landhotel Schend (NICHT „Landhaus" — das ist nur die Domain)
- **Live:** **https://landhaus-schend.de** (+ `www.`) — Cloudflare Pages, Projekt `landhotel-schend`
- **Vorschau:** `https://landhotel-schend.pages.dev` + Branch-Vorschauen
- **Stack:** Astro 6 (SSG, kein JavaScript-Framework im Auslieferungspfad) + Tailwind 3

## Was diese Seite tut — und was nicht

Sie nimmt **Anfragen** entgegen, keine Buchungen.

`/anfrage/` schickt das Formular an `functions/api/inquiry.ts`, eine Cloudflare
Pages Function. Die macht daraus **eine E-Mail an das Hotel** (Resend) plus eine
Eingangsbestätigung an den Gast. Danach hört die Software auf: **Schend prüft
Verfügbarkeit und antwortet von Hand.** Kein Kalender, keine Datenbank, kein
Rezeptions-Board.

> **Bis 01.08.2026 lagen hier 225 Dateien Hotel-SaaS** (Vite/React-Buchungs-
> strecke, 30 Supabase-Migrationen, Rezeptions-Board), die nie ausgeliefert
> wurden. Sie lasen sich wie Produktionscode und haben zu einem falschen
> Sicherheitsbericht geführt. Der SaaS heißt **Hospio OS** und liegt jetzt im
> eigenen Repo `hospio-os`. Ein Repo pro Kunde, das Produkt getrennt davon.

## Lokale Entwicklung

```bash
npm install
npm run dev              # Astro-Dev-Server
npm run build            # baut nach dist-astro/  — PFLICHT vor jedem Push
npm run preview          # gebauten Stand anschauen
npm run check            # astro check
npm run optimize:images  # Fotos rekomprimieren (mozjpeg)
```

## Deploy

```bash
git push origin main     # löst die GitHub-Action deploy-cloudflare.yml aus
```

Die Action baut, deployt zu Cloudflare Pages und prüft danach nach: HTTP 200 auf
`landhaus-schend.de` **und** dass das Anfrageformular auf `/anfrage/` wirklich
ausgeliefert wird. 200 allein wäre kein Nachweis — die Seite kann antworten und
trotzdem kaputt sein.

### Vercel hängt zusätzlich am `preview`-Branch

Produktiv ist **allein Cloudflare Pages**. An `preview` (den `mirror-preview.yml`
aus `main` fortschreibt) hängt zusätzlich ein Vercel-Projekt — ein Überbleibsel
aus der Zeit vor dem Astro-Umbau.

Es scheiterte bei jedem Push mit *„No Output Directory named `dist` found"*:
Vercel sucht standardmäßig `dist`, Astro schreibt hier aber nach `dist-astro`
(eigener `outDir`, siehe `astro.config.mjs`). Behoben am 13.08.2026 über
`vercel.json` → `outputDirectory`.

⚠ Dabei ist aus `vercel.json` die alte Regel
`rewrites: [{ source: "/(.*)", destination: "/index.html" }]` entfernt worden.
Die stammte aus der React-SPA-Zeit und wäre für eine statische Seite schädlich:
Sie hätte **jede** Adresse auf die Startseite umgeleitet und damit sowohl die
echten Unterseiten als auch die 404-Seite ausgehebelt. Astro erzeugt echte
Ordner mit `index.html` — dafür braucht es keine Umschreibung.

Wer Vercel nicht mehr braucht: Projekt dort löschen. Solange es existiert, muss
es grün sein — ein System, das dauerhaft rot meldet, wird ignoriert, und dann
fällt der echte Fehler auch nicht mehr auf.

## Aufbau

| Pfad | Zweck |
|---|---|
| `site/` | Die Seite: Astro-Komponenten, Seiten, `i18n/` (DE/EN/FR/NL), `lib/` (Zimmer, Pakete, Fotos) |
| `functions/api/inquiry.ts` | Anfrage → Resend-Mail. Der einzige Server-Code. |
| `public/fotos/` | Hotel-Bilder, Brand-Meta via IPTC/XMP |
| `scripts/` | Bild-Optimierung, Brand-Pack, Smoke-Test |
| `dist-astro/` | Build-Ergebnis |

## Wichtig: Brand vs. Domain

In allen Texten, Schema.org-Daten und Meta-Tags heißt es **Landhotel Schend**.
Die Domain lautet historisch `landhaus-schend.de`; „Landhaus Schend" darf als
SEO-Keyword stehen bleiben. Das war mehrfach verwechselt — nicht wieder.

## Umgebungsvariablen (Cloudflare Pages)

| Variable | Zweck |
|---|---|
| `RESEND_API_KEY` | Pflicht. Ohne ihn scheitert die Anfrage ehrlich, statt Erfolg vorzutäuschen. |
| `INQUIRY_TO` | Empfänger. **Kein Fallback** — ohne ihn wird nichts versendet (DSGVO). |
| `INQUIRY_FROM` | Absender, verifizierte Domain bei Resend |
