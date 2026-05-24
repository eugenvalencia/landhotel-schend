# Handoff — nächste Session

**Stand:** 2026-05-24 ~16:10
**Live:** https://schend.conexadigital.eu/ — auf **Cloudflare Pages** (global Edge-CDN)
**Letzter Commit:** `86f149f` (mega-menu Bilder entfernt nach V2.3 Polish-Welle)
**Rollback-Tags:** `pre-design-polish-2026-05-24`, `pre-design-polish-v22-2026-05-24`, `pre-image-opt-2026-05-24`, `schend-site-v2`

---

## Was sich seit gestern (V2 → heute) geändert hat

### Polish-Wellen V2.1, V2.2, V2.3 (14 neue Komponenten/Hooks)

**V2.1** — Lenis Smooth-Scroll + Number-Counter (Trust-Pills) + Tilt-on-Hover (Zimmer/Pakete-Cards) + Hairline-Section-Divider

**V2.2** — Hero-Crossfade verfeinert (2s + frischer Ken-Burns pro Slide) + Reading-Progress-Bar (Brass-Linie oben) + Section-Dots-Nav (rechts, 6 Sections) + Nav-Underline (symmetrisch scaleX) + Page-Fade-In bei Route-Wechsel

**V2.3** — Header verschwindet beim Runterscrollen + Mega-Menu für Zimmer/Pakete (Hover-Dropdown, OHNE Preview-Bild auf Eugen-Wunsch) + Cursor-Lupe auf Card-Bildern + Card-Caption-Slide-Up bei Hover + Footer-Brass-Underline (wandert von links)

### Infrastruktur: Hetzner → Cloudflare Pages

- Schend-Frontend jetzt auf Cloudflare Pages (~45 s deploy bei push, global Edge)
- `git push main` → GitHub Action `deploy-cloudflare.yml` baut & deployed automatisch
- Hetzner CX23 (`128.140.101.82`) bleibt für n8n, Umami, Supabase-Proxy, künftige APIs — kein Auto-Deploy mehr (Workflow nur noch `workflow_dispatch`)
- Page-Rules: `/assets/*` 1 y immutable, `/fotos/*` 30 d, restliche Tier-Defaults
- Cache-Purge bei Bedarf: `bash ~/.conexa/cf.sh purge conexadigital.eu --all`

### Image-Optimization (perf-Welle)

- 27 Fotos in `public/fotos/` durch mozjpeg recompressed: **−7,45 MB (−47 %)**
- Hero-/Zimmer-Bilder teils −86 % (waren oversized)
- Visuell kaum sichtbar (q78), `npm run optimize:images` jederzeit re-runnable

### Booking Auto-Confirmation-Mail (vorbereitet, noch nicht aktiv)

- `notify-schend` Edge-Function erweitert: macht parallel n8n + Resend-Mail
- Templates in `supabase/functions/_shared/booking-email.ts` (DE/EN/FR/NL HTML + Text)
- Setup-Doku in `docs/BOOKING-AUTO-CONFIRMATION-SETUP.md`
- **Aktivieren**: Resend-Account anlegen, `landhaus-schend.de` als Sender verifizieren (DNS bei Cloudflare), `RESEND_API_KEY` + `RESEND_FROM_EMAIL` im Supabase-Dashboard setzen, `supabase functions deploy notify-schend`

---

## Regel: erst überprüfen, dann live

**Memory-Eintrag `feedback-verify-before-deploy.md` erzwingt:** vor jedem Production-Deploy lokal bauen + im Browser smoke-testen. Heute gabs einen ErrorBoundary-Crash auf prod weil CI-Build ohne `VITE_SUPABASE_*` env-vars deployed wurde — der Build lief grün, aber Runtime crashte.

**Tool dafür**: `scripts/smoke.sh` — Headless-Chrome-Wrapper ohne Node-Deps.

```bash
bash scripts/smoke.sh https://schend.conexadigital.eu/ https://schend.conexadigital.eu/restaurant
```

---

## Was als nächstes ansteht

### User-Aufgaben (Eugen)

- [ ] Resend-Account anlegen + DNS für Mail-Sender bei Cloudflare einrichten
- [ ] Notion-Database für 3 n8n-Workflows (bekannt seit 2026-05-21)
- [ ] Telegram-Bot bei @BotFather
- [ ] Discovery-Tool selbst testen + Familie Beimler zeigen
- [ ] Schend auf Handy + Desktop durchklicken (V2.3 Polish-Test, Feedback was zu doll/zu subtil)

