# B — Landhaus Schend (Pilot-Kunde, LIVE)

**Astro 6 SSG.** Eine statische Kundenseite, live unter `landhaus-schend.de`.

## ⛔ IMPORTANT — Es gibt hier KEINE Buchungen

Die Seite nimmt **Anfragen** entgegen, keine Buchungen. `/anfrage/` schickt ein
Formular an `functions/api/inquiry.ts` (Cloudflare Pages Function), das daraus
**eine E-Mail an das Hotel** macht — über Resend. Danach hört die Software auf.
**Schend bearbeitet jede Anfrage von Hand:** Verfügbarkeit prüfen, Gast anrufen
oder anschreiben, zusagen. Es gibt keinen Kalender, keine Datenbank, kein
Rezeptions-Board, kein Supabase.

> **Warum das hier so groß steht:** Bis 01.08.2026 behauptete diese Datei
> „Gäste buchen drüber", und 225 Dateien SaaS-Code lagen im Repo, ohne je
> ausgeliefert zu werden. Das hat am 01.08.2026 zu einem falschen Sicherheits-
> bericht geführt — gemeldete „Lücken im Buchungssystem" betrafen schlafenden
> Code. Der SaaS heißt **Hospio OS** und liegt jetzt im Repo `hospio-os`.
> **Ein Repo pro Kunde, das Produkt getrennt davon** (Doctrine P4).

**Wenn du etwas über den Live-Zustand behauptest: erst messen, dann sagen.**
Repo-Inhalt ist kein Beleg dafür, dass etwas läuft.

## IMPORTANT — Brand/Domain (mehrfach falsch gewesen)

- **Brand in Texten/Schemas/Meta-Tags:** `Landhotel Schend`
- **Domain:** `landhaus-schend.de`
- **Legacy-Keyword:** `Landhaus Schend` darf als SEO-Keyword bleiben
- **NEVER** Brand und Domain verwechseln. Siehe `[[feedback-schend-naming]]`.

## IMPORTANT — Deploy-Regel

- **NEVER** pushen ohne vorherigen lokalen Build (`npm run build`) + Blick auf
  die gebauten Seiten. `git push origin main` löst sofort den Live-Deploy aus.
- **NEVER** Online-Payment hinzufügen — Eugen-Entscheidung,
  siehe `[[open-problem-finanzamt-online-buchung]]`.

## Commands

```bash
npm install
npm run dev              # Astro-Dev-Server
npm run build            # baut nach dist-astro/ (PFLICHT vor Push)
npm run preview          # gebauten Stand lokal anschauen
npm run check            # astro check
npm run optimize:images  # mozjpeg-Recompression der Fotos
```

## Struktur

| Pfad | Zweck |
|---|---|
| `site/` | **Die Seite.** Astro-Komponenten, Seiten, `site/i18n/` (DE/EN/FR/NL), `site/lib/` (Zimmer, Pakete, Fotos) |
| `site/tailwind.config.cjs` | Tailwind der Kundenseite (die Wurzel hat KEINE mehr) |
| `functions/api/inquiry.ts` | Anfrage-Formular → Resend-Mail. Der einzige Server-Code. |
| `public/fotos/` | Hotel-Bilder (Brand-Meta via IPTC/XMP gesetzt) |
| `scripts/` | Bild-Optimierung, Brand-Pack, Smoke-Test |
| `dist-astro/` | Build-Ergebnis (wird deployt) |

## Bot-Abwehr im Anfrageformular (01.08.2026)

Honigtopf (`company`), Zeitfalle (unter 3 s = kein Mensch), Bremse pro IP,
Längen-Kappung, Kategorie-Allowlist, serverseitige Einwilligungsprüfung.
⚠ Ein fehlender Zeitstempel weist **nie** ab — echte Gäste dürfen daran nie
scheitern. ⚠ Die Bremse lebt im Arbeitsspeicher einer Worker-Instanz und greift
nur bei gleichzeitigen Anfragen, nicht bei langsamem Tröpfeln.
Siehe `[[bot-abwehr-formulare-2026-08-01]]`.

## Style-Standards

- User-facing Sprache: warm, Gast-orientiert (nicht Tech-Sprache)
- Kommentare auf Deutsch, sie erklären das **Warum**
- Polish-Standards: Schatten, 3D-Tiefe, Pixel-Vergleich vor/nach (`[[feedback-style]]`)

## Definition of Done

1. `npm run build` grün
2. Gebaute Seiten ansehen — **200 allein ist kein Nachweis**: Kopf, Navi, Fuß
   und das Anfrageformular müssen wirklich drin sein
3. Lighthouse / a11y nicht verschlechtert (BFSG!)
4. Mobil getestet (390 px)
5. Alle 4 Sprachen bei Text-Änderungen
6. **Erst dann** `git push origin main`

## Hosting

| Was | Wo |
|---|---|
| Live (Gäste-Site) | `landhaus-schend.de` + `www.` — Cloudflare Pages, Projekt `landhotel-schend`. Deploy via `git push origin main` (GitHub-Action `deploy-cloudflare.yml`). |
| Vorschau | `landhotel-schend.pages.dev` + Branch-Vorschauen |
| Mail | Resend (`RESEND_API_KEY`, `INQUIRY_TO`, `INQUIRY_FROM` als Pages-Variablen) |
| Analytics | Umami (`analytics.conexadigital.eu`) |
| ~~Bau-Site, Hetzner, Supabase~~ | **Alles weg.** `schend.conexadigital.eu` am 01.08.2026 zurückgebaut, Hetzner abgeschaltet, Supabase zog mit dem SaaS nach `hospio-os`. |

## Wichtigste Memorys

`[[project-landhaus-schend]]` · `[[feedback-schend-naming]]` · `[[feedback-verify-before-deploy]]` ·
`[[schend-language-strategy]]` · `[[open-problem-finanzamt-online-buchung]]` ·
`[[schend-hosting-cloudflare-2026-08-01]]` · `[[bot-abwehr-formulare-2026-08-01]]` ·
`[[methode-waechter-der-immer-rot-leuchtet]]` · `[[karpathy-code-rules]]`

## Code-Doctrine

> Vor jeder Coding-Session: [`../CONEXA-CODE-RULES.md`](../CONEXA-CODE-RULES.md) —
> Karpathy-4-Regeln + 3 Conexa-Ergänzungen. Regel 6 (Build-Test vor Deploy) hat
> hier explizite Form: `npm run build` und ein Blick auf das Ergebnis sind
> Pflicht vor jedem Push.

@README.md
