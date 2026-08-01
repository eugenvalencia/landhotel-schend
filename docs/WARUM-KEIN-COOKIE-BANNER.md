# Warum landhaus-schend.de keinen Cookie-Banner hat

**Stand: 01.08.2026** · Gemessen, nicht angenommen — die Belege stehen unten.

Diese Seite braucht **keine Einwilligung** und deshalb **keinen Cookie-Banner**.
Das ist kein Versäumnis, sondern das Ergebnis der Bauweise. Dieses Blatt hält
fest, warum — falls jemand fragt.

## Die Rechtslage in einem Satz

**§ 25 Abs. 1 TDDDG** verlangt eine Einwilligung, wenn Informationen **auf dem
Endgerät gespeichert** oder **von dort abgerufen** werden. Passiert beides nicht,
gibt es nichts einzuwilligen. **Abs. 2 Nr. 2** nimmt zusätzlich alles aus, was
der Nutzer selbst angefordert hat.

## Was die Seite tatsächlich tut — gemessen am 01.08.2026

Erhoben im echten Browser auf `https://landhaus-schend.de/` nach vollständigem
Laden:

| Was | Ergebnis |
|---|---|
| Cookies (eigene wie fremde) | **keine** |
| `localStorage` | `theme` · `schend_a11y_v1` |
| `sessionStorage` | leer |
| Anfragen an Dritte | **nur** `static.cloudflareinsights.com` |
| Anfragen an Google / Meta / Fonts-CDN | **keine** |

Nachvollziehbar mit:

```bash
node scripts/../../conexa-os/scripts/seiten-abnahme.mjs --kunde schend
```
(Das Werkzeug liegt in `conexa-os/scripts/` und schreibt nach `docs/abnahme/`.)

## Die drei Punkte einzeln

**1. `theme` und `schend_a11y_v1` (localStorage)** — speichern die vom Gast
selbst gewählte Darstellung: hell/dunkel, Schriftgröße, Kontrast, reduzierte
Bewegung. Das ist ausdrücklich vom Nutzer angeforderte Funktion,
**§ 25 Abs. 2 Nr. 2 TDDDG**. Ohne diese Speicherung wäre die Einstellung nach
jedem Klick weg. Steht so in der Datenschutzerklärung, Ziffer 7.

**2. Cloudflare Web Analytics** — misst Seitenaufrufe, Verweisquelle, grobe
Region, Gerätetyp, Ladezeit. **Setzt keine Cookies, liest nichts aus dem Gerät,
kein Fingerprinting, kein seitenübergreifendes Wiedererkennen.** Damit greift
§ 25 Abs. 1 TDDDG nicht. Die Übermittlung selbst stützt sich auf
**Art. 6 Abs. 1 lit. f DSGVO**; das Widerspruchsrecht nach Art. 21 steht in der
Datenschutzerklärung, Ziffer 6 e — in allen vier Sprachen.

**3. Google Maps** — lädt **erst nach Klick** auf „Karte laden". Vorher geht
keine Anfrage an Google; im Browser gegengeprüft. Der Klick ist die Einwilligung
nach Art. 6 Abs. 1 lit. a DSGVO. Die vollständige Adresse steht als Text
daneben, niemand muss die Karte laden.

## Warum ein Banner die Lage verschlechtern würde

- **Er wäre selbst angreifbar.** Vorangekreuzte Kästchen, ein „Ablehnen", das
  schwerer zu finden ist als „Annehmen", Dienste die vor der Entscheidung
  laden — das sind die häufigsten Abmahngründe. Ein Banner für nichts schafft
  eine Angriffsfläche, wo bisher keine ist.
- **Er kostet Anfragen.** Jede Hürde vor dem Inhalt senkt die Zahl der Gäste,
  die bis zum Anfrageformular kommen.
- **Er schadet der Sichtbarkeit.** Ein Overlay verzögert den größten sichtbaren
  Inhalt (LCP) — ein Rankingfaktor bei Google.

## Wann das hier ungültig wird

Sobald **irgendetwas** hinzukommt, das Cookies setzt oder das Endgerät ausliest,
gilt dieses Blatt nicht mehr und ein Banner wird Pflicht. Typische Auslöser:

- Google Analytics 4 (setzt `_ga`)
- Meta-Pixel, LinkedIn Insight, TikTok Pixel
- eingebettete YouTube-Videos ohne „erst auf Klick"
- Schriften von einem fremden CDN statt selbst gehostet
- ein Buchungs-Widget eines Portals

> ⚠ **Altlast:** Besucher der früheren React-Seite tragen unter Umständen noch
> `_ga`-Cookies aus jener Zeit (Laufzeit bis zu 2 Jahre). Die heutige Seite lädt
> kein Google Analytics — im gebauten HTML null Treffer für `gtag`. Diese
> Cookies laufen von selbst aus; nichts liest sie mehr.

**Vor jeder solchen Änderung: erst messen, dann bauen.** Das Abnahme-Werkzeug
meldet neue Fremdhosts automatisch, sobald sie in der Datenschutzerklärung
fehlen.
