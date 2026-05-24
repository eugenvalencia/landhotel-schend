# Booking Auto-Confirmation — Setup

Stand: 2026-05-24

## Was ist gebaut

Die Edge-Function `notify-schend` macht jetzt **zwei Dinge parallel** nach jeder neuen Buchung:

1. **n8n-Webhook** (Owner-Side): qualifiziert die Anfrage via Claude und benachrichtigt die Inhaber-Familie
2. **Resend Direkt-Mail** (Guest-Side): sofortige Buchungsbestätigung an den Gast in seiner UI-Sprache (DE/EN/FR/NL)

Beide Pfade sind unabhängig — ein Ausfall auf einer Seite blockiert die andere nicht.

## Architektur

```
Booking.tsx (RPC create_booking)
        │
        ▼
   bookings INSERT
        │
   ┌────┴────┐ Postgres-Trigger trg_notify_schend_on_booking (async via pg_net)
        │
        ▼
   notify-schend (Edge-Function)
        │
   ┌────┴────────┐
   │             │   Promise.all → parallel
   ▼             ▼
   n8n         Resend
  /webhook      /emails
   │             │
   ▼             ▼
 Owner        Gast bekommt
 Mail/Slack   HTML+Text Mail
              in seiner Sprache
```

Die HTML-Templates liegen in `supabase/functions/_shared/booking-email.ts` — eine Datei, vier Sprachen, editorial Stil (Georgia-Serif + Gold-Akzent #b8985a passend zum Brand-Look).

## Resend-Setup (einmalig)

1. **Account anlegen**: https://resend.com — kostenloser Tier reicht für Schend-Volumen (3.000 Mails/Monat)
2. **Region wählen**: EU (Frankfurt) für DSGVO-Konformität → passt zur Hetzner-DE-Strategie
3. **Sender-Domain verifizieren**: `landhaus-schend.de` als Domain hinzufügen, DNS-Records (SPF/DKIM/DMARC) bei Cloudflare/Domain-Registrar setzen
4. **API-Key erstellen**: Settings → API Keys → "Full access" oder "Sending access only"

## Supabase-Secrets setzen

Im Supabase Dashboard unter **Project Settings → Edge Functions → Secrets**:

| Key | Wert |
|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | `buchung@landhaus-schend.de` (verifiziert in Resend) |
| `N8N_WEBHOOK_URL` | bestehend, falls schon gesetzt |
| `N8N_WEBHOOK_SECRET` | bestehend, falls schon gesetzt |

Alternativ via CLI:

```bash
supabase secrets set --env-file .env.secrets
```

## Function deployen

```bash
cd c:/Projekte/landhotel-schend
supabase functions deploy notify-schend
```

## Testen

**Variante A — Funktion direkt aufrufen** (Supabase Dashboard → Functions → notify-schend → Invoke):

```json
{ "booking_id": "<id-einer-existing-test-buchung>" }
```

Response sollte sein:
```json
{ "ok": true, "n8n": { "ok": true, "status": 200 }, "mail": { "ok": true, "status": 200 } }
```

**Variante B — Echte Buchung** über `https://schend.conexadigital.eu/booking` mit eigener Email-Adresse.

## Was beim Versand passiert

- **Sprache**: nimmt `preferred_language` aus der Booking (DE/EN/FR/NL), Fallback DE
- **Subject**: `Buchungsbestätigung LHS-260524-1234 — Landhotel Schend` (lokalisiert)
- **From**: `Landhotel Schend <buchung@landhaus-schend.de>`
- **Reply-to**: `info@landhaus-schend.de` (so landen Antworten beim Hotel, nicht im Auto-Inbox)
- **Body**: HTML mit Brand-Polish (Gold-Akzent, Georgia-Serif) + Plain-Text-Fallback für Mail-Clients ohne HTML
- **Tags**: `type=booking-confirmation`, `lang=<de|en|fr|nl>` für Resend-Analytics

## Troubleshooting

| Symptom | Ursache | Fix |
|---|---|---|
| `mail.ok=false, status=0, detail="RESEND_API_KEY not configured"` | Secret fehlt | im Supabase Dashboard setzen |
| `mail.ok=false, status=403` | From-Domain nicht verifiziert | DNS-Records bei Cloudflare prüfen, in Resend Domain-Status checken |
| `mail.ok=false, status=422` | Empfänger-Email ungültig oder geblockt | Bounce-Log in Resend prüfen |
| Email kommt nicht an | Spam-Folder, DMARC-Misconfiguration | DMARC-Policy auf `p=none` setzen während Onboarding |
| `n8n.ok=false` aber `mail.ok=true` | n8n-Workflow nicht aktiv | n8n-Workflow aktivieren (separat von Mail-Versand!) |

## Rollback

Die alte Function (nur n8n, keine Gast-Mail) ist erreichbar via:

```bash
git show 21de3a4:supabase/functions/notify-schend/index.ts > /tmp/old-notify.ts
# oder direkt
git reset --hard pre-image-opt-2026-05-24~1  # vor Image-Opt + Mail-Erweiterung
```

## Was als nächstes lohnt

- **WhatsApp-Zweig** über Twilio oder die WhatsApp-Business-API (Eugen hat in HANDOFF "Auto-Email/WhatsApp" geschrieben — Mail ist jetzt da, WhatsApp ist noch offen)
- **Reminder-Mail** 24h vor Anreise (Resend Scheduled Sends oder n8n-Cron)
- **Stornierungs-Bestätigung** mit gleicher Template-Struktur
- **Owner-Mail neben dem n8n-Weg** als Fallback für den Fall dass n8n down ist
