# Warum `_routes.json` existiert

**Gemessener Anlass (06.09.2026).** `landhaus-schend.de` beantwortete **12,4 %**
aller Anfragen mit **HTTP 504** — 1.381 in 24 Stunden, davon 1.178 auf dem Apex.
Ausnahmslos bei `cacheStatus: miss` und `originResponseStatus: 0`: das
Pages-Backend antwortete gar nicht.

**Der Fehler liegt NICHT in unserem Code.** 15 Minuten Function-Logs
(`wrangler pages deployment tail`) neben 87 eigenen Anfragen: Cloudflare zählte im
selben Fenster 4 × 504, das Log zeigte **93 Läufe, alle `outcome: ok`**, langsamster
50 ms. Die 504er entstehen, **bevor** die Function läuft — im Weg zwischen
Cloudflare-Edge und Pages-Infrastruktur.

**Was diese Datei bewirkt.** Ohne sie erzeugt Wrangler aus dem Vorhandensein von
`functions/` automatisch ein `_routes.json` mit `include: ["/*"]` — **jede** Anfrage
läuft dann durch die Functions-Infrastruktur, auch jede rein statische Seite. Mit
`include: ["/api/*"]` gehen nur noch die beiden API-Endpunkte diesen Weg; jede
Seite kommt direkt vom Pages-Asset-Server und umgeht damit genau die Strecke, auf
der die 504er entstehen.

⚠⚠ **Damit läuft `functions/_middleware.ts` nicht mehr bei Seitenaufrufen.** Die
www→Apex-Weiterleitung, die dort seit dem 21.08. steht, wird deshalb seit dem
06.09. von einer **Cloudflare Page Rule** auf Zonenebene erledigt
(`www.landhaus-schend.de/*` → `https://landhaus-schend.de/$1`, 301, Priorität 2).
Die Regel greift vor Pages, Pfad und Query-String bleiben erhalten — live gemessen.

⛔ **Wer diese Datei löscht, muss wissen:** dann läuft wieder aller Verkehr durch
die Functions. ⛔ **Wer die Page Rule löscht, stellt den doppelten Auftritt unter
www wieder her** — genau das Problem, das am 21.08. behoben wurde.

⚠ Der Unterschied im Randfall: die Middleware antwortete auf POST mit **308**
(Methode bleibt erhalten), die Page Rule antwortet immer mit **301**. Für das
Anfrageformular ist das folgenlos: `AnfragePage.astro` ruft `fetch("/api/inquiry")`
**relativ** auf, der Browser postet also an den Host, auf dem er gerade ist — und
auf `www` landet er wegen der Weiterleitung nie.

Vollständiger Befund: `conexa-os/docs/BEFUND-SCHEND-504-2026-09-06.md`
