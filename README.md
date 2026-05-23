# Landhotel Schend — Vite-React-App

3-Sterne-Superior Hotel in der Vulkaneifel, KMU-Erstreferenz für Conexa Digital.

- **Brand:** Landhotel Schend (NICHT „Landhaus")
- **Domain Production:** `landhaus-schend.de` (DNS aktuell noch IONOS, Cutover steht aus)
- **Live-Preview:** **https://schend.conexadigital.eu** (Hetzner-Caddy mit Auto-TLS)
- **Stack:** Vite + React + TypeScript + shadcn/ui + Supabase (Lovable-Init)

---

## Live-Preview-Workflow

**Schnellster Weg: lokal bauen + deployen mit einem Befehl.**

### Option A — Lokales Deploy-Skript (Bash, Git-Bash auf Windows)

```bash
cd C:/Projekte/landhotel-schend
./deploy.sh                # Build + Upload + Verify
./deploy.sh --skip-build   # Nur Upload (wenn dist/ aktuell)
```

Dauer: ~30–60s. Output: HTTP-Status + Title + URL.

### Option B — PowerShell-Variante

```powershell
cd C:\Projekte\landhotel-schend
.\deploy.ps1               # Build + Upload + Verify
.\deploy.ps1 -SkipBuild    # Nur Upload
```

### Option C — Auto-Deploy via GitHub Action (kein lokales Setup nötig)

Bei jedem `git push origin main` baut GitHub und deployt automatisch zu Hetzner (~2 Min Latenz).

**Setup einmalig (Eugen-Task):**

1. SSH-Private-Key kopieren (Inhalt von `C:\Users\info\.ssh\synology_schend`)
2. GitHub-Repo öffnen → **Settings → Secrets and variables → Actions → New repository secret**
3. Name: `HETZNER_SSH_KEY`, Value: kompletten Private-Key-Inhalt einfügen (incl. `-----BEGIN OPENSSH PRIVATE KEY-----` und Endzeile)
4. Speichern. Fertig.

Workflow-Datei: [`.github/workflows/deploy-hetzner.yml`](.github/workflows/deploy-hetzner.yml).

Manueller Trigger jederzeit möglich: GitHub-Repo → **Actions → Deploy zu Hetzner → Run workflow**.

---

## Lokale Entwicklung

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # produziert dist/
bun run preview      # preview von dist/
bun run test         # Vitest
bun run lint         # ESLint
```

Verzeichnis-Struktur grob:

```
src/
├── components/       # shadcn/ui + Custom-Components (incl. A11yPanel)
├── pages/            # Routen: Index, Booking, Operator, Datenschutz, Impressum, AGB, Barrierefreiheit
├── lib/              # Supabase-Client, Utils
└── ...
public/
├── fotos/            # Hotel-Bilder (optimiert via scripts/optimize-images.mjs)
└── ...
docs/
├── legal/            # Impressum.md/html/pdf, Datenschutz.*, AGB.*, Barrierefreiheit.*
└── ...
```

---

## Wichtig: Brand vs. Domain

- **Domain bleibt:** `landhaus-schend.de` (historisch, SEO-Equity)
- **Brand-Name in allen neuen Texten/Schemas/Titles:** **Landhotel Schend**

Siehe [`docs/SCHEND-NAMING.md`](docs/SCHEND-NAMING.md) falls vorhanden.

---

## Production-Cutover (TODO)

Aktuell läuft die Live-Site auf IONOS (alte WordPress-Apache-Site). Geplanter Cutover:

1. DNS für `landhaus-schend.de` von IONOS → Cloudflare-Zone migrieren (oder bei IONOS-DNS einfach A-Record auf `128.140.101.82` setzen)
2. Caddyfile auf Hetzner: zusätzlicher Block für `landhaus-schend.de` und `www.landhaus-schend.de`
3. IONOS auf Mail-Hosting reduzieren (oder zu Hetzner Mailcow migrieren)
4. Erste Direktbuchungs-KPI-Messung via Umami starten

---

## Tech-Stack-Pointer

- [conexa-os/CONEXA-MAP.md](../conexa-os/CONEXA-MAP.md) — Master-Doku Conexa-Infrastruktur
- [conexa-os/docs/INFRASTRUCTURE.md](../conexa-os/docs/INFRASTRUCTURE.md) — Hetzner + NAS + Cloudflare im Detail
- [conexa-os/docs/INVENTORY-2026-05-21.md](../conexa-os/docs/INVENTORY-2026-05-21.md) — Letzte Bestandsaufnahme + Have/Need/Skip
