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

**Stufe 2 — Content-Seiten + Daten**
- [ ] Startseite (Hero/Ken-Burns als CSS, USPs, Anrisse → Themen-Seiten).
- [ ] Zimmer-Übersicht + Zimmer-Detail (`/zimmer/[slug]`) aus Daten, `HotelRoom`-Schema.
- [ ] Pakete-Übersicht + Detail. Restaurant-Seite.

**Stufe 3 — Interaktion + Mehrsprachigkeit**
- [ ] Buchungs-Flow als React-Island (Supabase, create_booking) einbinden.
- [ ] Übersetzungen aus bestehender `i18n.ts` in Astro-i18n-Content überführen (DE vollständig; EN/FR/NL Gerüst, Inhalte folgen).
- [ ] hreflang/Canonical reziprok + selbstreferenzierend, sitemap pro Sprache.

**Stufe 4 — Verify + Cutover**
- [ ] `curl`-Test pro Route: Haupttext im HTML. Lighthouse SEO/Perf/A11y ≥ Zielwerte (§ A7/A5).
- [ ] § A0–A9 + B1/B2 Checkliste durchgehen.
- [ ] Branch-Preview gegen alte Preview vergleichen, dann erst `main` + Cloudflare-Cutover.
- [ ] Reusable Shell → `conexa-site-template` extrahieren.

## Risiken / offen
- Dashboard-Einbettung: entweder als eigene SPA-Route (`/dashboard/*` via Astro-`output: "server"`-Teilbereich oder separates Deploy) — in Stufe 3 entscheiden.
- Booking-Island muss dieselbe Supabase-Client-Config + RLS nutzen wie heute.
- Bestehende Fotos (`public/fotos`) + Self-Hosting bleiben 1:1.
