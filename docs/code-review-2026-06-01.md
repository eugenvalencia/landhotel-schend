# Code-Review landhotel-schend — 2026-06-01

> Multi-Agent-Review (12 Bereiche, adversarial gegengeprueft). Counts: {"confirmed":16,"unverified":16,"suggestions":15,"refuted":4}
> Logs: ["Review fertig: 16 bestaetigt, 16 ungeprueft, 15 Optimierungen, 4 verworfen"]

Ich strukturiere den Report direkt aus den gelieferten Findings — alle Pfade sind im Repo unter `src/` (die JSON-Pfade haben das `src/`-Präfix weggelassen, das die Verdicts korrigiert haben).

# Schend-Site — Review-Report (Lead-Synthese)

## Top-Prioritaeten

1. `src/components/dashboard/InvoiceDialog.tsx:29-30` — MwSt. pauschal 7% auf GESAMTbetrag inkl. Extras → steuerrechtlich falsche Hotelrechnung (Aufteilungsgebot: Übernachtung 7%, Frühstück/Parkplatz/Wellness 19%). **Fix:** VAT pro Position rechnen, getrennte 7%/19%-Basis im Footer ausweisen. (ungeprüft, aber höchstes Risiko: echtes Geld + Compliance)
2. `src/lib/format.ts:4-7` — `formatDate` parst `YYYY-MM-DD` als UTC und rendert lokal → Check-in/Check-out auf der **Buchungsbestätigung** verschiebt sich um 1 Tag (negative UTC-Offsets, internationale Gäste). **Fix:** String splitten + `new Date(y, m-1, d)` (wie `parseISOLocal`), Date-Objekte unangetastet lassen. Behebt zugleich das ungeprüfte Dashboard-Pendant (BookingsTab/CalendarTab/Confirmation-Mail).
3. `src/pages/Booking.tsx:138-141` — `blockedDates` mischt UTC-Parse + lokales `toISODate` → Verfügbarkeits-Kalender lügt in negativen Zeitzonen (belegte Nächte als frei). **Fix:** `parseISOLocal(b.check_in/out)` statt `new Date(string)`. (Server-Guard fängt echte Doppelbuchung ab, UI nicht.)
4. `src/pages/Login.tsx:36-46` — Nicht-Admin-Login: unbedingtes `navigate('/dashboard')` + Erfolgs-Toast → stille Schleife `/dashboard`→`/login` ohne Erklärung. **Fix:** Admin-Rolle vor Navigation prüfen, sonst `toast.error` + auf `/login` bleiben (oder Navigation allein dem `useEffect (user && isAdmin)` überlassen).
5. `src/pages/RoomDetail.tsx:62-105` — kein 404-/Fehler-State: ungültige/gelöschte Zimmer-ID hängt ewig auf „Zimmer wird geladen …". **Fix:** Status-State `loading|ready|notfound|error`, echten 404-Block mit Zurück-Link rendern (wie PaketDetail).

## Bestaetigte Bugs & Fehler

(keine `error`-Severity unter den bestätigten Findings)

### bug

