/**
 * www → Apex, als echte 301.
 * ══════════════════════════
 *
 * ⚠⚠ GEMESSENER ANLASS (21.08.2026): `https://www.landhaus-schend.de/`
 * antwortete mit **HTTP 200** — nicht mit einer Weiterleitung. Die komplette
 * Seite existierte damit doppelt, auf jedem Pfad (`/restaurant/` über www:
 * ebenfalls 200). Zusammengehalten wurde das allein durch
 * `<link rel="canonical" href="https://landhaus-schend.de/">` — ein Hinweis,
 * kein Befehl. Google darf ihn ignorieren, und in der Search Console standen
 * die www-Pfade denn auch als „Alternative Seite mit richtigem kanonischen
 * Tag".
 *
 * Und es ist nicht die Nebenvariante: Laut Clarity kommen die MEISTEN
 * Besucher über www — Startseite 88 Aufrufe über www gegen 36 über den Apex,
 * `/restaurant/` 32 gegen 21. Die Verweiskraft verteilte sich also auf zwei
 * Adressen, und die stärkere war die, die wir nicht als kanonisch führen.
 *
 * `conexadigital.eu` macht es seit dem Umzug richtig (www → 301 → Apex, das
 * erledigt dort Caddy). Schend liegt auf Cloudflare Pages, und Pages
 * beantwortet jeden Hostnamen, der auf das Projekt zeigt, mit demselben
 * Inhalt. `public/_redirects` hilft hier NICHT: Dessen Regeln kennen nur den
 * Pfad, nicht den Host. Eine Cloudflare-Weiterleitungsregel wäre der andere
 * Weg — dafür fehlen dem hinterlegten API-Token die Rechte.
 *
 * Bleibt diese Middleware. Sie läuft bei Pages VOR der statischen
 * Auslieferung und vor `functions/api/*`.
 *
 * ⚠ Sie läuft bei JEDER Anfrage. Deshalb:
 *   · alles in try/catch, und im Zweifel `next()` — eine kaputte Middleware
 *     nimmt sonst die ganze Seite mit.
 *   · Der Hostname wird gegen eine feste Liste geprüft, nicht per Muster.
 *   · **308 statt 301 für alles außer GET/HEAD.** Ein 301 darf ein POST in
 *     ein GET verwandeln; das Anfrage-Formular (`/api/inquiry`) würde dann
 *     still ins Leere laufen. 308 erhält die Methode und den Rumpf.
 *
 * ⚠ Wenn Schend eines Tages wie conexadigital.eu auf den eigenen Server
 * umzieht, läuft diese Datei nicht mehr — dann muss die Regel in die
 * Caddy-Konfiguration. Ein Umzug ohne diesen Schritt stellt den doppelten
 * Auftritt still wieder her.
 */

/** Hostnamen, die auf den Apex gehören. Feste Liste, kein Muster. */
const UMLEITEN: Record<string, string> = {
  "www.landhaus-schend.de": "landhaus-schend.de",
};

export const onRequest: PagesFunction = async (context) => {
  try {
    const url = new URL(context.request.url);
    const ziel = UMLEITEN[url.hostname];
    if (ziel) {
      url.hostname = ziel;
      const methode = context.request.method.toUpperCase();
      const code = methode === "GET" || methode === "HEAD" ? 301 : 308;
      return new Response(null, {
        status: code,
        headers: {
          Location: url.toString(),
          // Ein Jahr — die Zuordnung ändert sich nicht.
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }
  } catch {
    // Im Zweifel durchlassen: lieber ein doppelter Auftritt als eine tote Seite.
  }
  return context.next();
};
