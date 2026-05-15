-- ============================================================
-- Schend bekommt die WOW-Roadmap-Wave-1-Features als Demo-Module
-- freigeschaltet (state=active mit demo:true).
-- Alle 7 neuen Module sind in der Sidebar mit grünem Unlock-Icon
-- sichtbar und beim Klick erscheint die Demo-Variante.
-- ============================================================

UPDATE public.tenants
SET features = features ||
'{
  "smart_pricing":   { "state": "active", "demo": true },
  "folio":           { "state": "active", "demo": true },
  "shift_handover":  { "state": "active", "demo": true },
  "service_tickets": { "state": "active", "demo": true },
  "express_checkin": { "state": "active", "demo": true },
  "group_bookings":  { "state": "active", "demo": true },
  "cash_book":       { "state": "active", "demo": true }
}'::jsonb
WHERE slug = 'schend';
