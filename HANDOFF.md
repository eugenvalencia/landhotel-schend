# Handoff — nächste Session

**Stand:** 2026-05-23 ~22:00 Uhr
**Schend-Site live:** https://schend.conexadigital.eu/ (Tag `schend-site-v2`)
**Conexa V2 live:** https://demo.conexadigital.eu/ + Discovery: https://demo.conexadigital.eu/discovery/schend

---

## Was heute fertig wurde

22 Commits seit `schend-site-v1` (siehe `git log schend-site-v1..schend-site-v2 --oneline`):

- **Hero**: Trust-Pills + Restaurant-CTA + Ken-Burns + Magnetic + Glow-Border
- **Restaurant**: Tagesgäste-Banner + Specials-Cards + Standalone `/restaurant` Page (SEO-eigenständig)
- **Pakete**: Spotlight + Preis-Stamp + Highlight
- **About**: Visuelle Timeline 1856 → Heute
- **Reviews**: Trust-Strip + Verifiziert-Badges
- **Header**: Logo + Phone-Pill (Desktop/Tablet)
- **Mobile-Menu**: Phone-Pill prominent oben, größere Touch-Targets, Saison-Hint
- **Footer**: Trust-Strip + Saison-Hint + Familie Beimler
- **Floating-CTA Desktop**: Stamp-Look
- **Login**: editorial Brand-Polish
- **Booking**: "Buchung" konsistent + KEIN "verbindlich" + Auto-Email/WhatsApp-Versprechen
- **404**: Wolf+Hase Nu-Pogodi-Look (gelb Hawaii vs. weiß+rot)
- **SEO**: Title/Description ohne Wellness/Motorradgarage, Saison im Schema
- **A11y-FAB**: Type-Icon (statt Rollstuhl)
- **Restaurant-Link** prominent an 4 Stellen: Header-Nav, Mobile-Menu, Footer, Homepage-Section-Brücke

**Conexa parallel:** Discovery-Tool, 3 Master-Agents, n8n-Workflow-JSONs, BFSG-Doc, V2-Promote-Plan, CONEXA-AGENT-MAP.

---

## Wichtige Memory-Fixes von heute

| Was | Vorher | Jetzt |
|---|---|---|
| **Wellness/Sauna** bei Schend | "Wellness-Urlauber" Hauptzielgruppe | KEIN Wellness, KEIN Sauna — explizit dokumentiert |
| **Motorradgarage** | "videoüberwachte Garage" | Mehrere Stellplätze im offenen Hof, kein Dach |
| **Saison** | nicht spezifiziert | März – September (Winter geschlossen) |
| **Schend-Site Zweck** | unklar | Demo-Stack für Hotel-SaaS — Online-Buchung MIT Auto-Bestätigung ist Feature |
| **Buchungs-Wording** | "verbindlich buchen" | "Buchung" OK, "verbindlich" NIE (juristisch sauber) |

---

## TODO für nächste Session

### User-Aufgaben (Eugen)
- [ ] n8n-Owner-Setup abschließen (5 Min, https://n8n.conexadigital.eu)
- [ ] Notion-Database "Conexa-Leads" + "Conexa-Kunden" anlegen (15 Min, Schema in N8N-WORKFLOWS.md)
- [ ] Telegram-Bot bei @BotFather anlegen ("ConexaOpsBot")
- [ ] SUPABASE_ACCESS_TOKEN in `c:\Projekte\landhotel-schend\.env` setzen
- [ ] Discovery-Tool selbst testen + Familie Beimler zeigen
- [ ] conexadigital.eu Title `&amp;`-Bug in Framer-UI fixen (2 Min)
- [ ] Schend selbst durch die V2 klicken (Desktop + Handy)

### Claude-Aufgaben (für nächstes Fenster)
- [ ] Cartoon (Wolf+Hase) Detail-Refinement falls Eugen nochmal hingucken will
- [ ] Image-Optimization (WebP/AVIF) wenn Hero-Original-Files lokal beschaffbar
- [ ] Operator + Dashboard Brand-Polish (heute übersprungen, interne Tools)
- [ ] Booking Auto-Email/WhatsApp-Flow in Supabase Edge-Function bauen (passt zur SaaS-Demo)
- [ ] Conexa V2 nach conexadigital.eu promoten (Plan: docs/V2-PROMOTE-PLAN.md)
- [ ] `/conexa-akquise` Live-Demo mit fremder Hotel-URL
- [ ] Mastra-Playground aktivieren

### Strategische Themen
- BFSG-Reel auf TikTok produzieren (taniprokamni-Hook übernehmen)
- llms.txt + robots.txt + Discovery sind beim nächsten Conexa-Deploy live
- Lighthouse-Audit für reale Performance-Werte

---

## Rollback wenn nötig

```bash
cd c:/Projekte/landhotel-schend
git reset --hard schend-site-v1   # Stand vor heutigem Polish
# oder
git reset --hard schend-site-v2   # falls zwischendurch was kaputt geht
bash deploy.sh
```

---

## Wichtige Pfade & URLs

**Repos:**
- `c:\Projekte\landhotel-schend\` — Hotel-Site
- `c:\Projekte\conexa-os\` — Marketing-Site V2 + Discovery + Docs + n8n-Workflows
- `c:\Projekte\conexa-marketing-skills\skills\orchestration\` — 3 Master-Agents

**Live:**
- Schend: https://schend.conexadigital.eu (Tag schend-site-v2)
- Conexa V2: https://demo.conexadigital.eu
- Discovery Schend: https://demo.conexadigital.eu/discovery/schend
- n8n: https://n8n.conexadigital.eu (Owner-Setup ausstehend)

**Memory:**
- `C:\Users\info\.claude\projects\c--Projekte-conexa-agents\memory\session-2026-05-23-schend-polish.md` — diese Session
- `C:\Users\info\.claude\projects\c--Projekte-conexa-agents\memory\project-landhaus-schend.md` — Schend-Stammdaten (heute aktualisiert)
- `C:\Users\info\.claude\projects\c--Projekte-conexa-agents\memory\MEMORY.md` — Master-Index

**Doku:**
- `c:\Projekte\conexa-os\docs\CONEXA-AGENT-MAP.md` — welcher Agent für was
- `c:\Projekte\conexa-os\docs\N8N-WORKFLOWS.md` — Setup-Guide
- `c:\Projekte\conexa-os\docs\BFSG-AUDIT-SERVICE.md` — Service-Skizze
- `c:\Projekte\conexa-os\docs\V2-PROMOTE-PLAN.md` — Conexa-Site-Switch
- `c:\Projekte\conexa-os\docs\DAC7-BRIEFING-SCHEND.md` — Gesprächs-Leitfaden

---

## Einstieg im neuen Chat-Fenster

Öffne ein neues Claude-Code-Fenster im Verzeichnis `c:/Projekte/conexa-agents` und sag einfach:

> "Lies HANDOFF.md im landhotel-schend Repo und session-2026-05-23-schend-polish.md aus Memory. Wir machen weiter wo wir gestern aufgehört haben."

Claude (das werde wieder ich sein, aber ohne Erinnerung an heute) wird damit alles aufholen können.
