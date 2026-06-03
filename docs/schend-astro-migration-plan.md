# Schend → Astro Migration (SSG/SEO/GEO-Umbau)

> **Entscheidung:** [DR-029](../../conexa-os/docs/decision-log/DR-029-seo-geo-render-architektur.md) · Standard [§ A0](../../conexa-os/docs/SITE-COMPLIANCE-CHECKLIST.md)
> **Stack:** Astro (öffentliche Seiten) · React/Supabase bleibt für Dashboard + Booking
> **Sicherheit:** läuft auf eigenem Branch `feat/astro-ssg`; `main`/Live-Preview unangetastet bis verifiziert.
> **Ziel:** Jede öffentliche Seite als eigenes prerendered HTML pro Sprache (`/`, `/en/`, `/fr/`, `/nl/`), Content im HTML, eigene URLs pro Thema.

## Scope-Schnitt

| Bereich | Stack danach | Begründung |
|---|---|---|
| Startseite, Zimmer-Übersicht, Restaurant, Pakete, Über-uns, FAQ, Recht | **Astro (SSG)** | Öffentlich, SEO/GEO-relevant → muss prerendered + mehrsprachig sein |
| Zimmer-Detail, Paket-Detail | **Astro (SSG)** mit dynamischen Routen aus Daten | Eigene URLs, eigener Title/Schema pro Zimmer/Paket |
| Buchungs-Flow (Datepicker, Verfügbarkeit, create_booking RPC) | **React-Island** in Astro | Interaktiv, Supabase — als hydrierte Island einbetten |
| Hotelier-Dashboard (Login, Revenue, Calendar, Guests …) | **bleibt React-SPA** | Hinter Login → § A0 erlaubt SPA; kein SEO-Bedarf |

## Themen-Seiten (eigene URLs statt Anker)

| Heute (Anker) | Neu (eigene URL) | Title-Fokus (Keyword) |
|---|---|---|
| `/#rooms` | `/zimmer` | „Zimmer & Suiten Landhotel Schend Vulkaneifel" |
| `/#pakete` | `/pakete` | „Angebote & Pauschalen Eifel" |
| `/#about` | `/ueber-uns` | „Familienhotel seit 1856 Immerath" (Story = E-E-A-T + GEO) |
| `/#faq` | `/faq` | Frage-Keywords (GEO-Goldmine, direkte AI-Zitate) |
| `/restaurant` (schon Seite) | `/restaurant` | bleibt, in Astro neu |
| Startseite | `/` | Brand + Haupt-Conversion, Anrisse → verlinken auf Themen-Seiten |

Sprach-Pfade: `/en/zimmer`, `/fr/zimmer`, `/nl/zimmer` … via Astro i18n-Routing.

## Stufen

**Stufe 0 — Foundation (Branch + Astro-Gerüst)** ✅ (Commit 421eae6)
- [x] Branch `feat/astro-ssg`.
- [x] Astro 6 + `@astrojs/react` + `@astrojs/sitemap` + `@astrojs/check` installiert.
      (`@astrojs/tailwind` entfällt — in Astro 6 raus; stattdessen eigene explizite
      PostCSS-Pipeline in `astro.config`, isoliert von der Vite-`postcss.config.js`.)
- [x] `astro.config` mit i18n (`defaultLocale: "de"`, `locales: ["de","en","fr","nl"]`, `prefixDefaultLocale: false`).
      Isolation: `srcDir ./site`, `outDir ./dist-astro`, `publicDir ./public` (Fonts+Fotos geteilt).
- [x] Design-Tokens/Tailwind-Theme + self-hosted Fonts + globale CSS 1:1 portiert (`site/styles/global.css`).
- [ ] Cloudflare-Pages-Build auf statische `dist-astro/` umstellen (Branch-Preview separat). **OFFEN — Eugen-Decision (Infra).**

**Stufe 1 — Statische Seiten + Layout** ✅ (Commit 908f4ab)
- [x] `Layout.astro` (Head/SEO statisch: title/meta/canonical/OG/robots/geo, JSON-LD pro Seite über Slot). hreflang voll-reziprok = Stufe 3.
- [x] SiteHeader + SiteFooter als Astro-Komponenten (Mobile-Menü + Glas-Effekt als Vanilla-JS-Island, keine React-Hydration). Nav = echte URLs statt Anker.
- [x] Recht (Impressum/Datenschutz/AGB/Barrierefreiheit) — 1:1 verbatim portiert.
- [x] Über-uns (1856-Story + AboutPage-Schema) + FAQ (18 Fragen als natives `<details>` + `FAQPage`-Schema).
- [x] Bonus: Interim-Home (`/`) mit realem Hero + USP-Strip + vollem Hotel-`@graph`.
- [x] `react()`-Integration entfernt (ungenutzt → Orphan-Bundle vermieden); Dep bleibt für Stufe 3.

