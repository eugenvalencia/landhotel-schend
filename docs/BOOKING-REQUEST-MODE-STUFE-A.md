# Buchung Stufe A — Anfrage-Modus + Quellen-Tracking

Stand: 2026-06-04 · Status: **Code fertig, go-live gated (Eugen-Schritte unten)**

## Warum

Schends echter Schmerz (Eugen 2026-06-04): **Refund-Betrug** — Gast bucht + zahlt online,
storniert (kostenlos), verlangt Rückzahlung auf ein *fremdes* Konto → bei gestohlener
Zahlungsquelle Chargeback + Geldwäsche-Red-Flag → Finanzamt/Polizei.

**Lösung Stufe A:** Es fließt **nie Geld vorab** (Zahlung vor Ort) → es gibt nichts
zurückzuzahlen → Betrug strukturell unmöglich. Zusätzlich kommt jede Buchung als
**Anfrage** rein, die das Hotel im Dashboard bestätigt (Schend behält die
Verfügbarkeits-Kontrolle, keine Auto-Zusage). Und jede Buchung trägt eine **`source`**
(Direkt/Booking.com/…), damit das Provisionsfrei-Versprechen endlich belegbar ist.

(Stufe B — optionale Anzahlung via PSP mit Refund-to-source + Pre-Auth — ist dokumentiert,
aber NICHT Teil dieser Lieferung. Braucht Walter-Freigabe, GwG.)

## Was diese Lieferung enthält

| Bereich | Datei | Änderung |
|---|---|---|
| DB | `supabase/migrations/20260604150000_booking_request_mode_and_source.sql` | Spalten `source` + `request_status`; `create_booking` konsolidiert (war doppelt + kaputt); neue RPC `set_booking_request_status` |
| Gast-Formular | `src/pages/Booking.tsx` | Anfrage-Wording, sendet `p_source` |
| Gast-Bestätigung | `src/components/BookingConfirmationCard.tsx` | „Anfrage eingegangen" statt „bestätigt" |
| Gast-Email (4 Sprachen) | `supabase/functions/_shared/booking-email.ts` | Zwei Modi: `request` (Eingangsbestätigung) + `confirmation` (verbindliche Bestätigung) |
| Edge-Function | `supabase/functions/notify-schend/index.ts` | nimmt `kind` (request/confirmation); n8n nur bei neuer Anfrage |
| Hotel-Dashboard | `src/components/dashboard/BookingsTab.tsx` | Anfrage-Status-Badge, Bestätigen/Ablehnen, Quelle-Spalte, echte Quellen-Auswertung |

**Voller Anfrage-Loop:** Gast sendet Anfrage → sofort Eingangsbestätigung (`request`-Mail) →
Hotel klickt „Bestätigen" im Dashboard → `set_booking_request_status` löst per pg_net die
verbindliche `confirmation`-Mail aus. „Ablehnen" storniert + gibt den Kalender frei (keine Mail).

### Reparierte Altlasten (die React-Engine lief nie öffentlich, daher unbemerkt)
- `create_booking` existierte in **zwei widersprüchlichen Overloads**; die neueste (jsonb)
  setzte **kein `tenant_id`** (→ `NOT NULL`-Crash) und nutzte `booking_type='direct'`
  (nicht im Enum). Beide gedroppt, eine korrekte Version bleibt.
- Extras wurden still ignoriert (jsonb vs. von Booking.tsx gesendetes `UUID[]`). Gefixt.
- Return-Shape gab kein `room_total/extras_total/extras` zurück → Bestätigungskarte NaN. Gefixt.

## Datenmodell

- `payment_status` (bestehend, = Geld): `pending` bleibt — Zahlung vor Ort.
- `request_status` (neu, = Anfrage-Lebenszyklus): `angefragt` → `bestaetigt` | `abgelehnt`.
  Orthogonal zum Geld. `abgelehnt` setzt `payment_status='cancelled'` → Kalender wird frei.
- `source` (neu): Default `'Direkt'`; Kampagnen-Traffic über `?utm_source=`/`?source=`/`?ref=`.
- Anfragen blocken den Kalender tentativ (Overlap-Check zählt `pending`) — verhindert
  Doppel-Anfragen aufs selbe Zimmer, während das Hotel entscheidet.

## Go-Live-Reihenfolge (Eugen — manuelle, gegatete Schritte)

> ⚠️ Diese PR **nicht** vor Schritt 1+2 mergen — die Frontend-Schritte (Confirm-Button)
> brauchen die DB-Objekte. `/booking` bleibt bis Schritt 5 auf der Astro-mailto-Anfrage =
> kein Live-Risiko während der Umstellung.

1. **Migration anwenden** (kein CI für Supabase):
   ```bash
   cd c:/Projekte/landhotel-schend
   supabase db push       # oder die SQL im Supabase-Dashboard ausführen
   ```
   Danach ggf. PostgREST-Schema neu laden (Dashboard: „Reload schema", oder
   `NOTIFY pgrst, 'reload schema';`).
2. **Edge-Function deployen** (neues Anfrage-Wording der Gast-Mail):
   ```bash
   supabase functions deploy notify-schend
   ```
3. **Diese PR mergen** → Cloudflare baut die Site neu (Dashboard + Booking-Engine-Code live,
   aber `/booking` zeigt weiter auf Astro).
4. **Schend-Daten prüfen/seeden**: Zimmer + Extras in Supabase müssen gepflegt sein
   (die Seed-Migration `20260514141500` legt 21 Zimmer + Extras an — prüfen, ob real gewünscht).
5. **Weiche umlegen**: in `public/_redirects` `/booking` auf `/_saas/` routen (wie `/login` etc.),
   damit die React-Engine die Anfrage übernimmt. Vorher auf einer Preview testen.
6. **End-to-End-Test** auf Preview: Anfrage absenden → erscheint im Dashboard als „Angefragt"
   → Bestätigen/Ablehnen → Mail kommt an.

## Bekannte Folge-Arbeit (NICHT in dieser Lieferung)

- **AnalyticsTab-Quellen-Pie** ist weiter Demo-Mock; die *echte* Quellen-Auswertung steht
  jetzt im BookingsTab (echte Daten). Wiring des Pie auf echte Aggregation = später, sobald
  Buchungsvolumen da ist. (P3)
- **Stufe B** (Anzahlung/PSP mit Refund-to-source + Pre-Auth) — eigenes Projekt, Walter-Freigabe.
