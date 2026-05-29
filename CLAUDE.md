# B — Landhotel Schend (Pilot-Kunde, LIVE)

Vite + React 18 + TS + shadcn/ui + Supabase + Resend. Site ist live unter `landhaus-schend.de`. Gäste buchen drüber.

## IMPORTANT — Brand/Domain (mehrfach falsch gewesen)

- **Brand in Texten/Schemas/Meta-Tags:** `Landhotel Schend`
- **Domain (historisch):** `landhaus-schend.de`
- **Legacy-Keyword:** `Landhaus Schend` darf als SEO-Keyword bleiben
- **NEVER** Brand und Domain verwechseln. Siehe `[[feedback-schend-naming]]`.

## IMPORTANT — Deploy-Regel

- **NEVER** `./deploy.sh` ohne vorherigen lokalen Build + Browser-Smoke-Test (`npm run build && npm run preview`).
- **NEVER** Online-Payment hinzufügen — Eugen-Entscheidung, siehe `[[open-problem-finanzamt-online-buchung]]`.
- **NEVER** direkt in Production-Supabase editieren — immer Migration in `supabase/migrations/`.

## Commands

```bash
npm install
npm run dev                # http://localhost:8080 (oder 5173)
npm run build              # Production-Build
npm run preview            # Build lokal anschauen (PFLICHT vor deploy)
npm run lint
./deploy.sh                # Build + SCP zu Hetzner + Verify
```

## Struktur

| Pfad | Zweck |
|---|---|
| `src/components/` | UI (shadcn-Style, Komponenten klein halten) |
| `src/pages/` | Routen |
| `src/i18n/` | DE/EN/FR/NL — Detection-Hierarchie für Benelux (`[[schend-language-strategy]]`) |
| `src/lib/mail/` | Resend-Templates |
| `public/fotos/` | Hotel-Bilder (Brand-Meta schon gesetzt via IPTC/XMP) |
| `supabase/migrations/` | DB-Schema-Versionierung |
| `deploy.sh` | Build + SCP + Verify nach Hetzner |

## Style-Standards

- TS strict, React 18, Vite, Tailwind 3 + shadcn
- User-facing Sprache: warm, Gast-orientiert (nicht Tech-Sprache)
- Code-Sprache: Englisch (Props, Variablen). Kommentare auf Deutsch wenn nötig.
- Polish-Standards: Schatten, 3D-Tiefe, Pixel-Vergleich vor/nach (`[[feedback-style]]`)

## Definition of Done

1. `npm run build` grün
2. `npm run preview` — Browser-Smoke-Test wichtige Seiten
3. Lighthouse / a11y nicht verschlechtert (BFSG!)
4. Mobile getestet
5. Alle 4 Sprachen bei Text-Changes
6. Bei großen Releases: Git-Tag (`schend-site-v3` etc.)
7. **Erst dann** `./deploy.sh`

## Hosting

| Was | Wo |
|---|---|
| Aktive Bau-Site | `schend.conexadigital.eu` (Hetzner) — hier werden alle Änderungen entwickelt + getestet |
| Live (Gäste-Site) | `landhaus-schend.de` — Hosting-Provider noch zu klären (IONOS-Daten vorhanden, Hetzner als Ziel). Umzug erfolgt erst wenn Bau-Site fertig ist. |
| DB | Supabase EU-central-1 (Frankfurt, Project `eyplzqxikdznjiemzyoz` im outlook-Account) |
| Mail | Resend |
| Analytics | Umami (`analytics.conexadigital.eu`) |

## Wichtigste Memorys

`[[project-landhaus-schend]]` · `[[feedback-schend-naming]]` · `[[feedback-verify-before-deploy]]` · `[[schend-language-strategy]]` · `[[open-problem-finanzamt-online-buchung]]` · `[[karpathy-code-rules]]`

## Code-Doctrine

> Vor jeder Coding-Session: [`../CONEXA-CODE-RULES.md`](../CONEXA-CODE-RULES.md) — Karpathy-4-Regeln + 3 Conexa-Ergänzungen. Regel 6 (Build-Test bevor Deploy) hat hier explizite Form: `npm run build && npm run preview` PFLICHT vor `./deploy.sh` oder Push (siehe oben "Deploy-Regel"). Lock-File-Sync nicht vergessen — CI nutzt `npm ci` strict.

@README.md