- `src/lib/format.ts:4-7` — `formatDate` UTC-Parse von `YYYY-MM-DD`, Datum verschiebt sich 1 Tag auf der Bestätigungskarte → lokal parsen via `parseISOLocal`. *(Top-2)*
- `src/pages/Booking.tsx:138-141` — `blockedDates` UTC-Parse + lokales `toISODate` verschiebt Belegung → `parseISOLocal` nutzen. *(Top-3)*
- `src/pages/Login.tsx:36-46` — Nicht-Admin-Redirect-Sackgasse mit falschem Erfolgs-Toast → Rolle prüfen vor Navigation. *(Top-4)*
- `src/pages/RoomDetail.tsx:62-105` — kein 404/Fehler-State, ewiger Lade-Spinner → expliziter Status-State + 404-Block. *(Top-5)*
- `src/pages/RoomDetail.tsx:60,84-92,125` — stale `activeIdx` bei Zimmerwechsel → `gallery[activeIdx]===undefined`, kaputtes Hero-Bild. **Fix:** `useEffect(() => setActiveIdx(0), [id])` oder `gallery[activeIdx] ?? gallery[0]`.
- `src/pages/Barrierefreiheit.tsx:76,86,173` (+ `Datenschutz.tsx:372`, `AGB.tsx:207`, `Impressum.tsx:109`) — `new Date()` zur Renderzeit → „Stand"/„zuletzt geprüft" zeigt immer HEUTE; bei der BFSG-Erklärung eine unwahre Prüf-Aussage. **Fix:** hartkodierte Konstante pro Dokument (`const STAND = '2026-06-01'`).
- `src/components/SiteHeader.tsx:69-75` — Cross-Page-Anchor-Scroll per festem 80ms-Timeout, race mit lazy Index-Chunk → landet oben statt bei `#faq`. **Fix:** Ziel per `navigate('/', { state: { scrollTo: id } })` + `useEffect` nach Mount, oder MutationObserver-Retry.
- `src/components/WeatherCard.tsx:211-266` — `defaultMode="gps"`: feuert der Permission-Prompt nie, bleibt `pos` null → dauerhaftes „Lade Wetter …" (der 4s-Timeout greift nicht für offenen Prompt). **Fix:** eigener Fallback-Timer (5-6s) → Hotel-Standort.
- `src/components/dashboard/CalendarTab.tsx:467` — `onMouseLeave` ruft `finishDrag()` während gedrückter Maus → öffnet ungewollt den Buchungs-Dialog (Zielgruppe 60+: zittrige Maus). **Fix:** Drag global via `window 'mouseup'` abschließen; `onMouseLeave` nur Drag-State resetten ohne `openQuickFor`.

### a11y

- `src/components/HeaderMegaMenu.tsx:50-68` — Mega-Menu nur per Hover, kein onClick-Toggle/onFocus/ESC; `aria-expanded` nie `true` (WCAG 2.1.1). Betrifft konkret das Desktop-Submenü (Mobile-Burger ist zugänglich). **Fix:** onClick togglet `setOpen`, onFocus/onBlur am Wrapper, ESC → schließen + Fokus zurück.
- `src/components/ReviewsSection.tsx:159-162` — Karussell auto-rotiert alle 8s ohne Pause/Stop und ohne `prefers-reduced-motion` (WCAG 2.2.2). **Fix:** Interval bei reduced-motion nicht starten + Pause bei Hover/Focus.
- `src/components/A11yPanel.tsx:90-109` — `aria-modal="true"` ohne echten Fokus-Trap, Tab verlässt den Dialog (nur „trap-lite"). **Fix:** Tab/Shift+Tab im keydown-Handler zyklisch abfangen, optional `inert`/`aria-hidden` auf Hintergrund.
- `src/components/StickyMobileCTA.tsx:69-82` — versteckter Desktop-CTA bleibt trotz `aria-hidden` per Tab fokussierbar (nur `opacity-0`). **Fix:** zusätzlich `invisible` oder `tabIndex={show ? undefined : -1}`.

### quality (bestätigt)

- `src/components/ReviewsSection.tsx:156-162,256-285` — Auto-Rotate-Interval wird bei manueller Navigation nicht resettet → springt direkt nach Klick weiter. **Fix:** `idx` als `useEffect`-Dependency oder Timer bei Interaktion neu aufsetzen. *(gleiche Datei/Ursache-Nähe zum a11y-Karussell-Punkt — zusammen fixen)*
- `src/components/WeatherCard.tsx:295-296` — ungeschütztes `data.daily[0].sunrise` → Crash bei leerem `daily.time` (out-of-contract API-Response). **Fix:** `data.daily.length > 0` vor Render + `raw.daily.time?.length` im Guard.
- `src/pages/PaketDetail.tsx:76-84` — schema.org Offer nutzt `price` statt `lowPrice` für „ab"-/pro-Person-Preise; Parsing bricht latent bei Tausenderpunkt („1.299" → 1.299 €). Aktuell alle Preise 3-stellig, kein Live-Fehler. **Fix:** `lowPrice` + robustes Parsing (Tausenderpunkt entfernen, Komma→Punkt).

## Ungeprueft (manuell verifizieren)

Gegenprüfung technisch fehlgeschlagen — vor Fix kurz selbst am Code bestätigen. Mehrere überlappen mit bereits bestätigten Ursachen (Zeitzonen-Parsing).

