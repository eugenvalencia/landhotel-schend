# Schend → Astro: Cutover-Checkliste (Go-Live)

> Stand 2026-06-03. Branch `feat/astro-ssg`. SSG-Build über `npm run build:site` → `dist-astro/`.
> **Der Produktiv-Cutover braucht Eugens + Schends OK** (Live-Domain `landhaus-schend.de`).
> Bis dahin ist die bestehende React/Vite-App unberührt und bleibt live.

## Was fertig ist (DE, 22 Seiten, alles SSG)

`/` · `/zimmer` + 5 Typen · `/pakete` + 6 Pakete · `/restaurant` · `/ueber-uns` ·
`/faq` · `/impressum` · `/datenschutz` · `/agb` · `/barrierefreiheit` · `/404`.

Verifiziert: Content + JSON-LD (`Hotel`-@graph, `HotelRoom`, `Restaurant`, `FAQPage`,
`AboutPage`) statisch im HTML · eigene URLs pro Thema · noindex/canonical pro Seite korrekt ·
**kein externes JS-Bundle** (nur winziger inline Header-Toggle) · self-hosted Fonts + Fotos ·
`src/` + Vite-Config unangetastet.

## Vor dem Go-Live zu erledigen

### Routing (Cloudflare Pages)
- [ ] Build-Output des Astro-Deploys auf `dist-astro/` (Build-Cmd `npm run build:site`).
- [ ] `_redirects` für das Astro-Deploy NEU (nicht das geteilte `public/_redirects`):
      - SPA-Catch-all `/* /index.html 200` **entfernen** (bricht SSG-Routing).
      - `/booking` + `/dashboard/*` + `/login` + `/confirmation/*` → React-SPA-Deploy.
      - Sonst echtes 404 (Astro `/404.html`).
- [ ] Entscheiden: ein Deploy mit Pfad-Routing zur React-App, ODER zwei Deploys
      (Astro = öffentlich, React = `/booking`+`/dashboard`). Empfehlung: zwei Deploys,
      Cloudflare-Routing davor — sauberste Trennung, geringstes Risiko.

### SEO / Meta
- [ ] `public/robots.txt`: `Sitemap:`-Zeile auf `/sitemap-index.xml` (Astro) umbiegen.
- [ ] Alte hand-gepflegte `public/sitemap.xml` aus dem Astro-Output nehmen (sonst zwei Sitemaps).
- [ ] hreflang: aktuell nur `de` + `x-default` (korrekt für DE-only). Mit EN/FR/NL-Rollout
      voll-reziprok ergänzen.

### Inhalt / Recht (separate Owner, vor oder nach Go-Live)
- [ ] **FAQ** auf „nur das Beste für GEO" trimmen → **Angelina** (SEO/GEO-Skills).
- [ ] **AGB · Impressum · Datenschutz · Cookie-Consent** nach allen Richtlinien → **Walter** (Legal).
      Hinweis: Cookie-Banner (`src/components/CookieBanner.tsx`) muss noch in die Astro-Schicht,
      bevor der Consent final ist.
- [ ] EN/FR/NL-Inhalte: Übersetzungen erstellen (Quelle `src/i18n.ts` deckt nur Teile ab) → Angelina.

### Qualität
- [ ] Lighthouse (SEO/Perf/A11y) auf Preview messen, Zielwerte § A5/A7 der SITE-COMPLIANCE.
- [ ] Branch-Preview visuell gegen die aktuelle Live-Site vergleichen.
- [ ] a11y: Fokus-Reihenfolge Header-Mobile-Menü + Skip-Link am echten Deploy testen.

### Danach
- [ ] Reusable Shell (Layout/Header/Footer/SEO) → `conexa-site-template` extrahieren (Kunde #2–N).

## Was bewusst NICHT gemacht wurde (ehrlich)
- Booking-Flow NICHT als Astro-Island nachgebaut — die getestete React-Version bleibt, blind-Port
  des Supabase-`create_booking` wäre ungetestet/riskant gewesen.
- EN/FR/NL-Seiten NICHT halb übersetzt — Inhalt fehlt im Bestand, Fabrikation vermieden.
- Rechtstexte NICHT inhaltlich geändert — 1:1 portiert, Anpassung ist Walters Domäne.
