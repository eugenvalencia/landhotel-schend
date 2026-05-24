# Migration: Hetzner → Cloudflare Pages

Stand: 2026-05-24

## Warum

Aktueller Deploy via GitHub-Actions → rsync → Hetzner CX23 dauert 90-120s,
hat kein globales CDN (DE-Besucher 5-20ms TTFB, NL/BE/FR 20-40ms) und
keine Preview-URLs für PRs.

Mit Cloudflare Pages:
- ~45s Deploy nach `git push`
- Globales Edge-CDN: 5-15ms TTFB weltweit
- Preview-URL pro Feature-Branch (z.B. `feature-foo.landhotel-schend.pages.dev`)
- Kostenlos (unlimited bandwidth im Free Tier)
- DSGVO-konform (EU-Region konfigurierbar, Cloudflare hat AVV)

Hetzner CX23 bleibt für n8n, Umami, Uptime-Kuma, Conexa-APIs — nur der
statische Schend-Frontend-Layer wird ans CDN umgehängt.

## Setup-Schritte (für Eugen)

### Phase 1 — Cloudflare Pages Projekt anlegen (3 Min)

1. https://dash.cloudflare.com/?to=/:account/pages öffnen
2. **Create application** → Tab **Pages** → **Connect to Git**
3. GitHub-Repo `landhotel-schend` auswählen (ggf. erst die Cloudflare-GitHub-App installieren)
4. Setup-Felder:
   | Feld | Wert |
   |---|---|
   | Project name | `landhotel-schend` |
   | Production branch | `main` |
   | Framework preset | `Vite` |
   | Build command | `bun install --frozen-lockfile && bun run build` |
   | Build output directory | `dist` |
   | Root directory | `(leer)` |
5. **Save and Deploy** → erster Build läuft (~1-2 min)
6. Resultat: Pages-URL wie `landhotel-schend.pages.dev` — kurz öffnen, prüfen

### Phase 2 — API-Token für GitHub-Actions (2 Min)

Die Git-Integration aus Phase 1 deployed automatisch — aber wir wollen
ZUSÄTZLICH den GitHub-Actions-Workflow nutzen (für Preview-Builds in PRs
mit besseren Comments, ESLint-Checks vorher, etc.). Dafür braucht das
Repo einen Account-Level Cloudflare-Token:

1. https://dash.cloudflare.com/profile/api-tokens → **Create Token**
2. Custom Token mit Permissions:
   - **Account → Cloudflare Pages → Edit**
3. Account Resources: `93a6fc988f6bf06f077c05fa630cd5df`
4. Zone Resources: `All zones from account` (für Custom-Domain-Linking)
5. Token erstellen → kopieren
6. GitHub: Repo → Settings → Secrets and variables → Actions → **New repository secret**:
   - `CLOUDFLARE_API_TOKEN` = der neue Token
   - `CLOUDFLARE_ACCOUNT_ID` = `93a6fc988f6bf06f077c05fa630cd5df`

Hinweis: Der bestehende `~/.conexa/cloudflare-token` ist zone-scoped
und reicht NICHT für Pages-Deploys — daher ein neuer, account-level Token.
Den alten weiter für DNS-Operationen nutzen.

### Phase 3 — Custom-Domain einrichten (2 Min)

1. Im neuen Pages-Projekt → **Custom domains** → **Set up a custom domain**
2. Domain eingeben: `schend.conexadigital.eu`
3. Cloudflare schlägt CNAME vor: `schend.conexadigital.eu` → `landhotel-schend.pages.dev`
4. **Activate domain** → CF setzt den DNS-Record automatisch wenn die Zone in derselben CF-Account-Zone ist (was hier zutrifft, `conexadigital.eu` ist in dem Account)
5. SSL-Cert wird automatisch ausgestellt (~30-60s)

### Phase 4 — Verifikation + Rollback bereit halten (5 Min)

