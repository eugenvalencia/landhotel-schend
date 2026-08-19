# Bounce-Melder scharfschalten

> Der Endpunkt `functions/api/resend-webhook.ts` sagt dem Hotel Bescheid, wenn
> eine E-Mail an einen Gast nicht angekommen ist. **Er tut nichts, solange die
> drei Schritte unten nicht gemacht sind** — und das ist Absicht: ohne
> Signaturgeheimnis weist er jede Meldung ab, statt ungeprüfte durchzureichen.

## Warum es das gibt

Am **13.08.2026** hat der Mailserver eines Gastes die Eingangsbestätigung
abgelehnt (`550 5.7.1 XGEMAIL_0011`). Der Gast wusste nicht, ob seine Anfrage
angekommen ist; sie lag beim Hotel. **Sechs Tage hat es niemand bemerkt** — der
Fehler stand nur im Resend-Protokoll, in das niemand schaut.

Der Melder verhindert den Ausfall nicht. Er sorgt dafür, dass das Hotel ihn
**erfährt**, mit der Adresse des Gastes, damit jemand anrufen kann.

## Die drei Schritte

### 1. Endpunkt ausrollen
`git push origin main` → Cloudflare Pages baut und veröffentlicht
`https://landhaus-schend.de/api/resend-webhook`.
Bis Schritt 3 antwortet er auf alles mit `500 not_configured`. Das stört
niemanden, weil ihn noch niemand aufruft.

### 2. Webhook in Resend anlegen
Resend → **Webhooks** → *Add Webhook*

| Feld | Wert |
|---|---|
| Endpoint URL | `https://landhaus-schend.de/api/resend-webhook` |
| Events | `email.bounced` **und** `email.failed` |

⛔ **Nicht** `email.delivery_delayed` anhaken — Resend versucht es dann noch
weiter, ein Alarm wäre in den meisten Fällen falsch.
⛔ **Nicht** `email.complained` — die Mail ist angekommen, sie war nur
unerwünscht. Das ist kein Fall fürs Telefon.

Resend zeigt danach ein **Signing Secret** an: `whsec_…`. Kopieren.

### 3. Geheimnis in Cloudflare hinterlegen
Cloudflare → Pages → *landhotel-schend* → **Settings → Environment variables**

| Name | Typ | Wert |
|---|---|---|
| `RESEND_WEBHOOK_SECRET` | **Secret** (verschlüsselt) | das `whsec_…` aus Schritt 2 |

⚠ **Danach neu ausrollen** (Deployments → Retry deployment). Pages reicht neue
Variablen erst an eine neue Veröffentlichung durch — sonst läuft der Endpunkt
weiter ohne Geheimnis und weist alles ab.

`RESEND_API_KEY` und `INQUIRY_TO` sind bereits gesetzt (dieselben, die
`inquiry.ts` benutzt). `RESEND_API_BASE` ist **nicht** zu setzen — die Variable
existiert nur für die Messung.

## Nachprüfen, dass es wirklich greift

Resend hat eine Adresse, die **immer** zurückprellt: `bounced@resend.dev`.
Eine Anfrage über das Formular mit dieser Adresse als Gast-E-Mail löst also
einen echten Bounce und damit eine echte Warnung aus.

⚠ **Das schickt eine echte Warn-Mail an `info@landhaus-schend.de`.** Entweder
das Hotel vorher kurz informieren — oder den Test auf einer
**Vorschau-Veröffentlichung** fahren, bei der `INQUIRY_TO` auf eine eigene
Adresse zeigt (Cloudflare Pages hält für Preview eigene Variablen).

Ohne Ausrollen prüfbar ist alles andere:

```bash
node scripts/pruefe-resend-webhook.mjs
```

Startet den echten Endpunkt über `wrangler pages dev`, stellt Resend lokal nach
und fährt 12 Fälle — darunter fünf, die **abgewiesen werden müssen**
(verdrehte Signatur, nachträglich geänderter Inhalt, alter Zeitstempel, gar
keine Signatur, fremder Schlüssel). Es geht dabei keine einzige echte Mail raus.

## Was der Melder NICHT kann

- **Er merkt nicht, wenn eine Mail zugestellt, aber nie gelesen wird.** Nur was
  Resend als zurückgekommen meldet, löst etwas aus.
- **Er merkt nicht, wenn das Formular gar nicht erst absendet.** Dafür gibt es
  den Uptime-Kuma-Prüfling »landhaus-schend.de — Anfrageformular«.
- **Doppelte Warnungen sind nicht völlig ausgeschlossen.** Das Gedächtnis gegen
  Wiederholungen lebt im Arbeitsspeicher einer Worker-Instanz; Cloudflare hält
  je Rechenzentrum eigene. Eine doppelte Warnung ist der harmlosere Fehler als
  eine ausgebliebene.
- **Prellt das Hotelpostfach selbst zurück, passiert nichts** — wir würden an
  genau das Postfach schreiben, das gerade nichts annimmt, und uns dabei in
  eine Endlosschleife setzen. Der Fall steht dann nur im Cloudflare-Protokoll.