**Geld / Rechnung (priorisiert):**
- `src/components/dashboard/InvoiceDialog.tsx:29-30` — MwSt. 7% pauschal auf Gesamtbetrag → falsche Rechnung. **Fix:** VAT pro Position (7% Zimmer / 19% Extras). *(Top-1)*
- `src/components/dashboard/InvoiceDialog.tsx:28` — `roomSubtotal = max(0, total-extras)` klemmt auf 0 wenn Extras > total → Positions-Summen ≠ Gesamtbetrag. **Fix:** bei `extras > total` Fallback `roomPrice*nights` statt still 0.
- `src/components/dashboard/InvoiceDialog.tsx:24` — Nächte über `Math.round(ms/86400000)` → DST-anfällig. **Fix:** datumsbasiert (`Date.UTC(y,m,d)` beider Seiten).
- `src/components/dashboard/RevenueTab.tsx:11` — Supabase-`error` verschluckt (zeigt 0€ statt Fehler) + `check_in.slice`/`Number(total_price)`-Crash bei null. **Fix:** `error` destrukturieren + `if (!b.check_in) return` + NaN-Guard.

**Zeitzonen (gleiche Ursache wie Top-2/3 — gemeinsam mit `format.ts`-Fix erledigen):**
- `src/lib/format.ts:4-7` — Duplikat des bestätigten Off-by-one (auch `formatDateShort`).
- `src/components/dashboard/OverviewTab.tsx:103` — „Umsatz heute" vergleicht UTC-`created_at.slice(0,10)` gegen lokales `todayIso` → Abend-Buchungen fallen raus. **Fix:** `toISODate(new Date(b.created_at))`.
- `src/components/dashboard/OverviewTab.tsx:81-83` — Wochenstart per `getDay()` (Sonntag, nicht ISO-Montag) + ms-Arithmetik DST-anfällig → `weekDelta` falsch. **Fix:** Kalender-Arithmetik wie `CalendarTab`.
- `src/components/dashboard/CalendarTab.tsx:51-55` (+ YearGrid `947-954`) — `nightsBetween`/`computeMonth` mischt UTC- und lokale Mitternacht → Monats-Umsatzanteil/YoY verzerrt. **Fix:** durchgängig `Date.UTC(...)`.

**Daten-Integrität (Dashboard):**
- `src/components/dashboard/CalendarTab.tsx:112-154` — `fetchAllBookings`-Fehler auf Seite >0 wird per `break` geschluckt → Konfliktprüfung auf Teilmenge → stille Doppelbuchung. **Fix:** bei Page-Fehler werfen oder `partial`-Flag → Warn-Toast + Schreib-Block.
- `src/components/dashboard/GuestProfileDialog.tsx:96-130` — kein `active`-Guard, Stale-Write-Race beim schnellen Gastwechsel → falsche persönliche Daten gespeichert. **Fix:** `let active = true` + Cleanup, wie in den anderen Tabs.
- `src/components/dashboard/GuestProfileDialog.tsx:186-199` — Save geht bei Gast ohne email-Key blind in `insert` → Duplikat/Unique-Constraint. **Fix:** per email lookup/`upsert onConflict:'email'`.
- `src/components/dashboard/GuestProfileDialog.tsx:141-143` — `lastStay=past[0]` nutzt check_in-Sortierung statt check_out → „Letzter Besuch" falsch. **Fix:** `past.map(b=>b.check_out).sort().at(-1)`.
- `src/components/dashboard/OverviewTab.tsx:150-180` — Reaktivierungs-Merge über reinen `guest_name` bei fehlender email → Namensvetter-Kollision verfälscht spent/count. **Fix:** Email-Pflicht als Merge-Key, name-only nicht mergen.
- `src/integrations/supabase/types.ts:249-272` — `create_booking` RPC fehlt komplett in den generierten Typen → die zentrale Buchungs-Mutation hat null Compile-Schutz. **Fix:** `supabase gen types typescript` neu generieren, `data as {...}`-Cast ersetzen. *(deckt das bekannte Booking.tsx-tsc-Problem aus dem Handoff)*

**a11y (ungeprüft):**
- `src/components/dashboard/HyperlocalConciergeTab.tsx:211-220` — Filter-Badges sind klickbare div/span ohne Button-Semantik/Keyboard. **Fix:** echte `<button>` bzw. `role="button"` + `tabIndex` + `onKeyDown`.

