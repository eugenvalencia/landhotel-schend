-- ============================================================
-- Schend hat real nur 3 Zimmer-Kategorien:
--   Einzelzimmer, Doppelzimmer Standard, Doppelzimmer Komfort.
--
-- Der initiale Seed hatte zusaetzlich Familienzimmer/Junior Suite/Suite
-- erfunden — die gibt es im Haus nicht. Vorher verifiziert: keine
-- Buchungen referenzieren diese Zimmer (Stand 2026-05-15), daher Loeschung
-- sicher.
-- ============================================================

DELETE FROM public.rooms
WHERE room_type IN ('Familienzimmer', 'Junior Suite', 'Suite');
