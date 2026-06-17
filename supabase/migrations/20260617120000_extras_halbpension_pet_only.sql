-- Extras aufgeräumt (Eugen 17.06.):
--   - Buchbar bleiben nur Halbpension (auf Wunsch, 23 €) und Haustier (15 €).
--   - Frühstück ist IM Übernachtungspreis enthalten → kein buchbares Aufpreis-Extra.
--     Sonderfälle stehen als Hinweis (kein DB-Extra): ohne Frühstück −8 € p. P./Nacht,
--     externes Frühstück (Gäste ohne Übernachtung) 15 € p. P.
--   - Fahrrad / Late Check-out / Früh Check-in entfallen.
--
-- Per-Name-UPDATE auf BESTEHENDE Zeilen (kein INSERT) — die extras-Tabelle hat
-- tenant_id NOT NULL; neue Zeilen bräuchten einen Tenant. Da die Namen aus dem Seed
-- existieren, reicht UPDATE. Idempotent. Preis Halbpension 28 → 23, Haustier 10 → 15.
-- Muss mit FALLBACK_EXTRAS in src/pages/Booking.tsx übereinstimmen.

UPDATE public.extras SET active = false;
UPDATE public.extras SET active = true, price = 23, per_night = true, sort_order = 10 WHERE name = 'Halbpension';
UPDATE public.extras SET active = true, price = 15, per_night = true, sort_order = 20 WHERE name = 'Haustier';
