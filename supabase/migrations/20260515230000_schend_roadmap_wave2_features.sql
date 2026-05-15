-- ============================================================
-- Schend bekommt die WOW-Roadmap-Wave-2-Features als Demo-Module
-- freigeschaltet (state=active mit demo:true).
-- 5 neue Module: No-Show-Backfill, Aufenthalts-Optimum, Auto-Up-Sell,
-- Sprach-Concierge, Lost & Found.
-- ============================================================

UPDATE public.tenants
SET features = features ||
'{
  "no_show_backfill":       { "state": "active", "demo": true },
  "stay_length_optimizer":  { "state": "active", "demo": true },
  "auto_upsell":            { "state": "active", "demo": true },
  "multilingual_concierge": { "state": "active", "demo": true },
  "lost_found":             { "state": "active", "demo": true }
}'::jsonb
WHERE slug = 'schend';