### Claude-Aufgaben (für nächste Session)

- [ ] Motorradgarage-Wording in `src/i18n.ts:21,27` korrigieren — Memory sagt: NUR offener Hof, kein Dach/keine Überwachung (heute bewusst nicht angefasst, war "kein Text-Polish" Session)
- [ ] Saison-Hint im Booking-Calendar visuell stärker (Oktober-Februar sollten sichtbar nicht auswählbar wirken)
- [ ] Cartoon-Refinement Wolf+Hase auf 404 falls Lust drauf
- [ ] Operator + Dashboard Brand-Polish (interne Tools, niedrige Prio)
- [ ] Conexa V2 Promote zu conexadigital.eu (`docs/V2-PROMOTE-PLAN.md` im conexa-os Repo)
- [ ] `/conexa-akquise` Live-Demo mit fremder Hotel-URL

### Strategische Themen

- BFSG-Reel auf TikTok (taniprokamni-Hook übernehmen)
- conexadigital.eu HTML-Entity-Bug `&amp;` im Framer-Title fixen
- Lighthouse-Audit für reale Performance-Werte nach allen Polish-Wellen

---

## Rollback (falls nötig)

```bash
cd c:/Projekte/landhotel-schend

# Mega-Menu mit Bildern wieder
git reset --hard e0d6f5d

# Letzte Polish-Welle V2.3 rückgängig (V2.2 bleibt)
git reset --hard pre-design-polish-v22-2026-05-24

# V2.2 + V2.3 rückgängig (V2.1 bleibt)
git reset --hard pre-design-polish-2026-05-24

# Ganz vor Polish-Welle (vor V2.1)
git reset --hard schend-site-v2

# DNS-Rollback zu Hetzner (Cloudflare Pages umgehen):
bash ~/.conexa/cf.sh dns update conexadigital.eu d2f965931d9a06be7bf02e585191f674 A schend.conexadigital.eu 128.140.101.82 false
```

---

## Wichtige Pfade & URLs

**Repos:**
- `c:\Projekte\landhotel-schend\` — Hotel-Site (Vite + React)
- `c:\Projekte\conexa-os\` — Marketing-Site V2 + Discovery + Docs + n8n-Workflows
- `c:\Projekte\conexa-marketing-skills\skills\orchestration\` — 3 Master-Agents

**Live:**
- Schend: https://schend.conexadigital.eu (Cloudflare Pages, `landhotel-schend.pages.dev`)
- Conexa V2: https://demo.conexadigital.eu (Hetzner)
- Discovery: https://demo.conexadigital.eu/discovery/schend
- n8n: https://n8n.conexadigital.eu (Hetzner, Owner-Setup ausstehend)

**Cloudflare-Verwaltung autonom (von Claude nutzbar):**
- `c:\Users\info\.conexa\cf.sh` — Bash CLI
- `c:\Users\info\.conexa\cf.ps1` — PowerShell CLI
- `c:\Users\info\.conexa\CF-CLI.md` — Doku + Permissions-Liste
- Token: `c:\Users\info\.conexa\cloudflare-token` (Account-Level mit allen Permissions)

**Memory (für neue Chat-Session):**
- `C:\Users\info\.claude\projects\c--Projekte-conexa-agents\memory\session-2026-05-24.md` — heute komplett
- `feedback-verify-before-deploy.md` — die heute geborene Regel
- `cf-cli-helper.md` — CF-CLI Doku
- `project-landhaus-schend.md` — Stammdaten
- `MEMORY.md` — Index

**Doku im Repo:**
- `docs/BOOKING-AUTO-CONFIRMATION-SETUP.md` — Resend-Setup
- `docs/CLOUDFLARE-PAGES-MIGRATION.md` — Wie Schend nach CF Pages migriert wurde
- `scripts/smoke.sh` — Headless-Chrome-Smoke-Test (vor jedem Deploy benutzen)
- `scripts/optimize-images.mjs` — mozjpeg-Recompression

---

## Einstieg im neuen Chat-Fenster

Öffne ein neues Claude-Code-Fenster im Verzeichnis `c:/Projekte/conexa-agents` und sag:

> "Lies HANDOFF.md im landhotel-schend Repo + session-2026-05-24.md und feedback-verify-before-deploy.md aus Memory. Wir machen weiter wo wir aufgehört haben."