**i18n:**
- `src/pages/PaketDetail.tsx:49-52,170` — `highlights` aus i18n hart als `string[]` gecastet; falscher Resource-Typ (String/Objekt) → `.map`-Crash (weißer Screen). **Fix:** `Array.isArray(raw) ? raw : paket.highlights`.

## Optimierungen

(nicht adversarial geprüft — niedrigere Priorität)

- `src/integrations/supabase/types.ts:251` — `get_booked_ranges: Args: never` = handeditierte/stale Typen → komplett neu generieren (deckt auch `get_operator_overview`/`log_operator_access`, die per `(supabase as any)` umgangen werden).
- `src/pages/Login.tsx:12-24,82-88` — `?demo=1` zeigt Klartext-Admin-Credentials auch in Production. **Fix:** searchParams-Pfad auf `import.meta.env.DEV` beschränken; Demo-Konto in Prod ohne echten Tenant-Zugriff.
- `src/pages/Operator.tsx:87-89` — `audit_log_recent`-Fehler ignoriert → leerer Audit-Log sieht „sauber" aus (gefährlich bei Security-Feature). **Fix:** `auditRes.error` per Toast/Fehler-State melden.
- `src/components/dashboard/RoomsTab.tsx:24` — `error` ignoriert → leere Zimmerliste ununterscheidbar von Fehler. **Fix:** `error` destrukturieren + `toast.error`.
- `src/components/dashboard/InternalBookingsTab.tsx:61-81` — Initial-Load-Fehler ignoriert → leere Liste ohne Hinweis. **Fix:** `rRes.error/bRes.error` prüfen + Toast.
- `src/components/dashboard/BookingsTab.tsx:56` — Query ohne Limit/Pagination → kappt still bei 1000 Rows; `select('*')` lädt zu viel. **Fix:** Paged-Fetch wie GuestsTab + Spalten einschränken.
- `src/components/dashboard/CalendarTab.tsx:925-959` — `YearGrid` ungememoisiert, O(Jahre×Monate×Tage×Räume×Buchungen) pro Re-Render → friert bei Interaktion ein. **Fix:** `React.memo` + `useMemo([year,rooms,bookings])` + bookings als `Map<room_id,…>` vorgruppieren.
- `src/pages/Index.tsx:97-103,350` — Hero-Autoplay-Interval bei manuellem Dot-Klick nicht resettet. **Fix:** `heroIdx` in Dependencies oder `resetTimer()` im onClick.
- `src/pages/Booking.tsx:283-285` — `guestSchema.safeParse(guest)` läuft 2× pro Render (pro Keystroke). **Fix:** einmal `useMemo([guest])`, ungenutztes Ergebnis entfernen.
- `src/hooks/use-toast.ts:169-177` — `useEffect`-Dep `[state]` de-/registriert Listener bei jeder Änderung (shadcn-Bug). **Fix:** Dep auf `[]`.
- `src/components/HeaderMegaMenu.tsx:36-48` — `closeTimer`-setTimeout ohne Unmount-Cleanup. **Fix:** `useEffect(() => () => cancelClose(), [])`.
- `src/hooks/useMagnetic.ts:43-45` — onLeave-setTimeout ohne Cleanup → mutiert detached DOM nach Unmount. **Fix:** Handle halten + `clearTimeout` im Cleanup.
- `src/components/ReviewsSection.tsx:243` — Fallback-Link `'#'` mit `target=_blank` bei unbekannter Review-Quelle lädt Seite neu. **Fix:** bei fehlendem Match `<a>` gar nicht rendern.
- `src/components/dashboard/HousekeepingTab.tsx:32-33` — `counts` per Mutation im Render-Body statt `useMemo`. **Fix:** `useMemo(() => list.reduce(...), [list])`.
- `src/components/dashboard/GuestsTab.tsx:131-175` — interne Buchungen ganz aus Kontaktliste gefiltert; Intent unklar (niedrige Sicherheit). **Fix:** Intent klären — falls interne Kontakte gewünscht, nur aus Umsatz/Tier ausnehmen.

## Verworfen: 4 Fehlalarme