> **Inhalts-/Legal-Review (Eugen-Auftrag 2026-06-03, SEPARATER Pass nach der Migration):**
> FAQ auf „nur das Beste für GEO" trimmen → **Angelina** (CMO/SEO). AGB · Impressum ·
> Datenschutz · **Cookie-Consent** nach allen aktuellen Richtlinien prüfen/anpassen →
> **Walter** (Legal). Stufe 1 portiert die Texte bewusst 1:1; inhaltliche Änderung
> erst, wenn die Architektur steht (sonst Doppelarbeit bei Stufe-2/3-Rebuild).

**Stufe 2 — Content-Seiten + Daten** ✅ (Commit 9872a10)
- [x] Startseite voll (Hero + USP-Strip + Trust mit 4 echten Plattform-Ratings + 3 echten Zitaten + Zimmer/Pakete/Restaurant/Über-uns/Region-Anrissen + FAQ-CTA, Hotel-`@graph`).
- [x] Zimmer-Übersicht + `/zimmer/[slug]` (5 Typen), `HotelRoom`+`Offer`-Schema. Daten statisch aus Code-Konstanten (kein Build-Zeit-Supabase → deterministisch).
- [x] Pakete-Übersicht + `/pakete/[slug]` (6), Restaurant-Seite (+`Restaurant`-Schema). 404-Seite.

**Stufe 3 — Interaktion + Mehrsprachigkeit** ⚠️ teils bewusst gescoped (Commit s. Cutover-Doc)
- [~] Buchungs-Flow: NICHT blind als Island nachgebaut. Architektur-Entscheidung — `/booking` + `/dashboard` bleiben die getestete React-SPA, beim Cutover per Cloudflare-Routing angebunden. Astro-CTAs zeigen korrekt auf `/booking`. (Island-Einbettung = optionale spätere Politur.)
- [~] i18n: Config (de/en/fr/nl) steht. EN/FR/NL-**Inhalte** bewusst NICHT halb gebaut (Content-Task → Angelina; Fabrikations-/Inkonsistenz-Risiko). DE vollständig.
- [x] hreflang/Canonical korrekt für DE-Stand (de + x-default, selbstreferenzierend), Astro-Sitemap listet alle Routen. Voll-reziproke Sprach-hreflang folgt mit den Übersetzungen.

**Stufe 4 — Verify + Cutover** ✅ Verify / ⛔ Cutover = Eugen+Schend
- [x] Routen-Test: Haupttext + Schema im HTML pro Route (22 Seiten grün). Zero externes JS-Bundle.
- [x] § A0 (Render-Architektur) erfüllt — alles SSG, Content im HTML, eigene URLs pro Thema.
- [ ] Lighthouse SEO/Perf/A11y messen (braucht Preview-Deploy oder lokalen Server-Run).
- [ ] Branch-Preview gegen alte Preview, dann `main` + Cloudflare-Cutover. **⛔ Eugen + Schend-OK** (Live-Domain-Memory).
- [ ] Reusable Shell → `conexa-site-template`. **Follow-up** (eigener Repo-Refactor).

> **Cutover-Details** stehen in [`schend-astro-cutover-checklist.md`](./schend-astro-cutover-checklist.md).

## Risiken / offen
- **Cutover-Routing:** `dist-astro/_redirects` erbt aus `public/_redirects` den SPA-Fallback `/* /index.html 200` — der ist für das SSG-Deploy FALSCH (würde alles auf die Home routen). Beim Astro-Deploy überschreiben: SPA-Catch-all raus, `/booking` + `/dashboard/*` → React-App, sonst echtes 404. (`public/` ist mit der Vite-App geteilt → NICHT jetzt ändern.)
- **Sitemap-Verweis:** `public/robots.txt` zeigt auf `/sitemap.xml` (alt, Vite). Astro erzeugt `/sitemap-index.xml`. Beim Cutover robots umbiegen.
- Booking + Dashboard nutzen weiter dieselbe Supabase-Client-Config + RLS (React-SPA).
- Bestehende Fotos (`public/fotos`) + Self-Hosting bleiben 1:1. Pakete-Bilder neu in `public/pakete`.
