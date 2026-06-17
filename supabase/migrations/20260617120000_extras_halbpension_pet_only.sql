-- Extras aufgeräumt (Eugen 17.06.):
--   - Buchbar bleiben nur Halbpension (auf Wunsch, 23 €) und Haustier (15 €).
--   - Frühstück ist IM Übernachtungspreis enthalten → kein buchbares Aufpreis-Extra.
--     Sonderfälle stehen als Hinweis (kein DB-Extra): ohne Frühstück −8 € p. P./Nacht,
--     externes Frühstück (Gäste ohne Übernachtung) 15 € p. P.
--   - Fahrrad / Late Check-out / Früh Check-in entfallen.
-- Idempotent: erst alles deaktivieren, dann die zwei aktiven Extras setzen
-- (Preis Halbpension auf 23 € korrigiert — Seed stand auf 28 €; Haustier 10 → 15 €).
-- Muss mit FALLBACK_EXTRAS in src/pages/Booking.tsx übereinstimmen.

UPDATE public.extras SET active = false;

INSERT INTO public.extras (id, name, price, per_night, active, sort_order) VALUES
  ('595b0d19-c04d-4c13-a44b-53c478baa9b3', 'Halbpension', 23, true, true, 10),
  ('5744643a-c890-4195-bbe2-bd8100d64ed2', 'Haustier',    15, true, true, 20)
ON CONFLICT (id) DO UPDATE SET
  name      = EXCLUDED.name,
  price     = EXCLUDED.price,
  per_night = EXCLUDED.per_night,
  active    = EXCLUDED.active,
  sort_order = EXCLUDED.sort_order;