```bash
# Vorher: zeige aktuellen DNS-Stand notieren (für Rollback)
TOKEN=$(tr -d '[:space:]' < ~/.conexa/cloudflare-token)
ZONE=$(tr -d '[:space:]' < ~/.conexa/cloudflare-zone-id-conexadigital)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records?name=schend.conexadigital.eu" \
  | jq '.result[] | {id, type, content, proxied}'
# → ID notieren falls Rollback zum Hetzner-Record nötig ist
```

Nach Cutover (Phase 3 hat den DNS-Eintrag schon umgestellt):
```bash
# Sollte 200 + Cloudflare-Header zeigen
curl -sI https://schend.conexadigital.eu | head -20
# Im Header sollte erscheinen: cf-ray, cf-cache-status, server: cloudflare
```

Test:
- https://schend.conexadigital.eu/ — Startseite
- https://schend.conexadigital.eu/restaurant — Subroute (SPA-Fallback via _redirects)
- https://schend.conexadigital.eu/diese-seite-gibts-nicht — 404-Page
- https://schend.conexadigital.eu/fotos/hotelansicht-mit-terrasse-landhotel-schend.jpg — Asset

### Phase 5 — Hetzner-Deploy aufräumen (optional)

- `deploy.sh` und `deploy.ps1` umbenennen zu `deploy-hetzner-fallback.{sh,ps1}` oder löschen
- `/srv/conexa/sites/landhotel-schend/` auf Hetzner kann liegen bleiben als Notfall-Origin
- Caddy-Config `schend.conexadigital.eu` Block kann bleiben — wird einfach nicht mehr angesprochen

## Rollback (falls was schiefgeht)

Schnell-Rollback in <2 min:

1. Cloudflare Dashboard → DNS → `schend.conexadigital.eu` Record bearbeiten
2. Typ: `A`, Content: `128.140.101.82`, Proxied: aus (graue Wolke)
3. TTL: Auto
4. Save → Hetzner serviert wieder direkt

Alternativ via API (mit altem zone-token):
```bash
TOKEN=$(tr -d '[:space:]' < ~/.conexa/cloudflare-token)
ZONE=$(tr -d '[:space:]' < ~/.conexa/cloudflare-zone-id-conexadigital)
RECORD_ID="<aus Phase 4 Notiz>"
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/$RECORD_ID" \
  -d '{"type":"A","name":"schend.conexadigital.eu","content":"128.140.101.82","ttl":1,"proxied":false}'
```

Und Hetzner-Deploy manuell triggern via GitHub Actions → "Deploy zu Hetzner (Fallback)" → Run workflow.

## Architektur danach

```
                              Cloudflare Edge (global)
                                       │
                       schend.conexadigital.eu (CDN-cached)
                                       │
                              CF Pages Build = dist/
                                       │
                         git push main → CF baut + serviert
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
   Hetzner CX23 Nürnberg     Supabase EU             Resend EU
   (n8n, Umami,              (DB + Edge-Fns)         (Email)
    Uptime-Kuma)
```

**Datenfluss bleibt EU-zentriert** — nur statisches HTML/CSS/JS wird global
gecached, was DSGVO-unbedenklich ist (kein personenbezogenes Datum im Bundle).

## Pages-spezifische Files im Repo

| Datei | Zweck |
|---|---|
| `public/_headers` | Edge-Cache-Regeln + Security-Header (HSTS, X-Frame, etc.) |
| `public/_redirects` | SPA-Fallback (alle URLs → index.html mit HTTP 200) |
| `.github/workflows/deploy-cloudflare.yml` | Optional: Custom-Build via Actions statt CF-Build |
| `.github/workflows/deploy-hetzner.yml` | Auf manuell-only umgestellt (Fallback) |

## Performance-Check nach Cutover

Lighthouse vor/nach vergleichen — erwartet:
- Performance-Score: +5-10 (besseres TTFB, native Brotli)
- LCP: -200-400ms (Edge statt Single-Origin)
- Cache-Hit-Rate (von CF analysiert): >85% nach 24h
